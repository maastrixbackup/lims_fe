import React, { useState } from "react";
import { X, CheckCircle, Trash2 } from "lucide-react";

const DOCUMENT_TYPES = [
  "Order Sheet",
  "Notice by GMDC",
  "Attendance Sheet",
  "Consent Form",
  "Genealogy Sheet",
  "Legal Heir Certificate",
  "Yadast Register Copy",
  "Self-Attested RoR",
  "Certified Copy of RoR",
  "Patta Original",
  "Encumbrance Certificate",
  "Rent Receipt",
  "Trace Map",
  "Application to Claim for Land Compensation",
  "Calculation of Compensation",
  "Form 9A + Sample Photo (if any)",
  "Form 9B + Sample Photo (if any)",
  "Form 9C + Sample Photo (if any)",
  "Land Acquisition Award",
  "Indemnity Bond",
  "Physical Possession Certificate (Bond Paper)",
  "Apportionment Affidavit (if applicable)",
  "Affidavit for Legal Issues (if any)",
  "Aadhaar / Voter Card Copy",
  "PAN Proof",
  "Bank Passbook / Cancelled Cheque Copy",
  "Electronic Fund Transfer Form",
  "Receipt of Compensation",
  "Payment Voucher",
  "Photo of Physical Possession",
];

export default function UploadModal({ khata = { number: "KH-001" }, onClose }) {
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [uploading, setUploading] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Determine if a document type is a spreadsheet
  const isSheetType = (type) => {
    const sheetKeywords = ["Sheet", "Calculation"];
    return sheetKeywords.some((keyword) => type.includes(keyword));
  };

 const handleFileUpload = (e, docType) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  // Max 3 file rule
  if ((uploadedDocs[docType]?.length || 0) + files.length > 3) {
    alert(`You can upload a maximum of 3 files for "${docType}".`);
    e.target.value = "";
    return;
  }

  setUploading(docType);

  setTimeout(() => {
    // Existing file names for this docType
    const existingNames = (uploadedDocs[docType] || []).map((doc) =>
      doc.name.toLowerCase()
    );

    // Filter out duplicates
    const uniqueFiles = files.filter(
      (file) => !existingNames.includes(file.name.toLowerCase())
    );

    if (uniqueFiles.length === 0) {
      alert(`All selected files are already uploaded for "${docType}".`);
      setUploading(null);
      e.target.value = "";
      return;
    }

    // Prepare new file objects
    const newDocs = uniqueFiles.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    // Update state
    setUploadedDocs((prev) => ({
      ...prev,
      [docType]: [...(prev[docType] || []), ...newDocs],
    }));

    setSuccessMsg(
      `${uniqueFiles.length} file(s) uploaded successfully to "${docType}".`
    );
    setUploading(null);
    e.target.value = "";
  }, 800);
};

  // Handle delete
  const handleDelete = (docType, id) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [docType]: prev[docType].filter((doc) => doc.id !== id),
    }));
    setSuccessMsg("File deleted successfully!");
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-3xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h3 className="font-bold text-lg mb-4">
          Upload Documents for Khata {khata.number}
        </h3>

        {/* Success Alert */}
        {successMsg && (
          <div className="alert alert-success py-2 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Document Upload List */}
        <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
          {DOCUMENT_TYPES.map((docType, index) => (
            <div
              key={index}
              className="card bg-base-200 border border-primary/10 shadow-lg hover:shadow-2xl hover:border-primary transition-all duration-300"
            >
              <div className="card-body p-4">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label className="font-semibold text-sm text-primary w-full sm:w-1/3">
                    {docType}
                  </label>

                  <input
                    type="file"
                    accept={
                      isSheetType(docType)
                        ? ".xls,.xlsx,.csv"
                        : "application/pdf,image/*"
                    }
                    multiple
                    onChange={(e) => handleFileUpload(e, docType)}
                    className="file-input file-input-bordered w-full"
                    disabled={uploading === docType}
                  />
                </div>

                {/* Upload Status */}
                {uploading === docType && (
                  <p className="text-xs text-blue-600 mt-1 animate-pulse">
                    Uploading...
                  </p>
                )}

                {/* Uploaded Files */}
                {uploadedDocs[docType]?.length ? (
                  <ul className="space-y-1 mt-3 text-sm">
                    {uploadedDocs[docType].map((file) => (
                      <li
                        key={file.id}
                        className="flex items-center justify-between bg-base-100 p-2 rounded-md border border-gray-300 hover:border-primary/50 transition"
                      >
                        <span className="truncate w-52">{file.name}</span>
                        <div className="flex gap-2">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-xs btn-outline btn-success"
                          >
                            View
                          </a>
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

        {/* Footer */}
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
