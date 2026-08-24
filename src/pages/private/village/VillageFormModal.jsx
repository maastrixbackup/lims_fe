import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useLandTypeParam } from "../../../utils/landtypes";
import { useSelector } from "react-redux";
import { apiClient } from "../../../utils/apiClient";
import { useSuccessMessage } from "../../../hooks/useSuccessMessage";
import SuccessMessage from "../../../shared/SuccessMessage";

const VillageFormModal = ({
  isOpen,
  onClose,
  editingVillage,
  odishaDistricts,
  // api,
  fetchVillages,
}) => {
  const { projects } = useSelector((s) => s.list);
  const selectedProject = useSelector((s) => s.selectedProject.project);
  const typeParam = useLandTypeParam();
  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();

  const [formData, setFormData] = useState({
    project_id: "",
    village_name: "",
    district: "",
    tahasil: "",
    type: "",
    // village_code: "",
    thana_no: "",
    // multiplying_factor: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingVillage) {
      console.log("editingVillage data:", editingVillage);
      setFormData({
        project_id: editingVillage.project_id,
        village_name: editingVillage.village_name,
        district:
          odishaDistricts.find(
            (d) => d.toLowerCase() === editingVillage.district?.toLowerCase(),
          ) ||
          editingVillage.district ||
          "",
        tahasil: editingVillage.tahasil,
        type: editingVillage.type?.toString(),
        // village_code: editingVillage.village_code,
        thana_no: editingVillage.thana_name_no,
        // multiplying_factor: editingVillage.multiplying_factor || "",
      });
    } else {
      setFormData({
        project_id: selectedProject?.id || "",
        village_name: "",
        district: "",
        tahasil: "",
        type: typeParam.toString(),
        // village_code: "",
        thana_no: "",
        // multiplying_factor: "",
      });
    }
    setErrors({});
  }, [editingVillage, selectedProject, typeParam]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.project_id) newErrors.project_id = "Project is required.";
    if (!formData.district) newErrors.district = "District is required.";
    if (!formData.tahasil.trim()) newErrors.tahasil = "Tahasil is required.";

    if (!formData.village_name.trim())
      newErrors.village_name = "Village name is required.";
    else if (!/^[A-Za-z\s]+$/.test(formData.village_name))
      newErrors.village_name = "Village name should contain only letters.";

    // if (!formData.village_code.trim())
    //   newErrors.village_code = "Village code is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const endpoint = editingVillage
      ? `/village/updateVillage/${editingVillage.id}`
      : `/village/addVillage`;

    const method = editingVillage ? "PUT" : "POST";

    try {
      const data = await apiClient(endpoint, {
        method,
        body: formData,
      });

      if (data?.success) {
        showSuccess(
          data.message ||
            (editingVillage
              ? "Village updated successfully!"
              : "Village added successfully!"),
        );

        fetchVillages();

        setTimeout(() => {
          closeModal();
          onClose();
        }, 800);
      } else {
        showError(data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.log(error);
      showError("Failed to save village. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog open className="modal modal-open">
      <div
        className="modal-box max-w-2xl max-h-130 relative"
        style={{ scrollbarWidth: "thin" }}
      >
        <button className="absolute right-3 top-3" onClick={onClose}>
          <X size={20} />
        </button>

        <h3 className="font-bold text-lg mb-4">
          {editingVillage ? "Edit Village" : "Add Village"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Project Name
            </label>
            <select
              name="project_id"
              value={formData.project_id || ""}
              onChange={(e) =>
                setFormData({ ...formData, project_id: e.target.value })
              }
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
            value={
              typeParam === 1
                ? "Private Land"
                : typeParam === 2
                  ? "Government Land"
                  : "Forest Land"
            }
            className="input input-bordered w-full bg-gray-100"
            readOnly
          />
          <input type="hidden" name="type" value={formData.type} />

          {/* Village Code */}
          {/* <label>Village Code</label>
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
            )} */}
          <label>Thana Name/No</label>
          <input
            type="text"
            name="thana_no"
            value={formData.thana_no}
            onChange={(e) =>
              setFormData({ ...formData, thana_no: e.target.value })
            }
            className={`input input-bordered w-full ${
              errors.thana_no ? "border-red-500" : ""
            }`}
            placeholder="Enter Thana Name/ No"
          />
          {errors.thana_no && (
            <p className="text-red-500 text-sm">{errors.thana_no}</p>
          )}

          {/* {editingVillage && (
              <>
                <label>Multiplying Factor</label>
                <input
                  type="text"
                  name="multiplying_factor"
                  value={formData.multiplying_factor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      multiplying_factor: e.target.value,
                    })
                  }
                  className="input input-bordered w-full"
                  placeholder="Enter Multiplying Factor"
                />
              </>
            )} */}

          <div className="modal-action">
            <button
              className="btn btn-error text-white"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
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

export default VillageFormModal;
