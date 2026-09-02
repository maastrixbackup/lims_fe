import React, { useEffect, useRef, useState } from "react";
import { X, Upload, CheckCircle, ExternalLink, Download } from "lucide-react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../utils/config";

const MapModal = ({ khata, onClose, onUpload }) => {
  const fileInputRef = useRef();
  const token = useSelector((state) => state.auth.userToken);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [mapData, setMapData] = useState([]);

  const khata_id = khata?.id;

  // const toAbsoluteUrl = (value) => {
  //   if (!value || typeof value !== "string") return "";

  //   try {
  //     return new URL(value, API_BASE_URL).toString();
  //   } catch {
  //     return "";
  //   }
  // };

  // const getMapFileUrls = (map) => {
  //   const directUrl =
  //     map?.download_url ||
  //     map?.url ||
  //     map?.file_url ||
  //     map?.path ||
  //     map?.file_path ||
  //     "";
  //   const fallbackUrl =
  //     map?.file_name && khata_id
  //       ? `${API_BASE_URL}/govtkhata/downloadGovtMapFile/${khata_id}/${encodeURIComponent(map.file_name)}`
  //       : "";

  //   return [toAbsoluteUrl(directUrl), fallbackUrl].filter(Boolean);
  // };

  // const getErrorMessage = async (response, fallbackMessage) => {
  //   const contentType = response.headers.get("content-type") || "";

  //   if (contentType.includes("application/json")) {
  //     try {
  //       const data = await response.json();
  //       return data?.message || fallbackMessage;
  //     } catch {
  //       return fallbackMessage;
  //     }
  //   }

  //   const text = await response.text();
  //   const cleanedText = text
  //     .replace(/<[^>]*>/g, " ")
  //     .replace(/\s+/g, " ")
  //     .trim();

  //   return cleanedText || fallbackMessage;
  // };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".zip") && !file.name.endsWith(".kmz")) {
      alert("Please upload a valid .zip or .kmz file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("khata_id", khata_id);

    try {
      setLoading(true);
      setSuccessMsg("");

      const res = await fetch(`${API_BASE_URL}/govtkhata/uploadMapDocument`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Upload failed");

      setSuccessMsg("KMZ/ZIP file uploaded successfully!");
      setTimeout(() => setSuccessMsg(""), 1500);
      fetchMapData();

      onUpload?.(data);
    } catch (err) {
      console.error(err);
      alert(err.message || "Upload error");
    } finally {
      setLoading(false);
    }
  };


  const fetchMapData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/govtkhata/getGovtMapFiles/${khata_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
 console.log('map', data);
 
      if (data?.success) {
        setMapData(data?.data || []);
      } else {
        console.error("Error: ", data?.message);
      }
    } catch (error) {
      console.error("Could not get data:", error);
    }
  };

  useEffect(() => {
    if (khata_id) fetchMapData();
  }, [khata_id]);

 const handleDownloadMap = async (map) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/govtkhata/downloadGovtMapFile/${khata_id}/${encodeURIComponent(map.file_name)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Download failed");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = map.file_name;
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download error:", err);
    alert("Failed to download file");
  }
};

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-xl relative">
        <button
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h3 className="font-bold text-lg mb-4">
          Maps for Khata {khata?.number}
        </h3>
        <div className="flex justify-end mb-4">
          <button
            className="btn btn-sm btn-primary flex items-center gap-2"
            onClick={() => fileInputRef.current.click()}
            disabled={loading}
          >
            <Upload size={16} />
            {loading ? "Uploading..." : "Upload KMZ File"}
          </button>

          <input
            type="file"
            accept=".kmz,.zip"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
        {successMsg && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-green-100 text-green-700 border border-green-300">
            <CheckCircle size={18} />
            <span className="text-sm">{successMsg}</span>
          </div>
        )}
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
          Google Maps does not open a KMZ file directly inside this page. Use
          <a
            href="https://earth.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-1 font-medium underline"
          >
            Google Earth
          </a>
          to import the downloaded KMZ, or open the file in Google Earth.
        </div>
        <div className="grid grid-cols-1 gap-3">
          {mapData.length > 0 ? (
            mapData.map((map) => (
              <div
                key={map.id}
                className="flex items-center justify-between p-3 rounded-xl border shadow-sm bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="font-medium text-sm truncate">
                    {map.file_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://earth.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-xs btn-outline btn-primary"
                  >
                    <ExternalLink size={14} />
                    Open KMZ
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDownloadMap(map)}
                    className="btn btn-xs btn-outline"
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No map files uploaded yet.</p>
          )}
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </dialog>
  );
};

export default MapModal;
