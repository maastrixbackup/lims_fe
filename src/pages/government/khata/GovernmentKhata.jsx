import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import KhataTable from "./KhataTable";
import KhataForm from "./KhataForm";
import { API_BASE_URL } from "../../../utils/config";
import { useLandTypeParam } from "../../../utils/landtypes";
import { apiClient } from "../../../utils/apiClient";
import SuccessMessage from "../../../shared/SuccessMessage";
import { useSuccessMessage } from "../../../hooks/useSuccessMessage";
import { FolderUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UploadModal from "./UploadModal";
import MapModal from "./MapModal"
import PlotListModal from "./PlotListModal";

const GovernmentKhata = () => {
  const [mapKhata, setMapKhata] = useState(null);
  const [plotKhata, setPlotKhata] = useState(null);
  const [uploadKhata, setUploadKhata] = useState(null);
  const [khatas, setKhatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKhata, setEditingKhata] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const navigate = useNavigate();
  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();

  const token = useSelector((s) => s.auth.userToken);
  const userRole = useSelector((s) => s.auth.user?.role_name);
  const { user } = useSelector((s) => s.auth);
  const role = user?.role_name;
  const canEdit = role !== "Viewer";
  const projectId = useSelector((s) => s.selectedProject.project?.id);

  const typeParam = useLandTypeParam();
  const PRESENT_STATUS_MAP = {
    1: "Lease Case to Sub-Collector",
    2: "Lease Case to ADM (Rev Sec)",
    3: "Demand Raised",
    4: "Lease Sanctioned by Collector",
  };

  // 🔹 Fetch Khatas (reusable)
  const fetchKhatas = useCallback(async () => {
    if (!projectId || !typeParam) {
      setKhatas([]);
      return;
    }

    setLoading(true);

    try {
      const pageSize = 500;
      let currentPage = 1;
      let totalPageCount = 1;
      const allKhatas = [];

      do {
        const url = `/govtkhata/govtKhataList?project_id=${projectId}&type=${typeParam}&page=${currentPage}&limit=${pageSize}`;
        const res = await apiClient(url);

        if (!res?.success) break;

        const mapped = (res.data || []).map((k) => ({
          id: k.id,
          khata_no: k.khata_no,
          plot_no: k.plot_no || "-",
          project_id: k.project_id,
          village_id: k.village_id,
          lease_case_no: k.lease_case_no || "-",
          present_status: PRESENT_STATUS_MAP[k.present_status || ""],
          case_details: k.case_details,
          village_name: k.village_name || "-",
          plot_count: k.plot_count || 0,
          kissam_of_land: k.kissam_of_land || "",
          unique_id: k.unique_id || "",
          ror_name: k.ror_name || "",
          land_category: k.land_category || "",
          khata_document_count: k.khata_document_count || 0,
          khata_map_document_count: k.khata_map_document_count || 0,
        }));

        allKhatas.push(...mapped);
        totalPageCount = res.totalPages || 1;

        if (mapped.length === 0) break;
        currentPage += 1;
      } while (currentPage <= totalPageCount);

      setKhatas(allKhatas);
    } catch (err) {
      // TOKEN_EXPIRED already handled by apiClient (logout + redirect)
      if (err.message === "Invalid or expired token") {
        navigate("/");
        return;
      }
      setKhatas([]);
    } finally {
      setLoading(false);
    }
  }, [projectId, typeParam]);

  useEffect(() => {
    fetchKhatas();
  }, [fetchKhatas]);

  useEffect(() => {
    setPage(1);
  }, [projectId, typeParam]);

  const openModal = (khata = null) => {
    setEditingKhata(khata);
    setIsModalOpen(true);
  };

  const onCancel = () => {
    setEditingKhata(null);
    setIsModalOpen(false);
  };

  const openDeleteConfirm = (khata) => {
    setDeleteConfirm(khata);
  };

  const onUpload = (khata) => {
    setUploadKhata(khata);
  };
const onMap = (khata) => {
  setMapKhata(khata);
};

const onViewPlots = (khata) => {
  setPlotKhata(khata);
};
  const handleDelete = async () => {
    try {
      await apiClient(`/govtkhata/deleteGovtKhata/${deleteConfirm.id}`, {
        method: "DELETE",
      });

      showSuccess("Data Deleted Successfully");
      //  closeModal()
      fetchKhatas();
    } catch (err) {
      showError(err.message || "Someting Went Wrong");
    } finally {
      setDeleteConfirm(null);
    }
  };
  const handleExport = () => {
    if (!khatas.length) return;

    const headers = [
      "Khata No",
      "Plot No",
      "Village",
      "Kissam Of Land",
      "Lease Case No",
      "Present Status",
      "Case Details",
      "Plot Count",
      "Case Count",
      "ROR Name",
      "Land Category",
    ];

    const rows = khatas.map((k) => [
      k.khata_no,
      k.plot_no,
      k.village_name,
      k.kissam_of_land,
      k.lease_case_no,
      k.present_status,
      k.case_details,
      k.plot_count,
      k.unique_id,
      k.ror_name,
      k.land_category,
    ]);

    const csvContent = [headers, ...rows]
      .map((e) => e.map((x) => `"${x ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "government_khata.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="p-2 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Government Land Khata</h2>
        <div className="flex gap-2">
          <button
            className="btn btn-sm bg-green-600 text-white"
            onClick={handleExport}
            // disabled={!khatas.length}
          >
            <FolderUp size={18} /> Export
          </button>

          {/* <button className="btn btn-primary btn-sm" onClick={() => openModal()}>
    + Add Khata
  </button> */}
          <button
            className={`btn btn-primary btn-sm text-white whitespace-nowrap
        ${
          !canEdit
            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
            : ""
        }
      `}
            onClick={() => canEdit && openModal()}
            disabled={!canEdit}
          >
            Add Khata
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-4">Loading...</p>
      ) : (
        <KhataTable
          khatas={khatas}
          onEdit={openModal}
          onDelete={openDeleteConfirm}
          userRole={userRole}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          onUpload={onUpload}
          onViewPlots={onViewPlots}
          onMap={onMap}
        />
      )}

      {isModalOpen && (
        <KhataForm
          editingKhata={editingKhata}
          onCancel={onCancel}
          fetchKhatas={fetchKhatas}
        />
      )}
      {uploadKhata && (
        <UploadModal khata={uploadKhata} onClose={() => setUploadKhata(null)} />
      )}
{/* Map */}
{mapKhata && (
  <MapModal
    khata={mapKhata}
    onClose={() => setMapKhata(null)}
  />
)}

{/* Plot List */}
{plotKhata && (
  <PlotListModal
    khata={plotKhata}
    onClose={() => setPlotKhata(null)}
  />
)}
      {deleteConfirm && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="my-3">
              Are you sure you want to delete Khata{" "}
              <b>{deleteConfirm.khata_no}</b>?
            </p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button className="btn" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
      <SuccessMessage
        open={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={closeModal}
      />
    </main>
  );
};

export default GovernmentKhata;
