import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { odishaDistricts } from "../../../utils/constants";
import VillageTable from "./VillageTable";
import VillageFilter from "./VillageFilter";
import VillageFormModal from "./VillageFormModal";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import Loader from "../../../shared/Loader";
import { useLandTypeParam } from "../../../utils/landtypes";
import ExportButtons from "../../../shared/ExportButtons";
import { apiClient } from "../../../utils/apiClient";

const Villages = () => {
  const { user, userToken: token } = useSelector((s) => s.auth);
  const { projects } = useSelector((s) => s.list);
  const selectedProject = useSelector((state) => state.selectedProject.project);
  const role = user?.role_name;
  const canEdit = role !== "Viewer"; // users that can add/edit/delete

  const { landType } = useParams();
  const typeParam = useLandTypeParam();

  const [villages, setVillages] = useState([]);
  const [formData, setFormData] = useState({
    project_id: "",
    districts: [],
    tahasils: [],
    villageNames: [],
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVillage, setEditingVillage] = useState(null);
  const [deleteVillage, setDeleteVillage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Extract unique tahasils from current villages (for filter dropdown)
  const tahasils = useMemo(() => {
    return [...new Set(villages.map((v) => v.tahasil).filter(Boolean))];
  }, [villages]);

  // Normalize incoming village objects to a consistent shape
  const normalizeVillages = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((v) => ({
      id: v.id ?? v.village_id ?? v.uid,
      village_name: v.village_name ?? v.name ?? v.village,
      district: v.district ?? v.dist ?? v.district_name ?? "",
      tahasil: v.tahasil ?? v.taluka ?? v.tahasil_name ?? "",
      project_id: v.project_id ?? v.project ?? v.projectId ?? "",
      project_name: v.project_name ?? v.project_name ?? "",
      ...v,
    }));
  };

  // Fetch villages from API: ONLY project_id + type + pagination
  const fetchVillages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (selectedProject?.id) params.append("project_id", selectedProject.id);

      if (typeParam) params.append("type", typeParam);

      params.append("page", page);
      params.append("limit", limit);

      const url = `/village/villageList?${params.toString()}`;
      const data = await apiClient(url, "GET");
      console.log("Fetched villages:", data);

      if (data && data.success) {
        setVillages(normalizeVillages(data.villages || []));
        setTotalPages(data.totalPages ?? data.total_pages ?? 1);
      } else {
        setVillages([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching villages:", err);
      setVillages([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // fetch when selected project, type, page or limit changes
  useEffect(() => {
    // reset to page 1 when project or type changes
    setPage(1);
  }, [selectedProject?.id, typeParam]);

  useEffect(() => {
    // Only attempt to fetch if a project is selected
    if (!selectedProject?.id) {
      setVillages([]);
      setTotalPages(1);
      return;
    }
    fetchVillages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject?.id, typeParam, page, limit]);

  const openModal = (v = null) => {
    setEditingVillage(v);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteVillage) return;
    try {
      const data = await apiClient(`/village/deleteVillage/${deleteVillage.id}`, "DELETE");
      if (data && data.success) {
        // you could use a toast instead of alert in real app
        alert("Village deleted successfully!");
        // refetch current page
        fetchVillages();
      } else {
        alert(data?.message || "Failed to delete village.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting the village.");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteVillage(null);
    }
  };

  // Client-side filters: district, tahasil, village name
  const filteredVillages = useMemo(() => {
    if (!Array.isArray(villages)) return [];

    return villages.filter((v) => {
      const matchDistrict =
        formData.districts.length === 0 || formData.districts.includes(v.district);

      const matchTahasil =
        formData.tahasils.length === 0 || formData.tahasils.includes(v.tahasil);

      const matchVillage =
        formData.villageNames.length === 0 || formData.villageNames.includes(v.village_name);

      return matchDistrict && matchTahasil && matchVillage;
    });
  }, [villages, formData]);

  // Export data should use the client-filtered list (already scoped to selected project)
  const projectFilteredData = filteredVillages;

  return (
    <div className="space-y-5 h-screen">
      <h2 className="text-lg font-semibold capitalize">
        {landType?.replace("-", " ") || "Private"} Villages
      </h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex justify-end items-center mb-4">
            <div className="flex items-center gap-3">
              <ExportButtons
                data={projectFilteredData}
                fileName="villages"
                columns={[
                  { label: "ID", key: "id" },
                  { label: "Project Name", key: "project_name" },
                  { label: "Village", key: "village_name" },
                  { label: "District", key: "district" },
                  { label: "Tahasil", key: "tahasil" },
                  { label: "Type", key: "type" },
                  { label: "Village Code", key: "village_code" },
                ]}
              />

              <button
                className={`btn btn-primary text-white ${
                  !canEdit
                    ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                    : ""
                }`}
                onClick={() => { if (canEdit) openModal(); }}
                disabled={!canEdit}
              >
                Add Village
              </button>
            </div>
          </div>

          <VillageFilter
            formData={formData}
            setFormData={setFormData}
            odishaDistricts={odishaDistricts}
            tahasils={tahasils}
            villages={villages}
          />

          <motion.div
            key={landType}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <VillageTable
              villages={filteredVillages}
              projects={projects}
              isRestricted={!canEdit}
              onEdit={openModal}
              onDelete={(village) => {
                setDeleteVillage(village);
                setIsDeleteModalOpen(true);
              }}
              landType={landType}
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
              totalPages={totalPages}
            />
          </motion.div>
        </>
      )}

      {isModalOpen && (
        <VillageFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingVillage={editingVillage}
          projects={projects}
          odishaDistricts={odishaDistricts}
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
