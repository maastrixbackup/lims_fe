import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import FilterDropdownPortal from "./FilterDropdownPortal";

const FilterableHeader = ({
  label,
  field,
  filters,
  setFilters,
  activeFilter,
  setActiveFilter,
  getFilterOptions,
  className = "",
  sortConfig,
  onSort,
}) => {
  const buttonRef = useRef(null);
  const [optionSearch, setOptionSearch] = useState("");
  const options = getFilterOptions(field) || [];
  const filteredOptions = useMemo(() => {
    const query = optionSearch.trim().toLowerCase();
    if (!query) return options;
    return options.filter((opt) =>
      String(opt).toLowerCase().includes(query)
    );
  }, [options, optionSearch]);

  const isActive = sortConfig?.field === field;
  const direction = isActive ? sortConfig.direction : null;

  useEffect(() => {
    if (activeFilter === field) {
      setOptionSearch("");
    }
  }, [activeFilter, field]);

  const renderSortIcon = () => {
    if (!isActive) return <ArrowUpDown size={14} className="text-gray-400" />;
    if (direction === "asc")
      return <ArrowUp size={14} className="text-black" />;
    return <ArrowDown size={14} className="text-black" />;
  };

  return (
    <th className={className}>
      <div className="flex items-center gap-1">
        <span>{label}</span>
                {/* FILTER BUTTON */}
        <button
          ref={buttonRef}
          onClick={() =>
            setActiveFilter(activeFilter === field ? null : field)
          }
          className="p-1 hover:bg-gray-100 rounded"
          title="Filter"
        >
          <Filter size={14} />
        </button>

        {/* SORT BUTTON */}
        <button
          onClick={() => onSort(field)}
          className="p-1 hover:bg-gray-100 rounded"
          title="Sort"
        >
          {renderSortIcon()}
        </button>


      </div>

      {/* FILTER DROPDOWN */}
      {activeFilter === field && (
        <FilterDropdownPortal
          anchorRef={buttonRef}
          onClose={() => setActiveFilter(null)}
        >
          <div className="bg-white rounded-md shadow-lg w-52 max-h-60 overflow-y-auto">
            <div className="p-2 border-b">
              <input
                type="text"
                value={optionSearch}
                onChange={(e) => setOptionSearch(e.target.value)}
                placeholder="Search options..."
                className="input input-sm input-bordered w-full"
              />
            </div>
            <ul className="menu p-2 text-sm">
              <li>
                <button
                  className={!filters[field] ? "font-semibold text-primary" : ""}
                  onClick={() => {
                    setFilters((prev) => {
                      const copy = { ...prev };
                      delete copy[field];
                      return copy;
                    });
                    setActiveFilter(null);
                  }}
                >
                  All
                </button>
              </li>

              <li className="my-1 border-t" />

              {filteredOptions.map((opt) => (
                <li key={opt}>
                  <button
                    className={
                      filters[field] === opt
                        ? "font-semibold text-primary"
                        : ""
                    }
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, [field]: opt }));
                      setActiveFilter(null);
                    }}
                  >
                    {opt}
                  </button>
                </li>
              ))}
              {filteredOptions.length === 0 && (
                <li className="px-3 py-2 text-gray-500">No options found</li>
              )}
            </ul>
          </div>
        </FilterDropdownPortal>
      )}
    </th>
  );
};

export default FilterableHeader;
