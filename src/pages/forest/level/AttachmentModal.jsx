import React from "react";

const AttachmentModal = ({ files = [], onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded shadow-lg w-[400px] max-h-[70vh] overflow-auto">

        <div className="flex justify-between items-center p-3 border-b">
          <h3 className="font-bold">Attachments</h3>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="p-4 space-y-2">
          {files.length === 0 && <p>No attachments</p>}

          {files.map((f, i) => (
            <div
              key={i}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>{f.name || `File ${i + 1}`}</span>

              <a
                href={f.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-xs btn-primary"
              >
                View
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttachmentModal;
