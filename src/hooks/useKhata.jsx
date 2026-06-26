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
      if (!projectId) {
        setKhatas([]);
        setTotal(0);
        setTotalPages(1);
        return;
      }

      const pageSize = 500;
      let currentPage = 1;
      const maxPages = 1000;
      const allKhatas = [];
      

      while (currentPage <= maxPages) {
        const url = `/khata/khataList?page=${currentPage}&limit=${pageSize}&project_id=${projectId}&village_id=${villageQueryString}&type=${typeParam}`;
        const data = await apiClient(url);
        console.log(`Fetched page ${currentPage}`, data);
        if (!data.success) break;

        const pageData = data.khatas || [];
        //  console.log(`Page ${currentPage} data length:`, pageData.length);
        allKhatas.push(...pageData);

        const serverTotalPages = Number(
          data.totalPages ?? data.total_pages ?? data.last_page ?? 0
        );
        const reachedServerEnd =
          Number.isFinite(serverTotalPages) &&
          serverTotalPages > 0 &&
          currentPage >= serverTotalPages;
        const reachedDataEnd =
          pageData.length === 0 || pageData.length < pageSize;

        if (reachedServerEnd || reachedDataEnd) break;
        currentPage += 1;
      }

      const uniqueKhatas = Array.from(
        new Map(allKhatas.map((item) => [item.id, item])).values()
      );

      setKhatas(uniqueKhatas);
      setTotal(uniqueKhatas.length);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchKhatas();
  }, [token, projectId, filterVillage, typeParam]);

  useEffect(() => {
    const pages = Math.max(1, Math.ceil((khatas?.length || 0) / limit));
    setTotalPages(pages);
    if (page > pages) {
      setPage(pages);
    }
  }, [khatas, limit, page]);

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
        uploadProps: { khata, onUploaded: fetchKhatas },
      })),

    closeUploadModal: () =>
      setModals((m) => ({ ...m, isUploadOpen: false })),

    openMapModal: (khata) =>
      setModals((m) => ({
        ...m,
        isMapOpen: true,
        mapProps: { khata, onUpload: fetchKhatas },
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
    fetchKhatas
  };
};
