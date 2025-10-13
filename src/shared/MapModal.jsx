// src/components/Khata/MapModal.jsx
import React from "react";
import { X } from "lucide-react";

const MapModal = ({ khata, onClose }) => {
  const maps = [
    { id: 2084, file: "2084.kmz" },
    { id: 2088, file: "2088.kmz" },
  ];

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-xl">
         <button
          type="button"
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h3 className="font-bold text-lg mb-4">
          Maps for Khata {khata?.number}
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {maps.map((map) => (
            <div
              key={map.id}
              className="flex items-center justify-between p-3 rounded-xl border shadow-sm bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="font-medium text-sm truncate">{map.id}</span>
              </div>
              <a
                href={`/${map.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-xs btn-outline btn-primary"
              >
                View in Google Earth
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

export default MapModal;
