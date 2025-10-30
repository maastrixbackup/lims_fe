import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../utils/config";
import { useSelector } from "react-redux";

const UploadPlots = () => {
  const [plots, setPlots] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const token = useSelector((state) => state.auth.userToken);

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
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
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
    if (!file) {
      setError("No file selected. Please select a file first.");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(false);

      const formData = new FormData();
      formData.append("file", file); // 👈 Attach the uploaded file

      const response = await fetch(`${API_BASE_URL}/plots/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Upload failed");
      }

      const data = await response.json();
      console.log("Upload success ✅:", data);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="p-6 space-y-6">
      {/* Upload Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Upload Plots (CSV / Excel)</h2>
        <input
          type="file"
          accept=".csv, .xlsx, .xls"
          onChange={handleFileUpload}
          className="file-input file-input-primary"
        />
      </div>

      {/* Messages */}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">Plots uploaded successfully!</p>}

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

      {/* Preview Table */}
      {plots.length > 0 && (
        <div className="overflow-x-auto max-h-[500px] border rounded-md">
          <table className="table table-zebra w-full">
            <thead className="bg-gray-100 text-gray-700 sticky top-0">
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
                <tr key={idx} className="hover:bg-gray-50">
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
    </main>
  );
};

export default UploadPlots;
