import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../utils/config";
import { useSelector } from "react-redux";
import { Download, Trash2 } from "lucide-react";
import moment from "moment";

const UploadPlots = () => {
  const [plots, setPlots] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [plotDocs, setPlotDocs] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const { projects } = useSelector((s) => s.list);
  const token = useSelector((state) => state.auth.userToken);

  const fetchPlotDocuments = async () => {
    try {
      setLoadingDocs(true);
      const response = await fetch(`${API_BASE_URL}/plots/plotDocumentList`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to fetch plot documents");
      }

      const data = await response.json();
      setPlotDocs(data.files || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    if (token) fetchPlotDocuments();
  }, [token]);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    setError(null);
    setPlots([]);
    setSuccess(false);
    setFile(selectedFile);

    if (fileExtension === "csv") {
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => setPlots(results.data),
        error: (err) => setError("Error parsing CSV: " + err.message),
      });
    } else if (["xlsx", "xls"].includes(fileExtension)) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        setPlots(jsonData);
      };
      reader.readAsArrayBuffer(selectedFile);
    } else {
      setError("Unsupported file type. Please upload a CSV or Excel file.");
    }
  };

  const handleUploadToAPI = async () => {
    if (!file) return setError("No file selected. Please select a file first.");
    if (!selectedProject || !selectedType)
      return setError("Please select both Project and Type before uploading.");

    try {
      setUploading(true);
      setError(null);
      setSuccess(false);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("project_id", String(selectedProject));
      formData.append("type", String(selectedType));

      const response = await fetch(`${API_BASE_URL}/plots/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "File upload failed");

      setSuccess(true);
      setFile(null);
      setPlots([]);
      fetchPlotDocuments();
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (name) => {
    alert(`Delete API not implemented. Would delete: ${name}`);
  };

  const isUploadEnabled = selectedProject && selectedType;

  return (
    <main className="p-6 space-y-8">
      {/* 🔹 Project and Type Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Upload Plots (CSV / Excel)</h2>

        {/* Project Dropdown */}
        <select
          className="select select-bordered w-full md:w-1/3"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">Select Project</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.project_name}
            </option>
          ))}
        </select>

        {/* Type Dropdown */}
        <select
          className="select select-bordered w-full md:w-1/4"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Select Type</option>
          <option value="1">Pvt Land</option>
          <option value="2">Govt Land</option>
          <option value="3">Forest Land</option>
        </select>

        {/* File Input — Always Visible */}
        <input
          type="file"
          accept=".csv, .xlsx, .xls"
          disabled={!isUploadEnabled}
          onChange={handleFileUpload}
          className={`file-input w-full md:w-auto transition-all duration-300 ${
            !isUploadEnabled
              ? "bg-gray-200 border-gray-400 text-gray-600 cursor-not-allowed"
              : "file-input-bordered file-input-primary bg-white text-gray-900"
          }`}
          title={
            !isUploadEnabled
              ? "Select both Project and Type to enable upload"
              : "Choose CSV or Excel file"
          }
        />
      </div>

      {/* Messages */}
      {error && <p className="text-red-500">{error}</p>}
      {success && (
        <p className="text-green-600 font-medium">
          Plots uploaded successfully!
        </p>
      )}

      {/* Upload Button */}
      {file && (
        <div className="flex justify-end">
          <button
            onClick={handleUploadToAPI}
            disabled={uploading}
            className="btn btn-primary"
          >
            {uploading ? "Uploading..." : "Upload Now"}
          </button>
        </div>
      )}

      {/* File Preview Table */}
      {plots.length > 0 && (
        <div className="overflow-auto max-h-[400px] border rounded-md">
          <table className="table table-zebra w-full">
            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
              <tr>
                {Object.keys(plots[0]).map((key) => (
                  <th key={key} className="text-xs font-semibold">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plots.map((plot, idx) => (
                <tr key={idx}>
                  {Object.values(plot).map((val, i) => (
                    <td key={i} className="text-sm">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Uploaded Plot Documents */}
      <section>
        <h3 className="text-lg font-semibold mb-3">
          📄 Uploaded Plot Documents
        </h3>

        {loadingDocs ? (
          <p>Loading plot documents...</p>
        ) : plotDocs.length > 0 ? (
          <div className="overflow-auto max-h-[500px] border rounded-md">
            <table className="table table-zebra w-full">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th>#</th>
                  <th>File Name</th>
                  <th>Size</th>
                  <th>Uploaded At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plotDocs.map((doc, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td>{idx + 1}</td>
                    <td className="font-medium">{doc.name}</td>
                    <td>{doc.size}</td>
                    <td>
                      {moment(doc.uploadedAt).format("DD MMM YYYY, hh:mm A")}
                    </td>
                    <td className="flex gap-3 items-center">
                      <a
                        href={doc.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Download size={18} />
                      </a>
                      <button
                        onClick={() => handleDelete(doc.name)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No uploaded plot documents found.
          </p>
        )}
      </section>
    </main>
  );
};

export default UploadPlots;