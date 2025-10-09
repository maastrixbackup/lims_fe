// src/pages/AccessDenied.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-base-200 text-center">
      <h1 className="text-5xl font-bold text-error mb-4">Access Denied</h1>
      <p className="text-gray-600 mb-6">
        You don’t have permission to view this page.
      </p>
      <button className="btn btn-primary" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
}
