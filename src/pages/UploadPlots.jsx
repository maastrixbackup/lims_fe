import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const UploadPlots = () => {
  const [plots, setPlots] = useState([]);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (fileExtension === "csv") {
      // Parse CSV
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setPlots(results.data);
        },
        error: (err) => {
          setError("Error parsing CSV: " + err.message);
        },
      });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      // Parse Excel
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        setPlots(jsonData);
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError("Unsupported file type. Please upload a CSV or Excel file.");
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

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Preview Table */}
      {plots.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-gray-100 text-gray-700">
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
