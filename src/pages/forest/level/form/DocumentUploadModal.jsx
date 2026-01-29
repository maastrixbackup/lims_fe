import React from "react";

const DocumentUploadModal = ({ section, docs, files, onUpload, onClose }) => {
  if (!section) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-xl">

        <h3 className="font-bold mb-3">{section} Documents</h3>

        {docs.map((doc) => (
          <div key={doc} className="flex gap-2 mb-2 items-center">
            <span className="w-48 text-sm">{doc}</span>

            <input
              type="file"
              className="file-input file-input-bordered file-input-sm"
              onChange={(e) => onUpload(doc, e.target.files[0])}
            />

            {files?.[doc] && <span className="text-success text-xs">✔</span>}
          </div>
        ))}

        <div className="modal-action">
          <button className="btn btn-success btn-sm" onClick={onClose}>
            Done
          </button>
        </div>

      </div>
    </dialog>
  );
};

export default DocumentUploadModal;
