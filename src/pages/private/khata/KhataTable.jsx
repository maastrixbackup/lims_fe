// import React, { useState } from "react";
// import {
//   Pencil,
//   Trash2,
//   Upload,
//   Map as MapIcon,
//   LandPlot,
//   DockIcon,
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import moment from "moment";
// import PlotListModal from "./PlotListModal";
// import { setSelectedKhataId } from "../../../utils/khataSlice";
// import Pagination from "../../../shared/Pagination";

// const KhataTable = ({
//   khatas,
//   page,
//   limit,
//   setLimit,
//   totalPages,
//   setPage,
//   onEdit,
//   onDelete,
//   onUpload,
//   onMap,
// }) => {
//   const dispatch = useDispatch();
//   const userRole = useSelector((state) => state.auth.user?.role_name);
//   const selectedProject = useSelector((state) => state.selectedProject.project);

//   const [isPlotModalOpen, setIsPlotModalOpen] = useState(false);

//   const isRestricted =
//     userRole === "Data Entry User" || userRole === "Viewer";

//   // Filter khatas based on selected project
//   const displayKhatas = selectedProject
//     ? khatas.filter((k) => k.project_id === selectedProject.id)
//     : [];

//   const stickyActionHeader =
//     "p-3 text-right bg-gray-200 text-gray-700 sticky right-0 z-[30] shadow-md";

//   const stickyActionCell =
//     "p-3 text-right bg-white sticky right-0 border-l border-gray-100 shadow-sm";

//   const formatThreeItems = (value) => {
//     let items = [];

//     if (typeof value === "string") {
//       items = value.split(",").map((v) => v.trim());
//     } else if (Array.isArray(value)) {
//       items = value;
//     }

//     if (items.length === 0) return "No data";

//     const firstThree = items.slice(0, 3).join(", ");
//     return items.length > 3 ? `${firstThree} … (${items.length})` : firstThree;
//   };

//   return (
//     <>
//       <div className="card bg-white shadow-lg p-4">
//         {(!selectedProject || displayKhatas.length === 0) && (
//           <div className="py-10 text-center text-gray-600">
//             {selectedProject ? (
//               <>
//                 <p className="text-md font-medium text-red-500">
//                   No Khata found for the{" "}
//                   <span className="text-primary font-bold">
//                     Selected Project.
//                   </span>
//                 </p>
//                 <p className="text-md text-gray-500 mt-1">
//                   Try selecting a different  <span className="text-gray-700 font-semibold">Project</span>{" "}or add a new Khata.
//                 </p>
//               </>
//             ) : (
//               <>
//                 <p className="text-lg font-medium">
//                   Please{" "}
//                   <span className="text-primary font-semibold">
//                     Select a Project
//                   </span>{" "}
//                   first.
//                 </p>
//                 <p className="text-lg text-gray-500 mt-1">
//                   A project is required to view Khata list.
//                 </p>
//               </>
//             )}
//           </div>
//         )}
//         {selectedProject && displayKhatas.length > 0 && (
//           <>
//             <div className="max-h-[400px] overflow-x-auto">
//               <table className="table w-full">
//                 <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap">
//                   <tr>
//                     <th>Sl/No</th>
//                     <th>Name of Village</th>
//                     <th>Village Code</th>
//                     <th>Khata No.</th>
//                     <th>Plot No.</th>
//                     <th>Kissam of the Land</th>
//                     <th>Category of Land</th>
//                     <th>Total Area (Ac)</th>
//                     <th>Total Area (Ha)</th>
//                     <th>Acquired Area (Ac)</th>
//                     <th>Acquired Area (Ha)</th>
//                     <th>Remarks</th>
//                     <th>Tahasil</th>
//                     <th>R.I. Circle</th>
//                     <th>Thana No.</th>
//                     <th>Date of Award</th>
//                     <th>RT Name</th>
//                     <th>PT Name</th>
//                     <th>Present Address</th>
//                     <th>Affected Person</th>
//                     <th>Unique ID</th>
//                     <th>Plot Count</th>
//                     <th>Created</th>
//                     <th>Reference Document</th>
//                     <th className={stickyActionHeader}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {displayKhatas.map((khata, idx) => (
//                     <tr key={khata.id} className="whitespace-nowrap">
//                       <td>{(page - 1) * limit + idx + 1}</td>
//                       <td>{khata.village_name || "No data"}</td>
//                       <td>{khata.village_code || "No data"}</td>
//                       <td>{khata.khata_no || "No data"}</td>
//                       <td>{formatThreeItems(khata.plot_no)}</td>
//                       <td>{formatThreeItems(khata.kissam_of_land)}</td>
//                       <td>{formatThreeItems(khata.land_category)}</td>
//                       <td>{khata.land_area_total_acres || "No data"}</td>
//                       <td>{khata.land_area_total_hectares || "No data"}</td>
//                       <td>{khata.land_area_acquired_acres || "No data"}</td>
//                       <td>{khata.land_area_acquired_hectares || "No data"}</td>

//                       <td>{khata.lo13_remarks || "No data"}</td>
//                       <td>{khata.tahasil_name || "No data"}</td>
//                       <td>{formatThreeItems(khata.ri_circle_name)}</td>
//                       <td>{khata.thana_no || "No data"}</td>
//                       <td>{khata.date_of_award?.split("T")[0] || "No data"}</td>
//                       <td>{khata.name_of_recorded_tenant || "No data"}</td>
//                       <td>{khata.name_of_present_tenant || "No data"}</td>
//                       <td>{khata.present_address || "No data"}</td>
//                       <td>{khata.displaced_affected_person || "No data"}</td>

//                       <td>{khata.unique_id || "No data"}</td>
//                       <td>{khata.plot_count || "No data"}</td>

//                       <td>{moment(khata.created_at).format("DD-MM-YYYY")}</td>

//                       <td>
//                         <button
//                           className={`btn btn-xs text-white ${
//                             userRole === "Viewer"
//                               ? "!bg-gray-300 !text-gray-400"
//                               : "bg-blue-500"
//                           }`}
//                           onClick={() => onEdit(khata)}
//                           disabled={userRole === "Viewer"}
//                         >
//                           <DockIcon size={14} /> Reference
//                         </button>
//                       </td>

//                       <td className={stickyActionCell}>
//                         <div className="flex space-x-2 justify-end">
//                           <button
//                             className="btn btn-xs btn-accent text-white"
//                             onClick={() => {
//                               dispatch(setSelectedKhataId(khata.id));
//                               setIsPlotModalOpen(true);
//                             }}
//                           >
//                             <LandPlot size={14} /> View Plots
//                           </button>

//                           <button
//                             className={`btn btn-xs btn-info text-white ${
//                               userRole === "Viewer"
//                                 ? "!bg-gray-300 !text-gray-400"
//                                 : ""
//                             }`}
//                             onClick={() => onUpload(khata)}
//                             disabled={userRole === "Viewer"}
//                           >
//                             <Upload size={14} /> Upload
//                           </button>

//                           <button
//                             className="btn btn-xs btn-success text-white"
//                             onClick={() => onMap(khata)}
//                           >
//                             <MapIcon size={14} /> Maps
//                           </button>
//                                <button
//                             className={`btn btn-xs btn-warning text-white ${
//                               userRole === "Viewer"
//                                 ? "!bg-gray-300 !text-gray-400"
//                                 : ""
//                             }`}
//                             onClick={() => onEdit(khata)}
//                             disabled={userRole === "Viewer"}
//                           >
//                             <Pencil size={14} /> Edit
//                           </button>

//                           <button
//                             className={`btn btn-xs btn-error text-white ${
//                               isRestricted
//                                 ? "!bg-gray-300 !text-gray-400"
//                                 : ""
//                             }`}
//                             onClick={() => onDelete(khata)}
//                             disabled={isRestricted}
//                           >
//                             <Trash2 size={14} /> Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <Pagination
//               page={page}
//               totalPages={totalPages}
//               setPage={setPage}
//               limit={limit}
//               setLimit={setLimit}
//             />
//           </>
//         )}
//       </div>

//       {isPlotModalOpen && (
//         <PlotListModal onClose={() => setIsPlotModalOpen(false)} />
//       )}
//     </>
//   );
// };

// export default KhataTable;

import React, { useState, useEffect } from "react";
import {
  SlidersHorizontal,
  Upload,
  Map as MapIcon,
  LandPlot,
  DockIcon,
  // SlidersHorizontal,
  Filter,
  FilterIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import PlotListModal from "./PlotListModal";
import { setSelectedKhataId } from "../../../utils/khataSlice";
import Pagination from "../../../shared/Pagination";
import FilterableHeader from "./FilterableHeader";


const KhataTable = ({
  khatas,
  page,
  limit,
  setLimit,
  totalPages,
  setPage,
  onEdit,
  onDelete,
  onUpload,
  onMap,
  total,
}) => {
  const dispatch = useDispatch();
  const selectedProject = useSelector((state) => state.selectedProject.project);
  const [noData, setNoData] = useState(false);


  const [isPlotModalOpen, setIsPlotModalOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: null,
  });
  const userRole = useSelector((state) => state.auth.user?.role_name);
  const isRestricted = userRole === "Data Entry User" || userRole === "Viewer";
  /* ---------------- STICKY CLASSES ---------------- */
  const stickyCol1Header =
    "p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-0 z-[40] shadow-md min-w-[140px]";

  const stickyCol1Cell =
    "p-3 text-left bg-white md:sticky md:left-0 shadow-sm min-w-[140px]";

  const stickyCol2Header =
    "p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-[140px] z-[35] shadow-md min-w-[180px]";

  const stickyCol2Cell =
    "p-3 text-left bg-white md:sticky md:left-[140px] shadow-sm min-w-[180px]";

  const stickyActionHeader =
    "p-3 text-right bg-gray-200 text-gray-700 sticky right-0 z-[30] shadow-md";
  const stickyActionCell =
    "p-3 text-right sticky right-0 border-l border-gray-100 shadow-sm bg-white";

  /* ---------------- HELPERS ---------------- */
  const formatThreeItems = (value) => {
    if (!value) return "No data";
    const items =
      typeof value === "string"
        ? value.split(",").map((v) => v.trim())
        : Array.isArray(value)
        ? value
        : [];
    const firstThree = items.slice(0, 3).join(", ");
    return items.length > 3 ? `${firstThree} … (${items.length})` : firstThree;
  };

  const normalizeValue = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "number") return value;
    if (!isNaN(Date.parse(value))) return new Date(value).getTime();
    if (typeof value === "string")
      return value.split(",")[0].trim().toLowerCase();
    return value.toString().toLowerCase();
  };

  const handleSort = (field) => {
    setSortConfig((prev) => {
      if (prev.field !== field) return { field, direction: "asc" };
      if (prev.direction === "asc") return { field, direction: "desc" };
      return { field: null, direction: null };
    });
  };

  /* ---------------- DATA ---------------- */
  const displayKhatas = selectedProject
    ? khatas.filter((k) => k.project_id === selectedProject.id)
    : [];

  const getFilterOptions = (field) => {
    const set = new Set();
    displayKhatas.forEach((row) => {
      const val = row[field];
      if (!val) return;
      if (typeof val === "string") {
        val.split(",").forEach((v) => set.add(v.trim()));
      } else {
        set.add(String(val));
      }
    });
    return Array.from(set).sort();
  };

  const filteredKhatas = displayKhatas
    .filter((khata) =>
      Object.entries(filters).every(([field, value]) => {
        if (!value) return true;
        const fieldValue = khata[field];
        if (!fieldValue) return false;

        if (typeof fieldValue === "string")
          return fieldValue
            .split(",")
            .map((v) => v.trim())
            .includes(value);

        return String(fieldValue) === String(value);
      })
    )
    .sort((a, b) => {
      if (!sortConfig.field || !sortConfig.direction) return 0;
      const aVal = normalizeValue(a[sortConfig.field]);
      const bVal = normalizeValue(b[sortConfig.field]);

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    const isAnyFilterApplied = Object.values(filters).some(Boolean);
  useEffect(() => {
  if (isAnyFilterApplied && filteredKhatas.length === 0) {
    setNoData(true);
  } else {
    setNoData(false);
  }
}, [filteredKhatas, isAnyFilterApplied]);
const resetFilters = () => {
  setFilters({});
  setActiveFilter(null);
  setSortConfig({ field: null, direction: null });
  setPage?.(1); // optional if pagination exists
};

if (noData) {
  return (
    <div className="card bg-white shadow-lg py-16 flex flex-col items-center">
      <p className="text-lg font-semibold text-red-600">
        No matching Khata found
      </p>

      <p className="text-sm text-gray-500 mt-1">
        Applied filters returned no results.
      </p>

      <button
        className="btn btn-sm btn-outline btn-primary mt-5"
        onClick={resetFilters}
      >
        Reset Filters
      </button>
    </div>
  );
}


  return (
    <>
      <div className="card bg-white shadow-lg">
        {(!selectedProject || displayKhatas.length === 0) && (
          <div className="py-10 text-center text-gray-600">
            {!selectedProject ? (
              <>
                <p className="text-lg font-medium">
                  Please{" "}
                  <span className="text-primary font-semibold">
                    Select a Project
                  </span>{" "}
                  first.
                </p>
                <p className="text-lg text-gray-500 mt-1">
                  A project is required to view Khata list.
                </p>
              </>
            ) : (
              <>
                <p className="text-md font-medium text-red-500">
                  No Khata found for the{" "}
                  <span className="text-primary font-bold">
                    Selected Project.
                  </span>
                </p>
                <p className="text-md text-gray-500 mt-1">
                  Try selecting a different{" "}
                  <span className="text-gray-700 font-semibold">Project</span>{" "}
                  or add a new Khata.
                </p>
              </>
            )}
          </div>
        )}
        {selectedProject && filteredKhatas.length > 0 && (
          <>
            <div className="max-h-[400px] overflow-x-auto relative" style={{scrollbarWidth:"thin"}}>
              <table className="table w-full whitespace-nowrap">
                <thead className="sticky top-0 bg-gray-200 z-20">
                  <tr>
                    <th>Sl/No</th>

                    <FilterableHeader
                      label="Khata No."
                      field="khata_no"
                      className={stickyCol1Header}
                      filters={filters}
                      setFilters={setFilters}
                      activeFilter={activeFilter}
                      setActiveFilter={setActiveFilter}
                      getFilterOptions={getFilterOptions}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                    />

                    <FilterableHeader
                      label="Village"
                      field="village_name"
                      className={stickyCol2Header}
                      filters={filters}
                      setFilters={setFilters}
                      activeFilter={activeFilter}
                      setActiveFilter={setActiveFilter}
                      getFilterOptions={getFilterOptions}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                    />

                    {[
                      ["Village Code", "village_code"],
                      ["Plot No.", "plot_no"],
                      ["Kissam", "kissam_of_land"],
                      ["Category", "land_category"],
                      ["Total Area (Ac)", "land_area_total_acres"],
                      ["Total Area (Ha)", "land_area_total_hectares"],
                      ["Acquired Area (Ac)", "land_area_acquired_acres"],
                      ["Acquired Area (Ha)", "land_area_acquired_hectares"],
                      ["Remarks", "lo13_remarks"],
                      ["Tahasil", "tahasil_name"],
                      ["RI Circle", "ri_circle_name"],
                      ["Thana", "thana_no"],
                      ["Award Date", "date_of_award"],
                      ["RT Name", "name_of_recorded_tenant"],
                      ["PT Name", "name_of_present_tenant"],
                      ["Address", "present_address"],
                      ["Affected Person", "displaced_affected_person"],
                      ["Case No", "unique_id"],
                      ["Plot Count", "plot_count"],
                      ["Created", "created_at"],
                    ].map(([label, field]) => (
                      <FilterableHeader
                        key={field}
                        label={label}
                        field={field}
                        filters={filters}
                        setFilters={setFilters}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        getFilterOptions={getFilterOptions}
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      />
                    ))}

                    <th className={stickyActionHeader}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredKhatas.map((khata, idx) => (
                    <tr key={khata.id}>
                      <td>{(page - 1) * limit + idx + 1}</td>
                      <td className={stickyCol1Cell}>{khata.khata_no}</td>
                      <td className={stickyCol2Cell}>{khata.village_name}</td>
                      <td>{khata.village_code}</td>
                      <td>{formatThreeItems(khata.plot_no || "No Data")}</td>
                      <td>{formatThreeItems(khata.kissam_of_land || "No Data")}</td>
                      <td>{formatThreeItems(khata.land_category || "No Data")}</td>
                      <td>{khata.land_area_total_acres || "No Data"}</td>
                      <td>{khata.land_area_total_hectares || "No Data"}</td>
                      <td>{khata.land_area_acquired_acres}</td>
                      <td>{khata.land_area_acquired_hectares}</td>
                      <td>{khata.lo13_remarks || "No Data"}</td>
                      <td>{khata.tahasil_name || "No Data"}</td>
                      <td>{formatThreeItems(khata.ri_circle_name || "No Data")}</td>
                      <td>{khata.thana_no || "No Data"}</td>
                      <td>{khata.date_of_award?.split("T")[0] || "No Data"}</td>
                      <td>{khata.name_of_recorded_tenant || "No Data"}</td>
                      <td>{khata.name_of_present_tenant || "No Data"}</td>
                      <td>{khata.present_address || "No Data"}</td>
                      <td>{khata.displaced_affected_person || "No Data"}</td>
                      <td>{khata.unique_id || "No Data"}</td>
                      <td>{khata.plot_count || "No Data"}</td>
                      <td>{moment(khata.created_at).format("DD-MM-YYYY")}</td>

                      <td className={stickyActionCell}>
                        <select
                          className="select select-sm bg-gray-100 border border-gray-300 w-[42px] "
                          defaultValue=""
                          onChange={(e) => {
                            const action = e.target.value;
                            e.target.value = "";

                            if (action === "viewPlots") {
                              dispatch(setSelectedKhataId(khata.id));
                              setIsPlotModalOpen(true);
                            }

                            if (action === "upload") onUpload(khata);
                            if (action === "map") onMap(khata);
                            if (action === "edit") onEdit(khata);
                            if (action === "delete") onDelete(khata);
                          }}
                        >
                          <option value="" disabled>
                          <Filter size={12}/>
                          </option>

                          <option
                            value="viewPlots"
                            className="text-md text-gray-700 font-bold"
                          >
                            <LandPlot size={14} />View Plots ({khata.plot_count || 0})
                          </option>

                          <option
                            value="upload"
                            disabled={userRole === "Viewer"}
                            className={`text-md text-gray-700 font-bold ${
                              userRole === "Viewer" ? "!text-gray-400" : ""
                            }`}
                          >
                           <Upload size={14} />Upload ({khata.khata_document_count || 0})
                          </option>

                          <option value="map"  className="text-md text-gray-700 font-bold">
                            <MapIcon size={14} />Map ({khata.khata_map_document_count || 0})
                          </option>

                          <option value="edit" disabled={userRole === "Viewer"}
                             className={`text-md text-gray-700 font-bold ${
                                  userRole === "Viewer" ? "!text-gray-400" : ""
                                }`}
                          >
                            ✍️Edit
                          </option>

                          <option value="delete" disabled={isRestricted}
                              className={`text-md text-gray-700 font-bold ${
                                  isRestricted ? "!text-gray-400" : ""
                                }`}
                          >
                           ❌Delete
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
              totalPages={totalPages}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
            />
          </>
        )}
      </div>

      {isPlotModalOpen && (
        <PlotListModal onClose={() => setIsPlotModalOpen(false)} />
      )}
    </>
  );
};

export default KhataTable;

// import React, { useState, useRef, useEffect } from "react";
// import {
//   Upload,
//   Map as MapIcon,
//   LandPlot,
//   DockIcon,
//   SlidersHorizontal,
//   Filter,
//   FilterIcon,
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import moment from "moment";
// import PlotListModal from "./PlotListModal";
// import { setSelectedKhataId } from "../../../utils/khataSlice";
// import Pagination from "../../../shared/Pagination";

// const KhataTable = ({
//   khatas,
//   page,
//   limit,
//   setLimit,
//   totalPages,
//   setPage,
//   onEdit,
//   onDelete,
//   onUpload,
//   onMap,
//   total
// }) => {
//   const dispatch = useDispatch();
//   const userRole = useSelector((state) => state.auth.user?.role_name);
//   const selectedProject = useSelector((state) => state.selectedProject.project);

//   const [isPlotModalOpen, setIsPlotModalOpen] = useState(false);

//   const isRestricted = userRole === "Data Entry User" || userRole === "Viewer";

//   const stickyCol1Header =
//     "p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-0 z-[40] shadow-md min-w-[140px]";

//   const stickyCol1Cell =
//     "p-3 text-left bg-white md:sticky md:left-0 shadow-sm min-w-[140px]";

//   const stickyCol2Header =
//     "p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-[140px] z-[35] shadow-md min-w-[180px]";

//   const stickyCol2Cell =
//     "p-3 text-left bg-white md:sticky md:left-[140px] shadow-sm min-w-[180px]";

//   const stickyActionHeader =
//     "p-3 text-right bg-gray-200 text-gray-700 sticky right-0 z-[30] shadow-md";
//   const stickyActionCell =
//     "p-3 text-right sticky right-0 border-l border-gray-100 shadow-sm bg-white";

//   const [filters, setFilters] = useState({});
//   const [activeFilter, setActiveFilter] = useState(null);
//   const filterRef = useRef(null);
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (filterRef.current && !filterRef.current.contains(event.target)) {
//         setActiveFilter(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const getFilterOptions = (field) => {
//     return Array.from(
//       new Set(
//         displayKhatas
//           .map((k) => k[field])
//           .flatMap((v) => {
//             if (!v) return [];
//             if (Array.isArray(v)) return v;
//             if (typeof v === "string") return v.split(",").map((s) => s.trim());
//             return [v];
//           })
//       )
//     ).filter(Boolean);
//   };

//   const applyFilter = (field, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//     setPage(1);
//     setActiveFilter(null);
//   };

//   const formatThreeItems = (value) => {
//     let items = [];
//     if (typeof value === "string") {
//       items = value.split(",").map((v) => v.trim());
//     } else if (Array.isArray(value)) {
//       items = value;
//     }
//     if (items.length === 0) return "No data";
//     const firstThree = items.slice(0, 3).join(", ");
//     return items.length > 3 ? `${firstThree} … (${items.length})` : firstThree;
//   };

//   const displayKhatas = selectedProject
//     ? khatas.filter((k) => k.project_id === selectedProject.id)
//     : [];
//   const FilterableHeader = ({
//     label,
//     field,
//     activeFilter,
//     setActiveFilter,
//     applyFilter,
//     getFilterOptions,
//     className = "",
//     filterRef,
//   }) => {
//     return (
//       <th className={`relative ${className}`}>
//         <div className="flex items-center gap-1">
//           {label}
//           <FilterIcon
//             size={14}
//             className="cursor-pointer"
//             onClick={(e) => {
//               e.stopPropagation();
//               setActiveFilter(activeFilter === field ? null : field);
//             }}
//           />
//         </div>

//         {activeFilter === field && (
//           <div
//             ref={filterRef}
//             className="absolute left-0 mt-1 w-48 bg-white  rounded-md w-40 shadow-[0_4px_10px_rgba(1,1,1,0.25)]
// z-50 max-h-60 overflow-y-auto "
//             style={{ scrollbarWidth: "thin" }}
//           >
//             {/* ALL option */}
//             <div
//               className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 border-b border-gray-200"
//               onClick={() => applyFilter(field, "")}
//             >
//               All
//             </div>

//             {getFilterOptions(field).map((opt) => (
//               <div
//                 key={opt}
//                 className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 border-b border-gray-100"
//                 onClick={() => applyFilter(field, opt)}
//               >
//                 {opt}
//               </div>
//             ))}
//           </div>
//         )}
//       </th>
//     );
//   };

//   return (
//     <>
//       <div className="card bg-white shadow-lg">
//         {(!selectedProject || displayKhatas.length === 0) && (
//           <div className="py-10 text-center text-gray-600">
//             {!selectedProject ? (
//               <>
//                 <p className="text-lg font-medium">
//                   Please{" "}
//                   <span className="text-primary font-semibold">
//                     Select a Project
//                   </span>{" "}
//                   first.
//                 </p>
//                 <p className="text-lg text-gray-500 mt-1">
//                   A project is required to view Khata list.
//                 </p>
//               </>
//             ) : (
//               <>
//                 <p className="text-md font-medium text-red-500">
//                   No Khata found for the{" "}
//                   <span className="text-primary font-bold">
//                     Selected Project.
//                   </span>
//                 </p>
//                 <p className="text-md text-gray-500 mt-1">
//                   Try selecting a different{" "}
//                   <span className="text-gray-700 font-semibold">Project</span>{" "}
//                   or add a new Khata.
//                 </p>
//               </>
//             )}
//           </div>
//         )}

//         {selectedProject && displayKhatas.length > 0 && (
//           <>
//             <div
//               className="max-h-[400px] overflow-x-auto relative "
//               style={{
//                 scrollbarWidth: "thin",
//               }}
//             >
//               <table className="table w-full">
//                 <thead className="bg-gray-200 text-gray-700 sticky top-0 z-20 whitespace-nowrap">
//                   <tr>
//                     <th>Sl/No</th>

//                     <FilterableHeader
//                       label="Khata No."
//                       field="khata_no"
//                       className={stickyCol1Header}
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="Name of Village"
//                       field="village_name"
//                       className={stickyCol2Header}
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="Village Code"
//                       field="village_code"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="Plot No."
//                       field="plot_no"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="Kissam of the Land"
//                       field="land_of_kissam"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="Category of Land"
//                       field="land_category"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="Total Area (Ac)"
//                       field="total_area_ac"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="Total Area (Ha)"
//                       field="total_area_ha"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="Acquired Area (Ac)"
//                       field="acquired_area_ac"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="Acquired Area (Ha)"
//                       field="acquired_area_ha"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="Remarks"
//                       field="remarks"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="Tahasil"
//                       field="tahasil"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="R.I. Circle"
//                       field="ri_circle"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="Thana No."
//                       field="thana_no"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="Date of Award"
//                       field="date_of_award"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="RT Name"
//                       field="rt_name"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="PT Name"
//                       field="pt_name"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="Present Address"
//                       field="present_address"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="Affected Person"
//                       field="displaced_affected_person"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="Unique ID"
//                       field="unique_id"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="Plot Count"
//                       field="plot_count"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />

//                     <FilterableHeader
//                       label="Created"
//                       field="created_at"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     />
// {/*
//                     <FilterableHeader
//                       label="Reference Document"
//                       field="reference_document"
//                       activeFilter={activeFilter}
//                       setActiveFilter={setActiveFilter}
//                       applyFilter={applyFilter}
//                       getFilterOptions={getFilterOptions}
//                       filterRef={filterRef}
//                     /> */}

//                     <th className={stickyActionHeader}>Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {displayKhatas
//                     .filter((khata) =>
//                       Object.entries(filters).every(([field, value]) => {
//                         if (!value) return true;

//                         const fieldValue = khata[field];
//                         if (!fieldValue) return false;

//                         if (Array.isArray(fieldValue))
//                           return fieldValue.includes(value);

//                         if (typeof fieldValue === "string")
//                           return fieldValue
//                             .split(",")
//                             .map((v) => v.trim())
//                             .includes(value);

//                         return String(fieldValue) === String(value);
//                       })
//                     )
//                     .map((khata, idx) => (
//                       <tr key={khata.id} className="whitespace-nowrap">
//                         <td>{(page - 1) * limit + idx + 1}</td>

//                         <td className={stickyCol1Cell}>
//                           {khata.khata_no || "No data"}
//                         </td>

//                         <td className={stickyCol2Cell}>
//                           {khata.village_name || "No data"}
//                         </td>

//                         <td>{khata.village_code || "No data"}</td>
//                         <td>{formatThreeItems(khata.plot_no)}</td>
//                         <td>{formatThreeItems(khata.kissam_of_land)}</td>
//                         <td>{formatThreeItems(khata.land_category)}</td>
//                         <td>{khata.land_area_total_acres || "No data"}</td>
//                         <td>{khata.land_area_total_hectares || "No data"}</td>
//                         <td>{khata.land_area_acquired_acres || "No data"}</td>
//                         <td>
//                           {khata.land_area_acquired_hectares || "No data"}
//                         </td>
//                         <td>{khata.lo13_remarks || "No data"}</td>
//                         <td>{khata.tahasil_name || "No data"}</td>
//                         <td>{formatThreeItems(khata.ri_circle_name)}</td>
//                         <td>{khata.thana_no || "No data"}</td>
//                         <td>
//                           {khata.date_of_award?.split("T")[0] || "No data"}
//                         </td>
//                         <td>{khata.name_of_recorded_tenant || "No data"}</td>
//                         <td>{khata.name_of_present_tenant || "No data"}</td>
//                         <td>{khata.present_address || "No data"}</td>
//                         <td>{khata.displaced_affected_person || "No data"}</td>
//                         <td>{khata.unique_id || "No data"}</td>
//                         <td>{khata.plot_count || "No data"}</td>
//                         <td>{moment(khata.created_at).format("DD-MM-YYYY")}</td>
// {/*
//                         <td>
//                           <button
//                             className="btn btn-sm bg-blue-500 text-white w-40"
//                             onClick={() => onEdit(khata)}
//                           >
//                             <DockIcon size={14} /> Reference
//                           </button>
//                         </td> */}

//                         <td className={stickyActionCell}>
//                           <div className="dropdown dropdown-left">
//                             <label
//                               tabIndex={0}
//                               className="btn btn-xs bg-gray-200 border-0"
//                             >
//                               <SlidersHorizontal size={14} />
//                             </label>

//                             <ul className="dropdown-content menu p-2 bg-white rounded-md w-40 shadow-[0_4px_10px_rgba(1,1,1,0.25)] z-50 text-md space-y-3 ">
//                               <li>
//                                 <button
//                                   onClick={() => {
//                                     dispatch(setSelectedKhataId(khata.id));
//                                     setIsPlotModalOpen(true);
//                                   }}
//                                   className="text-gray-700 font-semibold"
//                                 >
//                                   <LandPlot size={14} /> View Plots (
//                                   {khata.plot_count || 0})
//                                 </button>
//                               </li>
//                               <li>
//                                 <button
//                                   disabled={userRole === "Viewer"}
//                                   onClick={() => onUpload(khata)}
//                                   className={`text-gray-700 font-semibold ${
//                                     userRole === "Viewer"
//                                       ? "!text-gray-400"
//                                       : ""
//                                   }`}
//                                 >
//                                   <Upload size={14} /> Upload (
//                                   {khata.khata_document_count || 0})
//                                 </button>
//                               </li>
//                               <li>
//                                 <button
//                                   className="text-gray-700 font-semibold"
//                                   onClick={() => onMap(khata)}
//                                 >
//                                   <MapIcon size={14} /> Map (
//                                   {khata.khata_map_document_count || 0})
//                                 </button>
//                               </li>
//                               <li>
//                                 <button
//                                   disabled={userRole === "Viewer"}
//                                   onClick={() => onEdit(khata)}
//                                   // className="text-gray-700 font-semibold"
//                                   className={`text-gray-700 font-semibold ${
//                                     userRole === "Viewer"
//                                       ? "!text-gray-400"
//                                       : ""
//                                   }`}
//                                 >
//                                   ✍️ Edit
//                                 </button>
//                               </li>
//                               <li>
//                                 <button
//                                   disabled={isRestricted}
//                                   onClick={() => onDelete(khata)}
//                                   //  className="text-gray-700 font-semibold"
//                                   className={`text-gray-800 font-semibold ${
//                                     isRestricted ? "!text-gray-400" : ""
//                                   }`}
//                                 >
//                                   ❌ Delete
//                                 </button>
//                               </li>
//                             </ul>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>

//             <Pagination
//               page={page}
//               totalPages={totalPages}
//               setPage={setPage}
//               limit={limit}
//               setLimit={setLimit}
//               total={total}
//             />
//           </>
//         )}
//       </div>

//       {isPlotModalOpen && (
//         <PlotListModal onClose={() => setIsPlotModalOpen(false)} />
//       )}
//     </>
//   );
// };

// export default KhataTable;
