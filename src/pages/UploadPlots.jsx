import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import { Download, Trash2 } from "lucide-react";
import moment from "moment";
import ConfirmDelete from "../shared/ConfirmDelete";
import { apiClient } from "../utils/apiClient";

/* ================= LAND TYPE API MAP ================= */
const LANDTYPE_API = {
  "1": {
    upload: "/plots/upload",
    list: "/plots/plotDocumentList",
    delete: "/plots/plotDocumentDelete",
  },
  "2": {
    upload: "/govtplots/uploadGovtPlotExcel",
    // list: "/govtplots/plotDocumentList",
    delete: "/govtplots/plotDocumentDelete",
  },
  "3": {
    upload: "/plots/upload",
    list: "/plots/plotDocumentList",
    delete: "/plots/plotDocumentDelete",
  },
};

const UploadPlots = () => {
  const [plots, setPlots] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [plotDocs, setPlotDocs] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [hasUploaded, setHasUploaded] = useState(false);


  const selectedProject = useSelector((s) => s.selectedProject.project);
  const projectId = selectedProject?.id;

  /* ================= FETCH DOCUMENTS ================= */
  const fetchPlotDocuments = async () => {
    if (!selectedType || !projectId) return;

    try {
      setLoadingDocs(true);
      // setError(null);

      const api = LANDTYPE_API[selectedType].list;

      const data = await apiClient(api, {
        params: { project_id: projectId },
      });

      setPlotDocs(data.files || []);
    } catch (err) {
      console.log(err);
      // setError(err.message || "Failed to fetch plot documents");
    } finally {
      setLoadingDocs(false);
    }
  };

useEffect(() => {
  if (selectedProject && selectedType && hasUploaded) {
    fetchPlotDocuments();
  }
}, [selectedProject, selectedType, hasUploaded]);


  /* ================= FILE PARSING ================= */
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.split(".").pop().toLowerCase();

    setError(null);
    setPlots([]);
    setSuccess(false);
    setFile(selectedFile);

    if (ext === "csv") {
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => setPlots(res.data),
        error: (err) => setError(err.message),
      });
    } else if (["xlsx", "xls"].includes(ext)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(new Uint8Array(e.target.result), {
          type: "array",
        });
        const ws = wb.Sheets[wb.SheetNames[0]];
        setPlots(XLSX.utils.sheet_to_json(ws, { defval: "" }));
      };
      reader.readAsArrayBuffer(selectedFile);
    } else {
      setError("Unsupported file type");
      setFile(null);
    }
  };

  /* ================= UPLOAD ================= */
  const handleUploadToAPI = async () => {
    if (!file) return setError("No file selected");
    if (!selectedProject || !selectedType)
      return setError("Select Project and Type");

    try {
      setUploading(true);
      setError(null);
      setSuccess(false);

      const api = LANDTYPE_API[selectedType].upload;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("project_id", projectId);
      formData.append("type", Number(selectedType));
await apiClient(api, {
  method: "POST",
  body: formData,
});

setSuccess(true);
setHasUploaded(true);   // ✅ enable list loading
setFile(null);
setPlots([]);
fetchPlotDocuments();

      setTimeout(() => setSuccess(false), 1000);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
  setPlotDocs([]);
  setHasUploaded(false);
}, [selectedType]);

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!docToDelete || !selectedType) return;

    try {
      const api = LANDTYPE_API[selectedType].delete;

      await apiClient(
        `${api}/${encodeURIComponent(docToDelete)}`,
        { method: "DELETE" }
      );

      setPlotDocs((prev) =>
        prev.filter((doc) => doc.name !== docToDelete)
      );
    } catch (err) {
      setError(err.message || "Delete failed");
    } finally {
      setIsDeleteModalOpen(false);
      setDocToDelete(null);
    }
  };

  const isUploadEnabled = selectedProject && selectedType;
  return (
    <main className="p-6 space-y-8 h-screen overflow-y-auto">
      <h2 className="text-xl font-bold">Upload Plots (CSV / Excel)</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <input
          className="input w-full"
          value={
            selectedProject
              ? selectedProject.project_name || selectedProject.name
              : "Select Project"
          }
          readOnly
        />

        <select
          className="select select-bordered w-full"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Select Type</option>
          <option value="1">Pvt Land</option>
          <option value="2">Govt Land</option>
          <option value="3">Forest Land</option>
        </select>

        <input
          type="file"
          accept=".csv, .xlsx, .xls"
          disabled={!isUploadEnabled}
          onChange={handleFileUpload}
          className={`file-input w-full mt-1 ${
            !isUploadEnabled
              ? "bg-gray-200 cursor-not-allowed"
              : "file-input-bordered file-input-primary"
          }`}
        />

        <button
          onClick={handleUploadToAPI}
          disabled={!file || uploading}
          className="btn btn-primary w-full"
        >
          {uploading ? "Uploading..." : "Upload Now"}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">Upload successful!</p>}

      {/* ================= DOCUMENT LIST ================= */}
      <section>
        <h3 className="text-lg font-semibold mb-3">📄 Uploaded Documents</h3>

        {loadingDocs ? (
          <p>Loading...</p>
        ) : plotDocs.length ? (
          <table className="table table-zebra w-full">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
              <tr>
                <th>#</th>
                <th>File</th>
                <th>Size</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plotDocs.map((doc, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{doc.name}</td>
                  <td>{doc.size}</td>
                  <td>
                    {moment(doc.uploadedAt).format(
                      "DD MMM YYYY, hh:mm A"
                    )}
                  </td>
                  <td className="flex gap-3">
                    <a
                      href={doc.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Download size={18} />
                    </a>
                    <button
                      onClick={() => {
                        setDocToDelete(doc.name);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No documents found</p>
        )}
      </section>

      <ConfirmDelete
        isOpen={isDeleteModalOpen}
        title="Confirm Deletion"
        message={`Delete "${docToDelete}"?`}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </main>
  );
};

export default UploadPlots;
