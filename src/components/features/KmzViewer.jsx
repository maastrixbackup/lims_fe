import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet"; // Import Leaflet directly as an ES module
import JSZip from "jszip";
import { kml } from "@tmcw/togeojson";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet icon assets missing in Webpack/Vite bundlers
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Helper component to auto-fit map view to the loaded KMZ layer bounds
const AutoFitBounds = ({ geoJsonData }) => {
  const map = useMap();

  useEffect(() => {
    if (geoJsonData) {
      const geoJsonLayer = L.geoJSON(geoJsonData);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [geoJsonData, map]);

  return null;
};

const KmzViewer = ({ kmzUrl }) => {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndParseKmz = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch the KMZ file arrayBuffer
        const response = await fetch(kmzUrl);
        if (!response.ok) throw new Error("Failed to fetch KMZ file.");
        const buffer = await response.arrayBuffer();

        // 2. Unzip using JSZip
        const zip = await JSZip.loadAsync(buffer);

        // 3. Find the primary KML file inside the archive
        const kmlFile = Object.keys(zip.files).find((filename) =>
          filename.endsWith(".kml")
        );

        if (!kmlFile) {
          throw new Error("No .kml file found inside the KMZ archive.");
        }

        const kmlText = await zip.file(kmlFile).async("text");

        // 4. Parse KML XML string to DOM
        const parser = new DOMParser();
        const kmlDom = parser.parseFromString(kmlText, "text/xml");

        // 5. Convert KML DOM to GeoJSON format
        const convertedGeoJson = kml(kmlDom);
        setGeoData(convertedGeoJson);
      } catch (err) {
        console.error("KMZ Parsing Error:", err);
        setError(err.message || "Failed to load KMZ map data.");
      } finally {
        setLoading(false);
      }
    };

    if (kmzUrl) {
      fetchAndParseKmz();
    }
  }, [kmzUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-600 font-medium">Loading Map Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 text-red-600 rounded-lg p-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-gray-300 shadow-sm">
      <MapContainer
        center={[20.2961, 85.8245]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geoData && (
          <>
            <GeoJSON
              data={geoData}
              style={() => ({
                color: "#2563eb",
                weight: 3,
                opacity: 0.8,
                fillColor: "#3b82f6",
                fillOpacity: 0.35,
              })}
              onEachFeature={(feature, layer) => {
                if (feature.properties && feature.properties.name) {
                  layer.bindPopup(
                    `<strong>${feature.properties.name}</strong><br/>${
                      feature.properties.description || ""
                    }`
                  );
                }
              }}
            />
            <AutoFitBounds geoJsonData={geoData} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default KmzViewer;