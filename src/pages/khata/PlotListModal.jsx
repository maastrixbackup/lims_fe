import React from "react";
import { X, MapPin, Eye } from "lucide-react";

const PlotListModal = ({ plots = [], onClose }) => {
  return (
    <dialog open className="modal modal-open bg-white">
      <div className="modal-box max-w-6xl bg-white relative">
     
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>


        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <MapPin size={20} className="text-blue-500" />
          Plot List
        </h3>

      
        <div className="overflow-x-auto max-h-[65vh]">
          <table className="table table-zebra w-full border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
              <tr>
                <th>#</th>
                <th>Plot No.</th>
                {/* <th>Survey No.</th> */}
                <th>Area (in sq.m)</th>
                <th>Village</th>
                <th>Owner</th>
                {/* <th>Status</th>
                <th className="text-center">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {plots.length > 0 ? (
                plots.map((plot, index) => (
                  <tr key={plot.id || index}>
                    <td>{index + 1}</td>
                    <td className="font-semibold">{plot.plot_no}</td>
                    {/* <td>{plot.survey_no}</td> */}
                    <td>{plot.area || "—"}</td>
                    <td>{plot.village_name || "—"}</td>
                    <td>{plot.owner_name || "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    No plots available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

export default PlotListModal;
