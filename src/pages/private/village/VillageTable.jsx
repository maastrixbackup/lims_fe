import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import moment from "moment";
import { getTypeName } from "../../../utils/constants";
import { useSelector } from "react-redux";

const VillageTable = ({
  villages = [],
  projects = [],
  isRestricted,
  onEdit,
  onDelete,
}) => {
  const selectedProject = useSelector((state) => state.selectedProject.project);

  const filteredVillages = selectedProject
    ? villages.filter((v) => v.project_id === selectedProject.id)
    : villages;

  return (
    <div className="card bg-white shadow-lg">
      <div className="max-h-[400px] overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap">
            <tr>
              <th>#</th>
              {/* <th>Project</th> */}
              <th>Village Code</th>
              <th>Village</th>
              <th>District</th>
              <th>Tahasil</th>
              {/* <th>Type</th> */}
              
              <th>Date</th>
              <th className="text-right pr-6">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredVillages.length ? (
              filteredVillages.map((v, i) => {
                const project = projects.find((p) => p.id === v.project_id);
                return (
                  <tr key={v.id} className="hover:bg-gray-50 whitespace-nowrap">
                    <td>{i + 1}</td>
                    {/* <td>{project?.name || "N/A"}</td> */}
                     <td>{v.village_code}</td>
                    <td>{v.village_name}</td>
                    <td>{v.district}</td>
                    <td>{v.tahasil}</td>
                    {/* <td>{getTypeName(v.type)}</td> */}
                   
                    <td>{moment(v.created_at).format("DD-MM-YYYY")}</td>
                    <td className="text-right space-x-2">
                      <button
                        className={`btn btn-xs btn-warning text-white ${
                          isRestricted
                            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => onEdit(v)}
                        disabled={isRestricted}
                      >
                        <Pencil size={14} /> Edit
                      </button>

                      <button
                        className={`btn btn-xs btn-error text-white ${
                          isRestricted
                            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => onDelete(v)}
                        disabled={isRestricted}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
               <td colSpan="9" className="text-center py-6 text-gray-500">
                    {selectedProject ? (
                      <>
                        <p className="text-md font-medium text-red-500">
                          No Village found for the{" "}
                          <span className="text-primary font-semibold">
                            Selected Project.
                          </span>
                          
                        </p>
                        <p className="text-md text-gray-500 mt-1">
                          Try selecting a different project or add a new Village.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-medium text-gray-500">
                          Please{" "}
                          <span className="text-primary font-semibold">
                            select a project
                          </span>{" "}
                          first.
                        </p>
                        <p className="text-lg text-gray-500 mt-1">
                          A project is required to view Village list.
                        </p>
                      </>
                    )}
                  </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VillageTable;
