import React, { useState } from "react";
import { plotData, projectVillageKhataMap } from "../utils/constants";
import { Pencil, Trash2, X } from "lucide-react";

const Plots = () => {
  const [plots, setPlots] = useState(plotData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    project: "",
    village: "",
    khataNo: "",
    code: "",
    sl: "",
    plotNo1: "",
    plotNo2: "",
    tenant: "",
    kissam: "",
    rorArea: "",
    occupiedArea: "",
    remarks: "",
    yadast: "",
    bmv: "",
    ses: "",
  });

  // Open modal
  const openModal = (plot = null) => {
    if (plot) {
      setEditingPlot(plot);
      setFormData(plot);
    } else {
      setEditingPlot(null);
      setFormData({
        project: "",
        village: "",
        khataNo: "",
        code: "",
        sl: "",
        plotNo1: "",
        plotNo2: "",
        tenant: "",
        kissam: "",
        rorArea: "",
        occupiedArea: "",
        remarks: "",
        yadast: "",
        bmv: "",
        ses: "",
      });
    }
    setIsModalOpen(true);
  };

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Reset child dropdowns when parent changes
    if (e.target.name === "project") {
      setFormData((prev) => ({ ...prev, village: "", khataNo: "" }));
    }
    if (e.target.name === "village") {
      setFormData((prev) => ({ ...prev, khataNo: "" }));
    }
  };

  // Save plot
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPlot) {
      setPlots(
        plots.map((p) =>
          p.id === editingPlot.id ? { ...formData, id: p.id } : p
        )
      );
    } else {
      setPlots([...plots, { ...formData, id: plots.length + 1 }]);
    }
    setIsModalOpen(false);
  };

  // Delete
  const confirmDelete = () => {
    setPlots(plots.filter((p) => p.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto space-y-6">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Plots List</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + Add Plot
        </button>
      </div>

      {/* Table */}
      <div className="card bg-white shadow-lg rounded-2xl">
    <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
  <table className="table w-full whitespace-nowrap text-sm">
    <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
      <tr>
        <th>#</th>
        <th>Project</th>
        <th>Village</th>
        <th>Khata No</th>
        <th>Code</th>
        <th>Sl</th>
        <th>Plot No. 1</th>
        <th>Plot No. 2</th>
        <th>Tenant</th>
        <th>Kissam</th>
        <th>RoR Area</th>
        <th>Occupied Area</th>

        {/* === NEW EXTENDED FIELDS === */}
        {[
          "SES Survey No.", "LA Case File No.", "Date of Award", "LO1-Name of Recorded Tenant (RT)",
          "LO2-Name of Present Tenant(s)", "Present Address", "Displaced/Affected Person",
          "Name of Village", "Name of the Tahasil", "Name of the R.I. Circle", "Thana No.",
          "Khata No.", "Plot No.", "Kissam of the Land", "LO12-Category of Land", "LO13-Remarks",
          "LA1-Land Area (Total Area in Acres)", "LA2-Land Area (Total Area in Ha.)",
          "Land Area (Total Acquired Area in Acres)", "Land Area (Total Acquired Area in Ha.)",
          "Market Value fixed U/S.26 of RFCTLARR Act 2013 (Per Acre)", "Basic Land value",
          "Land value  with multiplication factor (Values from 1 to 2)", "No. of Trees",
          "Total Value of Trees", "No. of House", "Value of Structure (house)",
          "Detail of Structures other than House", "Value of structures other than house",
          "Total Value  (Land-22 + Tree-24 + House-26 + Structures-28)", "Solatium @ of (100%)",
          "12% additional compensation on market value of land area", "Total Compensation Amount",
          "LA18-Apportionment Amount of the Award for the Individual Family Member", "LA19-Priority/Urgency",
          "LA20-Land Use Plan", "LA21-Remarks", "BK01-Bank Account No.", "BK02-Name of the Bank",
          "BK03-Name of the Branch with IFSC Code", "PD01-Aadhaar No.", "PAN No.", "Age", "Caste",
          "Marital Status", "Education", "Occupation", "Annual Income", "PD09- Skill Acquired",
          "PD10-Affidavit with subject details (if any)", "FD01-No. of Family Members (Major Male)",
          "No. of Family Members (Major Female)", "No. of Family Members (Minor Male)",
          "No. of Family Members (Minor Female)", "No. of Family Members (Major Transgender)",
          "No. of Family Members (Minor Transgender)", "No. of Persons with Disability",
          "Family with Orphan Members (Y/N)", "FD09-Legal Heir Certificate No. (if any)",
          "LG01-Land Case - No. (Number)", "Land Case - Date (Date)", "Land Case Type",
          "Land case - Status", "LG05-Land Case - Action", "RR Assistance (Rehab) - Employment in the Project",
          "RR Assistance (Rehab) - Cash in lieu of Employment", "RR Assistance (Rehab) - Training for Skill Upgradation",
          "RR Assistance (Rehab) - Assistance for Self Employment", "RR Assistance (Rehab) - Special Allowance to STs for loss of NTFP",
          "RR Assistance (Resettle) - Homested Land Alloted/Self Relocation", "RR Assistance (Resettle) - House Building Assistance",
          "RR Assistance (Resettle) - Constructed by Project Authority/Self", "RR Assistance (Resettle) - Assistance for Transit Shed",
          "RR Assistance (Resettle) - Transportation Allowance", "RR Assistance (Resettle) - Maintenance Allowance",
          "RR Assistance (Other) - Special Allowance for Multiple Displacement", "RR Assistance (Other) - Ex-Gratia (if any)",
          "RR Assistance (Other) - Other Benefits (if any)", "GR01-Grievance No.", "Grievance  Date",
          "Grievance - Subject Matter", "Grievance - Present Status", "GR05-Grievance - Action taken",
          "TR01-Tribunal (Y/N)", "Tribunal - Date of Deposit", "TR03-Tribunal - Amount Deposited",
          "GV01-Premium", "GV02-Ground Rent", "GV03-Cess", "GV04-Incidental Charges", "GV05-Total", "Abatement"
        ].map((label) => (
          <th key={label}>{label}</th>
        ))}

        <th className="text-right pr-6">Actions</th>
      </tr>
    </thead>

    <tbody>
      {plots.length > 0 ? (
        plots.map((plot, idx) => (
          <tr key={plot.id} className="hover:bg-gray-50 transition-colors">
            <td>{idx + 1}</td>
            <td>GMDC - Baitarani-West Coal Block</td>
            <td>{plot.village}</td>
            <td>{plot.khataNo}</td>
            <td>{plot.code}</td>
            <td>{plot.sl}</td>
            <td>{plot.plotNo1}</td>
            <td>{plot.plotNo2}</td>
            <td>{plot.tenant}</td>
            <td>{plot.kissam}</td>
            <td>{plot.rorArea}</td>
            <td>{plot.occupiedArea}</td>

            {/* === NEW EXTENDED DATA CELLS === */}
            {[
              "SES_Survey_No_", "LA_Case_File_No_", "Date_of_Award", "LO1-Name_of_Recorded_Tenant_(RT)",
              "LO2-Name_of_Present_Tenant(s)", "Present_Address", "Displaced/Affected_Person",
              "Name_of_Village", "Name_of_the_Tahasil", "Name_of_the_R.I._Circle", "Thana_No_",
              "Khata_No_", "Plot_No_", "Kissam_of_the_Land", "LO12-Category_of_Land", "LO13-Remarks",
              "LA1-Land_Area_(Total_Area_in_Acres)", "LA2-Land_Area_(Total_Area_in_Ha_)",
              "Land_Area_(Total_Acquired_Area_in_Acres)", "Land_Area_(Total_Acquired_Area_in_Ha_)",
              "Market_Value_fixed_U_S.26_of_RFCTLARR_Act_2013_(Per_Acre)", "Basic_Land_value",
              "Land_value_with_multiplication_factor_(Values_from_1_to_2)", "No._of_Trees",
              "Total_Value_of_Trees", "No._of_House", "Value_of_Structure_(house)",
              "Detail_of_Structures_other_than_House", "Value_of_structures_other_than_house",
              "Total_Value_(Land-22_+_Tree-24_+_House-26_+_Structures-28)", "Solatium_@_of_(100%)",
              "12%_additional_compensation_on_market_value_of_land_area", "Total_Compensation_Amount",
              "LA18-Apportionment_Amount_of_the_Award_for_the_Individual_Family_Member", "LA19-Priority/Urgency",
              "LA20-Land_Use_Plan", "LA21-Remarks", "BK01-Bank_Account_No.", "BK02-Name_of_the_Bank",
              "BK03-Name_of_the_Branch_with_IFSC_Code", "PD01-Aadhaar_No.", "PAN_No.", "Age", "Caste",
              "Marital_Status", "Education", "Occupation", "Annual_Income", "PD09-_Skill_Acquired",
              "PD10-Affidavit_with_subject_details_(if_any)", "FD01-No._of_Family_Members_(Major_Male)",
              "No._of_Family_Members_(Major_Female)", "No._of_Family_Members_(Minor_Male)",
              "No._of_Family_Members_(Minor_Female)", "No._of_Family_Members_(Major_Transgender)",
              "No._of_Family_Members_(Minor_Transgender)", "No._of_Persons_with_Disability",
              "Family_with_Orphan_Members_(Y/N)", "FD09-Legal_Heir_Certificate_No._(if_any)",
              "LG01-Land_Case_-_No._(Number)", "Land_Case_-_Date_(Date)", "Land_Case_Type",
              "Land_case_-_Status", "LG05-Land_Case_-_Action", "RR_Assistance_(Rehab)_-_Employment_in_the_Project",
              "RR_Assistance_(Rehab)_-_Cash_in_lieu_of_Employment", "RR_Assistance_(Rehab)_-_Training_for_Skill_Upgradation",
              "RR_Assistance_(Rehab)_-_Assistance_for_Self_Employment", "RR_Assistance_(Rehab)_-_Special_Allowance_to_STs_for_loss_of_NTFP",
              "RR_Assistance_(Resettle)_-_Homested_Land_Alloted/Self_Relocation", "RR_Assistance_(Resettle)_-_House_Building_Assistance",
              "RR_Assistance_(Resettle)_-_Constructed_by_Project_Authority/Self", "RR_Assistance_(Resettle)_-_Assistance_for_Transit_Shed",
              "RR_Assistance_(Resettle)_-_Transportation_Allowance", "RR_Assistance_(Resettle)_-_Maintenance_Allowance",
              "RR_Assistance_(Other)_-_Special_Allowance_for_Multiple_Displacement", "RR_Assistance_(Other)_-_Ex-Gratia_(if_any)",
              "RR_Assistance_(Other)_-_Other_Benefits_(if_any)", "GR01-Grievance_No.", "Grievance_Date",
              "Grievance_-_Subject_Matter", "Grievance_-_Present_Status", "GR05-Grievance_-_Action_taken",
              "TR01-Tribunal_(Y/N)", "Tribunal_-_Date_of_Deposit", "TR03-Tribunal_-_Amount_Deposited",
              "GV01-Premium", "GV02-Ground_Rent", "GV03-Cess", "GV04-Incidental_Charges", "GV05-Total", "Abatement"
            ].map((key) => (
              <td key={key}>{plot[key] || "-"}</td>
            ))}

            <td className="text-right">
              <div className="flex justify-end gap-2">
                <button
                  className="btn btn-xs btn-warning text-white"
                  onClick={() => openModal(plot)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-xs btn-error text-white"
                  onClick={() => setDeleteConfirm(plot)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="999" className="text-center py-6 text-gray-500">
            No plots found. Click <span className="font-semibold">+ Add Plot</span> to create one.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
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

  <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[80vh] pr-2">
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
        Object.keys(projectVillageKhataMap[formData.project]).map((village) => (
          <option key={village} value={village}>
            {village}
          </option>
        ))}
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
    <input type="text" name="code" value={formData.code} onChange={handleChange} placeholder="Code" className="input input-bordered w-full" required />
    <input type="number" name="sl" value={formData.sl} onChange={handleChange} placeholder="Sl" className="input input-bordered w-full" required />
    <input type="text" name="plotNo1" value={formData.plotNo1} onChange={handleChange} placeholder="Plot No. 1" className="input input-bordered w-full" required />
    <input type="text" name="plotNo2" value={formData.plotNo2} onChange={handleChange} placeholder="Plot No. 2" className="input input-bordered w-full" />
    <input type="text" name="tenant" value={formData.tenant} onChange={handleChange} placeholder="Tenant" className="input input-bordered w-full" required />
    <input type="text" name="kissam" value={formData.kissam} onChange={handleChange} placeholder="Kissam" className="input input-bordered w-full" required />
    <input type="number" step="0.0001" name="rorArea" value={formData.rorArea} onChange={handleChange} placeholder="RoR Area" className="input input-bordered w-full" required />
    <input type="number" step="0.0001" name="occupiedArea" value={formData.occupiedArea} onChange={handleChange} placeholder="Occupied Area" className="input input-bordered w-full" required />

    {/* 🟩 NEW FIELDS SECTION START */}
    <h4 className="col-span-2 text-lg font-semibold mt-4 border-b pb-1">Land Details</h4>

    {[
      "SES Survey No.", "LA Case File No.", "Date of Award", "LO1-Name of Recorded Tenant (RT)",
      "LO2-Name of Present Tenant(s)", "Present Address", "Displaced/Affected Person",
      "Name of Village", "Name of the Tahasil", "Name of the R.I. Circle", "Thana No.",
      "Khata No.", "Plot No.", "Kissam of the Land", "LO12-Category of Land", "LO13-Remarks",
      "LA1-Land Area (Total Area in Acres)", "LA2-Land Area (Total Area in Ha.)",
      "Land Area (Total Acquired Area in Acres)", "Land Area (Total Acquired Area in Ha.)",
      "Market Value fixed U/S.26 of RFCTLARR Act 2013 (Per Acre)", "Basic Land value",
      "Land value  with multiplication factor (Values from 1 to 2)", "No. of Trees",
      "Total Value of Trees", "No. of House", "Value of Structure (house)",
      "Detail of Structures other than House", "Value of structures other than house",
      "Total Value  (Land-22 + Tree-24 + House-26 + Structures-28)", "Solatium @ of (100%)",
      "12% additional compensation on market value of land area", "Total Compensation Amount",
      "LA18-Apportionment Amount of the Award for the Individual Family Member", "LA19-Priority/Urgency",
      "LA20-Land Use Plan", "LA21-Remarks"
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

    <h4 className="col-span-2 text-lg font-semibold mt-4 border-b pb-1">Bank & Personal Details</h4>

    {[
      "BK01-Bank Account No.", "BK02-Name of the Bank", "BK03-Name of the Branch with IFSC Code",
      "PD01-Aadhaar No.", "PAN No.", "Age", "Caste", "Marital Status", "Education",
      "Occupation", "Annual Income", "PD09- Skill Acquired", "PD10-Affidavit with subject details (if any)"
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

    <h4 className="col-span-2 text-lg font-semibold mt-4 border-b pb-1">Family Details</h4>

    {[
      "FD01-No. of Family Members (Major Male)", "No. of Family Members (Major Female)",
      "No. of Family Members (Minor Male)", "No. of Family Members (Minor Female)",
      "No. of Family Members (Major Transgender)", "No. of Family Members (Minor Transgender)",
      "No. of Persons with Disability", "Family with Orphan Members (Y/N)",
      "FD09-Legal Heir Certificate No. (if any)"
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

    <h4 className="col-span-2 text-lg font-semibold mt-4 border-b pb-1">Land Case Details</h4>

    {[
      "LG01-Land Case - No. (Number)", "Land Case - Date (Date)", "Land Case Type",
      "Land case - Status", "LG05-Land Case - Action"
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

    <h4 className="col-span-2 text-lg font-semibold mt-4 border-b pb-1">RR Assistance (Rehab & Resettle)</h4>

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
      "RR Assistance (Other) - Other Benefits (if any)"
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

    <h4 className="col-span-2 text-lg font-semibold mt-4 border-b pb-1">Grievance Details</h4>

    {[
      "GR01-Grievance No.", "Grievance  Date", "Grievance - Subject Matter",
      "Grievance - Present Status", "GR05-Grievance - Action taken"
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

    <h4 className="col-span-2 text-lg font-semibold mt-4 border-b pb-1">Tribunal & Govt. Valuation</h4>

    {[
      "TR01-Tribunal (Y/N)", "Tribunal - Date of Deposit", "TR03-Tribunal - Amount Deposited",
      "GV01-Premium", "GV02-Ground Rent", "GV03-Cess", "GV04-Incidental Charges",
      "GV05-Total", "Abatement"
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
      <button type="submit" className="btn btn-primary">Save</button>
      <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
    </div>
  </form>
</div>

        </dialog>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteConfirm.code}</span>?
            </p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button className="btn" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </main>
  );
};

export default Plots;
