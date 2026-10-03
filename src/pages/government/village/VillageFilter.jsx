import React, { useState, useRef, useEffect } from "react";

const normalize = (v) => String(v ?? "").trim().toLowerCase();

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

  // Case-insensitive check: does `list` already contain `value` in any case?
  const isSelected = (list, value) =>
    (list || []).some((v) => normalize(v) === normalize(value));

  const toggleSelection = (key, value) => {
    setFormData((prev) => {
      const selected = prev[key] || [];
      return {
        ...prev,
        [key]: isSelected(selected, value)
          ? selected.filter((v) => normalize(v) !== normalize(value))
          : [...selected, value],
      };
    });
  };

  // ---- SELECT ALL HANDLERS ----
  const handleSelectAll = (key, list) => {
    setFormData((prev) => ({ ...prev, [key]: [...list] }));
  };

  const handleClearAll = (key) => {
    setFormData((prev) => ({ ...prev, [key]: [] }));
  };

  return (
    <div
      ref={dropdownRef}
      className="card mb-4"
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
              <label className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      formData.districts?.length === odishaDistricts.length
                    }
                    onChange={(e) =>
                      e.target.checked
                        ? handleSelectAll("districts", odishaDistricts)
                        : handleClearAll("districts")
                    }
                  />
                  <span>Select All Districts</span>
                </div>

                <button
                  className="text-red-600 text-sm"
                  onClick={() => handleClearAll("districts")}
                >
                  Clear
                </button>
              </label>

              {odishaDistricts.map((d) => (
                <label
                  key={d}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isSelected(formData.districts, d)}
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
            onClick={() => setOpen({ district: false, tahasil: !open.tahasil })}
            className="select select-bordered w-full text-left"
          >
            {formData.tahasils?.length
              ? `${formData.tahasils.length} Tahasil(s) Selected`
              : "Select Tahasils"}
          </button>

          {open.tahasil && (
            <div className="absolute z-20 bg-white border rounded-lg shadow-lg w-full max-h-60 overflow-y-auto">
             <label className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b">
                <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.tahasils?.length === tahasils.length}
                  onChange={(e) =>
                    e.target.checked
                      ? handleSelectAll("tahasils", tahasils)
                      : handleClearAll("tahasils")
                  }
                />
             <span>  Select All Tahasils</span>
            </div>
              <button
                className="text-red-600 text-sm"
                onClick={() => handleClearAll("tahasils")}
              >
                Clear
              </button>
                </label>

              {tahasils.map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isSelected(formData.tahasils, t)}
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