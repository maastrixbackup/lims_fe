import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Filter, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

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
  const [optionSearch, setOptionSearch] = useState("");

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
          : type === "text" || type === "number"
            ? getUniqueValues(key)
            : [];
  const filteredOptions = useMemo(() => {
    const query = optionSearch.trim().toLowerCase();
    if (!query) return filterOptions;
    return filterOptions.filter((value) =>
      String(value).toLowerCase().includes(query),
    );
  }, [filterOptions, optionSearch]);
  const isSorted = sortConfig.key === key;
  const sortDirection = isSorted ? sortConfig.direction : null;

  const renderSortIcon = () => {
    if (!isSorted) return <ArrowUpDown size={14} className="text-gray-400" />;
    if (sortDirection === "asc") return <ArrowUp size={14} className="text-black" />;
    return <ArrowDown size={14} className="text-black" />;
  };

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

  useEffect(() => {
    if (isOpen) {
      setOptionSearch("");
    }
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

      <button
        type="button"
        className={`p-1 rounded cursor-pointer ${
          isSorted ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
        }`}
        onClick={() =>
          setSortConfig((prev) => {
            if (prev.key !== key) {
              return { key, direction: "asc" };
            }
            if (prev.direction === "asc") {
              return { key, direction: "desc" };
            }
            return { key: null, direction: "asc" };
          })
        }
      >
        {renderSortIcon()}
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={style}
            className="bg-white rounded-lg shadow-xl border border-gray-200"
          >
            <div className="p-2 border-b">
              <input
                type="text"
                value={optionSearch}
                onChange={(e) => setOptionSearch(e.target.value)}
                placeholder="Search options..."
                className="input input-sm input-bordered w-full"
              />
            </div>
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

              {filteredOptions.map((value) => (
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
              {filteredOptions.length === 0 && (
                <li className="px-3 py-2 text-gray-500">No options found</li>
              )}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default FilterHeader;
