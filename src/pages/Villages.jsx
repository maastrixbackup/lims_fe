import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../utils/config";
import { odishaDistricts } from "../utils/constants";
import VillageTable from "../pages/village/VillageTable";
import VillageFilter from "../pages/village/VillageFilter";
import VillageFormModal from "../pages/village/VillageFormModal";
import ConfirmDelete from "../shared/ConfirmDelete";

const Villages = () => {
  
  const { user, userToken: token } = useSelector((s) => s.auth);
  const { projects } = useSelector((s) => s.list);
  const role = user?.role_name;
  const isRestricted = role === "Data Entry User" || role === "Viewer";

  const [villages, setVillages] = useState([]);
  const [filter, setFilter] = useState({ project_id: "", district: "", tahasil: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVillage, setEditingVillage] = useState(null);

  const [deleteVillage, setDeleteVillage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const fetchVillages = async () => {
    try {
      const data = await api("/village/villageList");
      if (data.success) setVillages(data.villages || []);
    } catch (err) {
      console.error("Error fetching villages:", err);
    }
  };

  useEffect(() => {
    fetchVillages();
  }, []);

  const openModal = (v = null) => {
    setEditingVillage(v);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteVillage) return;
    try {
      const data = await api(`/village/deleteVillage/${deleteVillage.id}`, "DELETE");
      if (data.success) {
        alert("Village deleted successfully!");
        fetchVillages();
      } else {
        alert("Failed to delete village.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
    setIsDeleteModalOpen(false);
    setDeleteVillage(null);
  };

  const filteredVillages = villages.filter(
    (v) =>
      // (!filter.project_id || v.project_id === Number(filter.project_id)) &&
      (!filter.district || v.district === filter.district) &&
      (!filter.tahasil || v.tahasil?.toLowerCase().includes(filter.tahasil.toLowerCase()))
  );

  return (
    <div className="p-4 overflow-hidden">
      <header className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Villages List</h2>
        <button
          className={`btn btn-primary text-white ${
            isRestricted
              ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
              : ""
          }`}
          onClick={() => openModal()}
          disabled={isRestricted}
        >
          + Add Village
        </button>
      </header>

      <VillageFilter
        filter={filter}
        setFilter={setFilter}
        projects={projects}
        odishaDistricts={odishaDistricts}
        role={role}
      />

      <VillageTable
        villages={filteredVillages}
        projects={projects}
        isRestricted={isRestricted}
        onEdit={openModal}
        onDelete={(village) => {
          setDeleteVillage(village);
          setIsDeleteModalOpen(true);
        }}
      />

      {isModalOpen && (
        <VillageFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingVillage={editingVillage}
          projects={projects}
          odishaDistricts={odishaDistricts}
          api={api}
          fetchVillages={fetchVillages}
        />
      )}
      <ConfirmDelete
        isOpen={isDeleteModalOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete "${deleteVillage?.village_name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Villages;
