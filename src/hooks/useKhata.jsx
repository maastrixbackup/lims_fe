import { useState, useEffect, useMemo } from "react";
// import { documentList } from "../utils/constants";
import { API_BASE_URL } from "../utils/config";
import { useSelector } from "react-redux";

export const useKhata = () => {
  const [khatas, setKhatas] = useState([]);
  const [filterProject, setFilterProject] = useState("");
  const [filterVillage, setFilterVillage] = useState("");
  const [uploadedDocs, setUploadedDocs] = useState([]);

  const {
    user,
    userToken: token,
    accessed_projects = [],
  } = useSelector((state) => state.auth);
  const role = user?.role_name;
  const { projects, villages } = useSelector((s) => s.list);

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

  const fetchKhatas = async () => {
    const data = await api("/khata/khataList");
    if (data.success) {
      let allKhatas = data.khatas || [];
      // if (role === "Data Entry User" || role === "Viewer") {
      //   const allowedIds = accessed_projects.map((p) => p.id);
      //   allKhatas = allKhatas.filter((k) => allowedIds.includes(k.project_id));
      // }
      setKhatas(allKhatas);
      // console.log("Khatas fetched:", allKhatas);
    }
  };

  useEffect(() => {
    if (token) {
      fetchKhatas();
    }
  }, [token]);
  const filteredKhatas = useMemo(
    () =>
      khatas.filter(
        (k) =>
          (!filterProject || k.project_id === parseInt(filterProject)) &&
          (!filterVillage || k.village_id === parseInt(filterVillage))
      ),
    [khatas, filterProject, filterVillage]
  );
  const handleDeleteConfirm = (id) => {
    setKhatas((prev) => prev.filter((k) => k.id !== id));
    setModals((m) => ({ ...m, isDeleteOpen: false }));
  };

  const handlers = {
  openAddModal: () =>
  setModals((m) => ({
    ...m,
    isFormOpen: true,
    formProps: { khata: null, setKhatas, token, projects, villages, fetchKhatas }, // 🟢 add fetchKhatas
  })),
openEditModal: (khata) =>
  setModals((m) => ({
    ...m,
    isFormOpen: true,
    formProps: { khata, setKhatas, token, projects, villages, fetchKhatas }, // 🟢 add fetchKhatas
  })),

    closeForm: () => setModals((m) => ({ ...m, isFormOpen: false })),

    openDeleteModal: (khata) =>
      setModals((m) => ({
        ...m,
        isDeleteOpen: true,
        deleteProps: { khata, onConfirm: handleDeleteConfirm },
      })),
    closeDeleteModal: () => setModals((m) => ({ ...m, isDeleteOpen: false })),

    openUploadModal: (khata) =>
      setModals((m) => ({
        ...m,
        isUploadOpen: true,
        uploadProps: { khata, uploadedDocs, setUploadedDocs },
      })),
    closeUploadModal: () => setModals((m) => ({ ...m, isUploadOpen: false })),

    openMapModal: (khata) =>
      setModals((m) => ({ ...m, isMapOpen: true, mapProps: { khata } })),
    closeMapModal: () => setModals((m) => ({ ...m, isMapOpen: false })),
  };

  return {
    projects,
    villages,
    khatas,
    filteredKhatas,
    filterProject,
    setFilterProject,
    filterVillage,
    setFilterVillage,
    modals,
    handlers,
  };
};
