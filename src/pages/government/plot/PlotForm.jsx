import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../utils/config";
import { useLandTypeParam } from "../../../utils/landtypes";
import { apiClient } from "../../../utils/apiClient";


const PlotForm = ({ closeModal, fetchPlots }) => {
  const token = useSelector((s) => s.auth.userToken);
  console.log("govrt plots token:", token);
  const selectedProject = useSelector((s) => s.selectedProject.project);
  const projects = useSelector((s) => s.list.projects || []);
  console.log("govrt plots selected project:", selectedProject);
  const typeParam = useLandTypeParam();
  const [villages, setVillages] = useState([]);
  

  const [formData, setFormData] = useState({
    project_id: selectedProject?.id || "",
    type: typeParam,
    mouza: "",
    tahasil: "",
    thana_no: "",
    ri_circle: "",
    khata_no: "",
    kissam: "",
    name_of_ror: "",
    plot_no: "",
    total_area_acres: "",
    proposed_area_acres: "",
    total_area_hectares: "",
    proposed_area_hectares: "",
    lease_case_no: "",
    present_status: 1, //1=Lease Case to Sub-Collector, 2=Lease Case to ADM (Rev.Sec), 3=Demand Raised, 4=Lease Sanctioned by Collector
    ua_idco_to_tahasildar: 1, //1->Yes, 0->No
    case_details: "",
    action_to_be_taken: "",
    ri_report: "", //'Not Started', 'In Progress', 'Complete'
    tree_enumeration: "", //'Not Started', 'In Progress', 'Complete'
    order_sheet_prep: "", //'Not Started', 'In Progress', 'Complete'
    misc_dr_case_prep: 1, //1->Yes, 0->No
    misc_dr_case_prep_number: "",
    reason_for_misc_dr_case: "",
    proclamation: 0, //1->Yes, 0->No
    objection_received: 0, //1->Yes, 0->No
    modification_revision: 0, //1->Yes, 0->No
    lease_to_idco: 0, //1->Yes, 0->No
    lease_to_ua: 0, //1->Yes, 0->No
    remarks: "",
    ri_report_attachment: "", //(Mandatory if ri_report = Complete)
    tree_enumeration_attachment: "", //(Mandatory if tree_enumeration = Complete)
    lease_to_idco_attachment: "", //(Mandatory if lease_to_idco = Yes)
    lease_to_ua_attachment: "", //(Mandatory if lease_to_ua = Yes)
  });

  /* ------------------ HANDLERS ------------------ */

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((p) => ({ ...p, [name]: value }));
};

const handleFileChange = (e) => {
  const { name, files } = e.target;
  setFormData((p) => ({ ...p, [name]: files[0] }));
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const fd = new FormData();

    const yesNo = (v) => (v === "Yes" ? 1 : 0);

    const presentStatusMap = {
      "Lease Case to Sub-Collector": 1,
      "Lease Case to ADM (Rev Sec)": 2,
      "Demand Raised": 3,
      "Lease Sanctioned by Collector": 4,
    };

    /* -------- TEXT FIELDS (ALWAYS APPEND) -------- */
    Object.entries({
      project_id: formData.project_id,
      type: formData.type,
      mouza: formData.mouza,
      tahasil: formData.tahasil,
      thana_no: formData.thana_no,
      ri_circle: formData.ri_circle,
      khata_no: formData.khata_no,
      kissam: formData.kissam,
      name_of_ror: formData.name_of_ror,
      plot_no: formData.plot_no,
      total_area_acres: formData.total_area_acres,
      proposed_area_acres: formData.proposed_area_acres,
      total_area_hectares: formData.total_area_hectares,
      proposed_area_hectares: formData.proposed_area_hectares,
      lease_case_no: formData.lease_case_no,
      case_details: formData.case_details,
      action_to_be_taken: formData.action_to_be_taken,
      ri_report: formData.ri_report,
      tree_enumeration: formData.tree_enumeration,
      order_sheet_prep: formData.order_sheet_prep,
      misc_dr_case_prep_number: formData.misc_dr_case_prep_number,
      reason_for_misc_dr_case: formData.reason_for_misc_dr_case,
      remarks: formData.remarks,
    }).forEach(([k, v]) => fd.append(k, v ?? ""));

    /* -------- NUMERIC MAPPED FIELDS -------- */
    fd.append("present_status", presentStatusMap[formData.present_status] || 0);
    fd.append("ua_idco_to_tahasildar", yesNo(formData.ua_idco_to_tahasildar));
    fd.append("misc_dr_case_prep", yesNo(formData.misc_dr_case_prep));
    fd.append("proclamation", yesNo(formData.proclamation));
    fd.append("objection_received", yesNo(formData.objection_received));
    fd.append("modification_revision", yesNo(formData.modification_revision));
    fd.append("lease_to_idco", yesNo(formData.lease_to_idco));
    fd.append("lease_to_ua", yesNo(formData.lease_to_ua));

    /* -------- FILES -------- */
    if (formData.ri_report === "Complete")
      fd.append("ri_report_attachment", formData.ri_report_attachment);

    if (formData.tree_enumeration === "Complete")
      fd.append("tree_enumeration_attachment", formData.tree_enumeration_attachment);

    if (formData.lease_to_idco === "Yes")
      fd.append("lease_to_idco_attachment", formData.lease_to_idco_attachment);

    if (formData.lease_to_ua === "Yes")
      fd.append("lease_to_ua_attachment", formData.lease_to_ua_attachment);

    const res = await fetch(`${API_BASE_URL}/govtplots/addGovtPlot`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: fd,
    });

    const data = await res.json();
if (data.success) {
  await fetchPlots(); // ✅ refetch list
  alert("Plot added successfully");
  closeModal();
}
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};



  const fetchVillages = useCallback(async () => {
    if (!formData.project_id) {
      setVillages([]);
      return;
    }

    try {
      const data = await apiClient(
        `/village/villageList?project_id=${formData.project_id}&type=${typeParam}`
      );
      console.log("govrt plots villages:", data);
      if (data.success) setVillages(data.villages || []);
    } catch (err) {
      console.error(err);
    }
  }, [formData.project_id, typeParam]);
  useEffect(() => {
    fetchVillages();
  }, [fetchVillages]);

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-lg mb-2">
          {formData.id ? "Edit Plot" : "Add Plot"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1 : Location Details */}
          <div className="card bg-base-100 shadow-md p-2">
            <h2 className="text-lg font-semibold mb-2">📍 Location Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Project</label>
                <select
                  name="project_id"
                  value={formData.project_id}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.project_name || p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Mouza</label>
                <select
                  name="mouza"
                  value={formData.mouza}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  // disabled={!formData.project}
                >
                  <option value="">Select Mouza</option>
                  {villages.map((v) => (
                    <option key={v.id} value={v.village_name}>
                      {v.village_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                 <label className="label">Khata No</label>
                <input
                  className="input input-bordered w-full"
                  name="khata_no"
                  value={formData.khata_no}
                  onChange={handleChange}
                />
                {/* <label className="label">Khata No</label>
                <select
                  name="khata_no"
                  value={formData.khata_no}
                  onChange={handleChange}
                  disabled={!formData.project_id}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Khata No</option>
                  {khatas.map((k) => (
                    <option key={k.id} value={k.khata_no}>
                      {k.khata_no}
                    </option>
                  ))}
                </select> */}
              </div>

              <div>
                <label className="label">Tahashil</label>
                <input
                  className="input input-bordered w-full"
                  name="tahasil"
                  value={formData.tahasil}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["thana_no", "Thana No"],
                ["ri_circle", "RI Circle"],
                ["name_of_ror", "Name of ROR"],
                ["plot_no", "Plot No"],
                ["kissam", "Kissam"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="label">{label}</label>
                  <input
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-base-100 shadow-md">
            <h2 className="text-lg font-semibold mb-2">📐 Area Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
              {[
                ["total_area_acres", "Total Area (Acres)"],
                ["proposed_area_acres", "Proposed Area (Acres)"],
                ["total_area_hectares", "Total Area (Hectares)"],
                ["proposed_area_hectares", "Proposed Area (Hectares)"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="label">{label}</label>
                  <input
                    type="number"
                    step="0.01"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4 : Lease Case Details */}
          <div className="card bg-base-100 shadow-md">
            <h2 className="text-lg font-semibold mb-4">
              📄 Lease Case Details
            </h2>
            <div>
              <label className="label">Lease Case No</label>
              <input
                type="number"
                name="lease_case_no"
                value={formData.lease_case_no}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div className="col-span-2">
                <label className="label">Present Status</label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-base-200 rounded-lg">
                  {[
                    "Lease Case to Sub-Collector",
                    "Lease Case to ADM (Rev Sec)",
                    "Demand Raised",
                    "Lease Sanctioned by Collector",
                  ].map((status) => (
                    <label key={status} className="label">
                      <input
                        type="radio"
                        name="present_status"
                        value={status}
                        checked={formData.present_status === status}
                        onChange={handleChange}
                        // className="mt-1"
                      />
                      <span className="text-sm leading-5 text-gray-800">
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="label">Case Details / Observation</label>
              <textarea
                className="textarea textarea-bordered w-full"
                name="case_details"
                value={formData.case_details}
                onChange={handleChange}
              />
            </div>
            {/* MISSING / DR CASE DETAILS */}
            <div className="mt-4">
              <div>
                <label className="label">
                  Missing Case Prep./ DR Case. Prep.
                </label>
                <div className="flex gap-6">
                  {["Yes", "No"].map((v) => (
                    <label key={v} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="misc_dr_case_prep"
                        value={v}
                        checked={formData.misc_dr_case_prep === v}
                        onChange={handleChange}
                      />
                      {v}
                    </label>
                  ))}
                </div>
              </div>

              {/* CASE NUMBER – ONLY IF YES */}
              {formData.misc_dr_case_prep === "Yes" && (
                <div className="mt-3">
                  <label className="label">Case Number</label>
                  <input
                    type="text"
                    name="misc_dr_case_prep_number"
                    value={formData.misc_dr_case_prep_number}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Enter Case Number"
                  />
                </div>
              )}

              {/* REASON – MANUAL ENTRY */}
              <div className="mt-4">
                <label className="label">
                  Reason for Misc/DR case (Not Mandatory)
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  name="reason_for_misc_dr_case"
                  value={formData.reason_for_misc_dr_case}
                  onChange={handleChange}
                  placeholder="Enter reason for missing or DR case"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="label">Action to be Taken</label>
              <textarea
                className="textarea textarea-bordered w-full"
                name="action_to_be_taken"
                value={formData.action_to_be_taken}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="card bg-base-100 shadow-md p-4">
            <h2 className="text-lg font-semibold mb-3">🔄 Workflow Tracking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ["ua_idco_to_tahasildar", "UA / IDCO to Tahasildar"],
                ["proclamation", "Proclamation"],
                ["objection_received", "Objection Received"],
                ["modification_revision", "Modification / Revision"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="label">{label}</label>
                  <div className="flex gap-6">
                    {["Yes", "No"].map((v) => (
                      <label key={v} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={name}
                          value={v}
                          checked={formData[name] === v}
                          onChange={handleChange}
                        />
                        {v}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          {/* STATUS + DOCUMENT FIELDS */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  {[
    ["ri_report", "RI Report", "ri_report_attachment"],
    ["tree_enumeration", "Tree Enumeration", "tree_enumeration_attachment"],
    ["order_sheet_prep", "Order Sheet Prep", "order_sheet_prep_attachment"],
  ].map(([name, label, fileField]) => (
    <div key={name}>
      <label className="label">{label}</label>

      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="select select-bordered w-full"
      >
        <option value="">Select</option>
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Complete">Complete</option>
      </select>

      {/* DOCUMENT UPLOAD – ONLY IF COMPLETE */}
      {formData[name] === "Complete" && (
        <div className="mt-2">
          <label className="label text-sm text-gray-600">
            Upload {label} Document
          </label>
          <input
            type="file"
            name={fileField}
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
            accept=".pdf,.jpg,.png"
          />
        </div>
      )}
    </div>
  ))}
</div>


         {/* LEASE DOCUMENTS */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  {[
    ["lease_to_idco", "Lease to IDCO", "lease_to_idco_attachment"],
    ["lease_to_ua", "Lease to UA", "lease_to_ua_attachment"],
  ].map(([name, label, fileField]) => (
    <div key={name}>
      <label className="label">{label}</label>

      <div className="flex gap-6">
        {["Yes", "No"].map((v) => (
          <label key={v} className="flex items-center gap-2">
            <input
              type="radio"
              name={name}
              value={v}
              checked={formData[name] === v}
              onChange={handleChange}
            />
            {v}
          </label>
        ))}
      </div>

      {/* DOCUMENT UPLOAD – ONLY IF YES */}
      {formData[name] === "Yes" && (
        <div className="mt-2">
          <label className="label text-sm text-gray-600">
            Attach Lease Case Deed
          </label>
          <input
            type="file"
            name={fileField}
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
            accept=".pdf,.jpg,.png"
          />
        </div>
      )}
    </div>
  ))}
</div>

          </div>

          <div className="card bg-base-100 shadow-md">
            <h2 className="text-lg font-semibold mb-2">📝 Remarks</h2>

            <textarea
              className="textarea textarea-bordered w-full"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={closeModal}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default PlotForm;
