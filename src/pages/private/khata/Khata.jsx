import React, { useState, useRef, useEffect } from "react";
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
import { ChevronDown, FolderUp, Printer } from "lucide-react";
import { getTypeName } from "../../../utils/constants";

export default function Khata() {
  const { landType } = useParams();
  const {
    khatas,
    modals,
    handlers,
    loading,
    filterVillage,
    setFilterVillage,
    page,
    totalPages,
    setPage,
  } = useKhata();

  const user = useSelector((state) => state.auth.user);
  const villages = useSelector((state) => state.list.villages) || [];
  const userRole = user?.role_name || "";

  const [villageDropdownOpen, setVillageDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setVillageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatKhataData = (data) =>
    data.map((k, i) => ({
      "Sl No": i + 1,
      Project: k.project_name,
      Village: k.village_name,
      "Khata No": k.khata_no,
      "Khata Type": getTypeName(k.type),
      "Unique ID": k.unique_id,
      Created: k.created_at ? moment(k.created_at).format("DD-MM-YYYY") : "",
    }));

  const getFileName = () => {
    const type = landType?.toLowerCase();
    if (type === "govt-land") return "govt_khata.xlsx";
    if (type === "forest-land") return "forest_khata.xlsx";
    return "private_khata.xlsx";
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(formatKhataData(khatas));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Khata");
    XLSX.writeFile(wb, getFileName());
  };

  const handlePrint = () => {
    const printContent = document.getElementById("khataTablePrint");
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>Khata Print</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 2px; white-space: nowrap; }
            th { background: #f4f4f4; }
            @media print { .no-print { display: none !important; } }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  const toggleVillage = (id) => {
    setFilterVillage((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4 space-y-5 h-screen overflow-y-auto">
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-xl font-semibold capitalize">
              {landType?.replace("-", " ") || "Private"} Khata
            </h2>

            <div className="flex items-center gap-3 print:hidden">
              <button
                className="btn bg-green-600 text-white px-4 flex items-center gap-2"
                onClick={handleExportExcel}
              >
                <FolderUp size={18} /> Export
              </button>

              <button
                className="btn bg-gray-600 text-white px-4 flex items-center gap-2"
                onClick={handlePrint}
              >
                <Printer size={18} /> Print
              </button>

              <button
                className={`btn btn-primary text-white ${
                  ["Data Entry User", "Viewer"].includes(userRole)
                    ? "!bg-gray-300 !text-gray-400 !cursor-not-allowed"
                    : ""
                }`}
                disabled={["Data Entry User", "Viewer"].includes(userRole)}
                onClick={handlers.openAddModal}
              >
                + Add Khata
              </button>
            </div>
          </div>

        {/* Village Dropdown */}
<div ref={dropdownRef} className="relative w-64">
  <button
    className="btn border border-gray-300 w-full justify-between"
    onClick={() => setVillageDropdownOpen(!villageDropdownOpen)}
  >
    {filterVillage.length > 0
      ? `${filterVillage.length} selected`
      : "Select Villages"}
    <ChevronDown size={16} />
  </button>

  {villageDropdownOpen && (
    <ul className="absolute left-0 top-full mt-1 dropdown menu w-full rounded-box bg-base-100 shadow-lg p-2 max-h-64 overflow-y-auto z-50">
      <li className="mb-1 border-b pb-1">
        <button
          className="text-blue-600 font-medium w-full text-left"
          onClick={() => setFilterVillage([])}
        >
          Clear All
        </button>
      </li>
      {villages.map((v) => (
        <li key={v.id}>
          <label className="cursor-pointer flex items-center gap-2 py-1">
            <input
              type="checkbox"
              className="checkbox checkbox-xs"
              checked={filterVillage.includes(v.id)}
              onChange={() => toggleVillage(v.id)}
            />
            <span>{v.village_name}</span>
          </label>
        </li>
      ))}
    </ul>
  )}
</div>


          <div id="khataTablePrint">
            <KhataTable
              khatas={khatas}
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              onEdit={handlers.openEditModal}
              onDelete={handlers.openDeleteModal}
              onUpload={handlers.openUploadModal}
              onMap={handlers.openMapModal}
            />
          </div>
        </>
      )}

      {modals.isFormOpen && (
        <KhataFormModal {...modals.formProps} onClose={handlers.closeForm} />
      )}

      {modals.isDeleteOpen && (
        <DeleteConfirmModal
          {...modals.deleteProps}
          onCancel={handlers.closeDeleteModal}
        />
      )}

      {modals.isUploadOpen && (
        <UploadModal
          {...modals.uploadProps}
          onClose={handlers.closeUploadModal}
        />
      )}

      {modals.isMapOpen && (
        <MapModal {...modals.mapProps} onClose={handlers.closeMapModal} />
      )}
    </div>
  );
}
