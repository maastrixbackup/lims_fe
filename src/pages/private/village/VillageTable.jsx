import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import moment from "moment";
import { useSelector } from "react-redux";
import Pagination from "../../../shared/Pagination";

const VillageTable = ({
  villages = [],
  projects = [],
  isRestricted,
  onEdit,
  onDelete,
  page,
  setPage,
  limit,
  setLimit,
  totalPages,
}) => {
  const selectedProject = useSelector((state) => state.selectedProject.project);
  const userRole = useSelector((state) => state.auth.user?.role_name);
  //  console.log("user role", userRole)
  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");

  const filteredVillages = selectedProject
    ? villages.filter((v) => v.project_id === selectedProject.id)
    : [];

  const showNoProject = !selectedProject;
  const showNoVillages = selectedProject && filteredVillages.length === 0;

  return (
    <div className="card bg-white shadow-lg">
      {showNoProject && (
        <div className="py-10 text-center">
          <p className="text-lg font-medium text-gray-500">
            Please{" "}
            <span className="text-primary font-semibold">Select a Project</span>{" "}
            first.
          </p>
          <p className="text-lg text-gray-500 mt-1">
            A project is required to view the Village list.
          </p>
        </div>
      )}
      {showNoVillages && (
        <div className="py-10 text-center">
          <p className="text-md font-medium text-red-500">
            No Village found for the{" "}
            <span className="text-primary font-bold">Selected Project</span>
          </p>
          <p className="text-md text-gray-500 mt-1">
            Try selecting a different{" "}
            <span className="text-gray-600 font-semibold">Project</span> or add
            a new Village.
          </p>
        </div>
      )}
      {!showNoProject && !showNoVillages && (
        <>
        <div className="max-h-[400px] overflow-x-auto"
        style={{ scrollbarWidth: "thin" }}>
          <table className="table w-full">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap">
              <tr>
                <th>Sl/No</th>
                <th>Village Code</th>
                <th>Village</th>
                <th>District</th>
                <th>Tahasil</th>
                <th>Date</th>
                <th className="text-right pr-6">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredVillages.map((v, i) => (
                <tr key={v.id} className="hover:bg-gray-50 whitespace-nowrap">
                  <td>{i + 1}</td>
                  <td>{v.village_code}</td>
                  <td>{v.village_name}</td>
                  <td>{v.district}</td>
                  <td>{v.tahasil}</td>
                  <td>{moment(v.created_at).format("DD-MM-YYYY")}</td>
                  {/* 
                  <td className="text-right space-x-2">
                    <button
                      // className={`btn btn-xs btn-warning text-white ${
                      //   isRestricted
                      //     ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                      //     : ""
                      // }`}
                        className={`btn btn-xs btn-warning text-white ${
                              userRole === "Viewer"
                                ? "!bg-gray-300 !text-gray-400"
                                : ""
                            }`}
                      onClick={() => onEdit(v)}
                      disabled={userRole === "Viewer"}
                      // disabled={isRestricted}
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
                  </td> */}

                  <td className="text-right space-x-2">
                    {/* Edit Button */}
                    <button
                      className={`btn btn-xs btn-warning text-white ${
                        !canEdit
                          ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => canEdit && onEdit(v)}
                      disabled={!canEdit}
                    >
                      <Pencil size={14} /> Edit
                    </button>

                    {/* Delete Button */}
                    <button
                      className={`btn btn-xs btn-error text-white ${
                        !canDelete
                          ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => canDelete && onDelete(v)}
                      disabled={!canDelete}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
       
        </div>
          <Pagination
              page={page}
              limit={limit}
              setPage={setPage}
              totalPages={totalPages}
              setLimit={setLimit}
            />
        </>
      )}
         {/* {selectedProject && (
            <Pagination
              page={page}
              limit={limit}
              setPage={setPage}
              totalPages={totalPages}
              setLimit={setLimit}
            />
          )} */}
    </div>
  );
};

export default VillageTable;
