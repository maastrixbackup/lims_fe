// src/components/Khata/UploadModal.jsx
import React from "react";
import { X } from "lucide-react";

const UploadModal = ({ khata, uploadedDocs, setUploadedDocs, onClose }) => {
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setUploadedDocs((prev) => [...newDocs, ...prev]);
    e.target.value = "";
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-3xl">
         <button
          type="button"
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h3 className="font-bold text-lg mb-4">
          Upload Documents for Khata {khata?.number}
        </h3>

        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileUpload}
          className="file-input file-input-bordered w-full mb-4"
        />

        <h4 className="font-semibold mb-3">Uploaded Files:</h4>
        <div className="grid grid-cols-1 gap-3">
          {uploadedDocs.map((doc, idx) => (
            <div
              key={idx}
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

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default UploadModal;
