import React, { useRef } from "react";
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
  const options = getFilterOptions(field) || [];

  const isActive = sortConfig?.field === field;
  const direction = isActive ? sortConfig.direction : null;

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

              {options.map((opt) => (
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
            </ul>
          </div>
        </FilterDropdownPortal>
      )}
    </th>
  );
};

export default FilterableHeader;
