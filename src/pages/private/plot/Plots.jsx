import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import PlotTable from "../plot/PlotsTable";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../utils/config";

import { useLandTypeParam } from "../../../utils/landtypes";

import { FolderUp } from "lucide-react";
import { apiClient } from "../../../utils/apiClient";
import { useSuccessMessage } from "../../../hooks/useSuccessMessage";
import SuccessMessage from "../../../shared/SuccessMessage";
import Loader from "../../../shared/Loader";

const Plots = () => {
  const { landType } = useParams();
  const typeParam = useLandTypeParam();

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const token = useSelector((state) => state.auth.userToken);
  const user = useSelector((state) => state.auth.user);
  const role = user?.role_name;
  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();

  const projectId = useSelector((state) => state.selectedProject?.project?.id);
  const isRestricted = role === "Viewer";
  const navigate = useNavigate();

  const fetchPlots = async () => {
    if (!projectId) {
      setPlots([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const pageSize = 500;
      let currentPage = 1;
      let totalPageCount = 1;
      const allPlots = [];

      do {
        const endpoint = `/plots/plotList?project_id=${projectId}&type=${typeParam}&page=${currentPage}&limit=${pageSize}`;
        const data = await apiClient(endpoint);

        if (!data.success) break;

        const pageData = data.plots || [];
        allPlots.push(...pageData);
        totalPageCount = data.totalPages || 1;

        if (pageData.length === 0) break;
        currentPage += 1;
      } while (currentPage <= totalPageCount);

      setPlots(allPlots);
    } catch (err) {
      showError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      fetchPlots();
    }
  }, [token, projectId, typeParam]);

  useEffect(() => {
    setPage(1);
  }, [projectId, typeParam]);

  const confirmDelete = async () => {
    if (!deleteConfirm?.id) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/plots/deletePlot/${deleteConfirm.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      // console.log("Delete Response:", data);

      if (data.success) {
        setPlots((prev) => prev.filter((p) => p.id !== deleteConfirm.id));
        setDeleteConfirm(null);
        showSuccess(data.message || "Plot Deleted SuccessFully", "error");
      } else {
        showSuccess(data.message || "Failed to delete plot.");
      }
    } catch (err) {
      console.error("Error deleting plot:", err);
      showError(err.message || "Something went wrong while deleting the plot.");
    }
  };
  const exportPlot = async () => {
    if (!projectId) {
      alert("Please select a project before exporting.");
      return;
    }

    try {
      setExporting(true);

      const res = await fetch(
        `${API_BASE_URL}/plots/exportPlot?project_id=${projectId}&page=${page}&type=${typeParam}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to export plots");
      }

      // Convert API response to Blob (PDF or Excel)
      const blob = await res.blob();

      // Create downloadable link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // File name according to type
      link.download = `plots_export_${projectId}.${
        blob.type.includes("pdf") ? "pdf" : "xlsx"
      }`;

      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export plot data");
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto ">
      <div className="flex flex-col gap-3 mb-2 sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-lg font-semibold capitalize">
          {landType?.replace("-", " ") || "Private"} Plots
        </h2>

        {/* Buttons */}
        <div className="flex flex-row gap-2 sm:gap-3">
          <button
            className="btn bg-green-600 text-white flex items-center justify-center gap-2"
            onClick={exportPlot}
            disabled={exporting}
          >
            {exporting ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <FolderUp size={18} />
            )}
            {exporting ? "Exporting..." : "Export"}
          </button>

          <button
            className={`btn btn-primary text-white flex justify-center ${
              isRestricted
                ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                : ""
            }`}
            disabled={isRestricted}
            onClick={() => navigate(`/${landType}/plot-form`)}
          >
            + Add Plot
          </button>
        </div>
      </div>

      {loading && projectId ? (
        <Loader message="Loading plot list..." />
      ) : (
        <PlotTable
          plots={plots}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          setDeleteConfirm={setDeleteConfirm}
          className="overflow-x"
          style={{ scrollbarWidth: "thin" }}
        />
      )}
      {/* {!projectId ? (
        <p className="text-center text-gray-600">
          Please select a project to view plots.
        </p>
      ) : loading ? (
        <Loader />
      ) : (
        <PlotTable plots={plots} setDeleteConfirm={setDeleteConfirm} />
      )} */}
      {deleteConfirm && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete plot{" "}
              <span className="font-semibold">
                {deleteConfirm.plot_no}
              </span>
              ?
            </p>

            <div className="modal-action">
              <button className="btn btn-error" onClick={confirmDelete}>
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

export default Plots;
