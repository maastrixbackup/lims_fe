import JSZip from "jszip";
import { kml as kmlToGeoJson } from "@tmcw/togeojson";

/**
 * Resolves a KML-relative href against assets extracted from the KMZ zip.
 * Absolute (http/https/data/blob) URLs are passed through untouched.
 */
function makeResolver(assetMap) {
  return (href) => {
    if (!href) return href;
    if (/^https?:\/\//i.test(href) || href.startsWith("data:") || href.startsWith("blob:")) {
      return href;
    }
    const clean = decodeURIComponent(href).replace(/^\.\//, "");
    return assetMap.get(clean) || assetMap.get(clean.split("/").pop()) || href;
  };
}

/**
 * @tmcw/togeojson doesn't currently expose a Point placemark's <IconStyle>
 * href as a GeoJSON property, so we resolve it ourselves:
 *  1. Build a styleId -> iconHref lookup from <Style> and <StyleMap>.
 *  2. Walk <Placemark><Point> nodes in document order and resolve each
 *     one's styleUrl (or inline <Style>) to an icon href.
 * togeojson emits features in document order for a single KML document,
 * so index-matching this array against the Point features it produces
 * is reliable in practice.
 */
function buildPointIconLookup(kmlDom, resolveHref) {
  const styleIcons = new Map(); // "#id" -> iconHref
  const styleMapTargets = new Map(); // "#id" -> "#normalStyleId"

  Array.from(kmlDom.getElementsByTagName("Style")).forEach((style) => {
    const id = style.getAttribute("id");
    if (!id) return;
    const href = style
      .getElementsByTagName("Icon")[0]
      ?.getElementsByTagName("href")[0]?.textContent?.trim();
    if (href) styleIcons.set(`#${id}`, href);
  });

  Array.from(kmlDom.getElementsByTagName("StyleMap")).forEach((map) => {
    const id = map.getAttribute("id");
    if (!id) return;
    const pairs = Array.from(map.getElementsByTagName("Pair"));
    const normalPair = pairs.find(
      (p) => p.getElementsByTagName("key")[0]?.textContent?.trim() === "normal"
    );
    const target = normalPair?.getElementsByTagName("styleUrl")[0]?.textContent?.trim();
    if (target) styleMapTargets.set(`#${id}`, target);
  });

  const resolveStyleUrl = (styleUrl) => {
    const target = styleMapTargets.has(styleUrl) ? styleMapTargets.get(styleUrl) : styleUrl;
    return styleIcons.get(target);
  };

  const icons = [];
  Array.from(kmlDom.getElementsByTagName("Placemark")).forEach((placemark) => {
    if (!placemark.getElementsByTagName("Point").length) return;

    const styleUrl = placemark.getElementsByTagName("styleUrl")[0]?.textContent?.trim();
    let href = styleUrl ? resolveStyleUrl(styleUrl) : undefined;

    if (!href) {
      // Inline <Style> defined directly on the Placemark (not shared)
      const inline = Array.from(placemark.children).find((c) => c.tagName === "Style");
      href = inline
        ?.getElementsByTagName("Icon")[0]
        ?.getElementsByTagName("href")[0]?.textContent?.trim();
    }

    icons.push(href ? resolveHref(href) : undefined);
  });

  return icons;
}

/**
 * Some KML exporters use the xsi:/gx:/atom: prefixes (most often for
 * xsi:schemaLocation) without ever declaring the matching xmlns:* on the
 * root <kml> tag. Google Earth ignores this; a strict browser DOMParser
 * throws "Namespace prefix ... is not defined" and refuses to parse at
 * all. This injects the missing declaration(s) onto the root tag when a
 * prefix is used but undeclared, leaving already-valid documents untouched.
 */
function ensureNamespaces(text) {
  const nsMap = {
    xsi: "http://www.w3.org/2001/XMLSchema-instance",
    gx: "http://www.google.com/kml/ext/2.2",
    atom: "http://www.w3.org/2005/Atom",
  };

  const kmlTagMatch = text.match(/<kml\b[^>]*>/);
  if (!kmlTagMatch) return text;
  const kmlTag = kmlTagMatch[0];

  let updatedTag = kmlTag;
  Object.entries(nsMap).forEach(([prefix, uri]) => {
    const usesPrefix = new RegExp(`[<\\s]${prefix}:`).test(text);
    const alreadyDeclared = new RegExp(`xmlns:${prefix}\\s*=`).test(kmlTag);
    if (usesPrefix && !alreadyDeclared) {
      updatedTag = updatedTag.replace("<kml", `<kml xmlns:${prefix}="${uri}"`);
    }
  });

  return updatedTag === kmlTag ? text : text.replace(kmlTag, updatedTag);
}

/**
 * Real-world KML/KMZ exports are frequently *not* well-formed XML — the
 * most common offenders are a <description> containing a raw URL or HTML
 * with an unescaped "&" (e.g. "...?a=1&b=2" instead of "&amp;"), and
 * xsi:/gx: prefixes used without their namespace being declared. Google
 * Earth tolerates both; a strict browser DOMParser does not. This strips
 * a leading BOM/invalid control characters, repairs missing namespace
 * declarations, and escapes bare ampersands that aren't already part of
 * a valid entity — without touching anything already well-formed.
 */
function sanitizeXml(text) {
  return ensureNamespaces(
    text
      .replace(/^\uFEFF/, "")
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
      .replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g, "&amp;")
  );
}

/**
 * Parses KML text into a DOM, retrying once with sanitization if the raw
 * text fails to parse. Throws with the underlying parser message (instead
 * of a generic one) when both attempts fail, so the real cause is visible.
 */
function parseKmlDom(kmlText) {
  const tryParse = (text) => {
    const dom = new DOMParser().parseFromString(text, "text/xml");
    const errorNode = dom.getElementsByTagName("parsererror")[0];
    return { dom, errorText: errorNode ? errorNode.textContent : null };
  };

  let { dom, errorText } = tryParse(kmlText);
  if (errorText) {
    ({ dom, errorText } = tryParse(sanitizeXml(kmlText)));
  }

  if (errorText) {
    const detail = errorText.replace(/\s+/g, " ").trim().slice(0, 200);
    throw new Error(`The KML content could not be parsed: ${detail}`);
  }

  return dom;
}

/**
 * Parses a KMZ (zip) or raw KML ArrayBuffer into:
 *  - geoJson: FeatureCollection of drawable features (points/lines/polygons),
 *    with point features carrying a resolved `icon` blob/http URL when the
 *    KML defines one.
 *  - groundOverlays: [{ name, url, bounds }] ready for Leaflet's ImageOverlay.
 *  - assetMap: Map of extracted asset blob URLs (caller must revoke these
 *    with revokeAssetUrls when done to avoid leaking memory).
 */
export async function parseKmzBuffer(buffer) {
  let zip = null;
  try {
    zip = await JSZip.loadAsync(buffer);
  } catch {
    zip = null; // not a zip — fall back to treating it as raw KML text
  }

  let kmlText;
  const assetMap = new Map();

  if (zip) {
    const kmlFileName = Object.keys(zip.files).find(
      (name) => !zip.files[name].dir && name.toLowerCase().endsWith(".kml")
    );
    if (!kmlFileName) {
      throw new Error("No .kml file found inside the archive.");
    }
    kmlText = await zip.file(kmlFileName).async("text");

    const assetEntries = Object.keys(zip.files).filter(
      (name) => !zip.files[name].dir && !name.toLowerCase().endsWith(".kml")
    );
    for (const entry of assetEntries) {
      try {
        const blob = await zip.file(entry).async("blob");
        const url = URL.createObjectURL(blob);
        assetMap.set(entry, url);
        assetMap.set(entry.split("/").pop(), url); // also index by basename
      } catch {
        // Skip an unreadable asset rather than failing the whole file
      }
    }
  } else {
    kmlText = new TextDecoder("utf-8").decode(buffer);
    if (!kmlText.includes("<kml")) {
      throw new Error("File is not a valid KML or KMZ document.");
    }
  }

  const resolveHref = makeResolver(assetMap);
  const kmlDom = parseKmlDom(kmlText);

  const geoJson = kmlToGeoJson(kmlDom);
  const pointIcons = buildPointIconLookup(kmlDom, resolveHref);

  let pointIndex = 0;
  const overlayFeatures = [];
  const drawFeatures = [];

  geoJson.features.forEach((feature) => {
    if (feature.properties?.["@geometry-type"] === "groundoverlay") {
      feature.properties.icon = resolveHref(feature.properties.icon);
      overlayFeatures.push(feature);
      return;
    }
    if (feature.geometry?.type === "Point") {
      const icon = pointIcons[pointIndex++];
      if (icon) feature.properties = { ...feature.properties, icon };
    }
    drawFeatures.push(feature);
  });

  const groundOverlays = overlayFeatures
    .map((f) => {
      const ring = f.geometry?.coordinates?.[0] || [];
      if (!ring.length) return null;
      const lats = ring.map(([, lat]) => lat);
      const lngs = ring.map(([lng]) => lng);
      return {
        name: f.properties?.name || "Ground overlay",
        url: f.properties?.icon,
        bounds: [
          [Math.min(...lats), Math.min(...lngs)],
          [Math.max(...lats), Math.max(...lngs)],
        ],
      };
    })
    .filter((ov) => ov && ov.url);

  return {
    geoJson: { type: "FeatureCollection", features: drawFeatures },
    groundOverlays,
    assetMap,
  };
}

export function revokeAssetUrls(assetMap) {
  if (!assetMap) return;
  assetMap.forEach((url) => {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  });
}

// GeoJSON coordinate nesting depth per geometry type, down to the raw
// [lng, lat] pairs — used to walk any geometry without needing Leaflet.
const COORD_DEPTH = {
  Point: 0,
  MultiPoint: 1,
  LineString: 1,
  MultiLineString: 2,
  Polygon: 2,
  MultiPolygon: 3,
};

/**
 * Computes [[southLat, westLng], [northLat, eastLng]] bounds for a single
 * GeoJSON geometry, cheaply (no Leaflet layer instantiation). Returns null
 * for unsupported/empty geometries so callers can skip them.
 */
export function computeGeometryBounds(geometry) {
  const depth = geometry && COORD_DEPTH[geometry.type];
  if (depth === undefined || !geometry.coordinates) return null;

  let minLat = Infinity;
  let minLng = Infinity;
  let maxLat = -Infinity;
  let maxLng = -Infinity;

  const visit = (node, level) => {
    if (level === 0) {
      const [lng, lat] = node;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    } else {
      node.forEach((child) => visit(child, level - 1));
    }
  };

  visit(geometry.coordinates, depth);

  if (!isFinite(minLat) || !isFinite(minLng)) return null;
  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
}