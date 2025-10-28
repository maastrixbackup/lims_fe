import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import PlotTable from "../shared/PlotsTable";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../utils/config";

const Plots = () => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const token = useSelector((state) => state.auth.userToken);
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role_name || "";

  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // ✅ Track current page
  const [totalPages, setTotalPages] = useState(1); // ✅ Track total pages from API
  const navigate = useNavigate();

  const fetchPlots = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/plots/plotList?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("Plot List Data:", data);

      if (data.success) {
        setPlots(data.plots || []);
        // ✅ If your backend provides total pages, update this:
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching plots:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch plots whenever page changes
  useEffect(() => {
    if (token) fetchPlots(page);
  }, [page, token]);

  // Delete confirm handler
  const confirmDelete = () => {
    setPlots((prev) => prev.filter((p) => p.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  };

  // ✅ Pagination Handlers
  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto space-y-6">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Plots List</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/plot-form")}
          disabled={userRole === "Admin" || userRole === "Client"}
        >
          + Add Plot
        </button>
      </div>

      {loading ? (
        <p>Loading plots...</p>
      ) : (
        <PlotTable plots={plots} setDeleteConfirm={setDeleteConfirm} />
      )}

      {/* ✅ Pagination Controls */}
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

      {/* Delete Modal */}
      {deleteConfirm && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteConfirm.code}</span>?
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
