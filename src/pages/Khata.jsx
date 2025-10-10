// src/pages/Khata.jsx
import React, { useState } from "react";
import { Pencil, Trash2, Upload, Map as MapIcon, X } from "lucide-react";
import { documentList } from "../utils/constants";

const Khata = () => {
  const projects = [{ id: 1, name: "GMDC - Baitarani-West Coal Block" }];

  const villages = [
    {
      id: 1,
      name: "Chhendipada Jangal",
      project: "GMDC - Baitarani-West Coal Block",
    },
    { id: 2, name: "Handigora", project: "GMDC - Baitarani-West Coal Block" },
  ];

  const [khatas, setKhatas] = useState([
    {
      id: 1,
      project: "GMDC - Baitarani-West Coal Block",
      village: "Chhendipada Jangal",
      number: "348",
      created: "2025-02-01",
    },
    {
      id: 2,
      project: "GMDC - Baitarani-West Coal Block",
      village: "Handigora",
      number: "789/111",
      created: "2025-02-02",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKhata, setEditingKhata] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    project: "",
    village: "",
    number: "",
    created: new Date().toISOString().split("T")[0],
  });

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedKhata, setSelectedKhata] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState(documentList); // { khataId: [{ name, url }] }

  // Filters
  const [filterProject, setFilterProject] = useState("");
  const [filterVillage, setFilterVillage] = useState("");

  const filteredKhatas = khatas.filter(
    (k) =>
      (filterProject ? k.project === filterProject : true) &&
      (filterVillage ? k.village === filterVillage : true)
  );

  // Open Add/Edit Modal
  const openModal = (khata = null) => {
    if (khata) {
      setEditingKhata(khata);
      setFormData(khata);
    } else {
      setEditingKhata(null);
      setFormData({
        project: "",
        village: "",
        number: "",
        created: new Date().toISOString().split("T")[0],
      });
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Save khata
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingKhata) {
      setKhatas(
        khatas.map((k) =>
          k.id === editingKhata.id ? { ...formData, id: k.id } : k
        )
      );
    } else {
      setKhatas([...khatas, { ...formData, id: khatas.length + 1 }]);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    setKhatas(khatas.filter((k) => k.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  };

  // Upload modal handlers
  const openUploadModal = (khata) => {
    setSelectedKhata(khata);
    setUploadModalOpen(true);
  };

  const openMapModal = (khata) => {
    setSelectedKhata(khata);
    setMapModalOpen(true);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    const newDocs = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setUploadedDocs((prev) => [...newDocs, ...prev]); // prepend new uploads
    e.target.value = "";
  };

  return (
    <div>
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Top Row */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Khata List</h2>
          <button className="btn btn-primary" onClick={() => openModal()}>
            + Add Khata
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-4">
          {/* Project Filter */}
          <select
            value={filterProject}
            onChange={(e) => {
              setFilterProject(e.target.value);
              setFilterVillage(""); // reset village when project changes
            }}
            className="select select-bordered w-48"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Village Filter */}
          <select
            value={filterVillage}
            onChange={(e) => setFilterVillage(e.target.value)}
            className="select select-bordered w-48"
            disabled={!filterProject} // only allow village selection if project is selected
          >
            <option value="">All Villages</option>
            {villages
              .filter((v) => (filterProject ? v.project === filterProject : true))
              .map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name}
                </option>
              ))}
          </select>
        </div>

        {/* Khata Table */}
        <div className="card bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="w-12">#</th>
                  <th>Project</th>
                  <th>Village</th>
                  <th>Khata No.</th>
                  <th>Created</th>
                  <th className="text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredKhatas.length > 0 ? (
                  filteredKhatas.map((khata, idx) => (
                    <tr
                      key={khata.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="font-medium">{idx + 1}</td>
                      <td>{khata.project}</td>
                      <td>{khata.village}</td>
                      <td>{khata.number}</td>
                      <td className="text-gray-500">{khata.created}</td>
                      <td className="text-right">
                        <div className="flex space-x-2 justify-end">
                          <button
                            className="btn btn-xs btn-warning text-white"
                            onClick={() => openModal(khata)}
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            className="btn btn-xs btn-error text-white"
                            onClick={() => setDeleteConfirm(khata)}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                          <button
                            className="btn btn-xs btn-info text-white"
                            onClick={() => openUploadModal(khata)}
                          >
                            <Upload size={14} /> Upload
                          </button>
                          <button
                            className="btn btn-xs btn-success text-white"
                            onClick={() => openMapModal(khata)}
                          >
                            <MapIcon size={14} /> Maps
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-500">
                      No khatas found.
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
              <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h3 className="font-bold text-lg mb-4">
              {editingKhata ? "Edit Khata" : "Add Khata"}
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

              {/* Village */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Village
                </label>
                <select
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  
                >
                  <option value="">Select Village</option>
                  {villages
                    .filter((v) => v.project === formData.project)
                    .map((v) => (
                      <option key={v.id} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Khata No */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Khata No.
                </label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
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
              <span className="font-semibold">{deleteConfirm.number}</span>?
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

      {/* Upload Modal */}
      {uploadModalOpen && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg mb-4">
              Upload Documents for Khata {selectedKhata?.number}
            </h3>

            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileUpload}
              className="file-input file-input-bordered w-full mb-4"
            />

            <h4 className="font-semibold mb-3">Uploaded Files:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
              {uploadedDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border shadow-sm bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="font-medium text-sm truncate ">
                      {doc.name}
                    </span>
                  </div>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-xs btn-outline btn-primary"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setUploadModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Map Modal */}
      {mapModalOpen && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-xl">
            <h3 className="font-bold text-lg mb-4">
              Maps for Khata {selectedKhata?.number}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 rounded-xl border shadow-sm bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="font-medium text-sm truncate ">2084</span>
                </div>
                <a
                  href={`${window.location.origin}/2084.kmz`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-xs btn-outline btn-primary"
                >
                  View in google earth
                </a>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border shadow-sm bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="font-medium text-sm truncate ">2088</span>
                </div>
                <a
                  href="/2088.kmz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-xs btn-outline btn-primary"
                >
                  View in google earth
                </a>
              </div>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setMapModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Khata;
