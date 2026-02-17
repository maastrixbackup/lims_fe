import React, { useEffect, useState } from "react";
import {
  Upload,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Pencil,
  Eye,
  Trash2,
} from "lucide-react";
import { API_BASE_URL } from "../../../utils/config";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useLandTypeParam } from "../../../utils/landtypes";
import { useLocation } from "react-router";
import { useSuccessMessage } from "../../../hooks/useSuccessMessage";
import SuccessMessage from "../../../shared/SuccessMessage";

const LandCost = () => {
  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();

  const [khatas, setKhatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editIndex, setEditIndex] = useState({ kIndex: null, rIndex: null });
  const [uploadingKey, setUploadingKey] = useState(null);

  const token = useSelector((state) => state.auth.userToken);
  const selectedProject = useSelector((state) => state.selectedProject);
  const projectId = selectedProject?.project?.id;
  const typeParam = useLandTypeParam();
  const location = useLocation();
  const plotId = location.state?.plot?.id;

  const fetchData = async () => {
    if (!projectId) return;

    const query = new URLSearchParams({
      project_id: projectId,
      type: typeParam,
    });

    if (plotId) {
      query.append("plot_id", plotId);
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/govtplots/getCompensationDetails?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success && data.data?.length > 0) {
        const mapped = data.data.map((item) => ({
          uniqueId: item.unique_id,
          khataNo: item.khata_no,
          totalComp: Number(item.total_compensation ?? 0),
          records: item.tenants.map((t) => ({
            id: t.id,
            leaseCaseNo: item.lease_case_no ?? t.lease_case_no ?? "No Data",
            plotNos: t.plot_nos ?? t.plot_no ?? "No Data",
            totalArea: Number(t.total_area ?? item.total_area ?? 0),
            landCostAmount: Number(
              t.land_cost_amount ?? t.compensation_payment ?? item.total_compensation ?? 0
            ),
            demandNoteFile: null,
            receiptFile: null,
            demandNoteUrl: t.demand_note_doc ?? t.demand_note ?? null,
            receiptUrl: t.receipt_doc ?? t.receipt ?? null,
          })),
        }));

        setKhatas(mapped);
      } else {
        setKhatas([]);
      }
    } catch (err) {
      showError(err.message || "Failed to fetch land cost data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [projectId, typeParam, plotId]);

  const validateTotals = (khata) => {
    const landCostSum = khata.records.reduce(
      (sum, r) => sum + Number(r.landCostAmount || 0),
      0
    );

    return {
      valid: Math.round(landCostSum) === Math.round(Number(khata.totalComp || 0)),
    };
  };

  const handleLandCostChange = (kIndex, rIndex, value) => {
    const amount = Math.max(0, Number(value) || 0);

    setKhatas((prev) => {
      const updated = [...prev];
      updated[kIndex].records[rIndex] = {
        ...updated[kIndex].records[rIndex],
        landCostAmount: amount,
      };
      return updated;
    });
  };

  const handleFileChange = async (kIndex, rIndex, file, fieldType) => {
    if (!file) return;

    const record = khatas[kIndex].records[rIndex];
    const uploadKey = `${record.id}-${fieldType}`;

    setUploadingKey(uploadKey);

    try {
      const formData = new FormData();
      formData.append("land_cost_id", record.id);
      formData.append("payment_proof", file);
      formData.append("attachment_type", fieldType);

      const res = await fetch(`${API_BASE_URL}/plots/landCostPaymentUpload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "File upload failed");
      }

      showSuccess(data.message || "File uploaded successfully");
      setKhatas((prev) => {
        const updated = [...prev];
        updated[kIndex].records[rIndex] = {
          ...updated[kIndex].records[rIndex],
          [fieldType === "demand_note" ? "demandNoteFile" : "receiptFile"]: file,
          [fieldType === "demand_note" ? "demandNoteUrl" : "receiptUrl"]:
            data?.data?.url || null,
        };
        return updated;
      });
    } catch (err) {
      showError(err.message || "Network error during file upload");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleDeleteRecord = (kIndex, rIndex) => {
    setKhatas((prev) => {
      const updated = [...prev];
      updated[kIndex] = {
        ...updated[kIndex],
        records: updated[kIndex].records.filter((_, idx) => idx !== rIndex),
      };
      return updated;
    });
    showSuccess("Row removed");
  };

  const handleUpdateRecord = async (kIndex, rIndex, data) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/govtplots/updatePlotPayment/${data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            lease_case_no: data.leaseCaseNo,
            plot_nos: data.plotNos,
            total_area: data.totalArea,
            land_cost_amount: data.landCostAmount,
            compensation_payment: data.landCostAmount,
          }),
        }
      );

      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Update failed");

      showSuccess(result.message || "Land cost details updated successfully");
      setKhatas((prev) => {
        const updated = [...prev];
        updated[kIndex].records[rIndex] = {
          ...updated[kIndex].records[rIndex],
          ...data,
        };
        return updated;
      });
    } catch (err) {
      showError(err.message || "Update failed");
    }
  };

  const handleExportExcel = () => {
    const exportRows = [];

    khatas.forEach((khata) => {
      khata.records.forEach((r) => {
        exportRows.push({
          "Unique ID": khata.uniqueId,
          "Khata No": khata.khataNo,
          "Khata Total Compensation": khata.totalComp,
          "Lease Case No": r.leaseCaseNo ?? "-",
          "Plot Nos": r.plotNos ?? "-",
          "Total Area": r.totalArea ?? 0,
          "Land Cost (Amount)": r.landCostAmount ?? 0,
          "Demand Note URL": r.demandNoteUrl ?? "-",
          "Receipt URL": r.receiptUrl ?? "-",
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Land Cost Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "Land_Cost_Data.xlsx");
  };

  const toggleAccordion = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  if (!projectId) {
    return (
      <main className="p-4">
        <h2 className="text-lg md:text-xl font-semibold capitalize mb-4">
          Cost Of Land - Payment Ready
        </h2>
        <div className="py-10 text-center text-gray-600">
          <p className="text-lg font-medium">
            Please <span className="text-primary font-semibold">Select a Project</span> first.
          </p>
          <p className="text-md text-gray-500 mt-1">
            A project is required to view land cost details.
          </p>
        </div>
      </main>
    );
  }

  if (loading) return <p className="p-4">Loading...</p>;

  if (khatas.length === 0) {
    return (
      <main className="p-4">
        <h2 className="text-lg md:text-xl font-semibold capitalize mb-4">
          Cost Of Land - Payment Ready
        </h2>
        <div className="py-10 text-center text-gray-600">
          <p className="text-md font-medium text-red-500">
            No land cost data found for the <span className="text-primary font-bold">selected project.</span>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-2 md:p-4 min-h-screen">
      <h2 className="text-lg md:text-xl font-semibold capitalize mb-4">
        Cost Of Land - Payment Ready
      </h2>

      {khatas.map((khata, kIndex) => {
        const { valid } = validateTotals(khata);

        return (
          <div key={kIndex} className="shadow-md mb-4 bg-white rounded-md">
            <div
              onClick={() => toggleAccordion(kIndex)}
              className="w-full flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 p-4 shadow hover:bg-gray-50 cursor-pointer"
            >
                <div className="text-left space-y-1">
                  <p className="font-semibold text-sm md:text-base">
                    Unique ID: <span className="text-primary">{khata.uniqueId}</span>
                  </p>
                  <p className="font-semibold text-sm md:text-base">
                    Khata No: <span className="text-primary">{khata.khataNo}</span>
                  </p>
                </div>

                <div className="text-left space-y-1 mt-2 sm:mt-0">
                  <p className="text-sm md:text-base">
                    <strong>Total Area:</strong> {khata.totalArea}
                  </p>
                  <p className="text-sm md:text-base">
                    <strong>Total Compensation:</strong> Rs {khata.totalComp.toLocaleString()}
                  </p>
                </div>
              <div className="flex flex-wrap items-center gap-3">
                {valid ? (
                  <span className="flex items-center text-green-600 text-sm whitespace-nowrap">
                    <CheckCircle size={18} className="mr-1" /> Totals Matched
                  </span>
                ) : (
                  <span className="flex items-center text-orange-600 text-sm whitespace-nowrap">
                    <AlertTriangle size={18} className="mr-1" /> Values do not match
                  </span>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportExcel();
                  }}
                  className="btn bg-green-600 text-white text-sm"
                >
                  Export Excel
                </button>

                <span>{openIndex === kIndex ? <ChevronUp /> : <ChevronDown />}</span>
              </div>
            </div>

            {openIndex === kIndex && (
              <div className="p-4">
                <div className="overflow-x-auto mt-2" style={{ scrollbarWidth: "thin" }}>
                  <table className="table table-zebra w-full text-xs sm:text-sm">
                    <thead className="bg-gray-200 text-gray-700">
                      <tr className="whitespace-nowrap">
                        <th>Lease Case No.</th>
                        <th>Plot Nos.</th>
                        <th>Total Area</th>
                        <th>Total Amount</th>
                        <th>Demand Note Attachment</th>
                        <th>Receipt Attachment</th>
                        <th>Edit / Delete / View</th>
                      </tr>
                    </thead>

                    <tbody>
                      {khata.records.map((r, rIndex) => (
                        <tr key={r.id ?? rIndex} className="whitespace-nowrap">
                          <td>{r.leaseCaseNo || "No Data"}</td>
                          <td>{r.plotNos || "No Data"}</td>
                          <td>{r.totalArea || 0}</td>

                          <td>
                            <input
                              type="number"
                              value={r.landCostAmount}
                              className="input input-bordered input-xs sm:input-sm w-28"
                              onChange={(e) => handleLandCostChange(kIndex, rIndex, e.target.value)}
                            />
                          </td>

                          <td>
                            <label className="cursor-pointer flex items-center gap-2">
                              <Upload size={16} />
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileChange(kIndex, rIndex, e.target.files?.[0], "demand_note")
                                }
                              />

                              {uploadingKey === `${r.id}-demand_note` ? (
                                <span className="loading loading-spinner loading-xs" />
                              ) : r.demandNoteFile ? (
                                <span
                                  className="text-green-600 text-xs max-w-[120px] truncate"
                                  title={r.demandNoteFile.name}
                                >
                                  {r.demandNoteFile.name}
                                </span>
                              ) : r.demandNoteUrl ? (
                                <a
                                  href={r.demandNoteUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-600 text-xs underline"
                                >
                                  View
                                </a>
                              ) : (
                                <span className="text-gray-400 text-xs">Choose</span>
                              )}
                            </label>
                          </td>

                          <td>
                            <label className="cursor-pointer flex items-center gap-2">
                              <Upload size={16} />
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileChange(kIndex, rIndex, e.target.files?.[0], "receipt")
                                }
                              />

                              {uploadingKey === `${r.id}-receipt` ? (
                                <span className="loading loading-spinner loading-xs" />
                              ) : r.receiptFile ? (
                                <span
                                  className="text-green-600 text-xs max-w-[120px] truncate"
                                  title={r.receiptFile.name}
                                >
                                  {r.receiptFile.name}
                                </span>
                              ) : r.receiptUrl ? (
                                <a
                                  href={r.receiptUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-600 text-xs underline"
                                >
                                  View
                                </a>
                              ) : (
                                <span className="text-gray-400 text-xs">Choose</span>
                              )}
                            </label>
                          </td>

                          <td>
                            <div className="flex items-center gap-2">
                              <button
                                className="btn btn-xs btn-warning text-white"
                                onClick={() => {
                                  setEditData({ ...r });
                                  setEditIndex({ kIndex, rIndex });
                                  setIsEditOpen(true);
                                }}
                              >
                                <Pencil size={14} />
                              </button>

                              <button
                                className="btn btn-xs btn-error text-white"
                                onClick={() => handleDeleteRecord(kIndex, rIndex)}
                              >
                                <Trash2 size={14} />
                              </button>

                              <button
                                className="btn btn-xs btn-info text-white"
                                onClick={() => {
                                  setEditData({ ...r });
                                  setIsViewOpen(true);
                                }}
                              >
                                <Eye size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {isEditOpen && editData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-5">
            <h3 className="text-lg font-semibold mb-4">Edit Land Cost</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Lease Case No.</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editData.leaseCaseNo || ""}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, leaseCaseNo: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium">Plot Nos.</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editData.plotNos || ""}
                  onChange={(e) => setEditData((prev) => ({ ...prev, plotNos: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs font-medium">Total Area</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={editData.totalArea}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, totalArea: Number(e.target.value) || 0 }))
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium">Total Amount</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={editData.landCostAmount}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      landCostAmount: Math.max(0, Number(e.target.value) || 0),
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button className="btn btn-ghost" onClick={() => setIsEditOpen(false)}>
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={async () => {
                  await handleUpdateRecord(editIndex.kIndex, editIndex.rIndex, editData);
                  setIsEditOpen(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewOpen && editData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-5">
            <h3 className="text-lg font-semibold mb-4">View Land Cost</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <strong>Lease Case No:</strong> {editData.leaseCaseNo || "No Data"}
              </p>
              <p>
                <strong>Plot Nos:</strong> {editData.plotNos || "No Data"}
              </p>
              <p>
                <strong>Total Area:</strong> {editData.totalArea || 0}
              </p>
              <p>
                <strong>Land Cost:</strong> {editData.landCostAmount || 0}
              </p>
            </div>
            <div className="flex justify-end mt-5">
              <button className="btn btn-ghost" onClick={() => setIsViewOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <SuccessMessage
        open={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={closeModal}
      />
    </main>
  );
};

export default LandCost;
