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
import SuccessMessage from "../../../shared/SuccessMessage";
import { useSuccessMessage } from "../../../hooks/useSuccessMessage";

const Villages = () => {
  const { user, userToken: token } = useSelector((s) => s.auth);
  const { projects } = useSelector((s) => s.list);
  const selectedProject = useSelector((state) => state.selectedProject.project);
  const role = user?.role_name;
  const canEdit = role !== "Viewer"; // users that can add/edit/delete
 const { modal, showSuccess, showError, closeModal } = useSuccessMessage();
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

  const tahasils = useMemo(() => {
    return [...new Set(villages.map((v) => v.tahasil).filter(Boolean))];
  }, [villages]);

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
      showError(err.message || "Error fetching villages:", );
      setVillages([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [selectedProject?.id, typeParam]);

  useEffect(() => {
    if (!selectedProject?.id) {
      setVillages([]);
      setTotalPages(1);
      return;
    }
    fetchVillages();
  }, [selectedProject?.id, typeParam, page, limit]);

  const openModal = (v = null) => {
    setEditingVillage(v);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteVillage) return;
    try {
      const data = await apiClient(
        `/village/deleteVillage/${deleteVillage.id} `,{
        method: "DELETE",
      },
     
      );
      if (data && data.success) {
       showSuccess( data.message || "Village Deleted Successfully")
        fetchVillages();
      } else {
        showError(data?.message || "Failed to delete village.");
      }
    } catch (err) {
      // console.error("Delete error:", err);
     showError(err.message, "An error occurred while deleting the village.");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteVillage(null);
    }
  };

  const filteredVillages = useMemo(() => {
    if (!Array.isArray(villages)) return [];

    return villages.filter((v) => {
      const matchDistrict =
        formData.districts.length === 0 ||
        formData.districts.includes(v.district);

      const matchTahasil =
        formData.tahasils.length === 0 || formData.tahasils.includes(v.tahasil);

      const matchVillage =
        formData.villageNames.length === 0 ||
        formData.villageNames.includes(v.village_name);

      return matchDistrict && matchTahasil && matchVillage;
    });
  }, [villages, formData]);
  const projectFilteredData = filteredVillages;

  return (
    <div className="h-screen">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
        {/* Header */}
        <h2 className="text-base sm:text-lg font-semibold capitalize">
        Government Land Villages
        </h2>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
            className={`btn btn-primary text-white whitespace-nowrap
        ${
          !canEdit
            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
            : ""
        }
      `}
            onClick={() => canEdit && openModal()}
            disabled={!canEdit}
          >
            Add Village
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      ) : (
        <>
          {/* <div className="flex justify-end items-center mb-4">
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
          </div> */}

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
          onCancel={() => setIsModalOpen(false)}
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
       <SuccessMessage
        open={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={closeModal}
      />
    </div>
  );
};

export default Villages;
