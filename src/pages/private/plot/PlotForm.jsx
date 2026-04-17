import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../utils/config";
import {
  sections,
  showToast,
  LA_CASE_REGEX,
  REQUIRED_FIELDS,
} from "../../../utils/constants";
import { useLandTypeParam } from "../../../utils/landtypes";
import { apiClient } from "../../../utils/apiClient";
import SuccessMessage from "../../../shared/SuccessMessage";
import { useSuccessMessage } from "../../../hooks/useSuccessMessage";
import { acreToHectare, hectareToAcre } from "../../../utils/formula";

const PlotForm = ({ fetchPlots }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { landType } = useParams();

  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();
  const token = useSelector((s) => s.auth.userToken);
  const selectedProject = useSelector((s) => s.selectedProject.project);
  const projects = useSelector((s) => s.list.projects || []);

  const editingPlot = location.state?.plot || null;
  const typeParam = useLandTypeParam();

  const [villages, setVillages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [userChangedProject, setUserChangedProject] = useState(false);
  const [khatas, setKhatas] = useState([]);

  const [formData, setFormData] = useState(() => ({
    type: typeParam,
    ...Object.fromEntries(
      Object.values(sections)
        .flat()
        .map((f) => [f, ""]),
    ),
    project_id: "",
  }));

  const normalizeOrphanMemberValue = (value) => {
    if (value === 1 || value === "1" || value === true) return "1";
    if (value === 0 || value === "0" || value === false) return "0";
    if (typeof value === "string") {
      const normalized = value.trim().toUpperCase();
      if (normalized === "Y" || normalized === "YES") return "1";
      if (normalized === "N" || normalized === "NO") return "0";
    }
    return "";
  };

  const normalizeTribunalValue = (value) => {
    if (value === null || value === undefined || value === "") return "";
    const normalized = String(value).trim().toUpperCase();
    if (normalized === "Y" || normalized === "YES" || normalized === "1") {
      return "Yes";
    }
    if (normalized === "N" || normalized === "NO" || normalized === "0") {
      return "No";
    }
    return "";
  };

  const REQUIRED_SET = useMemo(() => new Set(REQUIRED_FIELDS), []);
  const FAMILY_MEMBER_FIELDS = useMemo(
    () =>
      new Set([
        "family_major_male",
        "family_major_female",
        "family_minor_male",
        "family_minor_female",
        "family_major_transgender",
        "family_minor_transgender",
        "persons_with_disability",
        "family_with_orphan_members",
      ]),
    [],
  );

  const projectCode = useMemo(() => {
    const project = projects.find(
      (p) => String(p.id) === String(formData.project_id),
    );

    return project
      ? (project.client_code || project.client_code || "")
          .replace(/\s+/g, "")
          .toUpperCase()
      : "";
  }, [projects, formData.project_id]);

  const fetchVillages = useCallback(async () => {
    if (!formData.project_id) {
      setVillages([]);
      return;
    }

    try {
      const data = await apiClient(
        `/village/villageList?project_id=${formData.project_id}&type=${typeParam}`,
      );

      if (data.success) setVillages(data.villages || []);
    } catch (err) {
      console.error(err);
    }
  }, [formData.project_id, typeParam]);

  useEffect(() => {
    fetchVillages();
  }, [fetchVillages]);

  useEffect(() => {
    if (!editingPlot) return;

    setFormData((prev) => ({
      ...prev,
      ...editingPlot,
      tribunal: normalizeTribunalValue(editingPlot.tribunal),
      family_with_orphan_members: normalizeOrphanMemberValue(
        editingPlot.family_with_orphan_members,
      ),
      type: editingPlot.type || typeParam,
      project_id: editingPlot.project_id,
    }));

    setUserChangedProject(true);
  }, [editingPlot, typeParam]);

  useEffect(() => {
    if (!editingPlot && selectedProject && !userChangedProject) {
      setFormData((prev) => ({
        ...prev,
        project_id: selectedProject.id,
      }));
    }
  }, [selectedProject, userChangedProject, editingPlot]);

  useEffect(() => {
    if (editingPlot) return;

    if (projectCode && formData.village_code && formData.khata_no) {
      setFormData((prev) => ({
        ...prev,
        la_case_file_no: `${projectCode}/${formData.village_name}/${formData.khata_no}`,
      }));
    }
  }, [projectCode, formData.village_code, formData.khata_no, editingPlot]);

  const handleChange = ({ target: { name, value } }) => {
    setErrors((e) => ({ ...e, [name]: "" }));

    setFormData((prev) => {
      if (name === "project_id") {
        setUserChangedProject(true);
        return {
          ...prev,
          project_id: value,
          village_name: "",
          village_code: "",
        };
      }

      if (name === "village_name") {
        const found = villages.find((v) => v.village_name === value);
        return {
          ...prev,
          village_name: value,
          village_code: found?.village_code || "",
        };
      }
   // TOTAL AREA
if (name === "land_area_total_hectares") {
  return {
    ...prev,
    land_area_total_hectares: value,
    land_area_total_acres: hectareToAcre(value), // ✅ FIXED
  };
}

if (name === "land_area_total_acres") {
  return {
    ...prev,
    land_area_total_acres: value,
    land_area_total_hectares: acreToHectare(value), 
  };
}

 if (name === "land_area_acquired_hectares") {
  return {
    ...prev,
    land_area_acquired_hectares: value,
    land_area_acquired_acres: hectareToAcre(value),
  };
}

if (name === "land_area_acquired_acres") {
  return {
    ...prev,
    land_area_acquired_acres: value,
    land_area_acquired_hectares: acreToHectare(value),
  };
}


      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingPlot
        ? `${API_BASE_URL}/plots/updatePlot/${editingPlot.id}`
        : `${API_BASE_URL}/plots/createPlot`;

      const payload = {
        ...formData,
        type: typeParam,
        tribunal:
          formData.tribunal === ""
            ? null
            : normalizeTribunalValue(formData.tribunal),
        family_with_orphan_members:
          formData.family_with_orphan_members === ""
            ? null
            : Number(formData.family_with_orphan_members),
      };

      const res = await fetch(url, {
        method: editingPlot ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("dataaaaa", data);

      if (data.success) {
        showSuccess(data.message || "Data Added Successfully");
        fetchPlots?.();
        setTimeout(() => {
          closeModal();

          navigate(`/${landType}/plots`);
        }, 800);
      } else if (data.success === false) {
        showError(data.message || "Something went error");
      }
    } catch (err) {
      console.error(err);
      showError(err.message || "Something went error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="overflow-y-auto">
      <div className="max-w-6xl mx-auto bg-white shadow-xl p-2 rounded-lg">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {editingPlot ? "Edit Plot" : "Add New Plot"}
          </h2>
          <button
            onClick={() => navigate(`/${landType}/plots`)}
            className="btn btn-outline btn-sm"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Project</label>
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
            <label className="font-semibold text-sm mb-1 block">
              Land Type
            </label>
            <input
              readOnly
              className="input input-bordered w-full bg-gray-100"
              value={
                typeParam === 1
                  ? "Private Land"
                  : typeParam === 2
                    ? "Government Land"
                    : "Forest Land"
              }
            />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {Object.entries(sections).map(([section, fields]) => (
            <div key={section} className="p-4 border rounded-md bg-gray-50">
              <h3 className="font-semibold text-lg mb-3">{section}</h3>
              <div className="grid grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field}>
                    <label className="text-xs font-semibold block mb-1">
                      {field.replace(/_/g, " ").toUpperCase()}
                      {REQUIRED_SET.has(field) && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    {field === "village_name" ? (
                      <select
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        disabled={!formData.project_id}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select Village</option>
                        {villages.map((v) => (
                          <option key={v.id} value={v.village_name}>
                            {v.village_name}
                          </option>
                        ))}
                      </select>
                    ) : field === "full_part" ? (
                      <select
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select Type</option>
                        <option value="Full">Full</option>
                        <option value="Part">Part</option>
                      </select>
                    ) : field === "displaced_affected_project" ? (
                      <select
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select Type</option>
                        <option value="PAF">Project Affected Families (PAF) </option>
                        <option value="PDF">Project Displaced Families (PDF) </option>
                      </select>
                    ) : field === "tribunal" ? (
                      <select
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : field === "family_with_orphan_members" ? (
                      <select
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                    ) : (
                      <input
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        // readOnly={
                        //   field === "la_case_file_no" ||
                        //   field === "village_code"
                        // }
                        type={
                          field.includes("date")
                            ? "date"
                            : FAMILY_MEMBER_FIELDS.has(field) ||
                                field.includes("area") ||
                                field.includes("acres") ||
                                field.includes("hectares")
                              ? "number"
                              : "text"
                        }
                        className="input input-bordered w-full"
                      />
                    )}

                    {errors[field] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="btn"
              onClick={() => navigate(`/${landType}/plots`)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save"}
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
    </main>
  );
};

export default PlotForm;
