import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLandTypeParam } from "../utils/landtypes";
import { apiClient } from "../utils/apiClient";

export const useKhata = () => {
  const [khatas, setKhatas] = useState([]);
  const [villages, setVillages] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterVillage, setFilterVillage] = useState([]);

  const typeParam = useLandTypeParam();
  const villageQueryString =
    filterVillage.length > 0 ? filterVillage.join(",") : "";

  const token = useSelector((state) => state.auth.userToken);
  const { projects } = useSelector((s) => s.list);
  const projectId = useSelector((state) => state.selectedProject.project?.id);

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

  const fetchVillages = async () => {
    if (!projectId) {
      setVillages([]);
      return;
    }

    try {
      const url = `/village/villageList?project_id=${projectId}&type=${typeParam}`;
      const data = await apiClient(url);

      if (data.success) {
        setVillages(data.villages || []);
      }
    } catch (err) {
      console.error("Error loading villages:", err);
    }
  };

  useEffect(() => {
    fetchVillages();
  }, [projectId]);

  const fetchKhatas = async () => {
    setLoading(true);

    try {
      const url = `/khata/khataList?page=${page}&limit=${limit}&project_id=${projectId}&village_id=${villageQueryString}&type=${typeParam}`;
      const data = await apiClient(url);
 console.log("khata id", data);
 
      if (data.success) {
        setKhatas(data.khatas || []);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchKhatas();
  }, [token, page, limit, projectId, filterVillage, typeParam]);

  const handleDeleteConfirm = (id) => {
    setKhatas((prev) => prev.filter((k) => k.id !== id));
    setModals((m) => ({ ...m, isDeleteOpen: false }));
  };

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
      setModals((m) => ({
        ...m,
        isMapOpen: true,
        mapProps: { khata },
      })),

    closeMapModal: () =>
      setModals((m) => ({ ...m, isMapOpen: false })),
  };

  return {
    projects,
    villages,
    khatas,
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
    projectId,
    filterVillage,
    setFilterVillage,
    modals,
    handlers,
    loading,
    villageQueryString,
  };
};
