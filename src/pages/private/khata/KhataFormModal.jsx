import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { useLandTypeParam } from "../../../utils/landtypes";
import { apiClient } from "../../../utils/apiClient";

const KhataFormModal = ({ khata, onClose, token, villages, fetchKhatas }) => {
  const typeParam = useLandTypeParam();

  const typeLabel =
    typeParam === 2
      ? "Government Land"
      : typeParam === 3
      ? "Forest Land"
      : "Private Land";

  const selectedProject = useSelector((s) => s.selectedProject.project);
  const projects = useSelector((state) => state.list.projects || []);
  const [openVillage, setOpenVillage] = useState(false);
  // const [openProject, setOpenProject] = useState(false);

  // console.log('fgsdjfgsfh', projects)

  const [formData, setFormData] = useState({
    project_id: "",
    village_id: "",
    khata_no: "",
    type: typeParam,
  });

  const initializing = useRef(false);
  const userRole = useSelector((s) => s.auth.user?.role_name || "");
  const isRestricted = userRole === "Data Entry User";

  useEffect(() => {
    if (khata) {
      initializing.current = true;
      setFormData({
        project_id: khata.project_id,
        village_id: khata.village_id,
        khata_no: khata.khata_no || khata.number || "",
        type: khata.type || typeParam,
      });

      setTimeout(() => (initializing.current = false), 300);
    } else {
      setFormData({
        project_id: selectedProject?.id || "",
        village_id: "",
        khata_no: "",
        type: typeParam,
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
      [name]: name === "village_id" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = khata
        ? `/khata/updateKhata/${khata.id}`
        : `/khata/addKhata`;

      const method = khata ? "PUT" : "POST";

      const res = await apiClient(endpoint, {
        method,
        body: formData,
      });
      console.log("add khata", res);
      if (!res.success) {
        alert(res.message || "Failed to save khata");
        return;
      }

      await fetchKhatas();
      const toast = document.createElement("div");
      toast.textContent = khata
        ? "Khata updated successfully!"
        : "Khata added successfully!";
      toast.className =
        "fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-md shadow-md animate-fade-in";
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.classList.add("opacity-0", "transition-opacity", "duration-500");
        setTimeout(() => toast.remove(), 500);
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Error saving khata");
    }
  };
  return (
    <dialog open className="modal modal-open">
      <div className="modal-box relative">
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
          {/* <div>
            <label className="block text-sm font-medium mb-1">Project</label>
            <input
              type="text"
              className="input input-bordered w-full bg-gray-100 font-medium text-gray-700"
              value={
                selectedProject?.project_name ||
                selectedProject?.name ||
                "No Project Selected"
              }
              readOnly
            />
            <input type="hidden" name="project_id" value={formData.project_id} />
          </div> */}
          <div>
            <label className="block text-sm font-medium mb-1">Project</label>
            <select
              name="project_id"
              value={formData.project_id || ""}
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
          <div className="relative">
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

          <div>
            <label className="block text-sm font-medium mb-1">Khata No.</label>
            <input
              type="text"
              name="khata_no"
              value={formData.khata_no}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
              disabled={isRestricted}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Land Type</label>
            <input
              type="text"
              className="input input-bordered w-full bg-gray-100"
              value={typeLabel}
              readOnly
            />
          </div>

          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default KhataFormModal;
