import React, { useEffect, useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { API_BASE_URL } from "../utils/config";
import { useSelector } from "react-redux";

const UploadModal = ({ khata, uploadedDocs, setUploadedDocs, onClose }) => {
  const { userToken: token } = useSelector((s) => s.auth);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [localDocs, setLocalDocs] = useState([]); // ✅ local copy

  const fetchDocuments = async () => {
    if (!khata?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/khata/getKhataFiles/${khata.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.documentsWithUrl)) {
        const formatted = data.documentsWithUrl.map((doc) => ({
          id: doc.id,
          name: doc.file_name,
          url: doc.url,
        }));
        setLocalDocs(formatted);      // ✅ show immediately in modal
        setUploadedDocs(formatted);   // ✅ also sync to parent
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  useEffect(() => {
    if (khata?.id) {
      fetchDocuments(); // ✅ always fetch when khata changes or modal opens
    }
  }, [khata]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    for (const file of files) {
      const formData = new FormData();
      formData.append("khata_id", khata.id);
      formData.append("file", file);

      try {
        const res = await fetch(`${API_BASE_URL}/khata/uploadKhata`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          const newDoc = {
            id: data.document?.id || Date.now(),
            name: data.document?.file_name || file.name,
            url: data.document?.url || URL.createObjectURL(file),
          };
          setLocalDocs((prev) => [newDoc, ...prev]);
          setUploadedDocs((prev) => [newDoc, ...prev]);
          setSuccessMsg("Uploaded successfully!");
        }
      } catch (err) {
        console.error(err);
      }
    }
    setUploading(false);
    e.target.value = "";
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-3xl relative">
        <button onClick={onClose} className="absolute right-3 top-3 text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>

        <h3 className="font-bold text-lg mb-4">Upload Documents for Khata {khata?.number}</h3>

        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileUpload}
          className="file-input file-input-bordered w-full mb-4"
          disabled={uploading}
        />

        {uploading && <p className="text-blue-600 text-sm mb-2">Uploading...</p>}
        {successMsg && (
          <div className="flex items-center gap-2 bg-green-100 border border-green-300 text-green-700 px-3 py-2 rounded-md mb-3">
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        <h4 className="font-semibold mb-3">Uploaded Files:</h4>

        {localDocs.length === 0 ? (
          <p className="text-gray-500 text-sm">No documents uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {localDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-xl border shadow-sm bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="font-medium text-sm truncate">{doc.name}</span>
                </div>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-xs btn-outline btn-primary"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </dialog>
  );
};

export default UploadModal;
