import React, { useState, useEffect } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { useSelector } from "react-redux";
import { odishaDistricts } from "../utils/constants";
import { API_BASE_URL } from "../utils/config";
import moment from "moment";

const Villages = () => {
  const { user, userToken: token } = useSelector((s) => s.auth);
  const accessedProjects = useSelector((s) => s.auth.accessed_projects || []);
  const role = user?.role_name;
  const { projects, villages } = useSelector((s) => s.list);
  // console.log('accessed_project', accessedProjects)
  console.log('namesss',projects)
  console.log('namesss', villages)
  // only Super Admin can add/edit/delete
  const isRestricted = role === "Admin" || role === "Client";
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
  const [editingVillage, setEditingVillage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // generic API helper
  const api = async (url, method = "GET", body) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      ...(body && { body: JSON.stringify(body) }),
    });
    return res.json();
  };

  // open add/edit modal
  const openModal = (v = null) => {
    setEditingVillage(v);
    setFormData(
      v
        ? {
            project_id: v.project_id,
            village_name: v.village_name,
            district: v.district,
            tahasil: v.tahasil,
          }
        : { project_id: "", village_name: "", district: "", tahasil: "" }
    );
    setIsModalOpen(true);
  };

  // submit form (add/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingVillage
      ? `/village/updateVillage/${editingVillage.id}`
      : `/village/addVillage`;
    const method = editingVillage ? "PUT" : "POST";

    const data = await api(url, method, formData);
    alert(data.message || (editingVillage ? "Village updated" : "Village added"));

    if (data.success) {
      setIsModalOpen(false);
      fetchVillages();
    }
  };

  // confirm delete
  const confirmDelete = async () => {
    const data = await api(`/village/deleteVillage/${deleteConfirm.id}`, "DELETE");
    if (data.success) {
      alert("Village deleted successfully!");
      fetchVillages();
    }
    setDeleteConfirm(null);
  };

  // filtering
  const filteredVillages = villages.filter(
    (v) =>
      (!filter.project_id || v.project_id === Number(filter.project_id)) &&
      (!filter.district || v.district === filter.district) &&
      (!filter.tahasil ||
        v.tahasil.toLowerCase().includes(filter.tahasil.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Villages List</h2>
        <button
          className={`btn btn-primary text-white ${
            isRestricted
              ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
              : ""
          }`}
          disabled={isRestricted}
          onClick={() => openModal()}
        >
          + Add Village
        </button>
      </header>

      {/* Filters */}
      <div className="card bg-white shadow-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          name="project_id"
          value={filter.project_name}
          onChange={(e) => setFilter({ ...filter, project_id: e.target.value })}
          className="select select-bordered"
        >
          {/* Super Admin sees "All Projects" option */}
          {role === "Super Admin" && <option value="">All Projects</option>}
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.project_name}
            </option>
          ))}
        </select>

        <select
          name="district"
          value={filter.district}
          onChange={(e) => setFilter({ ...filter, district: e.target.value })}
          className="select select-bordered"
        >
          <option value="">All Districts</option>
          {odishaDistricts.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <input
          type="text"
          name="tahasil"
          value={filter.tahasil}
          onChange={(e) => setFilter({ ...filter, tahasil: e.target.value })}
          placeholder="Search Tahasil"
          className="input input-bordered"
        />
      </div>

      {/* Table */}
      <div className="card bg-white shadow-lg overflow-hidden">
        <table className="table w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th>#</th>
              <th>Project</th>
              <th>Village</th>
              <th>District</th>
              <th>Tahasil</th>
              <th>Date</th>
              <th className="text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVillages.length ? (
              filteredVillages.map((v, i) => (
                <tr key={v.id} className="hover:bg-gray-50 whitespace-nowrap">
                  <td>{i + 1}</td>
                  <td>
                    {projects.find((p) => p.id === v.project_id)?.project_name ||
                      "N/A"}
                  </td>
                  <td>{v.village_name}</td>
                  <td>{v.district}</td>
                  <td>{v.tahasil}</td>
                  <td>{moment(v.created_at).format("DD-MM-YYYY")}</td>
                  <td className="text-right space-x-2">
                    <button
                      className={`btn btn-xs btn-warning text-white ${
                        isRestricted
                          ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => openModal(v)}
                      disabled={isRestricted}
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      className={`btn btn-xs btn-error text-white ${
                        isRestricted
                          ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => setDeleteConfirm(v)}
                      disabled={isRestricted}
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <dialog open className="modal modal-open">
          <div className="modal-box relative">
            <button
              className="absolute right-3 top-3"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h3 className="font-bold text-lg mb-4">
              {editingVillage ? "Edit Village" : "Add Village"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              {["project_id", "district", "tahasil", "village_name"].map((f) => (
                <div key={f}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {f.replace("_", " ")}
                  </label>
                  {f === "district" ? (
                    <select
                      name="district"
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="">Select District</option>
                      {odishaDistricts.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  ) : f === "project_id" ? (
                    <select
                      name="project_id"
                      value={formData.project_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          project_id: e.target.value,
                        })
                      }
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
                  ) : (
                    <input
                      type="text"
                      name={f}
                      value={formData[f]}
                      onChange={(e) =>
                        setFormData({ ...formData, [f]: e.target.value })
                      }
                      className="input input-bordered w-full"
                      required
                    />
                  )}
                </div>
              ))}

              <div className="modal-action">
                <button className="btn btn-primary" type="submit">
                  Save
                </button>
                <button
                  className="btn"
                  onClick={() => setIsModalOpen(false)}
                  type="button"
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
              <b>{deleteConfirm.village_name}</b>?
            </p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button
                className="btn"
                onClick={() => setDeleteConfirm(null)}
                type="button"
              >
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
