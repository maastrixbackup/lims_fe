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

const GovernmentKhata = () => {
  const [khatas, setKhatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKhata, setEditingKhata] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();

  const token = useSelector((s) => s.auth.userToken);
  const userRole = useSelector((s) => s.auth.user?.role_name);
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
    if (!projectId || !typeParam) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/govtkhata/govtKhataList?project_id=${projectId}&type=${typeParam}&page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const res = await response.json();

      if (res.success) {
        const mapped = res.data.map((k) => ({
          id: k.id,
          khata_no: k.khata_no,
          plot_no: k.plot_no || "-",
          project_id: k.project_id,
          village_id: k.village_id,
          lease_case_no: k.lease_case_no || "-",
          present_status: PRESENT_STATUS_MAP[k.present_status || ""],
          case_details: k.case_details,
          village: k.village_name || k.village || "-",
          plot_count: k.plot_count || 0,
          kissam_of_land: k.kissam_of_land || "",
          unique_id:k.unique_id || ""
        }));
  setTotalPages(res.totalPages)
        setKhatas(mapped);
      } else {
        setKhatas([]);
      }
    } catch (err) {
      console.error("Khata list fetch failed:", err);
      setKhatas([]);
    } finally {
      setLoading(false);
    }
  }, [projectId, typeParam, token, page, limit]);

  useEffect(() => {
    fetchKhatas();
  }, [fetchKhatas, page, limit]);

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
    "Case Count"
  ];

  const rows = khatas.map((k) => [
    k.khata_no,
    k.plot_no,
    k.village,
    k.kissam_of_land,
    k.lease_case_no,
    k.present_status,
    k.case_details,
    k.plot_count,
    k.unique_id
  ]);

  const csvContent =
    [headers, ...rows]
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
    disabled={!khatas.length}
  >
     <FolderUp size={18} /> Export
  </button>

  <button className="btn btn-primary btn-sm" onClick={() => openModal()}>
    + Add Khata
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
          totalPages={totalPages}
        />
      )}

      {isModalOpen && (
        <KhataForm
          editingKhata={editingKhata}
          onCancel={onCancel}
          fetchKhatas={fetchKhatas}
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
