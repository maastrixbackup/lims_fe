import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { odishaDistricts } from "../utils/constants";

const Villages = () => {
  const projects = [{ id: 1, name: "GMDC - Baitarani-West Coal Block" }];

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

  // Filter state
  const [filter, setFilter] = useState({
    project: "",
    district: "",
    tahasil: "",
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

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

  // Filtered villages
  const filteredVillages = villages.filter((v) => {
    return (
      (filter.project === "" || v.project === filter.project) &&
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

        <div className="card bg-white shadow-lg rounded-2xl p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Project Filter */}
            <select
              name="project"
              value={filter.project}
              onChange={handleFilterChange}
              className="select select-bordered w-full"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* District Filter */}
            <select
              name="district"
              value={filter.district}
              onChange={handleFilterChange}
              className="select select-bordered w-full"
            >
              <option value="">All Districts</option>
              {odishaDistricts.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Tahasil Filter */}
            <select
              name="tahasil"
              value={filter.tahasil}
              onChange={handleFilterChange}
              className="select select-bordered w-full"
            >
              <option value="">All Tahasils</option>
              {[...new Set(villages.map((v) => v.tahasil))].map(
                (tahasil, i) => (
                  <option key={i} value={tahasil}>
                    {tahasil}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

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
                {filteredVillages.length > 0 ? (
                  filteredVillages.map((village, idx) => (
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
                      No villages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <dialog data-theme="light" open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {editingVillage ? "Edit Village" : "Add Village"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
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
