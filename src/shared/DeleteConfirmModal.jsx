// src/components/Plots/DeleteConfirmModal.jsx
import React from "react";

const DeleteConfirmModal = ({ plot, onConfirm, onCancel }) => (
  <dialog open className="modal modal-open">
    <div className="modal-box max-w-md">
      <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
      <p>
        Are you sure you want to delete{" "}
        <span className="font-semibold">{plot.code}</span>?
      </p>
      <div className="modal-action">
        <button className="btn btn-error" onClick={onConfirm}>
          Yes, Delete
        </button>
        <button className="btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  </dialog>
);

export default DeleteConfirmModal;
