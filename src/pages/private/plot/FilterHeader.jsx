import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Filter, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

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

  const isSorted = sortConfig?.field === field;
  const sortDirection = isSorted ? sortConfig.direction : null;

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
        width: 200,
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

  const renderSortIcon = () => {
    if (!isSorted) return <ArrowUpDown size={14} className="opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  return (
    <th className={className}>
      <div ref={triggerRef} className="flex items-center gap-1 select-none">
        <button
          type="button"
          onClick={() => onSort(field)}
          title="Click to sort"
          className={`flex items-center gap-1 px-1 py-0.5 rounded
            font-medium text-sm
            hover:bg-gray-200
            ${isSorted ? "text-indigo-600" : "text-gray-700"}`}
        >
          {label}
          {renderSortIcon()}
        </button>
        <button
          type="button"
          onClick={() => setOpenFilterField(isOpen ? null : field)}
          title="Filter"
          className={`p-1 rounded transition
            hover:bg-gray-200
            ${
              isOpen
                ? "bg-indigo-100 text-indigo-600"
                : "text-gray-500"
            }`}
        >
          <Filter size={14} />
        </button>
        {isOpen &&
          createPortal(
            <div
              ref={dropdownRef}
              style={style}
              className="bg-white rounded-lg shadow-xl border border-gray-200"
            >
              <ul
                className="max-h-56 overflow-y-auto text-sm"
                style={{ scrollbarWidth: "thin" }}
              >
                <li>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 font-medium"
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
