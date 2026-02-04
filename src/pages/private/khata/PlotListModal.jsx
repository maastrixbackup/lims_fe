// import React, { useEffect, useState } from "react";
// import { X, MapPin } from "lucide-react";
// import { useSelector } from "react-redux";
// import { API_BASE_URL } from "../../../utils/config";
// import { useLandTypeParam } from "../../../utils/landtypes";

// const PlotListModal = ({ onClose }) => {
//   const token = useSelector((s) => s.auth.userToken);
//   const khataId = useSelector((s) => s.khata.selectedKhataId);
//   console.log("khata_id", khataId);

//   const [plots, setPlots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const typeParam= useLandTypeParam()
//   console.log("typeparam in plot view",typeParam)

//   useEffect(() => {
//     if (!khataId) return;

//     const fetchPlots = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(
//           `${API_BASE_URL}/khata/viewPlotsByKhata/${khataId}?type=${typeParam}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = await res.json();
//         console.log("khata plots", data);

//         // FIXED: Correct path
//         setPlots(data?.data?.plots || []);
//       } catch (err) {
//         console.error("Error fetching plots:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlots();
//   }, [khataId, token]);

//   return (
//     <dialog open className="modal modal-open">
//       <div className="modal-box max-w-4xl relative">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
//         >
//           <X size={20} />
//         </button>

//         {/* Title */}
//         <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
//           <MapPin size={20} className="text-blue-500" />
//           Plot List
//         </h3>

//         {/* Loading indicator */}
//         {loading ? (
//           <p className="text-center py-6">Loading plots...</p>
//         ) : (
//           <div className="overflow-x-auto max-h-[65vh]">
//             <table className="table table-zebra w-full border border-gray-200">
//               <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
//                 <tr>
//                   <th>#</th>
//                   <th>Plot No.</th>
//                   <th>Area (sq.m)</th>
//                   <th>Village</th>
//                   <th>Owner</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {plots.length > 0 ? (
//                   plots.map((plot, index) => (
//                     <tr key={plot.id || index}>
//                       <td>{index + 1}</td>
//                       <td className="font-semibold">{plot.plot_no}</td>
//                       <td>{plot.land_area_total_acres || "—"}</td>
//                       <td>{plot.village_name || "—"}</td>
//                       <td>{plot.name_of_present_tenant || "—"}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="text-center py-6 text-gray-500">
//                       No plots available for this Khata.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Footer */}
//         <div className="modal-action">
//           <button className="btn" onClick={onClose}>
//             Close
//           </button>
//         </div>
//       </div>
//     </dialog>
//   );
// };

// export default PlotListModal;

// import React, { useEffect, useState } from "react";
// import { X, MapPin } from "lucide-react";
// import { useSelector } from "react-redux";
// import { API_BASE_URL } from "../../../utils/config";
// import { useLandTypeParam } from "../../../utils/landtypes";

// const PlotListModal = ({ onClose }) => {
//   const token = useSelector((s) => s.auth.userToken);
//   const khataId = useSelector((s) => s.khata.selectedKhataId);
//   console.log("khata_id", khataId);

//   const [plots, setPlots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const typeParam= useLandTypeParam()
//   console.log("typeparam in plot view",typeParam)

//   useEffect(() => {
//     if (!khataId) return;

//     const fetchPlots = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(
//           `${API_BASE_URL}/khata/viewPlotsByKhata/${khataId}?type=${typeParam}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = await res.json();
//         console.log("khata plots", data);

//         // FIXED: Correct path
//         setPlots(data?.data?.plots || []);
//       } catch (err) {
//         console.error("Error fetching plots:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlots();
//   }, [khataId, token]);

//   return (
//     <dialog open className="modal modal-open">
//       <div className="modal-box max-w-4xl relative">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
//         >
//           <X size={20} />
//         </button>

//         {/* Title */}
//         <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
//           <MapPin size={20} className="text-blue-500" />
//           Plot List
//         </h3>

//         {/* Loading indicator */}
//         {loading ? (
//           <p className="text-center py-6">Loading plots...</p>
//         ) : (
//           <div className="overflow-x-auto max-h-[65vh]">
//             <table className="table table-zebra w-full border border-gray-200">
//               <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
//                 <tr>
//                   <th>#</th>
//                   <th>Plot No.</th>
//                   <th>Area (sq.m)</th>
//                   <th>Village</th>
//                   <th>Owner</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {plots.length > 0 ? (
//                   plots.map((plot, index) => (
//                     <tr key={plot.id || index}>
//                       <td>{index + 1}</td>
//                       <td className="font-semibold">{plot.plot_no}</td>
//                       <td>{plot.land_area_total_acres || "—"}</td>
//                       <td>{plot.village_name || "—"}</td>
//                       <td>{plot.name_of_present_tenant || "—"}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="text-center py-6 text-gray-500">
//                       No plots available for this Khata.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Footer */}
//         <div className="modal-action">
//           <button className="btn" onClick={onClose}>
//             Close
//           </button>
//         </div>
//       </div>
//     </dialog>
//   );
// };

// export default PlotListModal;

import React, { useEffect, useMemo, useState } from "react";
import { X, MapPin, ArrowUpDown } from "lucide-react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../utils/config";
import { useLandTypeParam } from "../../../utils/landtypes";
import { apiClient } from "../../../utils/apiClient";

const PlotListModal = ({ onClose }) => {
  const token = useSelector((s) => s.auth.userToken);
  const khataId = useSelector((s) => s.khata.selectedKhataId);

  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const [plotNoFilter, setPlotNoFilter] = useState("");
  const [villageFilter, setVillageFilter] = useState("");
  const [areaUnit, setAreaUnit] = useState("acres");
  const [areaFilter, setAreaFilter] = useState("");

  const typeParam = useLandTypeParam();

useEffect(() => {
  if (!khataId) return;

  const fetchPlots = async () => {
    setLoading(true);
    try {
      const data = await apiClient(
        `/khata/viewPlotsByKhata/${khataId}?type=${typeParam}`
      );

      setPlots(data?.data?.plots || []);
      console.log("plot list", data)
    } catch (err) {
      console.error("Error fetching plots:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchPlots();
}, [khataId, typeParam]);



  const villages = useMemo(
    () => [...new Set(plots.map((p) => p.village_name).filter(Boolean))],
    [plots]
  );

  const plotNumbers = useMemo(
    () => [...new Set(plots.map((p) => p.plot_no).filter(Boolean))],
    [plots]
  );

  // const areaValues = useMemo(() => {
  //   const key =
  //     areaUnit === "acres"
  //       ? "land_area_total_acres"
  //       : "land_area_total_hectares";

  //   return [...new Set(plots.map((p) => p[key]).filter(Boolean))].sort(
  //     (a, b) => Number(a) - Number(b)
  //   );
  // }, [plots, areaUnit]);

  const ownerNames = useMemo(
    () => [
      ...new Set(
        plots.map((p) => p.name_of_present_tenant).filter((n) => n && n.trim())
      ),
    ],
    [plots]
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const processedPlots = useMemo(() => {
    return plots
      .filter((plot) => {
        if (plotNoFilter && plot.plot_no?.toString() !== plotNoFilter)
          return false;

        if (villageFilter && plot.village_name !== villageFilter) return false;

        if (areaFilter) {
          const value =
            areaUnit === "acres"
              ? plot.land_area_total_acres
              : plot.land_area_total_hectares;
          if (value?.toString() !== areaFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (!sortConfig.key) return 0;
        const A = a[sortConfig.key] ?? "";
        const B = b[sortConfig.key] ?? "";

        if (typeof A === "number") {
          return sortConfig.direction === "asc" ? A - B : B - A;
        }

        return sortConfig.direction === "asc"
          ? A.toString().localeCompare(B.toString())
          : B.toString().localeCompare(A.toString());
      });
  }, [plots, plotNoFilter, villageFilter, areaFilter, areaUnit, sortConfig]);

  const areaTotals = useMemo(() => {
    return processedPlots.reduce(
      (acc, plot) => {
        acc.totalAcres += Number(plot.land_area_total_acres) || 0;
        acc.totalHectares += Number(plot.land_area_total_hectares) || 0;
        acc.acquiredAcres += Number(plot.land_area_acquired_acres) || 0;
        acc.acquiredHectares += Number(plot.land_area_acquired_hectares) || 0;
        return acc;
      },
      {
        totalAcres: 0,
        totalHectares: 0,
        acquiredAcres: 0,
        acquiredHectares: 0,
      }
    );
  }, [processedPlots]);

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-3xl relative" style={{scrollbarWidth:"thin"}}>
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

        <div className="flex flex-wrap gap-2 mb-4">
          <select
            className="select select-bordered w-40"
            value={plotNoFilter}
            onChange={(e) => setPlotNoFilter(e.target.value)}
          >
            <option value="">All Plot Numbers</option>
            {plotNumbers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered w-40"
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
          >
            <option value="">All Villages</option>
            {villages.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
{/* 
          <select
            className="select select-bordered w-32"
            value={areaUnit}
            onChange={(e) => {
              setAreaUnit(e.target.value);
              setAreaFilter("");
            }}
          >
            <option value="acres">Acres</option>
            <option value="hectares">Hectares</option>
          </select> */}

          {/* <select
            className="select select-bordered w-40"
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
          >
            <option value="">All Areas</option>
            {areaValues.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select> */}

          <button
            className="btn btn-md bg-primary text-white"
            onClick={() => {
              setPlotNoFilter("");
              setVillageFilter("");
              setAreaUnit("acres");
              setAreaFilter("");
            }}
          >
            Reset
          </button>
        </div>
        <div className="mb-4 p-1 bg-blue-50 rounded border border-blue-200">
          <h4 className="font-semibold text-gray-700 mb-1">Owner(s):</h4>
          <p className="text-gray-800">
            {ownerNames.length > 0 ? ownerNames.join(", ") : "—"}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <SummaryBox
            title="Total Area (Acres)"
            value={areaTotals.totalAcres}
            bgColor="bg-green-100"
            textColor="text-green-700"
          />

          <SummaryBox
            title="Total Area (Hectares)"
            value={areaTotals.totalHectares}
            bgColor="bg-blue-100"
            textColor="text-blue-700"
          />

          <SummaryBox
            title="Acquired Area (Acres)"
            value={areaTotals.acquiredAcres}
            bgColor="bg-yellow-100"
            textColor="text-yellow-700"
          />

          <SummaryBox
            title="Acquired Area (Hectares)"
            value={areaTotals.acquiredHectares}
            bgColor="bg-purple-100"
            textColor="text-purple-700"
          />
        </div>

        {loading ? (
          <p className="text-center py-6">Loading plots...</p>
        ) : (
          <div
            className="overflow-x-auto max-h-[55vh]"
            style={{ scrollbarWidth: "thin" }}
          >
            <table className="table w-full">
              <thead className="sticky top-0 bg-gray-200 z-10">
                <tr>
                  <th>#</th>
                  <th
                    onClick={() => handleSort("plot_no")}
                    className="cursor-pointer"
                  >
                    Plot No <ArrowUpDown size={14} className="inline" />
                  </th>
                  <th onClick={() => handleSort("")} className="cursor-pointer">
                    Full / Part
                    <ArrowUpDown size={14} className="inline" />
                  </th>
                  <th
                    onClick={() => handleSort("land_area_total_acres")}
                    className="cursor-pointer"
                  >
                    Total Area (acres)
                    <ArrowUpDown size={14} className="inline" />
                  </th>
                  <th
                    onClick={() => handleSort("land_area_total_hectares")}
                    className="cursor-pointer"
                  >
                    Total Area (hectares)
                    <ArrowUpDown size={14} className="inline" />
                  </th>
                  <th
                    onClick={() => handleSort("land_area_acquired_acres")}
                    className="cursor-pointer"
                  >
                    Acquired Area (acres)
                    <ArrowUpDown size={14} className="inline" />
                  </th>
                  <th
                    onClick={() => handleSort("land_area_acquired_hectares")}
                    className="cursor-pointer"
                  >
                    Acquired Area (hectares)
                    <ArrowUpDown size={14} className="inline" />
                  </th>
                  <th
                    onClick={() => handleSort("village_name")}
                    className="cursor-pointer"
                  >
                    Village <ArrowUpDown size={14} className="inline" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {processedPlots.length ? (
                  processedPlots.map((plot, i) => (
                    <tr key={plot.id || i} className="whitespace-nowrap">
                      <td>{i + 1}</td>
                      <td className="font-semibold">{plot.plot_no || "N/A"}</td>
                      <td>{plot.full_part || "N/A"}</td>
                      <td>{plot.land_area_total_acres || "N/A"}</td>
                      <td>{plot.land_area_total_hectares || "N/A"}</td>
                      <td>{plot.land_area_acquired_acres || "N/A"}</td>
                      <td>{plot.land_area_acquired_hectares || "N/A"}</td>
                      <td>{plot.village_name || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-500">
                      No plots found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

const SummaryBox = ({ title, value, bgColor, textColor }) => (
  <div
    className={`
      h-12 
      flex flex-col justify-center item-center
      py-4
      rounded-lg
      text-center
      ${bgColor}
    `}
  >
    <p className="text-xs font-bold text-gray-600">{title}</p>
    <p className={`text-sm font-bold ${textColor}`}>{value.toFixed(2)}</p>
  </div>
);

export default PlotListModal;
