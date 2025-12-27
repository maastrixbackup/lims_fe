import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Filter } from "lucide-react";

const FilterHeader = ({
  label,
  field,
  options = [],
  updateFilter,
  openFilterField,
  setOpenFilterField,
  className = "",
  sortConfig,
  onSort,
}) => {
  const isOpen = openFilterField === field;

  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [style, setStyle] = useState({});

  /* ---------- Dropdown position ---------- */
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
        width: 180,
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

  /* ---------- Outside click ---------- */
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e) => {
      if (
        triggerRef.current?.contains(e.target) ||
        dropdownRef.current?.contains(e.target)
      )
        return;

      setOpenFilterField(null);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, setOpenFilterField]);

  /* ---------- Sort Icon ---------- */
  const renderSortIcon = () => {
    if (sortConfig?.field !== field) return "↕";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  return (
    <th className={className}>
      <div ref={triggerRef} className="flex items-center gap-1">
        {/* SORT BUTTON */}
        <span className="text-gray-700">{label}</span>
        
        {/* FILTER BUTTON */}
        <button
          type="button"
          onClick={() => setOpenFilterField(isOpen ? null : field)}
          title="Filter"
          className="rounded hover:bg-gray-300 text-gray-600"
        >
          <Filter size={14} />
        </button>
        <button
          type="button"
          onClick={() => onSort(field)}
          title="Click to sort"
          className="flex items-center gap-1 px-1 py-0.5 rounded
                     text-gray-700 font-medium
                     hover:bg-gray-300 hover:text-indigo-600
                     cursor-pointer select-none"
        >
          <span className="text-xs opacity-70">{renderSortIcon()}</span>
        </button>


        {/* FILTER DROPDOWN */}
        {isOpen &&
          createPortal(
            <div
              ref={dropdownRef}
              style={style}
              className="bg-white rounded-md shadow-lg"
            >
              <ul
                className="max-h-56 overflow-y-auto text-xs"
                style={{ scrollbarWidth: "thin" }}
              >
                <li>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                    onClick={() => {
                      updateFilter(field, "");
                      setOpenFilterField(null);
                    }}
                  >
                    All
                  </button>
                </li>

                {options.map((opt) => (
                  <li key={opt}>
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-gray-100"
                      onClick={() => {
                        updateFilter(field, opt);
                        setOpenFilterField(null);
                      }}
                    >
                      {opt}
                    </button>
                  </li>
                ))}
              </ul>
            </div>,
            document.body
          )}
      </div>
    </th>
  );
};

export default FilterHeader;
