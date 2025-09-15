import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Pencil, Trash2 } from "lucide-react";
import { odishaDistricts } from "../utils/constants";

const Villages = () => {
  // Example projects to pick from
  const projects = [{ id: 1, name: "GMDC - Baitarani-West Coal Block" }];

  // Odisha districts

  const [villages, setVillages] = useState([
    {
      id: 1,
      project: "GMDC - Baitarani-West Coal Block",
      name: "Chhendipada Jangal",
      district: "Angul",
      tahasil: "Tahasil X",
      created: "2025-01-10",
    },
    {
      id: 2,
      project: "GMDC - Baitarani-West Coal Block",
      name: "Handigora",
      district: "Balangir",
      tahasil: "Tahasil Y",
      created: "2025-01-11",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVillage, setEditingVillage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    project: "",
    name: "",
    district: "",
    tahasil: "",
    created: new Date().toISOString().split("T")[0],
  });

  // Open modal for add/edit
  const openModal = (village = null) => {
    if (village) {
      setEditingVillage(village);
      setFormData(village);
    } else {
      setEditingVillage(null);
      setFormData({
        project: "",
        name: "",
        district: "",
        tahasil: "",
        created: new Date().toISOString().split("T")[0],
      });
    }
    setIsModalOpen(true);
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save village
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingVillage) {
      setVillages(
        villages.map((v) =>
          v.id === editingVillage.id ? { ...formData, id: v.id } : v
        )
      );
    } else {
      setVillages([...villages, { ...formData, id: villages.length + 1 }]);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    setVillages(villages.filter((v) => v.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  };

  return (
    <div>
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Top Row with Button aligned to Table */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Villages List</h2>
          <button className="btn btn-primary" onClick={() => openModal()}>
            + Add Village
          </button>
        </div>

        {/* Villages Table */}
        <div className="card bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="w-12">#</th>
                  <th>Project</th>
                  <th>Village Name</th>
                  <th>District</th>
                  <th>Tahasil</th>
                  <th>Created</th>
                  <th className="text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {villages.length > 0 ? (
                  villages.map((village, idx) => (
                    <tr
                      key={village.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="font-medium">{idx + 1}</td>
                      <td>{village.project}</td>
                      <td>{village.name}</td>
                      <td>{village.district}</td>
                      <td>{village.tahasil}</td>
                      <td className="text-gray-500">{village.created}</td>
                      <td className="text-right space-x-2">
                        <button
                          className="btn btn-xs btn-warning text-white"
                          onClick={() => openModal(village)}
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          className="btn btn-xs btn-error text-white"
                          onClick={() => setDeleteConfirm(village)}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      No villages found. Click{" "}
                      <span className="font-semibold">+ Add Village</span> to
                      create one.
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
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {editingVillage ? "Edit Village" : "Add Village"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Project */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Project
                </label>
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
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

              {/* Tahasil */}
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
              {/* Village Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Village Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteConfirm.name}</span>?
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
