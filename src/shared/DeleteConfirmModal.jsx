// src/shared/DeleteConfirmModal.jsx
import React, { useState } from "react";
import { API_BASE_URL } from "../utils/config";
import { useSelector } from "react-redux";

const DeleteConfirmModal = ({ khata, onConfirm, onCancel }) => {
  const token = useSelector((state) => state.auth.userToken);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/khata/deleteKhata/${khata.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        onConfirm(khata.id); // notify parent to remove khata from table
      } else {
        alert(data.message || "Failed to delete khata");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting khata");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
        <p>
          Are you sure you want to delete{" "}
          <span className="font-semibold">{khata.khata_no}</span>?
        </p>
        <div className="modal-action">
          <button
            className="btn btn-error"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
          <button className="btn" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteConfirmModal;
