import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import PlotTable from "../plot/PlotsTable";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../utils/config";
import Loader from "../../../shared/Loader";
import { useLandTypeParam } from "../../../utils/landtypes";
import ExportButtons from "../../../shared/ExportButtons";
import { columns } from "../../../utils/constants";

const Plots = () => {
  const { landType } = useParams();
  const typeParam = useLandTypeParam();

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = useSelector((state) => state.auth.userToken);
  const user = useSelector((state) => state.auth.user);
  const role = user?.role_name;

  const projectId = useSelector((state) => state.selectedProject?.project?.id);
  const isRestricted = role === "Data Entry User" || role === "Viewer";
  const navigate = useNavigate();

  const fetchPlots = async (currentPage) => {
    if (!projectId) {
      console.warn("Project ID not available yet.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/plots/plotList?project_id=${projectId}&page=${currentPage}&type=${typeParam}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      // console.log("Plot Data Response:", data);

      if (data.success) {
        setPlots(data.plots || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching plots:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && projectId) {
      fetchPlots(page);
    }
  }, [page, token, projectId, typeParam]);

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
      console.log("Delete Response:", data);

      if (data.success) {
        setPlots((prev) => prev.filter((p) => p.id !== deleteConfirm.id));
        setDeleteConfirm(null);
      } else {
        alert(data.message || "Failed to delete plot.");
      }
    } catch (err) {
      console.error("Error deleting plot:", err);
      alert("Something went wrong while deleting the plot.");
    }
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold capitalize">
          {landType?.replace("-", " ") || "Private"} Plots
        </h2>
        <div className="flex items-center gap-3">
          <ExportButtons data={plots} fileName="Plots" columns={columns} />

          <button
            className={`btn btn-primary text-white ${
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

      {!projectId ? (
        <p className="text-center text-gray-600">
          Please select a project to view plots.
        </p>
      ) : loading ? (
        <Loader />
      ) : (
        <PlotTable plots={plots} setDeleteConfirm={setDeleteConfirm} />
      )}

   {projectId && (
  <div className="flex justify-center items-center mt-6">
    <div className="join">

      {/* Prev Button */}
      <button
        className="join-item btn btn-outline btn-sm"
        onClick={() => setPage((p) => p - 1)}
        disabled={page === 1}
      >
        ← Prev
      </button>

      {/* First Page */}
      <button
        className={`join-item btn btn-sm ${
          page === 1 ? "btn-primary" : ""
        }`}
        onClick={() => setPage(1)}
      >
        1
      </button>

      {/* Ellipsis Left */}
      {page > 3 && (
        <button className="join-item btn btn-sm btn-disabled">…</button>
      )}

      {/* Previous Page */}
      {page > 2 && (
        <button
          className="join-item btn btn-sm"
          onClick={() => setPage(page - 1)}
        >
          {page - 1}
        </button>
      )}

      {/* Current Page */}
      {page !== 1 && page !== totalPages && (
        <button className="join-item btn btn-sm btn-primary">{page}</button>
      )}

      {/* Next Page */}
      {page < totalPages - 1 && (
        <button
          className="join-item btn btn-sm"
          onClick={() => setPage(page + 1)}
        >
          {page + 1}
        </button>
      )}

      {/* Ellipsis Right */}
      {page < totalPages - 2 && (
        <button className="join-item btn btn-sm btn-disabled">…</button>
      )}

      {/* Last Page */}
      {totalPages > 1 && (
        <button
          className={`join-item btn btn-sm ${
            page === totalPages ? "btn-primary" : ""
          }`}
          onClick={() => setPage(totalPages)}
        >
          {totalPages}
        </button>
      )}

      {/* Next Button */}
      <button
        className="join-item btn btn-outline btn-sm"
        onClick={() => setPage((p) => p + 1)}
        disabled={page === totalPages}
      >
        Next →
      </button>
    </div>
  </div>
)}

      {deleteConfirm && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete plot{" "}
              <span className="font-semibold">
                {deleteConfirm.code || deleteConfirm.id}
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
    </main>
  );
};

export default Plots;
