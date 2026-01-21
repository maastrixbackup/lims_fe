import { useEffect, useRef } from "react";
import { Filter, ArrowUpDown } from "lucide-react";

const FilterHeader = ({
  column,
  filters,
  setFilters,
  sortConfig,
  setSortConfig,
  getUniqueValues,
  activeFilterKey,
  setActiveFilterKey,
}) => {
  const ref = useRef(null);

  if (!column) return null;

  const { key, label, type, options = [] } = column;
  const isOpen = activeFilterKey === key;
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setActiveFilterKey(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setActiveFilterKey]);

  return (
    <div ref={ref} className="relative flex items-center gap-1">
      <span className="font-semibold text-sm text-gray-700">
        {label}
      </span>
      <Filter
        size={14}
        className={`cursor-pointer ${
          filters[key]
            ? "text-blue-600"
            : "text-gray-400 hover:text-gray-600"
        }`}
        onClick={() =>
          setActiveFilterKey(isOpen ? null : key)
        }
      />
      <ArrowUpDown
        size={14}
        className={`cursor-pointer ${
          sortConfig.key === key
            ? "text-blue-600"
            : "text-gray-400 hover:text-gray-600"
        }`}
        onClick={() =>
          setSortConfig((prev) => ({
            key,
            direction:
              prev.key === key && prev.direction === "asc"
                ? "desc"
                : "asc",
          }))
        }
      />    
      {isOpen && (
        <div className="absolute top-6 left-0 z-50 bg-whiteshadow-md p-2 min-w-[160px]">
          <select
            className="select select-sm select-bordered w-full"
            value={filters[key] || ""}
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                [key]: e.target.value,
              }));
              setActiveFilterKey(null);
            }}
          >
            <option value="">All</option>

            {type === "yesno" &&
              ["Yes", "No"].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}

            {type === "status" &&
              ["Not Started", "In Progress", "Complete"].map(
                (v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                )
              )}

            {type === "select" &&
              options.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}

            {type === "text" &&
              getUniqueValues(key).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default FilterHeader;
