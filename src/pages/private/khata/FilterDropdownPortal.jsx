import { createPortal } from "react-dom";
import { useEffect, useState, useRef } from "react";

const FilterDropdownPortal = ({ anchorRef, children, onClose }) => {
  const [style, setStyle] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const updatePosition = () => {
      if (!anchorRef.current) return;

      const rect = anchorRef.current.getBoundingClientRect();
      const dropdownWidth = 208; // width of dropdown

      setStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2 - dropdownWidth / 2,
        zIndex: 10000,
      });
    };

    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [anchorRef]);

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [anchorRef, onClose]);

  if (!style) return null;

  return createPortal(
    <div ref={dropdownRef} style={style}>
      {children}
    </div>,
    document.body
  );
};

export default FilterDropdownPortal;
