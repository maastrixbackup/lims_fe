import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { useLandTypeParam } from "../../../utils/landtypes";
import { apiClient } from "../../../utils/apiClient";
import { RR_FIELDS_FORMS, showToast } from "../../../utils/constants";

const KhataFormModal = ({ khata, onClose, token, villages, fetchKhatas }) => {
  const typeParam = useLandTypeParam();
  console.log("khata^^^^^^^^^^^", khata);
  const typeLabel =
    typeParam === 2
      ? "Government Land"
      : typeParam === 3
      ? "Forest Land"
      : "Private Land";

  const selectedProject = useSelector((s) => s.selectedProject.project);
  const projects = useSelector((state) => state.list.projects || []);
  const [openVillage, setOpenVillage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    project_id: "",
    village_id: "",
    khata_no: "",
    type: typeParam,
    plot_no: "",
    full_part: "",
    kissam_of_land: "",
    land_category: "",
    land_area_total_acres: "",
    land_area_total_hectares: "",
    land_area_acquired_acres: "",
    land_area_acquired_hectares: "",
    lo13_remarks: "",
    tahasil_name: "",
    ri_circle_name: "",
    thana_no: "",
    date_of_award: "",
    name_of_recorded_tenant: "",
    name_of_present_tenant: "",
    present_address: "",
    displaced_affected_project: "",
    rr_employment: "",
    rr_cash_in_lieu: "",
    rr_training_skill_upgradation: "",
    rr_self_employment: "",
    rr_special_allowance_st_ntfp: "",
    rr_homestead_allotment: "",
    rr_house_building_assistance: "",
    rr_constructed_by: "",
    rr_transit_shed: "",
    rr_transport_allowance: "",
    rr_maintenance_allowance: "",
    rr_multiple_displacement_allowance: "",
    rr_exgratia: "",
    rr_other_benefits: "",
  });

  const initializing = useRef(false);
  // const userRole = useSelector((s) => s.auth.user?.role_name || "");
  // const isRestricted = userRole === "Data Entry User";

  useEffect(() => {
    if (khata) {
      initializing.current = true;
      setFormData({
        project_id: khata.project_id,
        village_id: khata.village_id,
        khata_no: khata.khata_no || "",
        type: khata.type || typeParam,
        plot_no: khata.plot_no || "",
        full_part: khata.full_part || "",
        kissam_of_land: khata.kissam_of_land || "",
        land_category: khata.land_category || "",
        land_area_total_acres: khata.land_area_total_acres || "",
        land_area_total_hectares: khata.land_area_total_hectares || "",
        land_area_acquired_acres: khata.land_area_acquired_acres || "",
        land_area_acquired_hectares: khata.land_area_acquired_hectares || "",
        lo13_remarks: khata.lo13_remarks || "",
        tahasil_name: khata.tahasil_name || "",
        ri_circle_name: khata.ri_circle_name || "",
        thana_no: khata.thana_no || "",
        date_of_award: khata.date_of_award || "",
        name_of_recorded_tenant: khata.name_of_recorded_tenant || "",
        name_of_present_tenant: khata.name_of_present_tenant || "",
        present_address: khata.present_address || "",
        displaced_affected_project: khata.displaced_affected_project || "",
        rr_employment: khata.rr_employment || "",
        rr_cash_in_lieu: khata.rr_cash_in_lieu || "",
        rr_training_skill_upgradation:
          khata.rr_training_skill_upgradation || "",
        rr_self_employment: khata.rr_self_employment || "",
        rr_special_allowance_st_ntfp: khata.rr_special_allowance_st_ntfp || "",
        rr_homestead_allotment: khata.rr_homestead_allotment || "",
        rr_house_building_assistance: khata.rr_house_building_assistance || "",
        rr_constructed_by: khata.rr_constructed_by || "",
        rr_transit_shed: khata.rr_transit_shed || "",
        rr_transport_allowance: khata.rr_transport_allowance || "",
        rr_maintenance_allowance: khata.rr_maintenance_allowance || "",
        rr_multiple_displacement_allowance:
          khata.rr_multiple_displacement_allowance || "",
        rr_exgratia: khata.rr_exgratia || "",
        rr_other_benefits: khata.rr_other_benefits || "",
      });

      setTimeout(() => (initializing.current = false), 300);
    } else {
      setFormData({
        project_id: selectedProject?.id || "",
        village_id: "",
        khata_no: "",
        type: typeParam,
        plot_no: "",
        full_part: "",
        kissam_of_land: "",
        land_category: "",
        land_area_total_acres: "",
        land_area_total_hectares: "",
        land_area_acquired_acres: "",
        land_area_acquired_hectares: "",
        lo13_remarks: "",
        tahasil_name: "",
        ri_circle_name: "",
        thana_no: "",
        date_of_award: "",
        name_of_recorded_tenant: "",
        name_of_present_tenant: "",
        present_address: "",
        displaced_affected_project: "",
        rr_employment: "",
        rr_cash_in_lieu: "",
        rr_training_skill_upgradation: "",
        rr_self_employment: "",
        rr_special_allowance_st_ntfp: "",
        rr_homestead_allotment: "",
        rr_house_building_assistance: "",
        rr_constructed_by: "",
        rr_transit_shed: "",
        rr_transport_allowance: "",
        rr_maintenance_allowance: "",
        rr_multiple_displacement_allowance: "",
        rr_exgratia: "",
        rr_other_benefits: "",
      });
    }
  }, [khata, typeParam, selectedProject]);

  useEffect(() => {
    if (!initializing.current) {
      setFormData((prev) => ({
        ...prev,
        village_id: "",
      }));
    }
  }, [formData.project_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "project_id" || name === "village_id" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    try {
      const isEdit = Boolean(khata);

      const endpoint = isEdit
        ? `/khata/updateKhata/${khata.id}`
        : `/khata/addKhata`;

      const method = isEdit ? "PUT" : "POST";

      const res = await apiClient(endpoint, {
        method,
        body: formData,
      });

      if (!res.success) {
        showToast(res.message || "Failed to save khata", "error");
        return;
      }

      await fetchKhatas();

      showToast(
        isEdit ? "Khata Updated Successfully" : "Khata Added Successfully",
        "success"
      );

      onClose();
    } catch (err) {
      console.error(err);
      showToast("Error saving khata", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog open className="modal modal-open ">
      <div className="modal-box max-w-2xl max-h-130 relative" style={{scrollbarWidth:"thin"}}>
        <button
          type="button"
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h3 className="font-bold text-lg mb-4">
          {khata ? "Edit Khata" : "Add Khata"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium ">Project</label>
              <select
                name="project_id"
                value={formData.project_id || ""}
                onChange={handleChange}
                className="select select-bordered w-full"
               
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
              <label className="block text-sm font-medium ">Land Type</label>
              <input
                type="text"
                className="input input-bordered w-full bg-gray-100"
                value={typeLabel}
                readOnly
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium">Village</label>
            <button
              type="button"
              onClick={() => setOpenVillage(!openVillage)}
              className="select select-bordered w-full flex justify-between items-center"
            >
              {villages.find((v) => v.id === formData.village_id)
                ?.village_name || "Select Village"}
            </button>

            {openVillage && (
              <ul className="absolute left-0 top-full dropdown menu w-full rounded-box bg-base-100 shadow-lg p-2 max-h-54 overflow-y-auto z-50">
                {villages.map((v) => (
                  <li
                    key={v.id}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, village_id: v.id }));
                      setOpenVillage(false);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {v.village_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium ">Khata No.</label>
              <input
                type="text"
                name="khata_no"
                value={formData.khata_no}
                onChange={handleChange}
                className="input input-bordered w-full"
               
                // disabled={isRestricted}
              />
            </div>

            <div>
              <label className="block text-sm font-medium ">Plot No.</label>
              <input
                type="text"
                name="plot_no"
                value={formData.plot_no}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium ">
                Kissam of Land
              </label>
              <input
                type="text"
                name="kissam_of_land"
                value={formData.kissam_of_land}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium ">
                Category of Land
              </label>
              <input
                type="text"
                name="land_category"
                value={formData.land_category}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium ">Full Part</label>
              <input
                type="text"
                name="full_part"
                value={formData.full_part}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Total Area (Acres)</label>
              <input
                type="number"
                name="land_area_total_acres"
                value={formData.land_area_total_acres}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Total Area (Ha)</label>
              <input
                type="number"
                name="land_area_total_hectares"
                value={formData.land_area_total_hectares}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">
                Acquired Area (Acres)
              </label>
              <input
                type="number"
                name="land_area_acquired_acres"
                value={formData.land_area_acquired_acres}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Acquired Area (Ha)</label>
              <input
                type="number"
                name="land_area_acquired_hectares"
                value={formData.land_area_acquired_hectares}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium">Tahasil Name</label>
              <input
                type="text"
                name="tahasil_name"
                value={formData.tahasil_name}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium">R.I. Circle Name</label>
              <input
                type="text"
                name="ri_circle_name"
                value={formData.ri_circle_name}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Thana No.</label>
              <input
                type="text"
                name="thana_no"
                value={formData.thana_no}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Date of Award</label>
            <input
              type="date"
              name="date_of_award"
              value={formData.date_of_award}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">
                Recorded Tenants (RT)
              </label>
              <input
                type="text"
                name="name_of_recorded_tenant"
                value={formData.name_of_recorded_tenant}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Present Tenants (PT)
              </label>
              <input
                type="text"
                name="name_of_present_tenant"
                value={formData.name_of_present_tenant}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Present Address</label>
            <textarea
              name="present_address"
              value={formData.present_address}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Remarks</label>
            <input
              type="text"
              name="lo13_remarks"
              value={formData.lo13_remarks}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Displaced / Affected Person
            </label>
            <select
              name="displaced_affected_project"
              value={formData.displaced_affected_project || ""}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Select Type</option>
              <option value="PAF">PAF</option>
              <option value="PDF">PDF</option>
            </select>
          </div>
          

          <hr className="my-4" />
          <div className="grid grid-cols-2 gap-3">
            {RR_FIELDS_FORMS.map((field) => (
              <div key={field.name}>
                <label className="text-sm font-medium mb-1 block">
                  {field.label}
                </label>

                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={formData[field.name] ?? ""}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  // disabled={isRestricted}
                />
              </div>
            ))}
          </div>
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-error text-white"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Saving..." : khata ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default KhataFormModal;
