import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../utils/config";
import { useLandTypeParam } from "../../../utils/landtypes";
import { apiClient } from "../../../utils/apiClient";
import SuccessMessage from "../../../shared/SuccessMessage";
import { useSuccessMessage } from "../../../hooks/useSuccessMessage";
import { Download, X } from "lucide-react";

const toYesNo = (value) => {
  if (value === "Yes" || value === "No") return value;
  return value === 1 || value === true ? "Yes" : "No";
};

const getAttachmentName = (attachment) => {
  if (!attachment) return "";
  if (attachment instanceof File) return attachment.name;
  if (typeof attachment === "string") {
    const parts = attachment.split("/");
    return parts[parts.length - 1];
  }
  if (typeof attachment === "object") {
    return attachment.file_name || attachment.name || attachment.originalname || "";
  }
  return "";
};

const getAttachmentUrl = (attachment) => {
  if (!attachment || attachment instanceof File) return "";
  if (typeof attachment === "string") return attachment;
  if (typeof attachment === "object") {
    return attachment.url || attachment.path || attachment.file_path || "";
  }
  return "";
};

const buildInitialFormData = (editingPlot, selectedProject, typeParam) => ({
  project_id: editingPlot?.project_id || selectedProject?.id || "",
  type: typeParam,
  district: editingPlot?.district || "",
  mouza: editingPlot?.mouza || "",
  tahasil: editingPlot?.tahasil || "",
  thana_no: editingPlot?.thana_no || "",
  ri_circle: editingPlot?.ri_circle || "",
  khata_no: editingPlot?.khata_no || "",
  kissam: editingPlot?.kissam || "",
  name_of_ror: editingPlot?.name_of_ror || "",
  plot_no: editingPlot?.plot_no || "",
  total_area_acres: editingPlot?.total_area_acres || "",
  proposed_area_acres: editingPlot?.proposed_area_acres || "",
  total_area_hectares: editingPlot?.total_area_hectares || "",
  proposed_area_hectares: editingPlot?.proposed_area_hectares || "",
  lease_case_no: editingPlot?.lease_case_no || "",
  present_status: editingPlot?.present_status || "",
  ua_idco_to_tahasildar: toYesNo(editingPlot?.ua_idco_to_tahasildar),
  case_details: editingPlot?.case_details || "",
  action_to_be_taken: editingPlot?.action_to_be_taken || "",
  ri_report: editingPlot?.ri_report || "",
  tree_enumeration: editingPlot?.tree_enumeration || "",
  order_sheet_prep: editingPlot?.order_sheet_prep || "",
  misc_dr_case_prep: toYesNo(editingPlot?.misc_dr_case_prep),
  misc_dr_case_prep_number: editingPlot?.misc_dr_case_prep_number || "",
  reason_for_misc_dr_case: editingPlot?.reason_for_misc_dr_case || "",
  proclamation: toYesNo(editingPlot?.proclamation),
  objection_received: toYesNo(editingPlot?.objection_received),
  modification_revision: toYesNo(editingPlot?.modification_revision),
  lease_to_idco: toYesNo(editingPlot?.lease_to_idco),
  lease_to_ua: toYesNo(editingPlot?.lease_to_ua),
  remarks: editingPlot?.remarks || "",
  ua_idco_to_tahasildar_attachment:
    editingPlot?.ua_idco_to_tahasildar_attachment || "",
  proclamation_attachment: editingPlot?.proclamation_attachment || "",
  objection_received_attachment: editingPlot?.objection_received_attachment || "",
  modification_revision_attachment:
    editingPlot?.modification_revision_attachment || "",
  lease_to_idco_attachment: editingPlot?.lease_to_idco_attachment || "",
  lease_to_ua_attachment: editingPlot?.lease_to_ua_attachment || "",
  ri_report_attachment: editingPlot?.ri_report_attachment || "",
  tree_enumeration_attachment: editingPlot?.tree_enumeration_attachment || "",
  land_area_total_acres: editingPlot?.land_area_total_acres || "",
  land_area_total_hectares: editingPlot?.land_area_total_hectares || "",
  land_area_acquired_acres: editingPlot?.land_area_acquired_acres || "",
  land_area_acquired_hectares: editingPlot?.land_area_acquired_hectares || "",
  market_value_per_acre: editingPlot?.market_value_per_acre || "",
  bench_market_value: editingPlot?.bench_market_value || "",
  premium: editingPlot?.premium || "",
  ground_rent: editingPlot?.ground_rent || "",
  cess: editingPlot?.cess || "",
  admin_charges: editingPlot?.admin_charges || "",
  total_cost: editingPlot?.total_cost || "",
  legal_heir_case_no: editingPlot?.legal_heir_case_no || "",
  land_case_no: editingPlot?.land_case_no || "",
  land_case_date: editingPlot?.land_case_date
    ? editingPlot.land_case_date.split("T")[0]
    : "",
  land_case_type: editingPlot?.land_case_type || "",
  land_case_status: editingPlot?.land_case_status || "",
  land_case_details: editingPlot?.land_case_details || "",
});

const PlotForm = ({ close, fetchPlots, editingPlot }) => {
  const token = useSelector((s) => s.auth.userToken);
  console.log("govrt plots token:", token);
  const selectedProject = useSelector((s) => s.selectedProject.project);
  const projects = useSelector((s) => s.list.projects || []);
  console.log("govrt plots selected project:", selectedProject);
  const typeParam = useLandTypeParam();
  const [villages, setVillages] = useState([]);
  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();
  const [formData, setFormData] = useState(() =>
    buildInitialFormData(editingPlot, selectedProject, typeParam),
  );

  useEffect(() => {
    setFormData(buildInitialFormData(editingPlot, selectedProject, typeParam));
  }, [editingPlot, selectedProject, typeParam]);

  const downloadAttachment = (attachment) => {
    const url = getAttachmentUrl(attachment);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => {
      const next = { ...p, [name]: value };

      if (name === "lease_to_idco" && value !== "Yes") {
        next.lease_to_idco_attachment = "";
      }

      if (name === "lease_to_ua" && value !== "Yes") {
        next.lease_to_ua_attachment = "";
      }

      if (name === "ua_idco_to_tahasildar" && value !== "Yes") {
        next.ua_idco_to_tahasildar_attachment = "";
      }

      if (name === "proclamation" && value !== "Yes") {
        next.proclamation_attachment = "";
      }

      if (name === "objection_received" && value !== "Yes") {
        next.objection_received_attachment = "";
      }

      if (name === "modification_revision" && value !== "Yes") {
        next.modification_revision_attachment = "";
      }

      if (name === "misc_dr_case_prep" && value !== "Yes") {
        next.misc_dr_case_prep_number = "";
      }

      return next;
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((p) => ({ ...p, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      const yesNo = (v) => (v === "Yes" || v === 1 ? 1 : 0);

      Object.entries({
        project_id: formData.project_id,
        district: formData.district,
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
        present_status: formData.present_status,
        ua_idco_to_tahasildar: yesNo(formData.ua_idco_to_tahasildar),
        case_details: formData.case_details,
        action_to_be_taken: formData.action_to_be_taken,
        ri_report: formData.ri_report,
        tree_enumeration: formData.tree_enumeration,
        order_sheet_prep: formData.order_sheet_prep,
        misc_dr_case_prep: yesNo(formData.misc_dr_case_prep),
        misc_dr_case_prep_number: formData.misc_dr_case_prep_number,
        reason_for_misc_dr_case: formData.reason_for_misc_dr_case,
        proclamation: yesNo(formData.proclamation),
        objection_received: yesNo(formData.objection_received),
        modification_revision: yesNo(formData.modification_revision),
        lease_to_idco: yesNo(formData.lease_to_idco),
        lease_to_ua: yesNo(formData.lease_to_ua),

        land_area_total_acres: formData.land_area_total_acres,
        land_area_total_hectares: formData.land_area_total_hectares,
        land_area_acquired_acres: formData.land_area_acquired_acres,
        land_area_acquired_hectares: formData.land_area_acquired_hectares,
        market_value_per_acre: formData.market_value_per_acre,
        bench_market_value: formData.bench_market_value,
        premium: formData.premium,
        ground_rent: formData.ground_rent,
        cess: formData.cess,
        admin_charges: formData.admin_charges,
        total_cost: formData.total_cost,
        legal_heir_case_no: formData.legal_heir_case_no,
        land_case_no: formData.land_case_no,
        land_case_date: formData.land_case_date,
        land_case_type: formData.land_case_type,
        land_case_status: formData.land_case_status,
        land_case_details: formData.land_case_details,
        remarks: formData.remarks,
      }).forEach(([k, v]) => fd.append(k, v ?? ""));

      // Attachments (only if uploaded)
      if (formData.ri_report_attachment instanceof File)
        fd.append("ri_report_attachment", formData.ri_report_attachment);

      if (formData.tree_enumeration_attachment instanceof File)
        fd.append(
          "tree_enumeration_attachment",
          formData.tree_enumeration_attachment,
        );

      if (formData.ua_idco_to_tahasildar_attachment instanceof File)
        fd.append(
          "ua_idco_to_tahasildar_attachment",
          formData.ua_idco_to_tahasildar_attachment,
        );

      if (formData.proclamation_attachment instanceof File)
        fd.append("proclamation_attachment", formData.proclamation_attachment);

      if (formData.objection_received_attachment instanceof File)
        fd.append(
          "objection_received_attachment",
          formData.objection_received_attachment,
        );

      if (formData.modification_revision_attachment instanceof File)
        fd.append(
          "modification_revision_attachment",
          formData.modification_revision_attachment,
        );

      if (formData.lease_to_idco_attachment instanceof File)
        fd.append(
          "lease_to_idco_attachment",
          formData.lease_to_idco_attachment,
        );

      if (formData.lease_to_ua_attachment instanceof File)
        fd.append("lease_to_ua_attachment", formData.lease_to_ua_attachment);

      const isEdit = Boolean(editingPlot?.id);

      const url = isEdit
        ? `${API_BASE_URL}/govtplots/updateGovtPlot/${editingPlot.id}`
        : `${API_BASE_URL}/govtplots/addGovtPlot`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const data = await res.json();

      if (data.success) {
        await fetchPlots();
        showSuccess(data.message || "Added Successfully");
        setTimeout(() => {
          close();
        }, 800);
      } else {
        showError(data.message || "Operation failed");
      }
    } catch (err) {
      // console.error(err);
      showError(data.message || "Operation failed");
    }
  };

  const fetchVillages = useCallback(async () => {
    if (!formData.project_id) {
      setVillages([]);
      return;
    }

    try {
      const data = await apiClient(
        `/village/villageList?project_id=${formData.project_id}&type=${typeParam}`,
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
      <div
        className="modal-box max-w-4xl max-h-130 relative"
        style={{ scrollbarWidth: "thin" }}
      >
        <button className="absolute right-3 top-3" onClick={close}>
          <X size={20} />
        </button>
        <h3 className="font-bold text-lg mb-2">
          {editingPlot ? "Edit Govt Plot" : "Add Govt Plot"}
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
                <label className="label">District</label>
                <input
                  className="input input-bordered w-full"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="label">Khata No</label>
                <input
                  className="input input-bordered w-full"
                  name="khata_no"
                  value={formData.khata_no}
                  onChange={handleChange}
                />
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
                type="text"
                name="lease_case_no"
                value={formData.lease_case_no}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^A-Za-z0-9/]/g, "");
                  handleChange({
                    target: {
                      name: "lease_case_no",
                      value,
                    },
                  });
                }}
                className="input input-bordered w-full"
                // placeholder="e.g. LC/123/2025"
                placeholder="e.g. 123/2025"
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
                [
                  "tree_enumeration",
                  "Tree Enumeration",
                  "tree_enumeration_attachment",
                ],
                ["order_sheet_prep", "Order Sheet Prep"],
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
                  {fileField && formData[name] === "Complete" && (
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
                      {getAttachmentName(formData[fileField]) && (
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <span className="truncate">
                            Current: {getAttachmentName(formData[fileField])}
                          </span>
                          {getAttachmentUrl(formData[fileField]) && (
                            <button
                              type="button"
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() =>
                                downloadAttachment(formData[fileField])
                              }
                              aria-label={`Download ${label} attachment`}
                              title="Download attachment"
                            >
                              <Download size={16} />
                            </button>
                          )}
                        </div>
                      )}
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
                      {getAttachmentName(formData[fileField]) && (
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <span className="truncate">
                            Current: {getAttachmentName(formData[fileField])}
                          </span>
                          {getAttachmentUrl(formData[fileField]) && (
                            <button
                              type="button"
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() =>
                                downloadAttachment(formData[fileField])
                              }
                              aria-label={`Download ${label} attachment`}
                              title="Download attachment"
                            >
                              <Download size={16} />
                            </button>
                          )}
                        </div>
                      )}
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

          {/* <div className="card bg-base-100 shadow-md p-2">
            <h2 className="text-lg font-semibold mb-3">
              💰 Valuation & Cost Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["market_value_per_acre", "Market Value per Acre"],
                ["bench_market_value", "Bench Market Value"],
                ["premium", "Premium"],
                ["ground_rent", "Ground Rent"],
                ["cess", "Cess"],
                ["admin_charges", "Administrative Charges"],
                ["total_cost", "Total Cost"],
                // ["Admin_cost", "Admin Cost"],
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
          <div className="card bg-base-100 shadow-md p-2">
            <h2 className="text-lg font-semibold mb-3">
              ⚖️ Legal Case Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Legal Heir Case No</label>
                <input
                  type="text"
                  name="legal_heir_case_no"
                  value={formData.legal_heir_case_no}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label">Land Case No</label>
                <input
                  type="text"
                  name="land_case_no"
                  value={formData.land_case_no}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label">Land Case Date</label>
                <input
                  type="date"
                  name="land_case_date"
                  value={formData.land_case_date}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label">Land Case Type</label>
                <input
                  type="text"
                  name="land_case_type"
                  value={formData.land_case_type}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="mt-4">
                <label className="label">Land Area Total(Acres)</label>
                <input
                  type="text"
                  name="land_area_total_acres"
                  value={formData.land_area_total_acres}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="mt-4">
                <label className="label"> Land Area Total(Hectares)</label>
                <input
                  type="text"
                  name="land_area_total_hectares"
                  value={formData.land_area_total_hectares}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="mt-4">
                <label className="label">Land Area Aquired (Acres)</label>
                <input
                  type="text"
                  name="land_area_acquired_acres"
                  value={formData.land_area_acquired_acres}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="mt-4">
                <label className="label">Land Area Aquired (Hectres)</label>
                <input
                  type="text"
                  name="land_area_acquired_hectares"
                  value={formData.land_area_acquired_hectares}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label">Land Case Status</label>
                <select
                  name="land_case_status"
                  value={formData.land_case_status}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Disposed">Disposed</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="label">Land Case Details</label>
              <textarea
                name="land_case_details"
                value={formData.land_case_details}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
              />
            </div>
          </div> */}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={close}
              className="btn btn-error text-white"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingPlot ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
      <SuccessMessage
        open={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={closeModal}
      />
    </dialog>
  );
};

export default PlotForm;
