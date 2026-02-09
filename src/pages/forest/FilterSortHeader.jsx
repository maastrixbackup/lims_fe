import React, { useEffect, useRef, useState } from "react";
import { ArrowUpDown, Filter } from "lucide-react";

const FilterSortHeader = ({
  label,
  field,
  filters,
  setFilters,
  sortConfig,
  setSortConfig,
  options = [],
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sorting logic
  const handleSort = () => {
    setSortConfig((prev) => {
      if (prev.field !== field) return { field, direction: "asc" };
      if (prev.direction === "asc") return { field, direction: "desc" };
      return { field: null, direction: null };
    });
  };

  // Clear filter
  const clearFilter = () => {
    setFilters((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
    setOpen(false); // close dropdown after clearing
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <th className="relative whitespace-nowrap">
      <div className="flex items-center gap-2">
        <span>{label}</span>

        <ArrowUpDown size={14} onClick={handleSort} />

        <Filter
          size={14}
          onClick={() => setOpen((p) => !p)}
          className={` ${filters[field]?.length ? "text-primary" : ""}`}
        />
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-0 bg-base-100 shadow-lg rounded z-50 w-48 p-2"
        >
          <select
            value={filters[field]?.[0] || ""}
            onChange={(e) => {
              const value = e.target.value;
              setFilters((prev) => ({
                ...prev,
                [field]: value ? [value] : [],
              }));
            }}
            className="select select-xs w-full text-gray-700"
          >
            <option value="">All</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            {filters[field]?.length > 0 && (
              <button
                onClick={clearFilter}
                className="btn btn-xs btn-ghost text-error mt-2 w-full"
              >
                Clear
              </button>
            )}
          </select>
        </div>
      )}
    </th>
  );
};

export default FilterSortHeader;

// import React, { useEffect, useRef, useState } from "react";
// import { ArrowUpDown, Filter } from "lucide-react";

// const FilterSortHeader = ({
//   label,
//   field,
//   filters,
//   setFilters,
//   sortConfig,
//   setSortConfig,
//   options = [],
// }) => {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Sorting logic
//   const handleSort = () => {
//     setSortConfig((prev) => {
//       if (prev.field !== field) return { field, direction: "asc" };
//       if (prev.direction === "asc") return { field, direction: "desc" };
//       return { field: null, direction: null };
//     });
//   };

//   // Toggle selection for multi-select
//   const toggleOption = (option) => {
//     setFilters((prev) => {
//       const current = prev[field] || [];
//       if (current.includes(option)) {
//         // remove option
//         return { ...prev, [field]: current.filter((v) => v !== option) };
//       } else {
//         // add option
//         return { ...prev, [field]: [...current, option] };
//       }
//     });
//   };

//   // Clear filter
//   const clearFilter = () => {
//     setFilters((prev) => {
//       const copy = { ...prev };
//       delete copy[field];
//       return copy;
//     });
//     setOpen(false);
//   };

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     if (open) document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [open]);

//   return (
//     <th className="relative whitespace-nowrap">
//       <div className="flex items-center gap-1">
//         <span>{label}</span>
//         <ArrowUpDown size={14} onClick={handleSort} />

//         <Filter
//           size={14}
//           onClick={() => setOpen((p) => !p)}
//           className={` ${filters[field]?.length ? "text-primary" : ""}`}
//         />
//       </div>

//       {open && (
//         <div
//           ref={dropdownRef}
//           className="absolute top-full left-0 mt-0 bg-base-100 shadow-lg rounded z-50 w-48 "
//         >
//           <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
//             {options.map((opt) => (
//               <label
//                 key={opt}
//                 className="flex items-center gap-2 text-gray-700"
//               >
//                 <input
//                   type="checkbox"
//                   checked={filters[field]?.includes(opt) || false}
//                   onChange={() => toggleOption(opt)}
//                   className="checkbox checkbox-xs"
//                 />
//                 <span>{opt}</span>
//               </label>
//             ))}
//           </div>

//           {filters[field]?.length > 0 && (
//             <button
//               onClick={clearFilter}
//               className="btn btn-xs btn-ghost text-error mt-2 w-full"
//             >
//               Clear
//             </button>
//           )}
//         </div>
//       )}
//     </th>
//   );
// };

// export default FilterSortHeader;
