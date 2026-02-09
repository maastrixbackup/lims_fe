import React, { useState, useEffect } from "react";
import {
  Upload,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Pencil,
} from "lucide-react";
import { API_BASE_URL } from "../../../utils/config";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useLandTypeParam } from "../../../utils/landtypes";
// import { useSearchParams } from "react-router";
import { useLocation } from "react-router";
import { showToast } from "../../../utils/constants";
import { useSuccessMessage } from "../../../hooks/useSuccessMessage";
import SuccessMessage from "../../../shared/SuccessMessage";

const Compensation = () => {
  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();

  const [khatas, setKhatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editIndex, setEditIndex] = useState({ kIndex: null, rIndex: null });

  const token = useSelector((state) => state.auth.userToken);
  const selectedProject = useSelector((state) => state.selectedProject);
  const projectId = selectedProject?.project?.id;
  const typeParam = useLandTypeParam();
  console.log("typeParam", typeParam);
  const location = useLocation();
  const plotId = location.state?.plot?.id;
  console.log("plotId", plotId);
  const [uploadingId, setUploadingId] = useState(null);

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
        `${API_BASE_URL}/plots/getCompensationDetails?${query.toString()}`,
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
          totalArea: Number(item.total_area),
          totalComp: Number(item.total_compensation),
          records: item.tenants.map((t) => ({
            id: t.id,
            plotNo: t.plot_no,
            tenant: t.present_tenant,
            paymentArea: Number(t.payment_area),
            compPayment: Number(t.compensation_payment),
            apportionment: Number(t.apportionment_percent),
            bankAcc: t.bank_ac,
            bankName: t.bank_name,
            ifsc: t.ifsc,
            status: t.status,
            txnNumber: t.transaction_no,
            file: null,
          })),
        }));
        console.log("mapped data", mapped);
        setKhatas(mapped);
      } else {
        setKhatas([]);
      }
    } catch (err) {
      showError(err.message || "Failed to fetch compensation data");
    }

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [projectId, typeParam, plotId]);

  const validateTotals = (khata) => {
    const compSum = khata.records.reduce(
      (sum, r) => sum + Number(r.compPayment || 0),
      0
    );

    return {
      valid: Math.round(compSum) === Math.round(khata.totalComp),
    };
  };

  const handleApportionChange = (kIndex, rIndex, value) => {
    let num = value;
    if (num < 0) num = 0;
    if (num > 100) num = 100;

    setKhatas((prev) => {
      const newData = [...prev];
      const khata = newData[kIndex];
      const records = khata.records;

      // Update current record
      records[rIndex].apportionment = num;

      // Calculate used percentage (except last)
      let usedPercent = 0;
      records.forEach((r, i) => {
        if (i !== records.length - 1) {
          usedPercent += Number(r.apportionment || 0);
        }
      });

      const lastIndex = records.length - 1;
      const remaining = Math.max(0, 100 - usedPercent);

      // Auto-adjust last row
      records[lastIndex].apportionment = rIndex === lastIndex ? num : remaining;

      // 🔥 RECALCULATE paymentArea + compPayment
      records.forEach((r) => {
        r.compPayment = (
          (Number(r.apportionment) / 100) *
          khata.totalComp
        ).toFixed(2);

        r.paymentArea = (
          (Number(r.apportionment) / 100) *
          khata.totalArea
        ).toFixed(2);
      });

      return newData;
    });
  };

  const handlePaymentChange = (kIndex, rIndex, value) => {
    let amount = value;

    if (amount < 0) amount = 0;

    setKhatas((prev) => {
      const newData = [...prev];
      const khata = newData[kIndex];
      const records = khata.records;
      const lastIndex = records.length - 1;

      records[rIndex].compPayment = amount;
      let usedAmount = 0;
      records.forEach((r, i) => {
        if (i !== lastIndex) {
          usedAmount += Number(r.compPayment || 0);
        }
      });

      if (usedAmount > khata.totalComp) {
        records[rIndex].compPayment -= usedAmount - khata.totalComp;
        usedAmount = khata.totalComp;
      }
      if (rIndex !== lastIndex) {
        records[lastIndex].compPayment = Number(
          Math.max(0, khata.totalComp - usedAmount).toFixed(2)
        );
      }
      records.forEach((r) => {
        r.apportionment = Number(
          ((Number(r.compPayment) / khata.totalComp) * 100).toFixed(2)
        );
      });

      return newData;
    });
  };

  const handleFileChange = async (kIndex, rIndex, file) => {
    if (!file) return;

    const record = khatas[kIndex].records[rIndex];

    setUploadingId(record.id);

    try {
      const formData = new FormData();
      formData.append("land_cost_id", record.id);
      formData.append("payment_proof", file);

      const res = await fetch(`${API_BASE_URL}/plots/landCostPaymentUpload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        showSuccess(data.message || "File uploaded successfully");
        setKhatas((prev) => {
          const updated = [...prev];
          updated[kIndex].records[rIndex] = {
            ...updated[kIndex].records[rIndex],
            file: null,
            status: "processing",
          };
          return updated;
        });
      } else {
        showError(err.message || "File upload failed");
      }
    } catch (err) {
      showError(err.message || "Network error during file upload");
    }

    setUploadingId(null);
  };

  const handleExportExcel = () => {
    const exportRows = [];

    khatas.forEach((khata) => {
      khata.records.forEach((r) => {
        exportRows.push({
          "Unique ID": khata.uniqueId,
          "Khata No": khata.khataNo,
          "Total Area": khata.totalArea,
          "Total Compensation": khata.totalComp,
          "Plot No": r.plotNo,
          Tenant: r.tenant,
          "Payment Area": r.paymentArea,
          "Compensation Payment": r.compPayment,
          "Apportionment (%)": r.apportionment,
          "Bank A/C": r.bankAcc ?? "-",
          "Bank Name": r.bankName ?? "-",
          IFSC: r.ifsc ?? "-",
          Status: r.status,
          "Txn No": r.txnNumber,
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Compensation Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "Compensation_Payments.xlsx");
  };

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleUpdatePayment = async (kIndex, rIndex, data) => {
    console.log("data*********", data);
    try {
      const res = await fetch(
        `${API_BASE_URL}/plots/updatePlotPayment/${data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            payment_area: data.paymentArea,
            total_compensation: data.totalComp,
            compensation_payment: data.compPayment,
            apportionment_percent: data.apportionment,
            bank_ac: data.bankAcc,
            bank_name: data.bankName,
            ifsc: data.ifsc,
            transaction_no: data.txnNumber,
          }),
        }
      );

      const result = await res.json();
      if (!result.success) throw new Error("Update failed");
      showSuccess(result.message || "Payment details updated successfully");
      setKhatas((prev) => {
        const updated = [...prev];
        updated[kIndex].records[rIndex] = {
          ...updated[kIndex].records[rIndex],
          ...data,
          status: "Paid",
        };
        return updated;
      });
    } catch (err) {
      showError(err.message || "Payment completion failed");
    }
  };
  const handlePaymentCompleted = async (khata) => {
    const { valid } = validateTotals(khata);
    if (!valid) {
      window.toast?.error("Totals do not match");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/plots/paymentCompleted`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          unique_id: khata.uniqueId,
          project_id: projectId,
          type: typeParam,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Payment completion failed");
      }

      showSuccess(result.message ||"Payment completed successfully..");
      setLoading(true);
      await fetchData();
      setKhatas((prev) =>
        prev.map((k) =>
          k.uniqueId === khata.uniqueId
            ? {
                ...k,
                records: k.records.map((r) => ({
                  ...r,
                  status: "completed",
                })),
              }
            : k
        )
      );
    } catch (err) {
      showError(err.message || "Payment completion failed");
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
            A project is required to view Land Compensation details.
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
            No Land Cost / Compensation data found for the{" "}
            <span className="text-primary font-bold">selected project.</span>
          </p>
          <p className="text-md text-gray-500 mt-1">
            Try selecting a different project or add compensation records.
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
              className="w-full flex flex-col lg:flex-row lg:justify-between lg:items-center
             gap-4 p-4 shadow-lg hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:gap-8 w-full lg:w-auto">
                <div className="text-left space-y-1">
                  <p className="font-semibold text-sm md:text-base">
                    Unique ID:{" "}
                    <span className="text-primary">{khata.uniqueId}</span>
                  </p>
                  <p className="font-semibold text-sm md:text-base">
                    Khata No:{" "}
                    <span className="text-primary">{khata.khataNo}</span>
                  </p>
                </div>

                <div className="text-left space-y-1 mt-2 sm:mt-0">
                  <p className="text-sm md:text-base">
                    <strong>Total Area:</strong> {khata.totalArea}
                  </p>
                  <p className="text-sm md:text-base">
                    <strong>Total Compensation:</strong> ₹
                    {khata.totalComp.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Right: Status + Actions */}
              <div className="flex flex-wrap items-center gap-3 justify-between lg:justify-end w-full lg:w-auto">
                {valid ? (
                  <span className="flex items-center text-green-600 text-sm whitespace-nowrap">
                    <CheckCircle size={18} className="mr-1" /> Totals Matched
                  </span>
                ) : (
                  <span className="flex items-center text-orange-600 text-sm whitespace-nowrap">
                    <AlertTriangle size={18} className="mr-1" /> Values do not
                    match
                  </span>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportExcel();
                  }}
                  className="btn bg-green-600 text-white flex items-center gap-2 text-sm"
                >
                  Export Excel
                </button>

                <span className="ml-auto lg:ml-0">
                  {openIndex === kIndex ? <ChevronUp /> : <ChevronDown />}
                </span>
              </div>
            </div>

            {openIndex === kIndex && (
              <div className="p-4">
                <div
                  className="overflow-x-auto mt-4"
                  style={{ scrollbarWidth: "thin" }}
                >
                  <table className="table table-zebra w-full text-xs sm:text-sm">
                    <thead className="bg-gray-200 text-gray-700">
                      <tr className="whitespace-nowrap">
                        <th>Plot No.</th>
                        <th>Present Tenant</th>
                        <th>Payment Area</th>
                        <th>Compensation Payment</th>
                        <th>Apportionment (%)</th>
                        <th>Days Of Interest</th>
                        <th>Bank A/C</th>
                        <th>Bank</th>
                        <th>IFSC</th>
                        <th>Status</th>
                        <th>Txn No.</th>
                        <th>Upload</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {khata.records.map((r, rIndex) => (
                        <tr key={rIndex} className="whitespace-nowrap">
                          <td>{r.plotNo}</td>
                          <td>{r.tenant}</td>
                          <td>{r.paymentArea}</td>

                          <td>
                            <input
                              type="number"
                              value={r.compPayment}
                              className="input input-bordered input-xs sm:input-sm w-24"
                              onChange={(e) =>
                                handlePaymentChange(
                                  kIndex,
                                  rIndex,
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          <td>
                            <input
                              type="number"
                              value={r.apportionment}
                              className="input input-bordered input-xs sm:input-sm w-20"
                              onChange={(e) =>
                                handleApportionChange(
                                  kIndex,
                                  rIndex,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>{r.days_of_interest ?? "No Data"}</td>
                          <td>{r.bankAcc ?? "No Data"}</td>
                          <td>{r.bankName ?? "No Data"}</td>
                          <td>{r.ifsc ?? "No Data"}</td>

                          <td>
                            <span
                              className={`badge text-xs ${
                                r.status === "Paid"
                                  ? "badge-success"
                                  : "badge-warning"
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>

                          <td>{r.txnNumber ?? "No Data"}</td>

                          <td>
                            <label className="cursor-pointer flex items-center gap-2">
                              <Upload size={16} />

                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileChange(
                                    kIndex,
                                    rIndex,
                                    e.target.files[0]
                                  )
                                }
                              />

                              {uploadingId === r.id ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : r.file ? (
                                <span
                                  className="text-green-600 text-xs max-w-[120px] truncate"
                                  title={r.file.name}
                                >
                                  {r.file.name}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">
                                  Choose
                                </span>
                              )}
                            </label>
                          </td>

                          <td>
                            <button
                              className="btn btn-xs btn-warning text-white"
                              onClick={() => {
                                setEditData({
                                  ...r,
                                  totalComp: khata.totalComp,
                                });
                                setEditIndex({ kIndex, rIndex });
                                setIsEditOpen(true);
                              }}
                            >
                              <Pencil size={14} /> Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {isEditOpen && editData && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-5">
                      <h3 className="text-lg font-semibold mb-4">
                        Edit Compensation
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium">
                            Payment Area
                          </label>
                          <input
                            type="number"
                            className="input input-bordered w-full"
                            value={editData.paymentArea}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                paymentArea: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">
                            Total Compensation
                          </label>
                          <input
                            type="number"
                            className="input input-bordered w-full"
                            value={editData.totalComp}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                totalComp: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">
                            Compensation Payment
                          </label>
                          <input
                            type="number"
                            className="input input-bordered w-full"
                            value={editData.compPayment}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                compPayment: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium">
                            Apportionment (%)
                          </label>
                          <input
                            type="number"
                            className="input input-bordered w-full"
                            value={editData.apportionment}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                apportionment: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium">
                            Transaction No
                          </label>
                          <input
                            type="text"
                            className="input input-bordered w-full"
                            value={editData.txnNumber}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                txnNumber: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium">
                            Bank A/C
                          </label>
                          <input
                            type="text"
                            className="input input-bordered w-full"
                            value={editData.bankAcc}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                bankAcc: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            className="input input-bordered w-full"
                            value={editData.bankName}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                bankName: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="text-xs font-medium">IFSC</label>
                          <input
                            type="text"
                            className="input input-bordered w-full"
                            value={editData.ifsc}
                            onChange={(e) =>
                              setEditData({ ...editData, ifsc: e.target.value })
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
                            await handleUpdatePayment(
                              editIndex.kIndex,
                              editIndex.rIndex,
                              editData
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

                <div className="flex justify-end mt-4 md:mt-6">
                  <button
                    className="btn btn-primary w-full md:w-auto"
                    disabled={!valid}
                    title={!valid ? "Totals do not match!" : ""}
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
      <SuccessMessage
        open={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={closeModal}
      />
    </main>
  );
};

export default Compensation;
