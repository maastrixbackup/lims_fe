import React, { useState, useEffect } from "react";
import { X, CheckCircle, Trash2 } from "lucide-react";
// import { API_BASE_URL } from "../../../utils/config";
import { DOCUMENT_TYPES, showToast } from "../../../utils/constants";
import { useSelector } from "react-redux";
  import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../utils/apiClient";

export default function UploadModal({ khata, onClose }) {
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [uploading, setUploading] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { userToken: token } = useSelector((s) => s.auth);


const navigate = useNavigate();


  const isSheetType = (type) => {
    const sheetKeywords = ["Sheet", "Calculation"];
    return sheetKeywords.some((keyword) => type.includes(keyword));
  };

const fetchDocuments = async () => {
  if (!khata?.id) return;

  try {
    setLoading(true);

    const data = await apiClient(`/khata/getKhataFiles/${khata.id}`);

    if (data?.success && Array.isArray(data.documentsWithUrl)) {
      const groupedDocs = data.documentsWithUrl.reduce((acc, doc) => {
        if (!acc[doc.document_type]) acc[doc.document_type] = [];
        acc[doc.document_type].push({
          id: doc.id,
          name: doc.file_name,
          url: doc.url,
        });
        return acc;
      }, {});

      setUploadedDocs(groupedDocs);
    }
  } catch (err) {
    if (err.message === "Invalid or expired token") {
      navigate("/");
      return;
    }

    console.error("Error fetching documents:", err);
    setErrorMsg("Failed to fetch documents.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchDocuments();
  }, [khata, token]);

  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 2000); // 2s
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

const handleFileUpload = async (e, docType) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  if ((uploadedDocs[docType]?.length || 0) + files.length > 3) {
    showToast(`You can upload a maximum of 3 files for "${docType}".`);
    e.target.value = "";
    return;
  }

  setUploading(docType);
  setErrorMsg("");
  setSuccessMsg("");

  try {
    for (const file of files) {
      const formData = new FormData();
      formData.append("document_type", docType);
      formData.append("khata_id", khata.id);
      formData.append("file", file);

      await apiClient("/khata/uploadKhata", {
        method: "POST",
        body: formData,
      });
    }

    setSuccessMsg(
      `${files.length} file(s) uploaded successfully to "${docType}".`
    );

    await fetchDocuments();
  } catch (err) {
    if (err.message === "Invalid or expired token") {
      navigate("/");
      return;
    }

    console.error(err);
    setErrorMsg(err.message || "File upload failed.");
  } finally {
    setUploading(null);
    e.target.value = "";
  }
};


const handleDelete = async (docType, id) => {
  if (!window.confirm("Are you sure you want to delete this file?")) return;

  try {
    setErrorMsg("");
    setSuccessMsg("");

    await apiClient(`/khata/deleteKhataFile/${id}`, {
      method: "DELETE",
    });

    setSuccessMsg("File deleted successfully!");
    await fetchDocuments();
  } catch (err) {
   
    if (err.message === "Invalid or expired token") {
      navigate("/");
      return;
    }

    console.error("Delete error:", err);
    setErrorMsg(err.message || "Error deleting file.");
  }
};

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h3 className="font-bold text-lg mb-4">
          Upload Documents for Khata {khata.number}
        </h3>

        {successMsg && (
          <div className="alert alert-success py-2 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="alert alert-error py-2 mb-4 flex items-center gap-2">
            <span>{errorMsg}</span>
          </div>
        )}

        {loading ? (
          <p className="text-center text-blue-600 mt-5 animate-pulse">
            Loading documents...
          </p>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
            {DOCUMENT_TYPES.map((docType, index) => (
              <div
                key={index}
                className="card bg-base-200 border border-primary/10 shadow-lg hover:shadow-2xl hover:border-primary transition-all duration-300"
              >
                <div className="card-body p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <label className="font-semibold text-sm text-primary w-full sm:w-1/3">
                      {docType}
                    </label>

                    <input
                      type="file"
                      accept={
                        isSheetType(docType)
                          ? ".xls,.xlsx,.csv,.pdf,.jpg,.jpeg,.docx"
                          : ""
                      }
                      multiple
                      onChange={(e) => handleFileUpload(e, docType)}
                      className="file-input file-input-bordered w-full"
                      disabled={uploading === docType}
                    />
                  </div>

                  {uploading === docType && (
                    <p className="text-xs text-blue-600 mt-1 animate-pulse">
                      Uploading...
                    </p>
                  )}

                  {uploadedDocs[docType]?.length ? (
                    <ul className="space-y-1 mt-3 text-sm">
                      {uploadedDocs[docType].map((file) => (
                        <li
                          key={file.id}
                          className="flex items-center justify-between bg-base-100 p-2 rounded-md border border-gray-300 hover:border-primary/50 transition"
                        >
                          <span className="truncate w-52">{file.name}</span>
                          <div className="flex gap-2">
                            <button
                              className="btn btn-xs btn-outline btn-success"
                              onClick={() => window.open(file.url, "_blank")}
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDelete(docType, file.id)}
                              className="btn btn-xs btn-outline btn-error"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 italic mt-2">
                      No files uploaded
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
