import React, { useState, useRef, useEffect } from "react";

const VillageFilter = ({
  formData,
  setFormData,
  odishaDistricts,
  tahasils = [],
}) => {
  const [open, setOpen] = useState({
    district: false,
    tahasil: false,
  });

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen({ district: false, tahasil: false });
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleSelection = (key, value) => {
    setFormData((prev) => {
      const selected = prev[key] || [];
      return {
        ...prev,
        [key]: selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value],
      };
    });
  };

  return (
    <div
      ref={dropdownRef}
      className="card bg-white shadow-lg rounded-2xl p-4 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* DISTRICT MULTI-SELECT */}
        <div className="relative">
          <button
            onClick={() =>
              setOpen({ district: !open.district, tahasil: false })
            }
            className="select select-bordered w-full text-left"
          >
            {formData.districts?.length
              ? `${formData.districts.length} District(s) Selected`
              : "Select Districts"}
          </button>

          {open.district && (
            <div className="absolute z-20 bg-white border rounded-lg shadow-lg w-full max-h-60 overflow-y-auto">
              {odishaDistricts.map((d) => (
                <label
                  key={d}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.districts?.includes(d)}
                    onChange={() => toggleSelection("districts", d)}
                  />
                  {d}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* TAHASIL MULTI SELECT */}
        <div className="relative">
          <button
            onClick={() =>
              setOpen({ district: false, tahasil: !open.tahasil })
            }
            className="select select-bordered w-full text-left"
          >
            {formData.tahasils?.length
              ? `${formData.tahasils.length} Tahasil(s) Selected`
              : "Select Tahasils"}
          </button>

          {open.tahasil && (
            <div className="absolute z-20 bg-white border rounded-lg shadow-lg w-full max-h-60 overflow-y-auto">
              {tahasils.map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.tahasils?.includes(t)}
                    onChange={() => toggleSelection("tahasils", t)}
                  />
                  {t}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VillageFilter;
