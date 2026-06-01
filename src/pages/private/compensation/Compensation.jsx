import React, { useState, useEffect } from "react";
import {
  Upload,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Pencil,
  Download,
  FileText,
  X,
  Landmark,
  Hash,
  BadgeCheck,
  Clock,
} from "lucide-react";
import { API_BASE_URL } from "../../../utils/config";
import { safeFetch } from "../../../utils/apiClient";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useLandTypeParam } from "../../../utils/landtypes";
import { useLocation } from "react-router";
import { useSuccessMessage } from "../../../hooks/useSuccessMessage";
import SuccessMessage from "../../../shared/SuccessMessage";
import Loader from "../../../shared/Loader";

/* ─── Status badge config ─── */
const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    icon: BadgeCheck,
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  processing: {
    label: "Processing",
    icon: Clock,
    cls: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  paid: {
    label: "Paid",
    icon: CheckCircle,
    cls: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  default: {
    label: "Pending",
    icon: Clock,
    cls: "bg-slate-100 text-slate-600 border border-slate-200",
  },
};

const StatusBadge = ({ status }) => {
  const key = status?.toLowerCase();
  const cfg = STATUS_CONFIG[key] || STATUS_CONFIG.default;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${cfg.cls}`}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
};

/* ─── helpers ─── */
function roundTo(value, decimals = 2) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return Number(num.toFixed(decimals));
}

function normalizeApportionmentForUi(rawValue, compPayment, totalComp) {
  const raw = Number(rawValue);
  if (!Number.isFinite(raw)) return 0;
  const total = Number(totalComp);
  const payment = Number(compPayment);
  const expectedPercent =
    Number.isFinite(total) && total > 0 && Number.isFinite(payment)
      ? (payment / total) * 100
      : null;
  if (expectedPercent !== null) {
    if (Math.abs(raw - expectedPercent) < 0.05) return roundTo(raw, 2);
    if (Math.abs(raw * 100 - expectedPercent) < 0.05)
      return roundTo(raw * 100, 2);
  }
  return raw <= 1 ? roundTo(raw * 100, 2) : roundTo(raw, 2);
}

function normalizeApportionmentForApi(uiValue) {
  const percent = Number(uiValue);
  if (!Number.isFinite(percent)) return 0;
  return roundTo(percent / 100, 4);
}

/* ─── Stat pill ─── */
const Stat = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
      {label}
    </span>
    <span className="text-sm font-semibold text-slate-800 mt-0.5">{value}</span>
  </div>
);

/* ─── Column header ─── */
const Th = ({ children, className = "" }) => (
  <th
    className={`px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 first:rounded-tl-lg last:rounded-tr-lg ${className}`}
  >
    {children}
  </th>
);

/* ─── Table cell ─── */
const Td = ({ children, className = "" }) => (
  <td className={`px-3 py-2.5 text-sm text-slate-700 ${className}`}>
    {children}
  </td>
);

/* ─── Numeric input ─── */
const NumInput = ({ value, onChange, className = "" }) => (
  <input
    type="text"
    inputMode="decimal"
    value={value === 0 || value === "0" ? "" : value ?? ""}
    onChange={onChange}
    className={`w-24 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-800 shadow-sm
      focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${className}`}
    placeholder=""
  />
);

/* ═══════════════════════════════════════════ */
const Compensation = () => {
  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();

  const [khatas, setKhatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editIndex, setEditIndex] = useState({ kIndex: null, rIndex: null });
  const [completingPlotKey, setCompletingPlotKey] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);

  const token = useSelector((s) => s.auth.userToken);
  const selectedProject = useSelector((s) => s.selectedProject);
  const projectId = selectedProject?.project?.id;
  const typeParam = useLandTypeParam();
  const location = useLocation();
  const plotId = location.state?.plot?.id;

  /* ── fetch ── */
  const fetchData = async () => {
    if (!projectId) return;
    const query = new URLSearchParams({ project_id: projectId, type: typeParam });
    if (plotId) query.append("plot_id", plotId);
    try {
      const res = await safeFetch(
        `${API_BASE_URL}/plots/getCompensationDetails?${query.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        setKhatas(
          data.data.map((item) => ({
            uniqueId: item.unique_id,
            khataNo: item.khata_no,
            totalArea: Number(item.total_area),
            totalComp: Number(item.total_compensation),
            records: item.tenants.map((t) => ({
              id: t.id,
              plotNo: t.plot_no,
              tenant: t.present_tenant,
              plotCompensation: Number(t.total_compensation ?? 0),
              paymentArea: Number(t.payment_area),
              compPayment: Number(t.compensation_payment),
              apportionment: normalizeApportionmentForUi(
                t.apportionment_percent,
                t.compensation_payment,
                item.total_compensation
              ),
              bankAcc: t.bank_ac,
              bankName: t.bank_name,
              ifsc: t.ifsc,
              status: t.status,
              txnNumber: t.transaction_no,
              file: null,
              fileName:
                t.payment_proof_file_name ||
                t.payment_proof_filename ||
                t.payment_proof ||
                "",
              fileUrl:
                t.payment_proof_url ||
                t.payment_proof_doc ||
                t.payment_proof_path ||
                "",
            })),
          }))
        );
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

  /* ── validation ── */
  const validatePlotTotals = (plotRecords = []) => {
    const apportionmentSum = roundTo(
      plotRecords.reduce((sum, record) => sum + Number(record.apportionment || 0), 0),
      2
    );
    const compensationSum = roundTo(
      plotRecords.reduce((sum, record) => sum + Number(record.compPayment || 0), 0),
      2
    );
    const plotCompensation = roundTo(getPlotCompensation(plotRecords), 2);

    return {
      apportionmentSum,
      compensationSum,
      plotCompensation,
      valid:
        Math.round(apportionmentSum) === 100 &&
        Math.round(compensationSum) === Math.round(plotCompensation),
    };
  };

  /* ── group by plot ── */
  const groupRecordsByPlot = (records = []) =>
    records.reduce((groups, record, idx) => {
      const key = record.plotNo || "No data found";
      if (!groups[key]) groups[key] = [];
      groups[key].push({ ...record, recordIndex: idx });
      return groups;
    }, {});

  const getPlotCompensation = (plotRecords = []) => {
    const compensationCounts = plotRecords.reduce((acc, record) => {
      const amount = Number(record.plotCompensation ?? 0);
      if (!Number.isFinite(amount) || amount <= 0) return acc;

      const key = amount.toFixed(4);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const dominantCompensation = Object.entries(compensationCounts).sort(
      (a, b) => b[1] - a[1] || Number(b[0]) - Number(a[0]),
    )[0];

    if (dominantCompensation) {
      return Number(dominantCompensation[0]);
    }

    return roundTo(
      plotRecords.reduce((sum, record) => sum + Number(record.compPayment || 0), 0),
      2,
    );
  };

  const getPlotTotals = (plotRecords = []) => ({
    totalCompensation: roundTo(
      plotRecords.reduce((sum, record) => sum + Number(record.compPayment || 0), 0),
      2
    ),
    totalPaymentArea: roundTo(
      plotRecords.reduce((sum, record) => sum + Number(record.paymentArea || 0), 0),
      4
    ),
  });

  /* ── apportionment change ── */
  const handleApportionChange = (kIndex, rIndex, value, plotRecords) => {
    let num = Number(value);
    if (!Number.isFinite(num)) num = 0;
    num = Math.min(100, Math.max(0, num));
    setKhatas((prev) => {
      const newData = [...prev];
      const { records, totalArea } = newData[kIndex];
      const plotIndexes = plotRecords.map((record) => record.recordIndex);
      const lastIdx = plotIndexes[plotIndexes.length - 1];
      const plotCompensation = getPlotCompensation(plotRecords);

      records[rIndex].apportionment = num;

      let used = 0;
      plotIndexes.forEach((index) => {
        if (index !== lastIdx) {
          used += Number(records[index].apportionment || 0);
        }
      });

      records[lastIdx].apportionment =
        rIndex === lastIdx ? num : Math.max(0, 100 - used);

      plotIndexes.forEach((index) => {
        const pct = Number(records[index].apportionment) || 0;
        records[index].compPayment = roundTo(
          (pct / 100) * Number(plotCompensation || 0),
          2
        );
        records[index].paymentArea = roundTo(
          (pct / 100) * Number(totalArea || 0),
          4
        );
      });

      return newData;
    });
  };

  /* ── payment change ── */
  const handlePaymentChange = (kIndex, rIndex, value, plotRecords) => {
    let amount = Math.max(0, Number(value) || 0);
    setKhatas((prev) => {
      const newData = [...prev];
      const khata = newData[kIndex];
      const { records, totalArea } = khata;
      const plotIndexes = plotRecords.map((record) => record.recordIndex);
      const lastIdx = plotIndexes[plotIndexes.length - 1];
      const plotCompensation = getPlotCompensation(plotRecords);

      records[rIndex].compPayment = amount;

      let used = 0;
      plotIndexes.forEach((index) => {
        if (index !== lastIdx) {
          used += Number(records[index].compPayment || 0);
        }
      });

      if (used > plotCompensation) {
        records[rIndex].compPayment -= used - plotCompensation;
        used = plotCompensation;
      }

      if (rIndex !== lastIdx) {
        records[lastIdx].compPayment = Number(
          Math.max(0, plotCompensation - used).toFixed(2)
        );
      }

      plotIndexes.forEach((index) => {
        const pct =
          Number(plotCompensation) > 0
            ? roundTo(
                (Number(records[index].compPayment) / Number(plotCompensation)) *
                  100,
                2
              )
            : 0;
        records[index].apportionment = pct;
        records[index].paymentArea = roundTo(
          (pct / 100) * Number(totalArea || 0),
          4
        );
      });

      return newData;
    });
  };

  /* ── file upload ── */
  const handleFileChange = async (kIndex, rIndex, file) => {
    if (!file) return;
    const record = khatas[kIndex].records[rIndex];
    setUploadingId(record.id);
    try {
      const formData = new FormData();
      formData.append("land_cost_id", record.id);
      formData.append("payment_proof", file);
      const res = await safeFetch(`${API_BASE_URL}/plots/landCostPaymentUpload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        showSuccess(data.message || "File uploaded successfully");
        setKhatas((prev) => {
          const updated = [...prev];
          updated[kIndex].records[rIndex] = {
            ...updated[kIndex].records[rIndex],
            file,
            fileName: file.name,
            fileUrl: data?.data?.url || data?.data?.file_url || data?.data?.payment_proof_url || updated[kIndex].records[rIndex].fileUrl || "",
            status: "processing",
          };
          return updated;
        });
      } else {
        showError(data.message || "File upload failed");
      }
    } catch (err) {
      showError(err.message || "Network error during file upload");
    }
    setUploadingId(null);
  };

  /* ── excel export ── */
  const handleExportExcel = () => {
    const rows = [];
    khatas.forEach((k) =>
      k.records.forEach((r) =>
        rows.push({
          "Unique ID": k.uniqueId,
          "Khata No": k.khataNo,
          "Total Area": k.totalArea,
          "Total Compensation": k.totalComp,
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
        })
      )
    );
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Compensation Data");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "Compensation_Payments.xlsx");
  };

  /* ── update payment ── */
  const handleUpdatePayment = async (kIndex, rIndex, data) => {
    const currentKhata = khatas[kIndex];
    const currentRecord = currentKhata?.records?.[rIndex];
    const totalComp = roundTo(currentKhata?.totalComp ?? data.totalComp, 2);
    const compPayment = roundTo(currentRecord?.compPayment ?? data.compPayment, 2);
    const paymentArea = roundTo(currentRecord?.paymentArea ?? data.paymentArea, 4);
    const apportionment = roundTo(currentRecord?.apportionment ?? data.apportionment, 2);
    try {
      const res = await safeFetch(`${API_BASE_URL}/plots/updatePlotPayment/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          payment_area: paymentArea,
          total_compensation: totalComp,
          compensation_payment: compPayment,
          apportionment_percent: normalizeApportionmentForApi(apportionment),
          bank_ac: data.bankAcc,
          bank_name: data.bankName,
          ifsc: data.ifsc,
          transaction_no: data.txnNumber,
        }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Failed to update payment details");
      showSuccess(result.message || "Payment details updated successfully");
      setKhatas((prev) => {
        const updated = [...prev];
        updated[kIndex].records[rIndex] = { ...updated[kIndex].records[rIndex], ...data, paymentArea, totalComp, compPayment, apportionment, status: "Paid" };
        return updated;
      });
    } catch (err) {
      showError(err.message || "Failed to update payment details");
    }
  };

  /* ── payment completed ── */
  const handlePaymentCompleted = async (khata, plotNo, plotRecords) => {
    if (!plotNo || plotNo === "No data found") { showError("Plot number is missing"); return; }
    const { valid } = validatePlotTotals(plotRecords);
    if (!valid) { showError("This plot totals do not match yet"); return; }
    const completionKey = `${khata.uniqueId}-${plotNo}`;
    setCompletingPlotKey(completionKey);
    try {
      const res = await safeFetch(`${API_BASE_URL}/plots/paymentCompleted`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ unique_id: khata.uniqueId, plot_no: plotNo, plot_nos: plotNo, project_id: projectId, type: typeParam }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Payment completion failed");
      showSuccess(result.message || "Payment completed successfully.");
      setLoading(true);
      await fetchData();
      setKhatas((prev) =>
        prev.map((k) =>
          k.uniqueId === khata.uniqueId
            ? { ...k, records: k.records.map((r) => (r.plotNo === plotNo ? { ...r, status: "completed" } : r)) }
            : k
        )
      );
    } catch (err) {
      showError(err.message || "Payment completion failed");
    } finally {
      setCompletingPlotKey(null);
    }
  };

  /* ─────────────── EMPTY STATES ─────────────── */
  if (!projectId)
    return (
      <main className="p-6">
        <PageHeader />
        <EmptyState
          icon={<Landmark size={36} className="text-slate-300" />}
          title="No project selected"
          description="Please select a project to view land compensation details."
        />
      </main>
    );

  if (loading) return <Loader message="Loading compensation list..." />;

  if (khatas.length === 0)
    return (
      <main className="p-6">
        <PageHeader />
        <EmptyState
          icon={<FileText size={36} className="text-slate-300" />}
          title="No compensation data found"
          description="No records exist for the selected project. Try a different project or add compensation records."
        />
      </main>
    );

  /* ─────────────── MAIN RENDER ─────────────── */
  return (
    <main className="p-4 md:p-6 min-h-screen bg-slate-50">
      <PageHeader />

      <div className="space-y-4 mt-6">
        {khatas.map((khata, kIndex) => {
          const plotEntries = Object.entries(groupRecordsByPlot(khata.records));
          const matchedPlotCount = plotEntries.filter(([, plotRecords]) => validatePlotTotals(plotRecords).valid).length;
          const isOpen = openIndex === kIndex;

          return (
            <div
              key={kIndex}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all"
            >
              {/* ── Accordion Header ── */}
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : kIndex)}
                className="w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors focus:outline-none"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Left: identifiers */}
                  <div className="flex flex-wrap gap-6 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Hash size={14} className="text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          La Case File No
                        </p>
                        <p className="text-sm font-bold text-blue-700 leading-tight">
                          {khata.uniqueId}
                        </p>
                      </div>
                    </div>

                    <div className="h-8 w-px bg-slate-200 hidden sm:block self-center" />

                    <Stat label="Khata No" value={khata.khataNo} />
                    <Stat label="Total Area" value={khata.totalArea} />
                    {/* <Stat
                      label="Total Compensation"
                      value={`₹${plotCompensation.toLocaleString()}`}
                    /> */}
                  </div>

                  {/* Right: badge + actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
                      <CheckCircle size={13} />
                      {matchedPlotCount}/{plotEntries.length} plots matched
                    </span>

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleExportExcel(); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold transition-all shadow-sm"
                    >
                      <Download size={13} />
                      Export
                    </button>

                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </div>
                  </div>
                </div>
              </button>

              {/* ── Accordion Body ── */}
              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-5">
                  <div className="space-y-5">
                    {plotEntries.map(
                      ([plotNo, plotRecords]) => {
                        const plotCompensation = getPlotCompensation(plotRecords);
                        const {
                          valid: plotValid,
                          apportionmentSum,
                        } = validatePlotTotals(plotRecords);

                        return (
                        <div
                          key={plotNo}
                          className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                        >
                          {/* Plot header */}
                          <div className="flex items-center justify-between px-4 py-3 bg-slate-800">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                                Plot No
                              </span>
                              <span className="text-sm font-bold text-white">
                                {plotNo}
                              </span>
                            </div>
                            <div className="flex items-center gap-6">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                               Total Compensation
                              </span>
                              <span className="text-sm font-bold text-white">
                                {`₹${plotCompensation.toLocaleString()}`}
                              </span>
                    </div>
                            {plotValid ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                                <CheckCircle size={11} />
                                Total matched
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
                                <AlertTriangle size={11} />
                                Mismatch ({apportionmentSum}%)
                              </span>
                            )}
                            <button
                              type="button"
                              disabled={
                                !plotValid ||
                                completingPlotKey ===
                                `${khata.uniqueId}-${plotNo}`
                              }
                              onClick={() =>
                                handlePaymentCompleted(khata, plotNo, plotRecords)
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-white text-xs font-semibold transition-all"
                            >
                              {completingPlotKey ===
                              `${khata.uniqueId}-${plotNo}` ? (
                                <>
                                  <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                  Completing…
                                </>
                              ) : (
                                <>
                                  <BadgeCheck size={13} />
                                  Mark Completed
                                </>
                              )}
                            </button>
                          </div>

                          {/* Table */}
                          <div
                            className="overflow-x-auto"
                            style={{ scrollbarWidth: "thin" }}
                          >
                            <table className="w-full border-collapse text-sm">
                              <thead>
                                <tr className="border-b border-slate-100 whitespace-nowrap">
                                  <Th>Tenant</Th>
                                  <Th>Payment Area</Th>
                                  <Th>Compensation (₹)</Th>
                                  <Th>Apportionment %</Th>
                                  {/* <Th>Days of Interest</Th> */}
                                  <Th>Bank A/C</Th>
                                  <Th>Bank</Th>
                                  <Th>IFSC</Th>
                                  <Th>Status</Th>
                                  <Th>Txn No.</Th>
                                  <Th>Proof</Th>
                                  <Th>Action</Th>
                                </tr>
                              </thead>
                              <tbody>
                                {plotRecords.map((r, rowIdx) => (
                                  <tr
                                    key={`${r.id ?? plotNo}-${r.recordIndex}`}
                                    className={`border-b border-slate-50 whitespace-nowrap transition-colors ${
                                      rowIdx % 2 === 0
                                        ? "bg-white"
                                        : "bg-slate-50/60"
                                    } hover:bg-blue-50/30`}
                                  >
                                    <Td className="font-medium text-slate-800 whitespace-nowrap">
                                      {r.tenant}
                                    </Td>
                                    <Td className="tabular-nums">{r.paymentArea}</Td>

                                    <Td>
                                      <NumInput
                                        value={r.compPayment}
                                        onChange={(e) =>
                                          handlePaymentChange(
                                            kIndex,
                                            r.recordIndex,
                                            e.target.value,
                                            plotRecords
                                          )
                                        }
                                      />
                                    </Td>

                                    <Td>
                                      <div className="flex items-center gap-2">
                                        <NumInput
                                          value={r.apportionment}
                                          className="w-20"
                                          onChange={(e) =>
                                            handleApportionChange(
                                              kIndex,
                                              r.recordIndex,
                                              e.target.value,
                                              plotRecords
                                            )
                                          }
                                        />
                                        {/* mini progress */}
                                        <div className="h-1.5 w-10 rounded-full bg-slate-100 overflow-hidden hidden lg:block">
                                          <div
                                            className="h-full bg-blue-500 rounded-full transition-all"
                                            style={{
                                              width: `${Math.min(100, r.apportionment)}%`,
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </Td>

                                    {/* <Td className="tabular-nums text-slate-500">
                                      {r.days_of_interest ?? (
                                        <span className="text-slate-300">—</span>
                                      )}
                                    </Td> */}
                                    <Td className="font-mono text-xs text-slate-600">
                                      {r.bankAcc ?? (
                                        <span className="text-slate-300">—</span>
                                      )}
                                    </Td>
                                    <Td className="whitespace-nowrap text-slate-600">
                                      {r.bankName ?? (
                                        <span className="text-slate-300">—</span>
                                      )}
                                    </Td>
                                    <Td className="font-mono text-xs text-slate-600">
                                      {r.ifsc ?? (
                                        <span className="text-slate-300">—</span>
                                      )}
                                    </Td>
                                    <Td>
                                      <StatusBadge status={r.status} />
                                    </Td>
                                    <Td className="font-mono text-xs text-slate-600">
                                      {r.txnNumber ?? (
                                        <span className="text-slate-300">—</span>
                                      )}
                                    </Td>

                                    {/* Upload */}
                                    <Td>
                                      <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors group">
                                        <div className="w-7 h-7 rounded-lg border border-dashed border-slate-300 group-hover:border-blue-400 flex items-center justify-center transition-colors">
                                          {uploadingId === r.id ? (
                                            <span className="w-3 h-3 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                                          ) : (
                                            <Upload size={13} />
                                          )}
                                        </div>
                                        <input
                                          type="file"
                                          className="hidden"
                                          onChange={(e) =>
                                            handleFileChange(
                                              kIndex,
                                              r.recordIndex,
                                              e.target.files[0]
                                            )
                                          }
                                        />
                                        {r.fileName ? (
                                          r.fileUrl ? (
                                            <a
                                              href={r.fileUrl}
                                              target="_blank"
                                              rel="noreferrer"
                                              onClick={(e) => e.stopPropagation()}
                                              className="text-blue-600 underline underline-offset-2 max-w-[90px] truncate"
                                              title={r.fileName}
                                            >
                                              {r.fileName}
                                            </a>
                                          ) : (
                                            <span
                                              className="text-emerald-600 max-w-[90px] truncate"
                                              title={r.fileName}
                                            >
                                              {r.fileName}
                                            </span>
                                          )
                                        ) : (
                                          <span className="text-slate-400 text-xs">
                                            Attach
                                          </span>
                                        )}
                                      </label>
                                    </Td>

                                    {/* Edit */}
                                    <Td>
                                      <button
                                        type="button"
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold transition-colors active:scale-95"
                                        onClick={() => {
                                          setEditData({
                                            ...r,
                                            totalComp: khata.totalComp,
                                          });
                                          setEditIndex({
                                            kIndex,
                                            rIndex: r.recordIndex,
                                          });
                                          setIsEditOpen(true);
                                        }}
                                      >
                                        <Pencil size={12} />
                                        Edit
                                      </button>
                                    </Td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Edit Modal ── */}
      {isEditOpen && editData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(15,23,42,0.55)" }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-semibold text-slate-800">
                  Edit Payment Details
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tenant: {editData.tenant}
                </p>
              </div>
              <button
                type="button"
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                onClick={() => setIsEditOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 grid grid-cols-2 gap-4">
              {[
                { label: "Transaction No.", key: "txnNumber", type: "text", span: false },
                { label: "Bank A/C", key: "bankAcc", type: "text", span: false },
                { label: "Bank Name", key: "bankName", type: "text", span: false },
                { label: "IFSC Code", key: "ifsc", type: "text", span: true },
              ].map(({ label, key, type, span }) => (
                <div key={key} className={span ? "col-span-2" : ""}>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={editData[key] ?? ""}
                    onChange={(e) =>
                      setEditData({ ...editData, [key]: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800
                      focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold transition-all shadow-sm"
                onClick={async () => {
                  await handleUpdatePayment(editIndex.kIndex, editIndex.rIndex, editData);
                  setIsEditOpen(false);
                }}
              >
                Save Changes
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

/* ─── Sub-components ─── */
const PageHeader = () => (
  <div className="flex items-center gap-3">
    <div className="w-1 h-8 rounded-full bg-blue-600" />
    <div>
      <h2 className="text-xl font-bold text-slate-800 leading-tight">
        Cost of Land
      </h2>
      <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-0.5">
        Payment Ready
      </p>
    </div>
  </div>
);

const EmptyState = ({ icon, title, description }) => (
  <div className="mt-16 flex flex-col items-center text-center gap-3">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
      {icon}
    </div>
    <p className="text-base font-semibold text-slate-700">{title}</p>
    <p className="text-sm text-slate-400 max-w-xs">{description}</p>
  </div>
);

export default Compensation;

