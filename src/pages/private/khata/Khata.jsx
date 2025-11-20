import React, { useMemo, useState } from "react";
import { useKhata } from "../../../hooks/useKhata";
import KhataTable from "./KhataTable";
import KhataFormModal from "./KhataFormModal";
import DeleteConfirmModal from "../../../shared/DeleteConfirmModal";
import UploadModal from "./UploadModal";
import MapModal from "../../../shared/MapModal";
import { useSelector } from "react-redux";
import Loader from "../../../shared/Loader";
import { useParams } from "react-router";
import * as XLSX from "xlsx";
import moment from "moment";
import { FolderUp, Printer, ChevronDown } from "lucide-react";
import { getTypeName } from "../../../utils/constants";

export default function Khata() {
  const { landType } = useParams();
  const { khatas, modals, handlers, loading } = useKhata();

  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role_name || "";

  const [filterVillages, setFilterVillages] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const villages = useMemo(() => {
    const setV = new Set();
    khatas.forEach((k) => {
      if (k.village_name) setV.add(k.village_name);
    });
    return Array.from(setV).sort((a, b) => a.localeCompare(b));
  }, [khatas]);

  const toggleVillage = (village) => {
    setFilterVillages((prev) =>
      prev.includes(village)
        ? prev.filter((v) => v !== village)
        : [...prev, village]
    );
  };

  const filteredKhatas = useMemo(() => {
    if (filterVillages.length === 0) return khatas;
    return khatas.filter((k) => filterVillages.includes(k.village_name));
  }, [khatas, filterVillages]);

  const getKhataTableFormattedData = (data) => {
    return data.map((k, idx) => ({
      "Sl No": idx + 1,
      Project: k.project_name || "",
      Village: k.village_name || "",
      "Khata No": k.khata_no || "",
      "Khata Type": getTypeName(k.type),
      "Unique ID": k.unique_id || "",
      Created: k.created_at ? moment(k.created_at).format("DD-MM-YYYY") : "",
    }));
  };

  const getFileName = () => {
    let type = landType?.toLowerCase();
    if (type === "govt-land") return "govt_khata.xlsx";
    if (type === "forest-land") return "forest_khata.xlsx";
    return "private_khata.xlsx";
  };

  const handleExportExcel = () => {
    const data = getKhataTableFormattedData(filteredKhatas);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Khata");
    XLSX.writeFile(wb, getFileName());
  };

  const handlePrint = () => {
    const printContent = document.getElementById("khataTablePrint");
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Khata Print</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 2px; white-space: no-wrap }
            th { background: #f4f4f4; white-space: no-wrap }
            @media print { .no-print { display: none !important; } }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-4 space-y-4">
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold capitalize">
              {landType?.replace("-", " ") || "Private"} Khata
            </h2>

            <div className="flex items-center gap-3 print:hidden">
              <button
                className="btn bg-green-600 text-white px-4 py-2 flex items-center gap-2 text-sm"
                onClick={handleExportExcel}
              >
                <FolderUp /> Export Excel
              </button>

              <button
                className="btn bg-gray-600 text-white px-4 py-2 flex items-center gap-2 text-sm"
                onClick={handlePrint}
              >
                <Printer /> Print
              </button>

              <button
                className={`btn btn-primary text-white ${
                  userRole === "Data Entry User" || userRole === "Viewer"
                    ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                    : ""
                }`}
                onClick={handlers.openAddModal}
                disabled={userRole === "Data Entry User" || userRole === "Viewer"}
              >
                + Add Khata
              </button>
            </div>
          </div>

          {/* Checkbox Dropdown */}
          <div className="relative w-64 print:hidden">
            <button
              className="w-full border rounded-lg p-2 flex justify-between items-center bg-white shadow-sm"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="text-sm text-gray-700">
                Select Villages
                {/* {filterVillages.length === 0
                  ? "Select Villages"
                  : `${filterVillages.length} selected`} */}
              </span>
              <ChevronDown />
            </button>

            {dropdownOpen && (
              <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-64 overflow-auto">
                <div className="p-2 border-b">
                  <button
                    className="text-blue-600 text-sm"
                    onClick={() => setFilterVillages([])}
                  >
                    Clear All
                  </button>
                </div>
                {villages.map((v) => (
                  <label
                    key={v}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filterVillages.includes(v)}
                      onChange={() => toggleVillage(v)}
                    />
                    <span>{v}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div id="khataTablePrint">
            <KhataTable
              khatas={filteredKhatas}
              onEdit={handlers.openEditModal}
              onDelete={handlers.openDeleteModal}
              onUpload={handlers.openUploadModal}
              onMap={handlers.openMapModal}
            />
          </div>
        </>
      )}

      {modals.isFormOpen && <KhataFormModal {...modals.formProps} onClose={handlers.closeForm} />}
      {modals.isDeleteOpen && <DeleteConfirmModal {...modals.deleteProps} onCancel={handlers.closeDeleteModal} />}
      {modals.isUploadOpen && <UploadModal {...modals.uploadProps} onClose={handlers.closeUploadModal} />}
      {modals.isMapOpen && <MapModal {...modals.mapProps} onClose={handlers.closeMapModal} />}
    </div>
  );
}
