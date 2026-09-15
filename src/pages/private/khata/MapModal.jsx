import React, { useEffect, useRef, useState } from "react";
import { X, Upload, CheckCircle, Eye, Download, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../utils/config";
import { extractDriveFileId } from "../../../utils/googleDrive";
import MapPreviewModal from "../../../components/features/MapPreviewModal";
import { toast } from "sonner";

const MapModal = ({ khata, onClose, onUpload }) => {
  const fileInputRef = useRef();
  const token = useSelector((state) => state.auth.userToken);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [mapData, setMapData] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  // 3. New state for custom preview modal
  const [selectedMap, setSelectedMap] = useState(null);

  const khata_id = khata?.id;

  // Handle file selection and upload
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

      const res = await fetch(`${API_BASE_URL}/khata/uploadMapDocument`, {
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

  // Fetch map documents from backend
  const fetchMapData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/khata/getMapFiles/${khata_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data?.success) {
        setMapData(data?.data || []);
      } else {
        console.error("Error fetching map files:", data?.message);
      }
    } catch (error) {
      console.error("Could not fetch map files:", error);
    }
  };

  useEffect(() => {
    if (khata_id) fetchMapData();
  }, [khata_id]);

  const executeDelete = async (docId) => {
    try {
      setDeletingId(docId);

      const res = await fetch(
        `${API_BASE_URL.replace("/api", "")}/maps/deleteMapDocument/${docId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete map document");
      }

      toast.success("Map document deleted successfully!");

      // Refresh the map list
      fetchMapData();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.message || "Error deleting map document");
    } finally {
      setDeletingId(null);
    }
  };

  // Trigger Sonner confirmation toast
  const handleDelete = (docId) => {
    toast("Are you sure you want to delete this map file?", {
      action: {
        label: "Delete",
        onClick: () => executeDelete(docId),
      },
      cancel: {
        label: "Cancel",
        onClick: () => toast.dismiss(),
      },
      duration: 5000,
    });
  };

  return (
    <>
      <dialog open className="modal modal-open">
        <div className="modal-box max-w-xl relative">
          <button
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X size={20} />
          </button>

          <h3 className="font-bold text-lg mb-4">
            Maps for Khata{khata?.number}
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
            Click <strong>Preview</strong> to view geometries directly inside
            the platform, or <strong>Download</strong> to save the file locally.
          </div>

          <div className="grid grid-cols-1 gap-3">
            {mapData.length > 0 ? (
              mapData.map((map) => {
                const rawUrl = map.file_url || "";
                const fileName = map.file_name || "Map Document";
                const fileId = extractDriveFileId(rawUrl);

                // Build backend proxy URL if file is hosted on Google Drive, or use direct file URL
                const previewUrl = fileId
                  ? `${API_BASE_URL.replace("/api", "")}/maps/proxy/${fileId}`
                  : rawUrl;
                return (
                  <div
                    key={map.id}
                    className="flex items-center justify-between p-3 rounded-xl border shadow-sm bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-2 max-w-[50%]">
                      <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                      <span
                        className="font-medium text-sm truncate"
                        title={fileName}
                      >
                        {fileName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* 4. Trigger Inline Preview Modal */}
                      <button
                        onClick={() =>
                          setSelectedMap({ url: previewUrl, name: fileName })
                        }
                        className="btn btn-xs btn-primary flex items-center gap-1"
                      >
                        <Eye size={14} />
                        Preview
                      </button>

                      {/* Direct Download Link */}
                      <a
                        href={rawUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={fileName}
                        className="btn btn-xs btn-outline flex items-center gap-1"
                      >
                        <Download size={14} />
                        Download
                      </a>

                      <button
                        onClick={() => handleDelete(map.id)}
                        disabled={deletingId === map.id}
                        className="btn btn-xs btn-ghost text-error hover:bg-error/10 p-1 rounded-lg transition-colors"
                        title="Delete Map"
                      >
                        {deletingId === map.id ? (
                          <span className="loading loading-spinner loading-xs text-error" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">
                No map files uploaded yet.
              </p>
            )}
          </div>

          <div className="modal-action">
            <button className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </dialog>

      {/* 5. Render Preview Modal conditionally when selectedMap is set */}
      {selectedMap && (
        <MapPreviewModal
          isOpen={Boolean(selectedMap)}
          onClose={() => setSelectedMap(null)}
          fileUrl={selectedMap.url}
          fileName={selectedMap.name}
          token={token}
        />
      )}
    </>
  );
};

export default MapModal;
