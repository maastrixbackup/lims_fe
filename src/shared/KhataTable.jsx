import React from "react";
import { Pencil, Trash2, Upload, Map as MapIcon } from "lucide-react";

const KhataTable = ({ khatas, onEdit, onDelete, onUpload, onMap }) => {
  return (
    <div className="card bg-white shadow-lg rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th>#</th>
              <th>Project</th>
              <th>Village</th>
              <th>Khata No.</th>
              <th>Created</th>
              <th className="text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {khatas.length > 0 ? (
              khatas.map((khata, idx) => (
                <tr
                  key={khata.id || idx}
                  className="hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  <td>{idx + 1}</td>
                  <td>{khata.project_name}</td>
                  <td>{khata.village_name}</td>
                  <td>{khata.khata_no}</td>
                  <td className="text-gray-500">
                    {new Date(khata.created_at).toLocaleDateString()}
                  </td>
                  <td className="text-right">
                    <div className="flex space-x-2 justify-end">
                      <button
                        className="btn btn-xs btn-warning text-white"
                        onClick={() => onEdit(khata)}
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        className="btn btn-xs btn-error text-white"
                        onClick={() => onDelete(khata)}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                      <button
                        className="btn btn-xs btn-info text-white"
                        onClick={() => onUpload(khata)}
                      >
                        <Upload size={14} /> Upload
                      </button>
                      <button
                        className="btn btn-xs btn-success text-white"
                        onClick={() => onMap(khata)}
                      >
                        <MapIcon size={14} /> Maps
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No khatas found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KhataTable;
