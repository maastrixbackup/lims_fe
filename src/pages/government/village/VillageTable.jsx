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
          <div
            className="max-h-[400px] overflow-x-auto"
            style={{ scrollbarWidth: "thin" }}
          >
            <table className="table w-full">
              <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap">
                <tr>
                  <th className="font-semibold text-sm text-gray-700">Sl/No</th>
                  <th className="font-semibold text-sm text-gray-700">Village Code</th>
                  <th className="font-semibold text-sm text-gray-700">Village</th>
                  <th className="font-semibold text-sm text-gray-700">District</th>
                  <th className="font-semibold text-sm text-gray-700">Tahasil</th>
                   <th className="font-semibold text-sm text-gray-700">Thana Name & No</th>
                  <th className="font-semibold text-sm text-gray-700">Date</th>
                  <th className="text-right font-semibold text-sm text-gray-700">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredVillages.map((v, i) => (
                  <tr key={v.id} className="hover:bg-gray-50 whitespace-nowrap">
                    <td>{i + 1}</td>
                    <td>{v.village_code || "No Data"}</td>
                    <td>{v.village_name || "No Data"}</td>
                    <td>{v.district || "No Data"}</td>
                    <td>{v.tahasil || "No Data"}</td>
                    <td>{v.thana_no || "No Data"}</td>
                    <td>{moment(v.created_at).format("DD-MM-YYYY")}</td>
                 
                    <td className="text-right">
                      <select
                    className="select select-sm bg-gray-100 border border-gray-300 w-[42px] "
                        defaultValue=""
                        onChange={(e) => {
                          const action = e.target.value;
                          e.target.value = "";

                          if (action === "edit" && canEdit) {
                            onEdit(v);
                          }

                          if (action === "delete" && canDelete) {
                            onDelete(v);
                          }
                        }}
                        // disabled={!canEdit && !canDelete}
                      >
                        <option value="" disabled>
                          Actions
                        </option>

                        <option value="edit" disabled={userRole === "Viewer"}
                            className={`text-md text-gray-700 font-bold ${
                              userRole === "Viewer" ? "!text-gray-400" : ""
                            }`}>
                          ✏️ Edit
                        </option>

                        <option value="delete"  disabled={!canDelete}
                            className={`text-md text-gray-700 font-bold ${
                              !canDelete ? "!text-gray-400" : ""
                            }`}>
                          🗑 Delete
                        </option>
                      </select>
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
