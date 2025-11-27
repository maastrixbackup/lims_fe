// ---------------------- useKhata.js ----------------------
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLandTypeParam } from "../utils/landtypes";
import { apiClient } from "../utils/apiClient";   // ⬅ USE GLOBAL CLIENT
import { setSelectedProject } from "../utils/selectedProjectSlice";

export const useKhata = () => {
  const [khatas, setKhatas] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // const [filterProject, setFilterProject] = useState("");
  const [filterVillage, setFilterVillage] = useState([]);

  const typeParam = useLandTypeParam();
  const villageQueryString =
    filterVillage.length > 0 ? filterVillage.join(",") : "";

  const token = useSelector((state) => state.auth.userToken);
  const { projects, villages } = useSelector((s) => s.list);
  const projectId = useSelector((state) => state.selectedProject.project?.id);
  

  // ---------- Modal State ----------
  const [modals, setModals] = useState({
    isFormOpen: false,
    isDeleteOpen: false,
    isUploadOpen: false,
    isMapOpen: false,
    formProps: {},
    deleteProps: {},
    uploadProps: {},
    mapProps: {},
  });

  // ---------- Fetch Khatas (Using Global apiClient) ----------
  const fetchKhatas = async () => {
    setLoading(true);

    try {
      const data = await apiClient(
        `/khata/khataList?page=${page}&limit=${limit}&project_id=${projectId}&village_id=${villageQueryString}&type=${typeParam}`
      );

      if (data.success) {
        setKhatas(data.khatas || []);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } else {
        console.error("Failed to fetch khatas:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchKhatas();
  }, [token, page, projectId, filterVillage, typeParam]);

  // ---------- Delete ----------
  const handleDeleteConfirm = (id) => {
    setKhatas((prev) => prev.filter((k) => k.id !== id));
    setModals((m) => ({ ...m, isDeleteOpen: false }));
  };

  // ---------- Modal Handlers ----------
  const handlers = {
    openAddModal: () =>
      setModals((m) => ({
        ...m,
        isFormOpen: true,
        formProps: {
          khata: null,
          token,
          projects,
          villages,
          fetchKhatas,
        },
      })),

    openEditModal: (khata) =>
      setModals((m) => ({
        ...m,
        isFormOpen: true,
        formProps: { khata, token, projects, villages, fetchKhatas },
      })),

    closeForm: () => setModals((m) => ({ ...m, isFormOpen: false })),

    openDeleteModal: (khata) =>
      setModals((m) => ({
        ...m,
        isDeleteOpen: true,
        deleteProps: { khata, onConfirm: handleDeleteConfirm },
      })),

    closeDeleteModal: () =>
      setModals((m) => ({ ...m, isDeleteOpen: false })),

    openUploadModal: (khata) =>
      setModals((m) => ({
        ...m,
        isUploadOpen: true,
        uploadProps: { khata },
      })),

    closeUploadModal: () =>
      setModals((m) => ({ ...m, isUploadOpen: false })),

    openMapModal: (khata) =>
      setModals((m) => ({ ...m, isMapOpen: true, mapProps: { khata } })),

    closeMapModal: () =>
      setModals((m) => ({ ...m, isMapOpen: false })),
  };

  return {
    projects,
    villages,
    khatas,
    page,
    limit,
    total,
    totalPages,
    setPage,
    projectId,
   setSelectedProject,
    filterVillage,
    setFilterVillage,
    modals,
    handlers,
    loading,
    villageQueryString
  };
};
