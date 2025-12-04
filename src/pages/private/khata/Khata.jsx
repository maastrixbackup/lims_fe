import React, { useState, useRef, useEffect } from "react";
import { useKhata } from "../../../hooks/useKhata";
import KhataTable from "./KhataTable";
import KhataFormModal from "./KhataFormModal";
import DeleteConfirmModal from "../../../shared/DeleteConfirmModal";
import UploadModal from "./UploadModal";
import MapModal from "./MapModal";
import { useSelector } from "react-redux";
import Loader from "../../../shared/Loader";
import { useParams } from "react-router";
import * as XLSX from "xlsx";
import moment from "moment";
import { ChevronDown, FolderUp, Printer } from "lucide-react";
import { getTypeName } from "../../../utils/constants";
import { API_BASE_URL } from "../../../utils/config";
import { useLandTypeParam } from "../../../utils/landtypes";
import ExportButtons from "../../../shared/ExportButtons";

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
    villages,
    limit,
    setLimit,
  } = useKhata();

  const user = useSelector((state) => state.auth.user);
  // const villages = useSelector((state) => state.list.villages) || [];
  // console.log("village list", villages);
  const userRole = user?.role_name || "";
  const projectId = useSelector((state) => state.selectedProject.project?.id);

  const [villageDropdownOpen, setVillageDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setVillageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const formatKhataData = (data) =>
  //   data.map((k, i) => ({
  //     "Sl No": i + 1,
  //     Project: k.project_name,
  //     Village: k.village_name,
  //     "Khata No": k.khata_no,
  //     "Khata Type": getTypeName(k.type),
  //     "Unique ID": k.unique_id,
  //     Created: k.created_at ? moment(k.created_at).format("DD-MM-YYYY") : "",
  //   }));

  // const getFileName = () => {
  //   const type = landType?.toLowerCase();
  //   if (type === "govt-land") return "govt_khata.xlsx";
  //   if (type === "forest-land") return "forest_khata.xlsx";
  //   return "private_khata.xlsx";
  // };
  // const [exporting, setExporting] = useState(false);
  const typeParam = useLandTypeParam();
  const token = useSelector((state) => state.auth.userToken);
  const [printing, setPrinting] = useState(false);

  // const handleExportExcel = async () => {
  //   try {
  //     setExporting(true);

  //     const villageIds = filterVillage.join(",");
  //     console.log("villageid", villageIds);

  //     const url = `${API_BASE_URL}/khata/exportKhata?project_id=${projectId}&limit=${limit}village_id=${villageIds}&type=${typeParam}`;

  //     const response = await fetch(url, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     // console.log("response7676", response);
  //     if (!response.ok) throw new Error("Failed to export khata");

  //     const blob = await response.blob();
  //     const downloadUrl = window.URL.createObjectURL(blob);

  //     const a = document.createElement("a");
  //     a.href = downloadUrl;
  //     a.download = getFileName();
  //     document.body.appendChild(a);
  //     a.click();

  //     a.remove();
  //     window.URL.revokeObjectURL(downloadUrl);
  //   } catch (error) {
  //     console.error("Export error:", error);
  //     alert("Failed to export Khata");
  //   } finally {
  //     setExporting(false);
  //   }
  // };

  const handlePrint = async () => {
    try {
      setPrinting(true);

      const villageIds = filterVillage.join(",");
      const url = `${API_BASE_URL}/khata/printKhata?project_id=${projectId}&village_id=${villageIds}&type=${typeParam}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch khata print data");
      }

      const contentType = response.headers.get("content-type");

      // Case 1: Backend returns HTML
      if (contentType.includes("text/html")) {
        const htmlContent = await response.text();
        const win = window.open("", "_blank");
        win.document.write(htmlContent);
        win.document.close();
        win.print();
        return;
      }

      // Case 2: Backend returns PDF
      if (contentType.includes("application/pdf")) {
        const blob = await response.blob();
        const pdfURL = URL.createObjectURL(blob);
        const win = window.open(pdfURL, "_blank");
        win.onload = () => win.print();
        return;
      }

      alert("Unexpected print data format");
    } catch (error) {
      console.error("Print error:", error);
      alert("Failed to print Khata");
    } finally {
      setPrinting(false); // Hide loader
    }
  };

  const toggleVillage = (id) => {
    setFilterVillage((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4 space-y-5 h-screen ">
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
              {/* <button
                className="btn bg-green-600 text-white px-4 flex items-center gap-2"
                onClick={handleExportExcel}
                disabled={exporting}
              >
                {exporting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Exporting...
                  </>
                ) : (
                  <>
                    <FolderUp size={18} /> Export
                  </>
                )}
              </button> */}
              <ExportButtons
              data={khatas}
                columns={[
                  { label: "Sl/No", key: "id" },
                  { label: "Name of Village", key: "village_name" },
                  { label: "Village Code", key: "village_code" },
                  { label: "Khata No.", key: "khata_no" },
                  { label: "Plot No.", key: "plot_no" },
                  { label: "Kissam of the Land", key: "kissam_of_land" },
                  { label: "Category of Land", key: "land_category" },
                  { label: "Total Area (Ac)", key: "land_area_total_acres" },
                  { label: "Total Area (Ha)", key: "land_area_total_hectares" },
                  {
                    label: "Acquired Area (Ac)",
                    key: "land_area_acquired_acres",
                  },
                  {
                    label: "Acquired Area (Ha)",
                    key: "land_area_acquired_hectares",
                  },
                  { label: "Remarks", key: "lo13_remarks" },
                  { label: "Tahasil", key: "tahasil_name" },
                  { label: "R.I. Circle", key: "ri_circle_name" },
                  { label: "Thana No.", key: "thana_no" },
                  { label: "Date of Award", key: "date_of_award" },
                  { label: "RT Name", key: "name_of_recorded_tenant" },
                  { label: "PT Name", key: "name_of_present_tenant" },
                  { label: "Present Address", key: "present_address" },
                  {
                    label: "Affected Person",
                    key: "displaced_affected_person",
                  },
                  { label: "Unique ID", key: "unique_id" },
                  { label: "Plot Count", key: "plot_count" },
                  { label: "Created", key: "created_at" },
                  { label: "Reference Document", key: "reference_document" },
                ]}
              />

              <button
                className="btn bg-gray-600 text-white px-4 flex items-center gap-2"
                onClick={handlePrint}
                disabled={printing}
              >
                {printing ? (
                  <>
                    <span className="loading loading-spinner loading-sm text-blue-200"></span>
                    <p className="text-blue-200">Printing...</p>
                  </>
                ) : (
                  <>
                    <Printer size={18} /> Print
                  </>
                )}
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
              setLimit={setLimit}
              limit={limit}
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
