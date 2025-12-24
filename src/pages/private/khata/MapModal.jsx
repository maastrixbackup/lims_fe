import React, { useEffect, useRef, useState } from "react";
import { X, Upload, CheckCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../utils/config";

const MapModal = ({ khata, onClose, onUpload }) => {
  const fileInputRef = useRef();
  const token = useSelector((state) => state.auth.userToken);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [mapData, setMapData] = useState([]);

  const khata_id = khata?.id;
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


  const fetchMapData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/khata/getMapFiles/${khata_id}`, {
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

               <a
                href={`/${map.file_name}`}
                target="_blank"
                className="btn btn-xs btn-outline btn-primary"
              >
                View in Google Earth
              </a>

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
