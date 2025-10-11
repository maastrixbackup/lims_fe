// src/components/Plots/PlotFormModal.jsx
import React from "react";
import { X } from "lucide-react";

const PlotFormModal = ({
  formData,
  setFormData,
  onClose,
  onSubmit,
  editingPlot,
  projectVillageKhataMap,
}) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "project") {
      setFormData((prev) => ({ ...prev, village: "", khataNo: "" }));
    }
    if (e.target.name === "village") {
      setFormData((prev) => ({ ...prev, khataNo: "" }));
    }
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-6xl">
        <button
          type="button"
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          onClick={() => setIsModalOpen(false)}
        >
          <X size={20} />
        </button>
        <h3 className="font-bold text-lg mb-4">
          {editingPlot ? "Edit Plot" : "Add Plot"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[80vh] pr-2"
        >
          {/* Existing Dropdowns */}
          <select
            name="project"
            value={formData.project}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Project</option>
            {Object.keys(projectVillageKhataMap).map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>

          <select
            name="village"
            value={formData.village}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
            disabled={!formData.project}
          >
            <option value="">Select Village</option>
            {formData.project &&
              Object.keys(projectVillageKhataMap[formData.project]).map(
                (village) => (
                  <option key={village} value={village}>
                    {village}
                  </option>
                )
              )}
          </select>

          <select
            name="khataNo"
            value={formData.khataNo}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
            disabled={!formData.village}
          >
            <option value="">Select Khata</option>
            {formData.project &&
              formData.village &&
              projectVillageKhataMap[formData.project][formData.village].map(
                (khata, i) => (
                  <option key={i} value={khata}>
                    {khata}
                  </option>
                )
              )}
          </select>

          {/* Existing Basic Fields */}
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Code"
            className="input input-bordered w-full"
            required
          />
          <input
            type="number"
            name="sl"
            value={formData.sl}
            onChange={handleChange}
            placeholder="Sl"
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            name="plotNo1"
            value={formData.plotNo1}
            onChange={handleChange}
            placeholder="Plot No. 1"
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            name="plotNo2"
            value={formData.plotNo2}
            onChange={handleChange}
            placeholder="Plot No. 2"
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="tenant"
            value={formData.tenant}
            onChange={handleChange}
            placeholder="Tenant"
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            name="kissam"
            value={formData.kissam}
            onChange={handleChange}
            placeholder="Kissam"
            className="input input-bordered w-full"
            required
          />
          <input
            type="number"
            step="0.0001"
            name="rorArea"
            value={formData.rorArea}
            onChange={handleChange}
            placeholder="RoR Area"
            className="input input-bordered w-full"
            required
          />
          <input
            type="number"
            step="0.0001"
            name="occupiedArea"
            value={formData.occupiedArea}
            onChange={handleChange}
            placeholder="Occupied Area"
            className="input input-bordered w-full"
            required
          />

          {/* 🟩 NEW FIELDS SECTION START */}
          <h4 className="col-span-2 text-lg font-semibold mt-4 border-b pb-1">
            Land Details
          </h4>

          {[
            "SES Survey No.",
            "LA Case File No.",
            "Date of Award",
            "LO1-Name of Recorded Tenant (RT)",
            "LO2-Name of Present Tenant(s)",
            "Present Address",
            "Displaced/Affected Person",
            "Name of Village",
            "Name of the Tahasil",
            "Name of the R.I. Circle",
            "Thana No.",
            "Khata No.",
            "Plot No.",
            "Kissam of the Land",
            "LO12-Category of Land",
            "LO13-Remarks",
            "LA1-Land Area (Total Area in Acres)",
            "LA2-Land Area (Total Area in Ha.)",
            "Land Area (Total Acquired Area in Acres)",
            "Land Area (Total Acquired Area in Ha.)",
            "Market Value fixed U/S.26 of RFCTLARR Act 2013 (Per Acre)",
            "Basic Land value",
            "Land value  with multiplication factor (Values from 1 to 2)",
            "No. of Trees",
            "Total Value of Trees",
            "No. of House",
            "Value of Structure (house)",
            "Detail of Structures other than House",
            "Value of structures other than house",
            "Total Value  (Land-22 + Tree-24 + House-26 + Structures-28)",
            "Solatium @ of (100%)",
            "12% additional compensation on market value of land area",
            "Total Compensation Amount",
            "LA18-Apportionment Amount of the Award for the Individual Family Member",
            "LA19-Priority/Urgency",
            "LA20-Land Use Plan",
            "LA21-Remarks",
          ].map((label) => (
            <input
              key={label}
              type="text"
              name={label.replace(/\s+/g, "_")}
              value={formData[label.replace(/\s+/g, "_")] || ""}
              onChange={handleChange}
              placeholder={label}
              className="input input-bordered w-full"
            />
          ))}

          <h4 className="col-span-2 text-lg font-semibold mt-4 border-b pb-1">
            Bank & Personal Details
          </h4>

          {[
            "BK01-Bank Account No.",
            "BK02-Name of the Bank",
            "BK03-Name of the Branch with IFSC Code",
            "PD01-Aadhaar No.",
            "PAN No.",
            "Age",
            "Caste",
            "Marital Status",
            "Education",
            "Occupation",
            "Annual Income",
            "PD09- Skill Acquired",
            "PD10-Affidavit with subject details (if any)",
          ].map((label) => (
            <input
              key={label}
              type="text"
              name={label.replace(/\s+/g, "_")}
              value={formData[label.replace(/\s+/g, "_")] || ""}
              onChange={handleChange}
              placeholder={label}
              className="input input-bordered w-full"
            />
          ))}

          <h4 className="col-span-2 text-lg font-semibold mt-4 border-b pb-1">
            Family Details
          </h4>

          {[
            "FD01-No. of Family Members (Major Male)",
            "No. of Family Members (Major Female)",
            "No. of Family Members (Minor Male)",
            "No. of Family Members (Minor Female)",
            "No. of Family Members (Major Transgender)",
            "No. of Family Members (Minor Transgender)",
            "No. of Persons with Disability",
            "Family with Orphan Members (Y/N)",
            "FD09-Legal Heir Certificate No. (if any)",
          ].map((label) => (
            <input
              key={label}
              type="text"
              name={label.replace(/\s+/g, "_")}
              value={formData[label.replace(/\s+/g, "_")] || ""}
              onChange={handleChange}
              placeholder={label}
              className="input input-bordered w-full"
            />
          ))}

          <h4 className="col-span-2 text-lg font-semibold mt-4 border-b pb-1">
            Land Case Details
          </h4>

          {[
            "LG01-Land Case - No. (Number)",
            "Land Case - Date (Date)",
            "Land Case Type",
            "Land case - Status",
            "LG05-Land Case - Action",
          ].map((label) => (
            <input
              key={label}
              type="text"
              name={label.replace(/\s+/g, "_")}
              value={formData[label.replace(/\s+/g, "_")] || ""}
              onChange={handleChange}
              placeholder={label}
              className="input input-bordered w-full"
            />
          ))}

          <h4 className="col-span-2 text-lg font-semibold mt-4 border-b pb-1">
            RR Assistance (Rehab & Resettle)
          </h4>

          {[
            "RR Assistance (Rehab) - Employment in the Project",
            "RR Assistance (Rehab) - Cash in lieu of Employment",
            "RR Assistance (Rehab) - Training for Skill Upgradation",
            "RR Assistance (Rehab) - Assistance for Self Employment",
            "RR Assistance (Rehab) - Special Allowance to STs for loss of NTFP",
            "RR Assistance (Resettle) - Homested Land Alloted/Self Relocation",
            "RR Assistance (Resettle) - House Building Assistance",
            "RR Assistance (Resettle) - Constructed by Project Authority/Self",
            "RR Assistance (Resettle) - Assistance for Transit Shed",
            "RR Assistance (Resettle) - Transportation Allowance",
            "RR Assistance (Resettle) - Maintenance Allowance",
            "RR Assistance (Other) - Special Allowance for Multiple Displacement",
            "RR Assistance (Other) - Ex-Gratia (if any)",
            "RR Assistance (Other) - Other Benefits (if any)",
          ].map((label) => (
            <input
              key={label}
              type="text"
              name={label.replace(/\s+/g, "_")}
              value={formData[label.replace(/\s+/g, "_")] || ""}
              onChange={handleChange}
              placeholder={label}
              className="input input-bordered w-full"
            />
          ))}

          <h4 className="col-span-2 text-lg font-semibold mt-4 border-b pb-1">
            Grievance Details
          </h4>

          {[
            "GR01-Grievance No.",
            "Grievance  Date",
            "Grievance - Subject Matter",
            "Grievance - Present Status",
            "GR05-Grievance - Action taken",
          ].map((label) => (
            <input
              key={label}
              type="text"
              name={label.replace(/\s+/g, "_")}
              value={formData[label.replace(/\s+/g, "_")] || ""}
              onChange={handleChange}
              placeholder={label}
              className="input input-bordered w-full"
            />
          ))}

          <h4 className="col-span-2 text-lg font-semibold mt-4 border-b pb-1">
            Tribunal & Govt. Valuation
          </h4>

          {[
            "TR01-Tribunal (Y/N)",
            "Tribunal - Date of Deposit",
            "TR03-Tribunal - Amount Deposited",
            "GV01-Premium",
            "GV02-Ground Rent",
            "GV03-Cess",
            "GV04-Incidental Charges",
            "GV05-Total",
            "Abatement",
          ].map((label) => (
            <input
              key={label}
              type="text"
              name={label.replace(/\s+/g, "_")}
              value={formData[label.replace(/\s+/g, "_")] || ""}
              onChange={handleChange}
              placeholder={label}
              className="input input-bordered w-full"
            />
          ))}

          {/* 🟩 NEW FIELDS SECTION END */}

          <input
            type="text"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Remarks"
            className="input input-bordered w-full col-span-2"
          />

          <div className="modal-action col-span-2">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default PlotFormModal;
