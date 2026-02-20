import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [style, setStyle] = useState({});

  if (!column) return null;

  const { key, label, type, options = [] } = column;
  const isOpen = activeFilterKey === key;

  const filterOptions =
    type === "yesno"
      ? ["Yes", "No"]
      : type === "status"
        ? ["Not Started", "In Progress", "Complete"]
        : type === "select"
          ? options
          : type === "text"
            ? getUniqueValues(key)
            : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current?.contains(e.target) ||
        dropdownRef.current?.contains(e.target)
      ) {
        return;
      }
      setActiveFilterKey(null);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setActiveFilterKey]);

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const updatePosition = () => {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = 240;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < dropdownHeight;

      setStyle({
        position: "fixed",
        left: rect.left,
        top: openUp ? rect.top - dropdownHeight - 6 : rect.bottom + 6,
        width: 220,
        zIndex: 9999,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative flex items-center gap-1">
      <span ref={triggerRef} className="font-semibold text-sm text-gray-700">
        {label}
      </span>

      <Filter
        size={14}
        className={`cursor-pointer ${
          filters[key] ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
        }`}
        onClick={() => setActiveFilterKey(isOpen ? null : key)}
      />

      <ArrowUpDown
        size={14}
        className={`cursor-pointer ${
          sortConfig.key === key ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
        }`}
        onClick={() =>
          setSortConfig((prev) => ({
            key,
            direction:
              prev.key === key && prev.direction === "asc" ? "desc" : "asc",
          }))
        }
      />

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={style}
            className="bg-white rounded-lg shadow-xl border border-gray-200"
          >
            <ul className="max-h-56 overflow-y-auto text-sm" style={{ scrollbarWidth: "thin" }}>
              <li>
                <button
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                    !filters[key] ? "font-semibold text-primary" : ""
                  }`}
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, [key]: "" }));
                    setActiveFilterKey(null);
                  }}
                >
                  All
                </button>
              </li>

              {filterOptions.map((value) => (
                <li key={value}>
                  <button
                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                      filters[key] === value ? "font-semibold text-primary" : ""
                    }`}
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, [key]: value }));
                      setActiveFilterKey(null);
                    }}
                  >
                    {value}
                  </button>
                </li>
              ))}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default FilterHeader;
