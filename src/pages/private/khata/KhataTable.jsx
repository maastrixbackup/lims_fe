import React, { useState } from "react";
import { Pencil, Trash2, Upload, Map as MapIcon, LandPlot, DockIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import PlotListModal from "./PlotListModal";
import { setSelectedKhataId } from "../../../utils/khataSlice";

const KhataTable = ({
  khatas,
  page,
  totalPages,
  setPage,
  onEdit,
  onDelete,
  onUpload,
  onMap,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role_name || "";
  const selectedProject = useSelector((state) => state.selectedProject.project);

  const [isPlotModalOpen, setIsPlotModalOpen] = useState(false);

  // Filter by selected project
  const displayKhatas = selectedProject
    ? khatas.filter((k) => k.project_id === selectedProject.id)
    : khatas;

  const isRestricted = userRole === "Data Entry User" || userRole === "Viewer";
  const rowClass = "hover:bg-gray-50 transition-colors";

  const stickyActionHeader =
    "p-3 text-right bg-gray-200 text-gray-700 sticky right-0 z-[30] shadow-md";

  const stickyActionCell =
    "p-3 text-right bg-white sticky right-0 border-l border-gray-100 shadow-sm";

  return (
    <>
      <div className="card bg-white shadow-lg">
        <div className="max-h-[400px] overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap">
              <tr>
                <th>Sl/No</th>

                {/* Extra columns from the image */}
                <th>Name of Village</th>
                <th>Code</th>
                <th>Khata No.</th>
                <th>Plot No.</th>
                <th>Kissam of the Land</th>
                <th>Category of Land</th>
                <th>Land Area (Total Area in Acres)</th>
                <th>Land Area (Total Area in Ha.)</th>
                <th>Land Area (Total Acquired Area in Acres)</th>
                <th>Land Area (Total Acquired Area in Ha.)</th>
                <th>Remarks</th>
                <th>Name of the Tahasil</th>
                <th>Name of the R.I. Circle</th>
                <th>Thana No.</th>
                <th>Date of Award</th>
                <th>Name of Recorded Tenants (RT)</th>
                <th className="bg-green-100">Name of Present Tenants (PT)</th>
                <th>Present Address</th>
                {/* <th className="bg-green-100">Contact No.</th> */}
                <th>Displaced / Affected Person</th>

                {/* Old columns you already had */}
                <th>Unique ID</th>
                <th>Plot Count</th>
                <th>Created</th>
                <th>Reference Document</th>
                <th className={stickyActionHeader}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {displayKhatas.length > 0 ? (
                displayKhatas.map((khata, idx) => (
                  <tr
                    key={khata.id}
                    className="hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    <td>{(page - 1) * 10 + idx + 1}</td>

                    {/* New Columns from Image */}
                    <td>{khata.village_name || "No data"}</td>
                    <td>{khata.code || "No data"}</td>
                    <td>{khata.khata_no || "No data"}</td>
                    <td>{khata.plot_no || "No data"}</td>
                    <td>{khata.kissam_of_land || "No data"}</td>
                    <td>{khata.land_category || "No data"}</td>

                    <td>{khata.land_area_total_acres || "No data"}</td>
                    <td>{khata.land_area_total_hectares || "No data"}</td>

                    <td>{khata.land_area_acquired_acres || "No data"}</td>
                    <td>{khata.land_area_acquired_hectares || "No data"}</td>

                    <td>{khata.lo13_remarks || "No data"}</td>

                    <td>{khata.tahasil_name || "No data"}</td>
                    <td>{khata.ri_circle_name || "No data"}</td>
                    <td>{khata.thana_no || "No data"}</td>

                    {/* Newly Added Fields */}
                    <td>
                      {khata.date_of_award
                        ? khata.date_of_award.split("T")[0]
                        : "No data"}
                    </td>
                    <td>{khata.name_of_recorded_tenant || "No data"}</td>
                    <td>{khata.name_of_present_tenant || "No data"}</td>
                    <td>{khata.present_address || "No data"}</td>
                    <td>{khata.displaced_affected_person || "No data"}</td>

                    {/* Your existing columns */}
                    <td>{khata.unique_id}</td>
                    <td>{khata.plot_count || "No Plots"}</td>

                    <td className="text-gray-500">
                      {moment(khata.created_at).format("DD-MM-YYYY")}
                    </td>
                    <td>   
                       <button
                          className={`btn btn-xs text-white ${
                            userRole === "Viewer"
                              ? "!bg-gray-300 !text-gray-400"
                              : "bg-blue-500"
                          }`}
                          onClick={() => onEdit(khata)}
                          disabled={userRole === "Viewer"}
                        >
                          <DockIcon size={14} /> Reference Document
                        </button>
                        </td>
                    <td className={stickyActionCell}>
                      <div className="flex space-x-2 justify-end">
                          {/* <button
                          className={`btn btn-xs text-white ${
                            userRole === "Viewer"
                              ? "!bg-gray-300 !text-gray-400"
                              : "bg-blue-300"
                          }`}
                          onClick={() => onEdit(khata)}
                          disabled={userRole === "Viewer"}
                        >
                          <DockIcon size={14} /> Reference Document
                        </button> */}
                        <button
                          // className={`btn btn-xs btn-accent text-white ${
                          //   isRestricted
                          //     ? "!bg-gray-300 !text-gray-400 !cursor-not-allowed"
                          //     : ""
                          // }`}
                          className="btn btn-xs btn-accent text-white"
                          onClick={() => {
                            dispatch(setSelectedKhataId(khata.id));
                            setIsPlotModalOpen(true);
                          }}
                          // disabled={isRestricted}
                        >
                          <LandPlot size={14} /> View Plots
                        </button>

                        <button
                          className={`btn btn-xs btn-warning text-white ${
                            userRole === "Viewer"
                              ? "!bg-gray-300 !text-gray-400"
                              : ""
                          }`}
                          onClick={() => onEdit(khata)}
                          disabled={userRole === "Viewer"}
                        >
                          <Pencil size={14} /> Edit
                        </button>

                        <button
                          className={`btn btn-xs btn-info text-white ${
                            userRole === "Viewer"
                              ? "!bg-gray-300 !text-gray-400"
                              : ""
                          }`}
                          onClick={() => onUpload(khata)}
                          disabled={userRole === "Viewer"}
                        >
                          <Upload size={14} /> Upload
                        </button>

                        <button
                          className="btn btn-xs btn-success text-white"
                          onClick={() => onMap(khata)}
                        >
                          <MapIcon size={14} /> Maps
                        </button>

                        <button
                          className={`btn btn-xs btn-error text-white ${
                            isRestricted ? "!bg-gray-300 !text-gray-400" : ""
                          }`}
                          onClick={() => onDelete(khata)}
                          disabled={isRestricted}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    {selectedProject ? (
                      <>
                        <p className="text-md font-medium text-gray-500">
                          No Khata found for the{" "}
                          <span className="text-primary font-semibold">
                            selected project
                          </span>
                          .
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Try selecting a different project or add a new Khata.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-md font-medium text-gray-500">
                          Please{" "}
                          <span className="text-primary font-semibold">
                            select a project
                          </span>{" "}
                          first.
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          A project is required to view Khata list.
                        </p>
                      </>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Compact Pagination (Server-Side) */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center p-4 border-t border-gray-300 bg-gray-50">
            <div className="join">
              {/* Prev Button */}
              <button
                className="join-item btn btn-sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </button>

              {/* First Page */}
              <button
                className={`join-item btn btn-sm ${
                  page === 1 ? "btn-primary" : ""
                }`}
                onClick={() => setPage(1)}
              >
                1
              </button>

              {/* Left Ellipsis */}
              {page > 3 && (
                <button className="join-item btn btn-sm btn-disabled">…</button>
              )}

              {/* Previous Page */}
              {page > 2 && (
                <button
                  className="join-item btn btn-sm"
                  onClick={() => setPage(page - 1)}
                >
                  {page - 1}
                </button>
              )}

              {/* Current Page */}
              {page !== 1 && page !== totalPages && (
                <button className="join-item btn btn-sm btn-primary">
                  {page}
                </button>
              )}

              {/* Next Page */}
              {page < totalPages - 1 && (
                <button
                  className="join-item btn btn-sm"
                  onClick={() => setPage(page + 1)}
                >
                  {page + 1}
                </button>
              )}

              {/* Right Ellipsis */}
              {page < totalPages - 2 && (
                <button className="join-item btn btn-sm btn-disabled">…</button>
              )}

              {/* Last Page */}
              {totalPages > 1 && (
                <button
                  className={`join-item btn btn-sm ${
                    page === totalPages ? "btn-primary" : ""
                  }`}
                  onClick={() => setPage(totalPages)}
                >
                  {totalPages}
                </button>
              )}

              {/* Next Button */}
              <button
                className="join-item btn btn-sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {isPlotModalOpen && (
        <PlotListModal onClose={() => setIsPlotModalOpen(false)} />
      )}
    </>
  );
};

export default KhataTable;
