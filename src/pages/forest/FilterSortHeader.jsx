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


  const handleSort = () => {
    setSortConfig((prev) => {
      if (prev.field !== field) return { field, direction: "asc" };
      if (prev.direction === "asc") return { field, direction: "desc" };
      return { field: null, direction: null };
    });
  };


  const toggleOption = (value) => {
    setFilters((prev) => {
      const current = prev[field] || [];
      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const clearFilter = () => {
    setFilters((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

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
      <div className="flex items-center gap-1">
        <span>{label}</span>

        <button onClick={handleSort} className="btn btn-ghost btn-xs">
          <ArrowUpDown size={14} />
        </button>

        <button
          onClick={() => setOpen((p) => !p)}
          className={`btn btn-ghost btn-xs ${
            filters[field]?.length ? "text-primary" : ""
          }`}
        >
          <Filter size={14} />
        </button>
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-2 bg-base-100 shadow-lg rounded z-50 w-48 p-2"
        >
          <div className="max-h-48 overflow-y-auto">
            {options.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 cursor-pointer text-sm py-1 text-gray-700"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs"
                  checked={filters[field]?.includes(opt) || false}
                  onChange={() => toggleOption(opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>

          <button
            onClick={clearFilter}
            className="btn btn-xs btn-ghost text-error mt-2 w-full"
          >
            Clear
          </button>
        </div>
      )}
    </th>
  );
};

export default FilterSortHeader;
