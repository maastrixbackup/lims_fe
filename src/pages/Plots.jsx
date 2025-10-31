import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlotTable from "../shared/PlotsTable";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../utils/config";

const Plots = () => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = useSelector((state) => state.auth.userToken);
  const user = useSelector((state) => state.auth.user);
  const role = user?.role_name;
  const isRestricted = role === "Admin" || role === "Client";
  
  const navigate = useNavigate();

  // Fetch plots list
  const fetchPlots = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/plots/plotList?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // console.log("Plot List Data:", data);

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
    if (token) fetchPlots(page);
  }, [page, token]);

  // Delete Plot API Integration
  const confirmDelete = async () => {
    if (!deleteConfirm?.id) return;

    try {
      const res = await fetch(`${API_BASE_URL}/plots/deletePlot/${deleteConfirm.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Delete Response:", data);

      if (data.success) {
        //Remove deleted plot from UI
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

  // Pagination Handlers
  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Plots List</h2>
        <button
            className={`btn btn-primary text-white ${
            isRestricted
              ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
              : ""
          }`}
          disabled={isRestricted}
          onClick={() => navigate("/plot-form")}
        
        >
          + Add Plot
        </button>
      </div>

      {loading ? (
        <p>Loading plots...</p>
      ) : (
        <PlotTable plots={plots} setDeleteConfirm={setDeleteConfirm} />
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className="btn btn-outline btn-sm"
          onClick={handlePrev}
          disabled={page === 1}
        >
          ← Previous
        </button>
        <span className="text-sm">
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          className="btn btn-outline btn-sm"
          onClick={handleNext}
          disabled={page === totalPages}
        >
          Next →
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete plot{" "}
              <span className="font-semibold">{deleteConfirm.code || deleteConfirm.id}</span>?
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
