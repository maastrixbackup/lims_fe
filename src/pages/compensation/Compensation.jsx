import React, { useState, useEffect } from "react";
import { Upload, CheckCircle, AlertTriangle } from "lucide-react";

const Compensation = () => {
  const [khatas, setKhatas] = useState([
    {
      uniqueId: "UID-001",
      khataNo: "KH-123",
      totalArea: 5, // acres
      totalComp: 500000,
      records: [
        {
          plotNo: "P-101",
          tenant: "Ramesh Das",
          paymentArea: 2,
          compPayment: 200000,
          apportionment: 40,
          bankAcc: "XXXXXX1234",
          bankName: "SBI",
          ifsc: "SBIN0001234",
          status: "Pending",
          txnNumber: "",
          file: null,
        },
        {
          plotNo: "P-102",
          tenant: "Suresh Behera",
          paymentArea: 3,
          compPayment: 300000,
          apportionment: 60,
          bankAcc: "XXXXXX5678",
          bankName: "HDFC",
          ifsc: "HDFC0005678",
          status: "Pending",
          txnNumber: "",
          file: null,
        },
      ],
    },
  ]);

  // ✅ Validation + color logic
  const validateTotals = (khata) => {
    const areaSum = khata.records.reduce(
      (sum, r) => sum + Number(r.paymentArea || 0),
      0
    );
    const compSum = khata.records.reduce(
      (sum, r) => sum + Number(r.compPayment || 0),
      0
    );
    const areaMatch = areaSum === khata.totalArea;
    const compMatch = compSum === khata.totalComp;

    return {
      valid: areaMatch && compMatch,
      areaMatch,
      compMatch,
    };
  };

  const handleApportionChange = (khataIndex, recIndex, value) => {
    setKhatas((prev) => {
      const newData = [...prev];
      const khata = newData[khataIndex];
      const record = khata.records[recIndex];

      record.apportionment = value;
      record.compPayment = ((value / 100) * khata.totalComp).toFixed(2);
      return newData;
    });
  };

  const handlePaymentChange = (khataIndex, recIndex, value) => {
    setKhatas((prev) => {
      const newData = [...prev];
      const khata = newData[khataIndex];
      const record = khata.records[recIndex];
      record.compPayment = value;
      return newData;
    });
  };

  const handleFileChange = (khataIndex, recIndex, file) => {
    setKhatas((prev) => {
      const newData = [...prev];
      newData[khataIndex].records[recIndex].file = file;
      return newData;
    });
  };

  const handleSubmit = () => {
    console.log("Submitting payment-ready data:", khatas);
    alert("Payments marked as ready successfully!");
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">
        Compensation Workflow - Payment Ready
      </h1>

      {khatas.map((khata, kIndex) => {
        const { valid } = validateTotals(khata);

        return (
          <div
            key={kIndex}
            className={`border rounded-2xl shadow-md mb-10 ${
              valid
                ? "bg-green-50 border-green-300"
                : "bg-orange-50 border-orange-300"
            }`}
          >
            {/* Header Row */}
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  Unique ID:{" "}
                  <span className="text-primary">{khata.uniqueId}</span>
                </p>
                <p>Khata No: {khata.khataNo}</p>
              </div>
              <div className="text-sm">
                <p>
                  <strong>Total Area:</strong> {khata.totalArea} Ac
                </p>
                <p>
                  <strong>Total Compensation:</strong> ₹
                  {khata.totalComp.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {valid ? (
                  <span className="flex items-center text-green-600 font-medium">
                    <CheckCircle size={18} className="mr-1" /> Valid Totals
                  </span>
                ) : (
                  <span className="flex items-center text-orange-600 font-medium">
                    <AlertTriangle size={18} className="mr-1" /> Totals Mismatch
                  </span>
                )}
              </div>
            </div>

            {/* Detail Table */}
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full text-sm">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th>Plot No.</th>
                    <th>Present Tenant</th>
                    <th>Payment Area</th>
                    <th>Compensation Payment</th>
                    <th>Apportionment (%)</th>
                    <th>Bank A/C</th>
                    <th>Bank Name</th>
                    <th>IFSC</th>
                    <th>Status</th>
                    <th>Txn No.</th>
                    <th>Upload Proof</th>
                  </tr>
                </thead>
                <tbody>
                  {khata.records.map((r, rIndex) => (
                    <tr key={rIndex}>
                      <td>{r.plotNo}</td>
                      <td>{r.tenant}</td>
                      <td>
                        <input
                          type="number"
                          value={r.paymentArea}
                          className="input input-bordered input-sm w-20"
                          onChange={(e) =>
                            setKhatas((prev) => {
                              const newData = [...prev];
                              newData[kIndex].records[rIndex].paymentArea =
                                e.target.value;
                              return newData;
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={r.compPayment}
                          className="input input-bordered input-sm w-28"
                          onChange={(e) =>
                            handlePaymentChange(kIndex, rIndex, e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={r.apportionment}
                          className="input input-bordered input-sm w-20"
                          onChange={(e) =>
                            handleApportionChange(
                              kIndex,
                              rIndex,
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>{r.bankAcc}</td>
                      <td>{r.bankName}</td>
                      <td>{r.ifsc}</td>
                      <td>
                        <span
                          className={`badge ${
                            r.status === "Paid"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={r.txnNumber}
                          onChange={(e) =>
                            setKhatas((prev) => {
                              const newData = [...prev];
                              newData[kIndex].records[rIndex].txnNumber =
                                e.target.value;
                              return newData;
                            })
                          }
                          className="input input-bordered input-sm w-28"
                        />
                      </td>
                      <td>
                        <label className="cursor-pointer flex items-center gap-2">
                          <Upload size={16} />
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) =>
                              handleFileChange(
                                kIndex,
                                rIndex,
                                e.target.files[0]
                              )
                            }
                          />
                          {r.file ? (
                            <span className="text-xs text-green-600">
                              Uploaded
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">
                              Choose
                            </span>
                          )}
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      <div className="flex justify-end mt-6">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Mark Payment Ready
        </button>
      </div>
    </main>
  );
};

export default Compensation;
