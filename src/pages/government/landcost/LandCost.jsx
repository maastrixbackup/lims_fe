import React, { useEffect, useState } from "react";
import {
  Upload,
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
import Loader from "../../../shared/Loader";

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
        },
      );

      const data = await res.json();

      if (data.success && data.data?.length > 0) {
        const groupedByLease = {};

        data.data.forEach((item) => {
          const tenants = item.tenants?.length ? item.tenants : [{}];

          tenants.forEach((t) => {
            const leaseCaseNo =
              item.lease_case_no ?? t.lease_case_no ?? "-";
            const key = leaseCaseNo || "-";

            if (!groupedByLease[key]) {
              groupedByLease[key] = {
                leaseCaseNo: key,
                khataNosSet: new Set(),
                plotNosSet: new Set(),
                uniqueIds: new Set(),
                totalArea: 0,
                landCostAmount: null,
                id: t.id,
                landCostId: t.land_cost_id ?? t.id ?? null,
                demandNoteFile: null,
                receiptFile: null,
                demandNoteUrl: t.demand_note_doc ?? t.demand_note ?? null,
                receiptUrl: t.receipt_doc ?? t.receipt ?? null,
              };
            }

            const row = groupedByLease[key];
            const uniqueId = item.unique_id ?? t.unique_id ?? null;
            if (uniqueId) {
              row.uniqueIds.add(uniqueId);
            }

            const rawKhataNos = item.khata_no ?? t.khata_no ?? "";
            rawKhataNos
              .toString()
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
              .forEach((k) => row.khataNosSet.add(k));

            const rawPlotNos = t.plot_nos ?? t.plot_no ?? "";
            rawPlotNos
              .toString()
              .split(",")
              .map((p) => p.trim())
              .filter(Boolean)
              .forEach((p) => row.plotNosSet.add(p));

            row.totalArea += Number(t.total_area ?? item.total_area ?? 0);
            const landCostValue = t.land_cost_amount ?? t.compensation_payment;
            if (
              landCostValue !== null &&
              landCostValue !== undefined &&
              landCostValue !== ""
            ) {
              row.landCostAmount =
                Number(row.landCostAmount || 0) + Number(landCostValue);
            }

            if (!row.id && t.id) {
              row.id = t.id;
            }
            if (!row.landCostId && (t.land_cost_id || t.id)) {
              row.landCostId = t.land_cost_id ?? t.id;
            }
          });
        });

        const mapped = Object.values(groupedByLease).map(
          ({ khataNosSet, plotNosSet, uniqueIds, ...row }) => {
            const khataNos = khataNosSet.size
              ? Array.from(khataNosSet).join(", ")
              : "-";
            const plotNos = plotNosSet.size
              ? Array.from(plotNosSet).join(", ")
              : "-";

            return {
              leaseCaseNo: row.leaseCaseNo,
              khataNos,
              uniqueIds: Array.from(uniqueIds),
              totalArea: row.totalArea,
              records: [
                {
                  id: row.id,
                  landCostId: row.landCostId,
                  leaseCaseNo: row.leaseCaseNo,
                  khataNos,
                  plotNos,
                  totalArea: row.totalArea,
                  landCostAmount: row.landCostAmount,
                  demandNoteFile: row.demandNoteFile,
                  receiptFile: row.receiptFile,
                  demandNoteUrl: row.demandNoteUrl,
                  receiptUrl: row.receiptUrl,
                },
              ],
            };
          },
        );

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

  const handleLandCostChange = (kIndex, rIndex, value) => {
    setKhatas((prev) => {
      const updated = [...prev];
      updated[kIndex].records[rIndex] = {
        ...updated[kIndex].records[rIndex],
        landCostAmount: value,
      };
      return updated;
    });
  };

  const handleFileChange = async (kIndex, rIndex, file, attachmentType) => {
    if (!file) return;

    const record = khatas[kIndex].records[rIndex];
    const landCostId = record.landCostId ?? record.id;
    if (!landCostId) {
      showError("land_cost_id is missing for this record");
      return;
    }

    const uploadKey = `${landCostId}-${attachmentType}`;
    setUploadingKey(uploadKey);

    try {
      const formData = new FormData();
      formData.append("land_cost_id", String(landCostId));
      if (attachmentType === "demand_note") {
        formData.append("demand_note_attachment", file, file.name);
      } else {
        formData.append("payment_proof", file, file.name);
      }

      const res = await fetch(
        `${API_BASE_URL}/govtplots/landCostPaymentUpload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "File upload failed");
      }

      showSuccess(result.message || "File uploaded successfully");

      setKhatas((prev) => {
        const updated = [...prev];

        updated[kIndex].records[rIndex] = {
          ...updated[kIndex].records[rIndex],
          ...(attachmentType === "demand_note"
            ? {
                demandNoteFile: file,
                demandNoteUrl: result?.data?.url || null,
              }
            : {
                receiptFile: file,
                receiptUrl: result?.data?.url || null,
              }),
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
            land_cost_amount: Number(data.landCostAmount || 0),
            compensation_payment: Number(data.landCostAmount || 0),
          }),
        },
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
          "Lease Case No": khata.leaseCaseNo ?? r.leaseCaseNo ?? "-",
          "Khata Nos": khata.khataNos ?? r.khataNos ?? "-",
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

  const handlePaymentCompleted = async (khata) => {
    const leaseCaseNo = khata?.leaseCaseNo;
    const uniqueIds = Array.isArray(khata?.uniqueIds)
      ? khata.uniqueIds.filter(Boolean)
      : [];

    if (!leaseCaseNo || leaseCaseNo === "-") {
      showError("Lease case number is missing for this payment");
      return;
    }
    if (!uniqueIds.length) {
      showError("Unique ID is missing for this lease case");
      return;
    }

    const payloadBase = {
      project_id: Number(projectId),
      type: Number(typeParam) || 2,
    };

    try {
      const results = await Promise.all(
        uniqueIds.map(async (uniqueId) => {
          const res = await fetch(`${API_BASE_URL}/govtplots/paymentCompleted`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              lease_case_no: leaseCaseNo,
              unique_id: uniqueId,
              ...payloadBase,
            }),
          });

          const data = await res.json();
          if (!res.ok || !data?.success) {
            throw new Error(data?.message || "Failed to mark payment completed");
          }
          return data;
        }),
      );

      showSuccess(
        results?.[0]?.message || "Payment marked as completed successfully",
      );
      await fetchData();
    } catch (err) {
      showError(err.message || "Failed to mark payment as completed");
    }
  };

  if (!projectId) {
    return (
      <main className="p-4">
        <h2 className="text-lg md:text-xl font-semibold capitalize mb-4">
          Cost Of Land - Payment Ready
        </h2>
        <div className="py-10 text-center text-gray-600">
          <p className="text-lg font-medium">
            Please{" "}
            <span className="text-primary font-semibold">Select a Project</span>{" "}
            first.
          </p>
          <p className="text-md text-gray-500 mt-1">
            A project is required to view land cost details.
          </p>
        </div>
      </main>
    );
  }

  if (loading) return <Loader message="Loading land cost list..." />;

  if (khatas.length === 0) {
    return (
      <main className="p-4">
        <h2 className="text-lg md:text-xl font-semibold capitalize mb-4">
          Cost Of Land - Payment Ready
        </h2>
        <div className="py-10 text-center text-gray-600">
          <p className="text-md font-medium text-red-500">
            No land cost data found for the{" "}
            <span className="text-primary font-bold">selected project.</span>
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
        return (
          <div key={kIndex} className="shadow-md mb-4 bg-white rounded-md">
            <div
              onClick={() => toggleAccordion(kIndex)}
              className="w-full flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 p-4 shadow hover:bg-gray-50 cursor-pointer"
            >
              <div className="text-left space-y-1">
                <p className="font-semibold text-sm md:text-base">
                  Lease Case No:{" "}
                  <span className="text-primary">{khata.leaseCaseNo}</span>
                </p>
                <p className="font-semibold text-sm md:text-base">
                  Khata Nos:{" "}
                  <span className="text-primary">{khata.khataNos}</span>
                </p>
              </div>

              <div className="text-left space-y-1 mt-2 sm:mt-0">
                <p className="text-sm md:text-base">
                  <strong>Total Area:</strong> {khata.totalArea}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportExcel();
                  }}
                  className="btn bg-green-600 text-white text-sm"
                >
                  Export Excel
                </button>

                <span>
                  {openIndex === kIndex ? <ChevronUp /> : <ChevronDown />}
                </span>
              </div>
            </div>
            {openIndex === kIndex && (
              <div className="p-4 space-y-4">
                {khata.records.map((r, rIndex) => (
                  <div
                    key={r.id ?? rIndex}
                    className="shadow-md rounded-lg p-3 md:p-4 bg-blue-50"
                  >
                      <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-500 mb-1">Plot Nos.</p>
                      <div className="text-sm bg-white shadow-md rounded-md p-2 max-h-28 overflow-y-auto break-words leading-6 bg-blue-50">
                        {r.plotNos || "-"}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">Khata Nos.</p>
                        <p className="text-sm font-medium break-words">
                          {r.khataNos || khata.khataNos || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">Total Area</p>
                        <p className="text-sm font-medium">{r.totalArea || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">Total Amount</p>
                        <input
                          type="number"
                          value={r.landCostAmount ?? ""}
                          className="input input-bordered input-sm w-full max-w-[180px]"
                          onChange={(e) =>
                            handleLandCostChange(kIndex, rIndex, e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">Actions</p>
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
                      </div>
                    </div>

                  

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">Demand Note Attachment</p>
                        <label className="cursor-pointer flex items-center gap-2">
                          <Upload size={16} />
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) =>
                              handleFileChange(
                                kIndex,
                                rIndex,
                                e.target.files?.[0],
                                "demand_note"
                              )
                            }
                          />
                          {uploadingKey === `${r.landCostId ?? r.id}-demand_note` ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : r.demandNoteFile ? (
                            <span
                              className="text-green-600 text-xs max-w-[180px] truncate"
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
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">Receipt Attachment</p>
                        <label className="cursor-pointer flex items-center gap-2">
                          <Upload size={16} />
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) =>
                              handleFileChange(
                                kIndex,
                                rIndex,
                                e.target.files?.[0],
                                "receipt"
                              )
                            }
                          />
                          {uploadingKey === `${r.landCostId ?? r.id}-receipt` ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : r.receiptFile ? (
                            <span
                              className="text-green-600 text-xs max-w-[180px] truncate"
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
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end mt-4 md:mt-6">
                  <button
                    className="btn btn-primary w-full md:w-auto"
                    onClick={() => handlePaymentCompleted(khata)}
                  >
                    Payment Completed
                  </button>
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
                  readOnly
                  tabIndex={-1}
                />
              </div>

              <div>
                <label className="text-xs font-medium">Khata Nos.</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editData.khataNos || ""}
                  readOnly
                  tabIndex={-1}
                />
              </div>

              <div>
                <label className="text-xs font-medium">Plot Nos.</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editData.plotNos || ""}
                  readOnly
                  tabIndex={-1}
                />
              </div>

              <div>
                <label className="text-xs font-medium">Total Area</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={editData.totalArea}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      totalArea: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium">Total Amount</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={editData.landCostAmount ?? ""}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      landCostAmount: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                className="btn btn-ghost"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={async () => {
                  await handleUpdateRecord(
                    editIndex.kIndex,
                    editIndex.rIndex,
                    editData,
                  );
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
                <strong>Lease Case No:</strong>{" "}
                {editData.leaseCaseNo || "-"}
              </p>
              <p>
                <strong>Khata Nos:</strong> {editData.khataNos || "-"}
              </p>
              <p>
                <strong>Plot Nos:</strong> {editData.plotNos || "-"}
              </p>
              <p>
                <strong>Total Area:</strong> {editData.totalArea || "-"}
              </p>
              <p>
                <strong>Land Cost:</strong>{" "}
                {editData.landCostAmount || "-"}
              </p>
              <p>
                <strong>Demand Note Attachment:</strong>{" "}
                {editData.demandNoteAttachment || "-"}
              </p>
              <p>
                <strong>Receipt Attachment:</strong>{" "}
                {editData.receiptAttachment || "-"}
              </p>
            </div>
            <div className="flex justify-end mt-5">
              <button
                className="btn btn-ghost"
                onClick={() => setIsViewOpen(false)}
              >
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

