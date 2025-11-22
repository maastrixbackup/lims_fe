import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  ChevronDown,
  Download,
  Printer,
  IndianRupee,
  X,
} from "lucide-react";
import * as XLSX from "xlsx";
import Loader from "../../shared/Loader";

export default function PaymentScreen() {
  // Dummy Tenant Payment Data
  const data = [
    {
      id: 1,
      name: "Ramesh Kumar",
      father_name: "Suresh Kumar",
      village: "Village A",
      amount: 25000,
      payment_status: "Pending",
    },
    {
      id: 2,
      name: "Sita Devi",
      father_name: "Mohan Lal",
      village: "Village B",
      amount: 18000,
      payment_status: "Paid",
    },
    {
      id: 3,
      name: "Mukesh Rana",
      father_name: "Harish Rana",
      village: "Village A",
      amount: 31000,
      payment_status: "Pending",
    },
  ];

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);

  const statusList = ["Paid", "Pending"];
  const [paymentFilter, setPaymentFilter] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [selectedTenant, setSelectedTenant] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Load dummy data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTenants(data);
      setLoading(false);
    }, 200);
  }, []);

  // Payment Status Filter Logic
  const toggleStatus = (status) => {
    setPaymentFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const selectAll = () => setPaymentFilter([...statusList]);
  const clearAll = () => setPaymentFilter([]);

  const filtered = useMemo(() => {
    if (paymentFilter.length === 0) return tenants;
    return tenants.filter((t) => paymentFilter.includes(t.payment_status));
  }, [tenants, paymentFilter]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Excel Export
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, "Payments.xlsx");
  };

  // Print Table
  const printTable = () => {
    const content = document.getElementById("printArea").innerHTML;
    const win = window.open("", "", "width=900,height=700");
    win.document.write(`
      <html>
        <head><title>Payments</title></head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  // Process Payment (Modal Submit)
  const submitPayment = (e) => {
    e.preventDefault();

    setTenants((prev) =>
      prev.map((t) =>
        t.id === selectedTenant.id
          ? { ...t, payment_status: "Paid" }
          : t
      )
    );

    setPaymentModalOpen(false);
  };

  return (
    <div className="p-2 space-y-6">

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Tenant Payments Management
      </h2>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* FILTER + EXPORT ROW */}
          <div className="flex items-center justify-between flex-wrap gap-4">

            {/* Payment Status Filter */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="w-64 px-3 py-2 bg-white border rounded-lg shadow flex justify-between items-center"
                onClick={() => setDropdownOpen((s) => !s)}
              >
                <span className="text-sm text-gray-700">
                  {paymentFilter.length === 0
                    ? "Filter by Payment Status"
                    : paymentFilter.join(", ")}
                </span>
                <ChevronDown size={18} />
              </button>

              {dropdownOpen && (
                <div className="absolute z-20 mt-1 w-64 bg-white border rounded shadow-md">
                  <div className="flex justify-between p-2 border-b bg-gray-50">
                    <button
                      onClick={selectAll}
                      className="text-sm text-blue-600"
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearAll}
                      className="text-sm text-gray-600"
                    >
                      Clear
                    </button>
                  </div>

                  {statusList.map((s) => (
                    <label
                      key={s}
                      className="flex gap-2 items-center p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={paymentFilter.includes(s)}
                        onChange={() => toggleStatus(s)}
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Export + Print Buttons */}
            <div className="flex gap-3">
              <button
                onClick={exportExcel}
                className="bg-green-600 text-white px-4 py-2 rounded shadow flex items-center gap-2 hover:bg-green-700"
              >
                <Download size={18} /> Excel
              </button>

              <button
                onClick={printTable}
                className="bg-gray-700 text-white px-4 py-2 rounded shadow flex items-center gap-2 hover:bg-black"
              >
                <Printer size={18} /> Print
              </button>
            </div>
          </div>

          {/* PAYMENT TABLE */}
          <div id="printArea" className="border rounded shadow overflow-auto">
            <table className="table w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th>Sl No</th>
                  <th>Name</th>
                  <th>Father Name</th>
                  <th>Village</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Pay</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((t, i) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td>{i + 1}</td>
                    <td>{t.name}</td>
                    <td>{t.father_name}</td>
                    <td>{t.village}</td>
                    <td>
                      <span className="flex items-center gap-1">
                        <IndianRupee size={14} /> {t.amount}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded text-white text-xs ${
                          t.payment_status === "Paid"
                            ? "bg-green-600"
                            : "bg-red-500"
                        }`}
                      >
                        {t.payment_status}
                      </span>
                    </td>

                    <td>
                      {t.payment_status === "Pending" && (
                        <button
                          onClick={() => {
                            setSelectedTenant(t);
                            setPaymentModalOpen(true);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                        >
                          Pay Now
                        </button>
                      )}
                      {t.payment_status === "Paid" && (
                        <span className="text-gray-500 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAYMENT MODAL */}
          {paymentModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
              <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">

                <button
                  className="absolute right-3 top-3 text-gray-600 hover:text-black"
                  onClick={() => setPaymentModalOpen(false)}
                >
                  <X size={20} />
                </button>

                <h3 className="text-xl font-semibold mb-4">Record Payment</h3>

                <form onSubmit={submitPayment} className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-sm">Tenant Name</label>
                    <input
                      className="border rounded p-2 bg-gray-100"
                      value={selectedTenant.name}
                      readOnly
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm">Amount</label>
                    <input
                      type="number"
                      className="border rounded p-2"
                      defaultValue={selectedTenant.amount}
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm">Payment Mode</label>
                    <select className="border rounded p-2" required>
                      <option value="">Select</option>
                      <option>Cash</option>
                      <option>Online</option>
                      <option>Cheque</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm">Transaction ID (Optional)</label>
                    <input type="text" className="border rounded p-2" />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Submit Payment
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
