import React, { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";

const VillageFormModal = ({
  isOpen,
  onClose,
  editingVillage,
  projects,
  odishaDistricts,
  api,
  fetchVillages,
}) => {
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

  useEffect(() => {
    if (editingVillage) {
      setFormData({
        project_id: editingVillage.project_id,
        village_name: editingVillage.village_name,
        district: editingVillage.district,
        tahasil: editingVillage.tahasil,
        type: editingVillage.type?.toString() || "",
        village_code: editingVillage.village_code,
      });
    } else {
      setFormData({
        project_id: "",
        village_name: "",
        district: "",
        tahasil: "",
        type: "",
        village_code: "",
      });
    }
    setErrors({});
  }, [editingVillage]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.project_id) newErrors.project_id = "Project is required.";
    if (!formData.district) newErrors.district = "District is required.";
    if (!formData.tahasil.trim()) newErrors.tahasil = "Tahasil is required.";
    if (!formData.village_name.trim())
      newErrors.village_name = "Village name is required.";
    else if (!/^[A-Za-z\s]+$/.test(formData.village_name))
      newErrors.village_name = "Village name should contain only letters.";
    if (!formData.type) newErrors.type = "Type is required.";
    if (!formData.village_code.trim())
      newErrors.village_code = "Village code is required.";
    // else if (!/^[A-Za-z0-9\s-]+$/.test(formData.village_code))
    //   newErrors.village_code = "Village code must be numeric.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      setSuccessMessage(
        data.message || "Something went wrong. Please try again."
      );
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
            <label>Project Name</label>
            <select
              name="project_id"
              value={formData.project_id}
              onChange={(e) =>
                setFormData({ ...formData, project_id: e.target.value })
              }
              className={`select select-bordered w-full ${
                errors.project_id ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.project_id && (
              <p className="text-red-500 text-sm">{errors.project_id}</p>
            )}

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
                <option key={d}>{d}</option>
              ))}
            </select>
            {errors.district && (
              <p className="text-red-500 text-sm">{errors.district}</p>
            )}

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

            <label>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className={`select select-bordered w-full ${
                errors.type ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Type</option>
              <option value="1">Pvt land</option>
              <option value="2">Govt land</option>
              <option value="3">Forest land</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type}</p>
            )}

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
