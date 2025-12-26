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

  const typeParam = useLandTypeParam();

  useEffect(() => {
    if (!khataId) return;

    const fetchPlots = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/khata/viewPlotsByKhata/${khataId}?type=${typeParam}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        setPlots(data?.data?.plots || []);
      } catch (err) {
        console.error("Error fetching plots:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlots();
  }, [khataId, token, typeParam]);

  const villages = useMemo(() => {
    return [...new Set(plots.map((p) => p.village_name).filter(Boolean))];
  }, [plots]);

  const plotNumbers = useMemo(() => {
    return [
      ...new Set(
        plots
          .map((p) => p.plot_no)
          .filter((p) => p !== null && p !== undefined && p !== "")
      ),
    ];
  }, [plots]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const processedPlots = useMemo(() => {
    let data = [...plots];

    if (plotNoFilter) {
      data = data.filter(
        (p) => p.plot_no?.toString() === plotNoFilter
      );
    }
    if (villageFilter) {
      data = data.filter((p) => p.village_name === villageFilter);
    }

    if (sortConfig.key) {
      data.sort((a, b) => {
        const valA = a[sortConfig.key] ?? "";
        const valB = b[sortConfig.key] ?? "";

        if (typeof valA === "number") {
          return sortConfig.direction === "asc"
            ? valA - valB
            : valB - valA;
        }

        return sortConfig.direction === "asc"
          ? valA.toString().localeCompare(valB.toString())
          : valB.toString().localeCompare(valA.toString());
      });
    }

    return data;
  }, [plots, plotNoFilter, villageFilter, sortConfig]);
  const ownerNames = [
    ...new Set(
      plots
        ?.map((p) => p.name_of_present_tenant)
        .filter((name) => name && name.trim() !== "")
    ),
  ];

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-2xl relative">
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
        <div className="grid grid-cols-1 grid-cols-3 gap-1 mb-4">
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
          {/* <button
            className="btn btn-outline w-40"
            onClick={() => {
              setPlotNoFilter("");
              setVillageFilter("");
            }}
          >
            Reset Filters
          </button> */}
        </div>
        <div className="mb-4 p-1 bg-blue-50 rounded border border-blue-200">
          <h4 className="font-semibold text-gray-700 mb-1">Owner(s):</h4>
          <p className="text-gray-800 font-semibold">
            {ownerNames.length > 0 ? ownerNames.join(", ") : "—"}
          </p>
        </div>

        {loading ? (
          <p className="text-center py-6">Loading plots...</p>
        ) : (
          <div className="overflow-x-auto max-h-[65vh]">
            <table className="table table-zebra w-full border border-gray-200">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th>#</th>
                  <th
                    onClick={() => handleSort("plot_no")}
                    className="cursor-pointer"
                  >
                    Plot No <ArrowUpDown size={14} className="inline" />
                  </th>
                  <th
                    onClick={() => handleSort("land_area_total_acres")}
                    className="cursor-pointer"
                  >
                    Total Area (acres)
                  </th>
                  <th>Total Area (hectares)</th>
                  <th>Acquired Area (acres)</th>
                  <th>Acquired Area (hectares)</th>
                  <th
                    onClick={() => handleSort("village_name")}
                    className="cursor-pointer"
                  >
                    Village <ArrowUpDown size={14} className="inline" />
                  </th>
                </tr>
              </thead>

              <tbody>
                {processedPlots.length > 0 ? (
                  processedPlots.map((plot, index) => (
                    <tr key={plot.id || index}>
                      <td>{index + 1}</td>
                      <td className="font-semibold">{plot.plot_no || "—"}</td>
                      <td>{plot.land_area_total_acres || "—"}</td>
                      <td>{plot.land_area_total_hectares || "—"}</td>
                      <td>{plot.land_area_acquired_acres || "—"}</td>
                      <td>{plot.land_area_acquired_hectares || "—"}</td>
                      <td>{plot.village_name || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      No plots found.
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

export default PlotListModal;
