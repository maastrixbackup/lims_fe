import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../../../utils/config";
import { odishaDistricts } from "../../../utils/constants";
import VillageTable from "./VillageTable";
import VillageFilter from "./VillageFilter";
import VillageFormModal from "./VillageFormModal";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import Loader from "../../../shared/Loader";
import { useLandTypeParam } from "../../../utils/landtypes";
import ExportButtons from "../../../shared/ExportButtons";
import { FolderUp } from "lucide-react";

const Villages = () => {
  const { user, userToken: token } = useSelector((s) => s.auth);
  const { projects } = useSelector((s) => s.list);
  const role = user?.role_name;
  const isRestricted = role === "Data Entry User" || role === "Viewer";
  const selectedProject = useSelector((state) => state.selectedProject.project);

  const [villages, setVillages] = useState([]);
  const [formData, setFormData] = useState({
    project_id: "",
    districts: [],
    tahasils: [],
    villageNames: [],
  });
  const tahasils = [...new Set(villages.map((v) => v.tahasil).filter(Boolean))];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVillage, setEditingVillage] = useState(null);
  const [deleteVillage, setDeleteVillage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { landType } = useParams();
  const typeParam = useLandTypeParam();

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

  const normalizeVillages = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((v) => ({
      id: v.id ?? v.village_id ?? v.uid,
      village_name: v.village_name ?? v.name ?? v.village,
      district: v.district ?? v.dist ?? "",
      tahasil: v.tahasil ?? v.taluka ?? "",
      project_id: v.project_id ?? v.project ?? "",
      ...v,
    }));
  };

const fetchVillages = async () => {
  try {
    setLoading(true);

    const params = new URLSearchParams();
    if (formData.project_id) params.append("project_id", formData.project_id);
    params.append("type", typeParam);

    const data = await api(`/village/villageList?${params.toString()}`);

    if (data.success && Array.isArray(data.villages)) {
      setVillages(normalizeVillages(data.villages));
    } else {
      setVillages([]);
    }
  } catch (err) {
    console.error("Error fetching villages:", err);
    setVillages([]);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchVillages();
  }, [landType, formData]);

  const openModal = (v = null) => {
    setEditingVillage(v);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteVillage) return;
    try {
      const data = await api(
        `/village/deleteVillage/${deleteVillage.id}`,
        "DELETE"
      );
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

const filteredVillages = !selectedProject
  ? [] // <-- No global project selected → table becomes empty
  : villages.filter((v) => {
      const matchDistrict =
        formData.districts.length === 0 ||
        formData.districts.includes(v.district);

      const matchTahasil =
        formData.tahasils.length === 0 ||
        formData.tahasils.includes(v.tahasil);

      const matchVillage =
        formData.villageNames.length === 0 ||
        formData.villageNames.includes(v.village_name);

      const matchProject =
        Number(v.project_id) === Number(selectedProject.id); // Force global project filter

      return matchDistrict && matchTahasil && matchVillage && matchProject;
    });


  const projectFilteredData = selectedProject
    ? filteredVillages.filter((v) => v.project_id === selectedProject.id)
    : filteredVillages;
//     const exportVillage = async () => {
//   try {
//     const params = new URLSearchParams({
//       project_id: formData.project_id || "",
//       tahasil: formData.tahasils || "",
//       district: formData.districts || "",
//       type: typeParam,
//     });

//     const response = await fetch(
//       `${API_BASE_URL}/village/exportVillage?${params.toString()}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Failed to export file");
//     }

//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "villages_export.xlsx";
//     document.body.appendChild(link);
//     link.click();
//     link.remove();

//   } catch (err) {
//     console.error("Export error:", err);
//     alert("Failed to export villages.");
//   }
// };


  return (
    <div className="p-4 space-y-5 h-screen">
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      ) : (
        <>
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold capitalize">
              {landType?.replace("-", " ") || "Private"} Villages
            </h2>
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

      {/* <button  className="btn bg-green-600 text-white flex items-center gap-2"  onClick={exportVillage}>
        <FolderUp size={18} /> 
        Export 
      </button> */}

              <button
                className={`btn btn-primary text-white shadow-md ${
                  isRestricted
                    ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                    : ""
                }`}
                onClick={() => openModal()}
                disabled={isRestricted}
              >
                + Add Village
              </button>
            </div>
          </header>

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
              isRestricted={isRestricted}
              onEdit={openModal}
              onDelete={(village) => {
                setDeleteVillage(village);
                setIsDeleteModalOpen(true);
              }}
              landType={landType}
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
