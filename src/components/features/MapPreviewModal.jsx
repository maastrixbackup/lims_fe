import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Maximize2, Minimize2, List, Search, Layers } from "lucide-react";
import { MapContainer, TileLayer, GeoJSON, ImageOverlay, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { parseKmzBuffer, revokeAssetUrls, computeGeometryBounds } from "../../utils/kmzParser";

// Fix Leaflet's default marker icon paths in React/Vite bundlers
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Esri World Imagery needs no API key/token, unlike Google or Mapbox
// satellite tiles — a reasonable free default for this kind of viewer.
const BASEMAPS = {
  street: {
    label: "Map",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  satellite: {
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    // Plain satellite imagery has no road/place names — this overlay adds
    // them back on top so it reads like Google Earth's hybrid view rather
    // than an unlabeled photo.
    labelsUrl:
      "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
  },
};

// Fixes Leaflet tile rendering inside dynamic React modal dialogs
const MapResizeHandler = () => {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(t);
  }, [map]);
  return null;
};

// Recalculate viewport bounds and center on loaded geometry + overlays
const AutoFitBounds = ({ geoJsonData, groundOverlays }) => {
  const map = useMap();

  useEffect(() => {
    const boundsList = [];

    if (geoJsonData?.features?.length) {
      const layer = L.geoJSON(geoJsonData);
      const b = layer.getBounds();
      if (b.isValid()) boundsList.push(b);
    }

    (groundOverlays || []).forEach((ov) => {
      boundsList.push(L.latLngBounds(ov.bounds));
    });

    if (boundsList.length) {
      let combined = boundsList[0];
      boundsList.slice(1).forEach((b) => {
        combined = combined.extend(b);
      });
      map.fitBounds(combined, { padding: [40, 40] });
    }
  }, [geoJsonData, groundOverlays, map]);

  return null;
};

// Zooms/pans the map to a layer selected from the side panel — works for
// points (flyTo) as well as lines/polygons (fitBounds to their extent).
const FocusLayer = ({ target }) => {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    if (target.bounds) {
      map.fitBounds(target.bounds, { padding: [60, 60], maxZoom: 18 });
    } else if (target.latlng) {
      map.flyTo(target.latlng, Math.max(map.getZoom(), 16), { duration: 0.75 });
    }
  }, [target, map]);
  return null;
};

// Styles lines/polygons from the properties togeojson attaches
// (stroke / stroke-opacity / fill-color / fill-opacity). Defaults are kept
// deliberately light — cadastral/plot KMZs commonly contain hundreds of
// small adjacent polygons, and a thick stroke + solid fill on each one
// stacks into an unreadable black mass at low zoom.
const BASE_STYLE = { weight: 1, opacity: 0.9, fillOpacity: 0.12 };
const HOVER_STYLE = { weight: 2.5, fillOpacity: 0.35 };

const styleFromProps = (props = {}) => ({
  color: props["stroke"] || "#2563eb",
  weight: props["stroke-width"] ? Number(props["stroke-width"]) : BASE_STYLE.weight,
  opacity: props["stroke-opacity"] !== undefined ? Number(props["stroke-opacity"]) : BASE_STYLE.opacity,
  fillColor: props["fill-color"] || props["fill"] || "#3b82f6",
  fillOpacity:
    props["fill-opacity"] !== undefined ? Number(props["fill-opacity"]) : BASE_STYLE.fillOpacity,
});

// Renders a point as its KML-defined icon image when available, otherwise a
// simple colored dot marker.
const buildPointLayer = (feature, latlng) => {
  const props = feature.properties || {};
  if (props.icon) {
    const icon = L.icon({
      iconUrl: props.icon,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -28],
    });
    return L.marker(latlng, { icon });
  }
  return L.circleMarker(latlng, {
    radius: 7,
    color: "#fff",
    weight: 2,
    fillColor: "#2563eb",
    fillOpacity: 1,
  });
};

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);

// Style/internal keys that shouldn't be shown as "extra data" in a popup.
const INTERNAL_PROP_KEYS = new Set([
  "name",
  "description",
  "stroke",
  "stroke-opacity",
  "stroke-width",
  "fill",
  "fill-color",
  "fill-opacity",
  "icon",
  "icon-color",
  "icon-opacity",
  "icon-scale",
  "icon-heading",
  "icon-offset",
  "icon-offset-units",
  "label-color",
  "label-opacity",
  "@geometry-type",
]);

// Builds popup HTML defensively: `description` isn't always a plain string
// depending on how the source KML structured it, so it's only rendered when
// it actually is one. Any other feature properties (plot number, owner,
// area, khata no. — whatever ExtendedData the KML carries) are shown as a
// small table instead of being silently dropped.
const popupHtml = (props = {}) => {
  const name = props.name ? escapeHtml(props.name) : "Untitled";

  const descHtml =
    typeof props.description === "string" && props.description.trim()
      ? `<div style="margin-top:4px;font-size:12px;color:#555">${props.description}</div>`
      : "";

  const extraEntries = Object.entries(props).filter(
    ([key, value]) =>
      !INTERNAL_PROP_KEYS.has(key) &&
      value !== null &&
      value !== undefined &&
      value !== "" &&
      typeof value !== "object"
  );

  const extraHtml = extraEntries.length
    ? `<table style="margin-top:6px;font-size:11px;color:#444;border-collapse:collapse">${extraEntries
        .map(
          ([key, value]) =>
            `<tr><td style="padding:1px 6px 1px 0;color:#888;white-space:nowrap;vertical-align:top">${escapeHtml(
              key
            )}</td><td style="padding:1px 0">${escapeHtml(value)}</td></tr>`
        )
        .join("")}</table>`
    : "";

  return `<div style="max-width:240px">
    <strong>${name}</strong>${descHtml}${extraHtml}
  </div>`;
};

const MapPreviewModal = ({ isOpen, onClose, fileUrl, fileName, token }) => {
  const [geoData, setGeoData] = useState(null);
  const [groundOverlays, setGroundOverlays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPanel, setShowPanel] = useState(true);
  const [search, setSearch] = useState("");
  const [focusTarget, setFocusTarget] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [basemap, setBasemap] = useState("street");
  const assetMapRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !fileUrl) return;

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        setGeoData(null);
        setGroundOverlays([]);

        const response = await fetch(fileUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!response.ok) throw new Error("Failed to load map file.");
        const buffer = await response.arrayBuffer();

        const { geoJson, groundOverlays: overlays, assetMap } = await parseKmzBuffer(buffer);

        if (cancelled) {
          revokeAssetUrls(assetMap);
          return;
        }

        assetMapRef.current = assetMap;
        setGeoData(geoJson);
        setGroundOverlays(overlays);
      } catch (err) {
        console.error("KMZ Render Error:", err);
        if (!cancelled) setError(err.message || "Failed to render map layer.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
      revokeAssetUrls(assetMapRef.current);
      assetMapRef.current = null;
    };
  }, [isOpen, fileUrl, token]);

  // Every named feature (point, line, or polygon) — not just Points — so a
  // KMZ full of named plot boundaries still gets a usable side panel.
  const namedLayers = useMemo(() => {
    if (!geoData?.features) return [];
    return geoData.features
      .map((f, idx) => {
        const name = f.properties?.name;
        if (!name) return null;
        if (f.geometry?.type === "Point") {
          const [lng, lat] = f.geometry.coordinates;
          return { id: idx, name, latlng: [lat, lng] };
        }
        const bounds = computeGeometryBounds(f.geometry);
        return bounds ? { id: idx, name, bounds } : null;
      })
      .filter(Boolean);
  }, [geoData]);

  const filteredLayers = useMemo(() => {
    if (!search.trim()) return namedLayers;
    const q = search.toLowerCase();
    return namedLayers.filter((p) => p.name.toLowerCase().includes(q));
  }, [namedLayers, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className={`relative bg-white shadow-2xl overflow-hidden flex flex-col ${
          isFullscreen
            ? "w-full h-full max-w-none max-h-none rounded-none"
            : "w-full max-w-6xl rounded-2xl max-h-[90vh]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-gray-800 text-base truncate pr-4">
            Map Preview: <span className="text-blue-600">{fileName}</span>
          </h3>
          <div className="flex items-center gap-1">
            <button
              className="p-1 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-200 transition"
              onClick={() => setShowPanel((v) => !v)}
              title="Toggle layers panel"
            >
              <List size={20} />
            </button>
            <button
              className="p-1 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-200 transition"
              onClick={() => setIsFullscreen((v) => !v)}
              title="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button
              className="p-1 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-200 transition"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className={`relative ${isFullscreen ? "flex-1" : "h-[600px]"} w-full bg-gray-100 flex`}>
          {loading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="mt-2 text-sm text-gray-600 font-medium">
                Parsing map geometries...
              </p>
            </div>
          )}

          {error && (
            <div className="flex h-full w-full items-center justify-center p-6 text-red-600 text-sm font-medium">
              Error: {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {showPanel && (
                <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto hidden sm:flex sm:flex-col">
                  <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
                    <div className="relative">
                      <Search
                        size={14}
                        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Search layers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {filteredLayers.length === 0 ? (
                      <p className="text-xs text-gray-400 p-3">No named layers found.</p>
                    ) : (
                      filteredLayers.map((p) => (
                        <button
                          key={p.id}
                          onClick={() =>
                            setFocusTarget({
                              latlng: p.latlng,
                              bounds: p.bounds,
                              id: p.id,
                              t: Date.now(),
                            })
                          }
                          className="w-full text-left px-3 py-2 text-xs border-b border-gray-50 hover:bg-blue-50 transition truncate"
                          title={p.name}
                        >
                          {p.name}
                        </button>
                      ))
                    )}
                  </div>
                  {groundOverlays.length > 0 && (
                    <div className="border-t border-gray-100 p-2 text-[11px] text-gray-500">
                      {groundOverlays.length} ground overlay
                      {groundOverlays.length > 1 ? "s" : ""} loaded
                    </div>
                  )}
                </div>
              )}

              <div className="flex-1 relative">
                <div className="absolute top-3 right-3 z-[1000] bg-white rounded-lg shadow-md flex overflow-hidden border border-gray-200">
                  {Object.entries(BASEMAPS).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => setBasemap(key)}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition ${
                        basemap === key
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Layers size={12} />
                      {cfg.label}
                    </button>
                  ))}
                </div>

                <MapContainer
                  center={[20.2961, 85.8245]}
                  zoom={12}
                  preferCanvas
                  style={{ height: "100%", width: "100%" }}
                >
                  <MapResizeHandler />
                  <TileLayer
                    key={basemap}
                    attribution={BASEMAPS[basemap].attribution}
                    url={BASEMAPS[basemap].url}
                  />
                  {BASEMAPS[basemap].labelsUrl && (
                    <TileLayer url={BASEMAPS[basemap].labelsUrl} />
                  )}

                  {groundOverlays.map((ov, i) => (
                    <ImageOverlay key={`overlay-${i}`} url={ov.url} bounds={ov.bounds} />
                  ))}

                  {geoData && (
                    <GeoJSON
                      key={fileUrl}
                      data={geoData}
                      style={(feature) => styleFromProps(feature.properties)}
                      pointToLayer={(feature, latlng) => buildPointLayer(feature, latlng)}
                      onEachFeature={(feature, layer) => {
                        if (feature.properties?.name || feature.properties?.description) {
                          layer.bindPopup(popupHtml(feature.properties));
                        }

                        // Only vector (line/polygon) layers support setStyle —
                        // point markers/icons don't, so skip the hover effect
                        // there rather than throwing on every point.
                        if (typeof layer.setStyle === "function") {
                          layer.on("mouseover", () => {
                            layer.setStyle(HOVER_STYLE);
                            layer.bringToFront();
                          });
                          layer.on("mouseout", () => {
                            layer.setStyle(styleFromProps(feature.properties));
                          });
                        }
                      }}
                    />
                  )}

                  {(geoData || groundOverlays.length > 0) && (
                    <AutoFitBounds geoJsonData={geoData} groundOverlays={groundOverlays} />
                  )}

                  <FocusLayer target={focusTarget} />
                </MapContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPreviewModal;