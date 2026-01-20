import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import { Download, Trash2 } from "lucide-react";
import moment from "moment";
import ConfirmDelete from "../shared/ConfirmDelete";
import { apiClient } from "../utils/apiClient";
import { useSuccessMessage } from "../hooks/useSuccessMessage";
import SuccessMessage from "../shared/SuccessMessage";
import { API_BASE_URL } from "../utils/config";

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

  const selectedProject = useSelector((s) => s.selectedProject.project);
  const projectId = selectedProject?.id;
  console.log("project id govt", projectId);
  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();
  const token = useSelector((state) => state.auth.userToken);
  const LANDTYPE_API = {
    1: {
      upload: "/plots/upload",
      list: "/plots/plotDocumentList",
      delete: "/plots/plotDocumentDelete",
      download: "/plots/plotDocumentDownload",
    },
    2: {
      upload: "/govtplots/uploadGovtPlotExcel",
      list: "/govtplots/govtPlotDocumentList",
      delete: "/govtplots/govtPlotDocumentDelete",
      download: "/govtplots/govtPlotDocumentDownload",
    },
    3: {
      upload: "/forestplots/uploadForestPlotExcel",
      list: "/forestplots/plotDocumentList",
      delete: "/forestplots/plotDocumentDelete",
      download: "",
    },
  };
const fetchPlotDocuments = async () => {
  if (!projectId || !selectedType) return;

  try {
    setLoadingDocs(true);

    const api = LANDTYPE_API[selectedType];
    if (!api?.list) return;

  const data = await apiClient(
  `${api.list}?project_id=${projectId}&type=${selectedType}`
);


    setPlotDocs(Array.isArray(data.files) ? data.files : []);
  } catch (err) {
    setError("Failed to fetch documents");
  } finally {
    setLoadingDocs(false);
  }
};

 useEffect(() => {
  if (!projectId || !selectedType) {
    setPlotDocs([]);
    return;
  }
  setPlotDocs([]);

  fetchPlotDocuments();
}, [projectId, selectedType]);


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
        try {
          const data = new Uint8Array(e.target.result);
          const wb = XLSX.read(data, { type: "array" });

          const ws = wb.Sheets[wb.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(ws, { defval: "" });

          setPlots(json);
        } catch (err) {
          console.error(err);
          setError("Invalid Excel file. Please upload a valid .xls/.xlsx file");
        }
      };

      reader.readAsArrayBuffer(selectedFile);
    } else {
      setError("Unsupported file type");
    }
  };
  const handleUploadToAPI = async () => {
    if (!file) return setError("No file selected");

    try {
      setUploading(true);
      const api = LANDTYPE_API[selectedType].upload;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("project_id", projectId);
      formData.append("type", selectedType);

      await apiClient(api, {
        method: "POST",
        body: formData,
      });

      showSuccess("Document uploaded successfully");
      setFile(null);
      setPlots([]);
      fetchPlotDocuments();
    } catch (err) {
      showError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

const handleDelete = async () => {
    if (!docToDelete || !selectedType) return;

    try {
      const api = LANDTYPE_API[selectedType];

      await apiClient(`${api.delete}/${encodeURIComponent(docToDelete)}`, {
        method: "DELETE",
      });
      showSuccess("Data Deleted Successfully");
      setPlotDocs((prev) => prev.filter((doc) => doc.name !== docToDelete));
    } catch (err) {
      setError(err.message || "Delete failed");
    } finally {
      setIsDeleteModalOpen(false);
      setDocToDelete(null);
    }
  };

  const handleDownload = async (doc) => {
    if (!selectedType) return;

    try {
      const apiPath = LANDTYPE_API[selectedType]?.download;
      if (!apiPath) {
        return setError("Download not supported for this land type");
      }

      const fileName = doc.download_name; // ✅ IMPORTANT

      const response = await fetch(
        `${API_BASE_URL}${apiPath}/${encodeURIComponent(fileName)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Download failed");
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
          readOnly
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
          {plotDocs.map((doc, id) => (
  <tr key={doc.id}> 
                  <td>{id + 1}</td>
                  <td>{doc.name}</td>
                  <td>{doc.size}</td>
                  <td>
                    {moment(doc.uploadedAt).format("DD MMM YYYY, hh:mm A")}
                  </td>
                  <td className="flex gap-3">
                    <button onClick={() => handleDownload(doc)}>
                      <Download size={16} />
                    </button>

                   <button
                      onClick={() => {
                        setDocToDelete(doc.download_name);
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
      <SuccessMessage
        open={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={closeModal}
      />
    </main>
  );
};

export default UploadPlots;
