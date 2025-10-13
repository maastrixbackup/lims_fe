// src/hooks/useKhata.js
import { useState, useMemo } from "react";
import { documentList } from "../utils/constants";

export const useKhata = () => {
  const projects = [{ id: 1, name: "GMDC - Baitarani-West Coal Block" }];
  const villages = [
    { id: 1, name: "Chhendipada Jangal", project: "GMDC - Baitarani-West Coal Block" },
    { id: 2, name: "Handigora", project: "GMDC - Baitarani-West Coal Block" },
  ];

  const [khatas, setKhatas] = useState([
    { id: 1, project: "GMDC - Baitarani-West Coal Block", village: "Chhendipada Jangal", number: "348", created: "2025-02-01" },
    { id: 2, project: "GMDC - Baitarani-West Coal Block", village: "Handigora", number: "789/111", created: "2025-02-02" },
  ]);

  const [filterProject, setFilterProject] = useState("");
  const [filterVillage, setFilterVillage] = useState("");
  const [uploadedDocs, setUploadedDocs] = useState(documentList);

  // modals
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

  const filteredKhatas = useMemo(
    () =>
      khatas.filter(
        (k) =>
          (!filterProject || k.project === filterProject) &&
          (!filterVillage || k.village === filterVillage)
      ),
    [khatas, filterProject, filterVillage]
  );

  const handlers = {
    openEditModal: (khata) => setModals((m) => ({ ...m, isFormOpen: true, formProps: { khata, setKhatas } })),
    openAddModal: () => setModals((m) => ({ ...m, isFormOpen: true, formProps: { khata: null, setKhatas } })),
    closeForm: () => setModals((m) => ({ ...m, isFormOpen: false })),

    openDeleteModal: (khata) => setModals((m) => ({ ...m, isDeleteOpen: true, deleteProps: { khata, setKhatas } })),
    confirmDelete: (id) => {
      setKhatas((prev) => prev.filter((k) => k.id !== id));
      setModals((m) => ({ ...m, isDeleteOpen: false }));
    },

    openUploadModal: (khata) => setModals((m) => ({ ...m, isUploadOpen: true, uploadProps: { khata, uploadedDocs, setUploadedDocs } })),
    closeUploadModal: () => setModals((m) => ({ ...m, isUploadOpen: false })),

    openMapModal: (khata) => setModals((m) => ({ ...m, isMapOpen: true, mapProps: { khata } })),
    closeMapModal: () => setModals((m) => ({ ...m, isMapOpen: false })),
  };

  return {
    projects,
    villages,
    filteredKhatas,
    filterProject,
    setFilterProject,
    filterVillage,
    setFilterVillage,
    modals,
    handlers,
  };
};
