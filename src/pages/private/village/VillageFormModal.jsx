import React, { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";
import { useLandTypeParam } from "../../../utils/landtypes";
import { useSelector } from "react-redux";

const VillageFormModal = ({
  isOpen,
  onClose,
  editingVillage,
  odishaDistricts,
  api,
  fetchVillages,
}) => {
  const { projects } = useSelector((s) => s.list);
  const selectedProject = useSelector((s) => s.selectedProject.project);
  const typeParam = useLandTypeParam();

  const [formData, setFormData] = useState({
    project_id: "",
    village_name: "",
    district: "",
    tahasil: "",
    type: "",
    village_code: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ⭐ When editing OR adding new, update form values
  useEffect(() => {
    if (editingVillage) {
      setFormData({
        project_id: editingVillage.project_id,
        village_name: editingVillage.village_name,
        district: editingVillage.district,
        tahasil: editingVillage.tahasil,
        type: editingVillage.type?.toString(),
        village_code: editingVillage.village_code,
      });
    } else {
      setFormData({
        project_id: selectedProject?.id || "",
        village_name: "",
        district: "",
        tahasil: "",
        type: typeParam.toString(),
        village_code: "",
      });
    }
    setErrors({});
  }, [editingVillage, selectedProject, typeParam]);

  // ⭐ Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.project_id) newErrors.project_id = "Project is required.";
    if (!formData.district) newErrors.district = "District is required.";
    if (!formData.tahasil.trim()) newErrors.tahasil = "Tahasil is required.";

    if (!formData.village_name.trim())
      newErrors.village_name = "Village name is required.";
    else if (!/^[A-Za-z\s]+$/.test(formData.village_name))
      newErrors.village_name = "Village name should contain only letters.";

    if (!formData.village_code.trim())
      newErrors.village_code = "Village code is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ⭐ Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const url = editingVillage
      ? `/village/updateVillage/${editingVillage.id}`
      : `/village/addVillage`;

    const method = editingVillage ? "PUT" : "POST";

    const data = await api(url, method, formData);
    setLoading(false);

    if (data.success) {
      setSuccessMessage(
        editingVillage
          ? "Village updated successfully!"
          : "Village added successfully!"
      );

      fetchVillages();

      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1500);
    } else {
      setSuccessMessage(data.message || "Something went wrong.");
    }
  };

  if (!isOpen) return null;

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box relative">
        <button className="absolute right-3 top-3" onClick={onClose}>
          <X size={20} />
        </button>

        <h3 className="font-bold text-lg mb-4">
          {editingVillage ? "Edit Village" : "Add Village"}
        </h3>

        {successMessage ? (
          <div className="flex flex-col items-center justify-center text-center space-y-3 py-6">
            <CheckCircle className="text-green-500 w-12 h-12" />
            <p className="text-lg font-semibold text-green-600">
              {successMessage}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Project Name */}
            <label>Project Name</label>
            <input
              // disabled
              className="input input-bordered w-full bg-gray-100 font-medium text-gray-700"
              value={
                selectedProject
                  ? selectedProject.project_name || selectedProject.name
                  : "Select Project"
              }
            />
            {/* Hidden actual value */}
            <input type="hidden" value={formData.project_id} />

            {/* District */}
            <label>District</label>
            <select
              name="district"
              value={formData.district}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value })
              }
              className={`select select-bordered w-full ${
                errors.district ? "border-red-500" : ""
              }`}
            >
              <option value="">Select District</option>
              {odishaDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.district && (
              <p className="text-red-500 text-sm">{errors.district}</p>
            )}

            {/* Tahasil */}
            <label>Tahasil</label>
            <input
              type="text"
              name="tahasil"
              value={formData.tahasil}
              onChange={(e) =>
                setFormData({ ...formData, tahasil: e.target.value })
              }
              className={`input input-bordered w-full ${
                errors.tahasil ? "border-red-500" : ""
              }`}
              placeholder="Enter Tahasil"
            />
            {errors.tahasil && (
              <p className="text-red-500 text-sm">{errors.tahasil}</p>
            )}

            {/* Village Name */}
            <label>Village Name</label>
            <input
              type="text"
              name="village_name"
              value={formData.village_name}
              onChange={(e) =>
                setFormData({ ...formData, village_name: e.target.value })
              }
              className={`input input-bordered w-full ${
                errors.village_name ? "border-red-500" : ""
              }`}
              placeholder="Enter Village Name"
            />
            {errors.village_name && (
              <p className="text-red-500 text-sm">{errors.village_name}</p>
            )}

            {/* Land Type */}
            <label>Land Type</label>
            <input
              type="text"
              // disabled
              value={
                typeParam === 1
                  ? "Private Land"
                  : typeParam === 2
                  ? "Government Land"
                  : "Forest Land"
              }
              className="input input-bordered w-full bg-gray-100"
            />
            <input type="hidden" name="type" value={formData.type} />

            {/* Village Code */}
            <label>Village Code</label>
            <input
              type="text"
              name="village_code"
              value={formData.village_code}
              onChange={(e) =>
                setFormData({ ...formData, village_code: e.target.value })
              }
              className={`input input-bordered w-full ${
                errors.village_code ? "border-red-500" : ""
              }`}
              placeholder="Enter Village Code"
            />
            {errors.village_code && (
              <p className="text-red-500 text-sm">{errors.village_code}</p>
            )}

            <div className="modal-action">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? editingVillage
                    ? "Updating..."
                    : "Saving..."
                  : editingVillage
                  ? "Update"
                  : "Save"}
              </button>

              <button className="btn" type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
};

export default VillageFormModal;
