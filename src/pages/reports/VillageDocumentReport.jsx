import React, { useState, useMemo } from "react";
import { CheckCircle, XCircle, Search, Filter, ChevronUp, ChevronDown } from "lucide-react";

const dummyDocuments = [
  { village: "Kalinga", ror: true, maps: true, survey: false },
  { village: "Badamba", ror: true, maps: false, survey: true },
  { village: "Nuagaon", ror: false, maps: false, survey: false },
  { village: "Gopinathpur", ror: true, maps: true, survey: true },
];

const VillageDocumentReport = ({ documents = dummyDocuments }) => {
  const [search, setSearch] = useState("");
  const [missingOnly, setMissingOnly] = useState(false);
  const [missingFilters, setMissingFilters] = useState({
    ror: false,
    maps: false,
    survey: false,
  });

  const [sortAsc, setSortAsc] = useState(true);

  const StatusIcon = ({ status }) => (
    <div className={`w-8 h-8 flex items-center justify-center rounded-full 
      ${status ? "bg-green-100" : "bg-red-100"}`}>
      {status ? (
        <CheckCircle className="text-green-600" size={20} />
      ) : (
        <XCircle className="text-red-600" size={20} />
      )}
    </div>
  );

  // ------------------------------
  // 🔍 FILTER + SORT LOGIC
  // ------------------------------

  const filteredData = useMemo(() => {
    return documents
      .filter((item) =>
        item.village.toLowerCase().includes(search.toLowerCase())
      )
      .filter((item) => {
        if (!missingOnly) return true;
        return !item.ror || !item.maps || !item.survey;
      })
      .filter((item) => {
        if (!missingFilters.ror && !missingFilters.maps && !missingFilters.survey)
          return true;

        return (
          (missingFilters.ror && !item.ror) ||
          (missingFilters.maps && !item.maps) ||
          (missingFilters.survey && !item.survey)
        );
      })
      .sort((a, b) =>
        sortAsc
          ? a.village.localeCompare(b.village)
          : b.village.localeCompare(a.village)
      );
  }, [documents, search, missingOnly, missingFilters, sortAsc]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-5 text-gray-800">
        Village Document Report
      </h2>

      {/* ---------------- Filters ---------------- */}
      <div className="mb-4 flex flex-wrap items-center gap-3 bg-white p-4 shadow rounded-xl">
        {/* Search */}
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
          <Search size={18} className="text-gray-600 mr-2" />
          <input
            type="text"
            placeholder="Search village..."
            className="bg-transparent focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Missing Only Toggle */}
        <button
          onClick={() => setMissingOnly(!missingOnly)}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 
          ${missingOnly ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-700"}`}
        >
          <Filter size={16} />
          Missing Only
        </button>

        {/* Individual Missing Filters */}
        <div className="flex gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={missingFilters.ror}
              onChange={() =>
                setMissingFilters({ ...missingFilters, ror: !missingFilters.ror })
              }
            />
            Missing ROR
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={missingFilters.maps}
              onChange={() =>
                setMissingFilters({ ...missingFilters, maps: !missingFilters.maps })
              }
            />
            Missing Maps
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={missingFilters.survey}
              onChange={() =>
                setMissingFilters({
                  ...missingFilters,
                  survey: !missingFilters.survey,
                })
              }
            />
            Missing Survey
          </label>
        </div>

        {/* Sorting */}
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium flex items-center gap-1"
        >
          Sort {sortAsc ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* ---------------- Table ---------------- */}
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
            <tr>
              <th className="py-3 px-4">Village</th>
              <th className="py-3 px-4">ROR</th>
              <th className="py-3 px-4">Maps</th>
              <th className="py-3 px-4">Survey Documents</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item, i) => (
              <tr
                key={i}
                className={`${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition duration-200`}
              >
                <td className="py-3 px-4 font-medium text-gray-800">
                  {item.village}
                </td>

                <td className="py-3 px-4 text-center">
                  <StatusIcon status={item.ror} />
                </td>
                <td className="py-3 px-4 text-center">
                  <StatusIcon status={item.maps} />
                </td>
                <td className="py-3 px-4 text-center">
                  <StatusIcon status={item.survey} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <p className="text-center py-4 text-gray-500">No records found.</p>
        )}
      </div>
    </div>
  );
};

export default VillageDocumentReport;



// VillageDocumentReport.jsx
// import React, { useState, useMemo } from "react";
// import { CheckCircle, XCircle, ArrowUpDown } from "lucide-react";

// const dummyDocuments = [
//   { village: "Kalinga", ror: true, maps: true, survey: false },
//   { village: "Badamba", ror: true, maps: false, survey: true },
//   { village: "Nuagaon", ror: false, maps: false, survey: false },
//   { village: "Gopinathpur", ror: true, maps: true, survey: true },
// ];

// const VillageDocumentReport = ({ documents = dummyDocuments }) => {
//   const [search, setSearch] = useState("");
//   const [missingRor, setMissingRor] = useState(false);
//   const [missingMaps, setMissingMaps] = useState(false);
//   const [missingSurvey, setMissingSurvey] = useState(false);

//   const [sortField, setSortField] = useState("");
//   const [sortOrder, setSortOrder] = useState("asc");

//   const toggleSort = (field) => {
//     if (sortField === field) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortOrder("asc");
//     }
//   };

//   const sortedFilteredData = useMemo(() => {
//     let data = [...documents];

//     // Search filter
//     if (search.trim()) {
//       data = data.filter((d) =>
//         d.village.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     // Missing filters
//     if (missingRor) data = data.filter((d) => !d.ror);
//     if (missingMaps) data = data.filter((d) => !d.maps);
//     if (missingSurvey) data = data.filter((d) => !d.survey);

//     // Sorting
//     if (sortField) {
//       data.sort((a, b) => {
//         let valA = a[sortField];
//         let valB = b[sortField];

//         if (typeof valA === "string") {
//           valA = valA.toLowerCase();
//           valB = valB.toLowerCase();
//         }

//         if (valA < valB) return sortOrder === "asc" ? -1 : 1;
//         if (valA > valB) return sortOrder === "asc" ? 1 : -1;
//         return 0;
//       });
//     }

//     return data;
//   }, [search, missingRor, missingMaps, missingSurvey, sortField, sortOrder]);

//   const ok = <CheckCircle className="text-green-600 mx-auto" />;
//   const no = <XCircle className="text-red-600 mx-auto" />;

//   return (
//     <div className="p-6 bg-white rounded-xl shadow">
//       <h2 className="text-xl font-bold mb-4">Village Document Report</h2>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 mb-4 items-center">

//         {/* Search */}
//         <input
//           type="text"
//           placeholder="Search village..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border px-3 py-2 rounded-lg w-60 shadow-sm"
//         />

//         {/* Missing Only Filters */}
//         <label className="flex items-center gap-2 text-sm">
//           <input
//             type="checkbox"
//             checked={missingRor}
//             onChange={() => setMissingRor(!missingRor)}
//           />
//           Missing ROR
//         </label>

//         <label className="flex items-center gap-2 text-sm">
//           <input
//             type="checkbox"
//             checked={missingMaps}
//             onChange={() => setMissingMaps(!missingMaps)}
//           />
//           Missing Maps
//         </label>

//         <label className="flex items-center gap-2 text-sm">
//           <input
//             type="checkbox"
//             checked={missingSurvey}
//             onChange={() => setMissingSurvey(!missingSurvey)}
//           />
//           Missing Survey Docs
//         </label>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto border rounded-lg shadow">
//         <table className="w-full">
//           <thead className="bg-gray-100">
//             <tr>
//               <th
//                 className="p-3 border cursor-pointer"
//                 onClick={() => toggleSort("village")}
//               >
//                 <div className="flex items-center justify-center gap-1">
//                   Village <ArrowUpDown size={14} />
//                 </div>
//               </th>

//               <th
//                 className="p-3 border cursor-pointer"
//                 onClick={() => toggleSort("ror")}
//               >
//                 <div className="flex items-center justify-center gap-1">
//                   ROR <ArrowUpDown size={14} />
//                 </div>
//               </th>

//               <th
//                 className="p-3 border cursor-pointer"
//                 onClick={() => toggleSort("maps")}
//               >
//                 <div className="flex items-center justify-center gap-1">
//                   Maps <ArrowUpDown size={14} />
//                 </div>
//               </th>

//               <th
//                 className="p-3 border cursor-pointer"
//                 onClick={() => toggleSort("survey")}
//               >
//                 <div className="flex items-center justify-center gap-1">
//                   Survey Docs <ArrowUpDown size={14} />
//                 </div>
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {sortedFilteredData.map((item, i) => (
//               <tr key={i} className="text-center">
//                 <td className="p-3 border">{item.village}</td>
//                 <td className="p-3 border">{item.ror ? ok : no}</td>
//                 <td className="p-3 border">{item.maps ? ok : no}</td>
//                 <td className="p-3 border">{item.survey ? ok : no}</td>
//               </tr>
//             ))}

//             {sortedFilteredData.length === 0 && (
//               <tr>
//                 <td colSpan="4" className="p-4 text-center text-gray-500">
//                   No records found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default VillageDocumentReport;

