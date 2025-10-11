import React, { useState, useEffect } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { useSelector } from "react-redux";
import { odishaDistricts } from "../utils/constants";
import { API_BASE_URL } from "../utils/config"; 

const Villages = () => {
  const token = useSelector((state) => state.auth?.userToken); 
  const [villages, setVillages] = useState([]);
  const [projects, setProjects] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVillage, setEditingVillage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    project_id: "",
    village_name: "",
    district: "",
    tahasil: "",
  });

  const [filter, setFilter] = useState({
    project_id: "",
    district: "",
    tahasil: "",
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/project/projectList`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())

      .then((data) => {
        if (data.success) {
          setProjects(data.projects || []);
        }
        console.log("Projects data:", data);
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, [token]);

  const fetchVillages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/village/villageList`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) setVillages(data.villages || []);
    } catch (err) {
      console.error("Error fetching villages:", err);
    }
  };

  useEffect(() => {
    fetchVillages();
  }, [token]);
  const openModal = (village = null) => {
    if (village) {
      setEditingVillage(village);
      setFormData({
        project_id: village.project_id,
        village_name: village.village_name,
        district: village.district,
        tahasil: village.tahasil,
      });
    } else {
      setEditingVillage(null);
      setFormData({
        project_id: "",
        village_name: "",
        district: "",
        tahasil: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const isEditing = !!editingVillage;
  const url = isEditing
    ? `${API_BASE_URL}/village/updateVillage/${editingVillage.id}`
    : `${API_BASE_URL}/village/addVillage`;
  const method = isEditing ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("Village response:", data);

    if (data.success) {
      alert(isEditing ? "Village updated successfully!" : "Village added successfully!");
      setIsModalOpen(false);
      fetchVillages();
    } else {
      alert(data.message || `Failed to ${isEditing ? "update" : "add"} village`);
    }
  } catch (err) {
    console.error(`Error ${isEditing ? "updating" : "adding"} village:`, err);
    alert("Something went wrong!");
  }
};

  const confirmDelete = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/village/deleteVillage/${deleteConfirm.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Village deleted successfully!");
        fetchVillages();
      }
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting village:", err);
    }
  };

  // ✅ Filtered list
  const filteredVillages = villages.filter((v) => {
    return (
      (filter.project_id === "" ||
        v.project_id === Number(filter.project_id)) &&
      (filter.district === "" || v.district === filter.district) &&
      (filter.tahasil === "" ||
        v.tahasil.toLowerCase().includes(filter.tahasil.toLowerCase()))
    );
  });

  return (
    <div>
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Villages List</h2>
          <button className="btn btn-primary" onClick={() => openModal()}>
            + Add Village
          </button>
        </div>

        {/* Filters */}
        <div className="card bg-white shadow-lg rounded-2xl p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              name="project_id"
              value={filter.project_id}
              onChange={(e) =>
                setFilter({ ...filter, project_id: e.target.value })
              }
              className="select select-bordered w-full"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.project_name}
                </option>
              ))}
            </select>

            <select
              name="district"
              value={filter.district}
              onChange={(e) =>
                setFilter({ ...filter, district: e.target.value })
              }
              className="select select-bordered w-full"
            >
              <option value="">All Districts</option>
              {odishaDistricts.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="tahasil"
              value={filter.tahasil}
              onChange={(e) =>
                setFilter({ ...filter, tahasil: e.target.value })
              }
              placeholder="Search Tahasil"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Table */}
        <div className="card bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th>#</th>
                  <th>Project</th>
                  <th>Village Name</th>
                  <th>District</th>
                  <th>Tahasil</th>
                  <th className="text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVillages.length > 0 ? (
                  filteredVillages.map((v, idx) => (
                    <tr
                      key={v.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td>{idx + 1}</td>
                      <td>
                        {projects.find((p) => p.id === v.project_id)
                          ?.project_name || "N/A"}
                      </td>

                      <td>{v.village_name}</td>
                      <td>{v.district}</td>
                      <td>{v.tahasil}</td>
                      <td className="text-right space-x-2">
                        <button
                          className="btn btn-xs btn-warning text-white"
                          onClick={() => openModal(v)}
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          className="btn btn-xs btn-error text-white"
                          onClick={() => setDeleteConfirm(v)}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No villages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <dialog open className="modal modal-open">
          <div className="modal-box relative">
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>

            <h3 className="font-bold text-lg mb-4">
              {editingVillage ? "Edit Village" : "Add Village"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Project
                </label>
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
                      {p.project_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  District
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select District</option>
                  {odishaDistricts.map((d, i) => (
                    <option key={i} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Tahasil
                </label>
                <input
                  type="text"
                  name="tahasil"
                  value={formData.tahasil}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Village Name
                </label>
                <input
                  type="text"
                  name="village_name"
                  value={formData.village_name}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="modal-action">
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
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {deleteConfirm.village_name}
              </span>
              ?
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
    </div>
  );
};

export default Villages;
