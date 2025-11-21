import React, { useState, useMemo, useEffect, useRef } from "react";
import { ChevronDown, Download, Printer } from "lucide-react";
import Loader from "../../shared/Loader";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router";

export default function Tenants() {
  const navigate = useNavigate();

  const dummyData = [
    {
      id: 1,
      name: "Ramesh Kumar",
      father_name: "Suresh Kumar",
      village: "Village A",
      khata_no: "102",
      plot_no: "45",
      area: "1.2 Acre",
      payment_status: "Ready for Payment",
    },
    {
      id: 2,
      name: "Sita Devi",
      father_name: "Mohan Lal",
      village: "Village B",
      khata_no: "87",
      plot_no: "12",
      area: "0.8 Acre",
      payment_status: "Payment Done",
    },
    {
      id: 3,
      name: "Mukesh Rana",
      father_name: "Harish Rana",
      village: "Village A",
      khata_no: "56",
      plot_no: "33",
      area: "2.0 Acre",
      payment_status: "Ready for Payment",
    },
    {
      id: 4,
      name: "Geeta Sharma",
      father_name: "Rajan Sharma",
      village: "Village C",
      khata_no: "150",
      plot_no: "5",
      area: "0.5 Acre",
      payment_status: "Payment Done",
    },
  ];

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);

  const paymentStatusOptions = ["Ready for Payment", "Payment Done"];
  const [paymentFilter, setPaymentFilter] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setTenants(dummyData);
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, []);

  const togglePayment = (status) => {
    setPaymentFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const selectAll = () => setPaymentFilter([...paymentStatusOptions]);
  const clearAll = () => setPaymentFilter([]);

  const filteredTenants = useMemo(() => {
    if (!paymentFilter || paymentFilter.length === 0) return tenants;
    return tenants.filter((t) => paymentFilter.includes(t.payment_status));
  }, [tenants, paymentFilter]);

  const dropdownRef = useRef(null);
  useEffect(() => {
    const onDocClick = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredTenants);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tenants");
    XLSX.writeFile(wb, "Tenants_List.xlsx");
  };

  /** PRINT */
  const printTable = () => {
    const printContent = document.getElementById("printArea").innerHTML;
    const printWindow = window.open("", "", "width=900,height=700");
    printWindow.document.write(`
      <html>
        <head>
          <title>Tenants List</title>
          <style>
            table { width: 100%; border-collapse: collapse; font-size: 14px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background: #f1f1f1; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-6 space-y-5">
      <h2 className="text-2xl font-semibold text-gray-800">Tenants List</h2>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="w-64 border rounded-lg px-3 py-2 flex justify-between items-center bg-white shadow hover:bg-gray-50"
                onClick={() => setDropdownOpen((s) => !s)}
              >
                <span className="text-sm text-gray-600">
                  {paymentFilter.length === 0
                    ? "Filter by Payment Status"
                    : paymentFilter.join(", ")}
                </span>
                <ChevronDown size={18} />
              </button>

              {dropdownOpen && (
                <div className="absolute z-20 mt-1 w-64 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto animate-fadeIn">
                  <div className="flex justify-between items-center p-2 border-b bg-gray-50">
                    <button
                      className="text-xs text-blue-600 hover:underline"
                      onClick={selectAll}
                    >
                      Select All
                    </button>
                    <button
                      className="text-xs text-gray-600 hover:underline"
                      onClick={clearAll}
                    >
                      Clear
                    </button>
                  </div>

                  {paymentStatusOptions.map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={paymentFilter.includes(status)}
                        onChange={() => togglePayment(status)}
                      />
                      <span className="text-sm">{status}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={exportExcel}
                className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded shadow hover:bg-green-700"
              >
                <Download size={18} /> Export
              </button>

              <button
                onClick={printTable}
                className="flex items-center gap-2 bg-gray-700 text-white px-3 py-2 rounded shadow hover:bg-black"
              >
                <Printer size={18} /> Print
              </button>
            </div>
          </div>

          {/* Table */}
          <div id="printArea" className="overflow-x-auto shadow-md border rounded-lg">
            <table className="table w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th>Sl No</th>
                  <th>Name</th>
                  <th>Father Name</th>
                  <th>Village</th>
                  <th>Khata No</th>
                  <th>Plot No</th>
                  <th>Area</th>
                  <th>Payment Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredTenants.map((t, index) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td>{index + 1}</td>
                    <td>{t.name}</td>
                    <td>{t.father_name}</td>
                    <td>{t.village}</td>
                    <td>{t.khata_no}</td>
                    <td>{t.plot_no}</td>
                    <td>{t.area}</td>

                    {/* FIXED PAYMENT STATUS BUTTON */}
                    <td>
                      <span
                        onClick={() => navigate("/payment/ready-to-payment")}
                        className={`px-2 py-1 rounded text-white text-sm w-36 inline-block text-center cursor-pointer 
                          ${
                            t.payment_status === "Payment Done"
                              ? "bg-green-600"
                              : "bg-yellow-500"
                          }
                        `}
                      >
                        {t.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredTenants.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-5 text-gray-500">
                      No tenants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
