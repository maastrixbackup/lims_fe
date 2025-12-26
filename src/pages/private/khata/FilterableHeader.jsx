import React, { useRef } from "react";
import { ArrowUp, Filter,ArrowDown} from "lucide-react";
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
  onSort
}) => {
  const buttonRef = useRef(null);
  const options = getFilterOptions(field) || [];
   const isActive = sortConfig?.field === field;
  const direction = isActive ? sortConfig.direction : null;
  

  return (
    <>
     
            <th className={className}>
    
      <div className="flex items-center gap-1">
        <span>{label}</span>
                    <button
          onClick={() => onSort(field)}
          className="flex items-center gap-1 font-semibold select-none"
        >
     

          <div className="flex flex-col leading-none">
            <ArrowUp
              size={12}
              className={
                direction === "asc"
                  ? "text-black"
                  : "text-gray-400"
              }
            />
            <ArrowDown
              size={12}
              className={
                direction === "desc"
                  ? "text-black"
                  : "text-gray-400"
              }
            />
          </div>
        </button>

        <button
          ref={buttonRef}
          onClick={() =>
            setActiveFilter(activeFilter === field ? null : field)
          }
        >
          <Filter size={14} />
        </button>
      </div>

      {activeFilter === field && (
        <FilterDropdownPortal
          anchorRef={buttonRef}
          onClose={() => setActiveFilter(null)}
        >
          <div className="bg-white rounded-md shadow-lg w-52 max-h-60 overflow-y-auto"
                        style={{
                scrollbarWidth: "thin",
              }}
>
            <ul className="menu p-2 text-sm">
              {/* ✅ ALL OPTION */}
              <li>
                <button
                  className={
                    !filters[field]
                      ? "font-semibold text-primary"
                      : ""
                  }
                  onClick={() => {
                    setFilters((prev) => {
                      const copy = { ...prev };
                      delete copy[field]; // remove filter
                      return copy;
                    });
                    setActiveFilter(null);
                  }}
                >
                  All
                </button>
              </li>

              <li className="my-1 border-t" />

              {/* FILTER OPTIONS */}
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
    </>

  );
};

export default FilterableHeader;
