// import React, { useState, useEffect } from "react";
// import { Upload, CheckCircle, AlertTriangle } from "lucide-react";
// import { API_BASE_URL } from "../../../utils/config";
// import { useSelector } from "react-redux";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// const Compensation = () => {
//   const [khatas, setKhatas] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const token = useSelector((state) => state.auth.userToken);
//   const selectedProject = useSelector((state) => state.selectedProject);
//   const projectId = selectedProject?.project?.id;

//   const fetchData = async () => {
//     if (!projectId) return;

//     try {
//       const res = await fetch(
//         `${API_BASE_URL}/plots/getCompensationDetails?project_id=${projectId}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         const mapped = data.data.map((item) => ({
//           uniqueId: item.unique_id,
//           khataNo: item.khata_no,
//           totalArea: Number(item.total_area),
//           totalComp: Number(item.total_compensation),
//           records: item.tenants.map((t) => ({
//             plotNo: t.plot_no,
//             tenant: t.present_tenant,
//             paymentArea: Number(t.payment_area),
//             compPayment: Number(t.compensation_payment),
//             apportionment: Number(t.apportionment_percent),
//             bankAcc: t.bank_ac,
//             bankName: t.bank_name,
//             ifsc: t.ifsc,
//             status: t.status,
//             txnNumber: "",
//             file: null,
//           })),
//         }));

//         setKhatas(mapped);
//       }
//     } catch (err) {
//       console.error("FETCH ERROR:", err);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     setLoading(true);
//     fetchData();
//   }, [projectId]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const validateTotals = (khata) => {
//     const compSum = khata.records.reduce(
//       (sum, r) => sum + Number(r.compPayment || 0),
//       0
//     );

//     const compMatch = Math.round(compSum) === Math.round(khata.totalComp);

//     return { compMatch, valid: compMatch };
//   };

//   const handleApportionChange = (kIndex, rIndex, value) => {
//     setKhatas((prev) => {
//       const newData = [...prev];
//       const khata = newData[kIndex];
//       const record = khata.records[rIndex];

//       record.apportionment = value;
//       record.compPayment = ((value / 100) * khata.totalComp).toFixed(2);

//       return newData;
//     });
//   };

//   const handlePaymentChange = (kIndex, rIndex, value) => {
//     setKhatas((prev) => {
//       const newData = [...prev];
//       const khata = newData[kIndex];
//       const record = khata.records[rIndex];

//       record.compPayment = value;
//       record.apportionment = ((value / khata.totalComp) * 100).toFixed(2);

//       return newData;
//     });
//   };

//   const handleFileChange = (kIndex, rIndex, file) => {
//     setKhatas((prev) => {
//       const newData = [...prev];
//       newData[kIndex].records[rIndex].file = file;
//       return newData;
//     });
//   };

//   const handleExportExcel = () => {
//     const exportRows = [];

//     khatas.forEach((khata) => {
//       khata.records.forEach((r) => {
//         exportRows.push({
//           "Unique ID": khata.uniqueId,
//           "Khata No": khata.khataNo,
//           "Total Area": khata.totalArea,
//           "Total Compensation": khata.totalComp,
//           "Plot No": r.plotNo,
//           Tenant: r.tenant,
//           "Payment Area": r.paymentArea,
//           "Compensation Payment": r.compPayment,
//           "Apportionment (%)": r.apportionment,
//           "Bank A/C": r.bankAcc ?? "-",
//           "Bank Name": r.bankName ?? "-",
//           IFSC: r.ifsc ?? "-",
//           Status: r.status,
//           "Txn No": r.txnNumber,
//         });
//       });
//     });

//     const worksheet = XLSX.utils.json_to_sheet(exportRows);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Compensation Data");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     const blob = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });

//     saveAs(blob, "Compensation_Payments.xlsx");
//   };

//   if (!projectId) {
//     return (
//       <main className="p-4">
//         <div className="py-10 text-center text-gray-600">
//           <p className="text-lg font-medium">
//             Please{" "}
//             <span className="text-primary font-semibold">Select a Project</span>{" "}
//             first.
//           </p>
//           <p className="text-md text-gray-500 mt-1">
//             A project is required to view Land Compensation details.
//           </p>
//         </div>
//       </main>
//     );
//   }

//   if (loading) return <p className="p-4">Loading...</p>;

//   if (khatas.length === 0) {
//     return (
//       <main className="p-4">
//         <div className="py-10 text-center text-gray-600">
//           <p className="text-md font-medium text-red-500">
//             No Land Cost / Compensation data found for the{" "}
//             <span className="text-primary font-bold">selected project.</span>
//           </p>
//           <p className="text-md text-gray-500 mt-1">
//             Try selecting a different project or add compensation records.
//           </p>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="p-2 md:p-4 min-h-screen">
//       <h2 className="text-lg md:text-xl font-semibold capitalize mb-4">
//         Cost Of Land - Payment Ready
//       </h2>

//       {khatas.map((khata, kIndex) => {
//         const { valid } = validateTotals(khata);

//         return (
//           <div
//             key={kIndex}
//             className="shadow-md mb-8 bg-white p-3 md:p-4 rounded-md"
//           >
//             <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-3 gap-3 md:gap-0">
//               {/* <div className="flex flex-row items-center gap-3 flex-wrap"></div> */}
//               <div>
//                 <p className="font-semibold text-sm md:text-base">
//                   Unique ID:{" "}
//                   <span className="text-primary">{khata.uniqueId}</span>
//                 </p>
//                 <p className="font-semibold text-sm md:text-base">
//                   Khata No:{" "}
//                   <span className="text-primary">{khata.khataNo}</span>
//                 </p>
//               </div>
//               <div className="text-sm md:text-base">
//                 <p>
//                   <strong>Total Area:</strong> {khata.totalArea}
//                 </p>
//                 <p>
//                   <strong>Total Compensation:</strong> ₹
//                   {khata.totalComp.toLocaleString()}
//                 </p>
//               </div>
//               <div className="flex flex-row items-center gap-3 flex-wrap">
//                 {valid ? (
//                   <span className="flex items-center text-green-600 text-sm">
//                     <CheckCircle size={18} className="mr-1" /> Totals Matched
//                   </span>
//                 ) : (
//                   <span className="flex items-center text-orange-600 text-sm">
//                     <AlertTriangle size={18} className="mr-1" /> Values do not
//                     match
//                   </span>
//                 )}
//                 <button
//                   className="btn bg-green-600 text-white flex items-center gap-2"
//                   onClick={handleExportExcel}
//                 >
//                   Export Excel
//                 </button>
//               </div>
//             </div>
//             <div className="overflow-x-auto mt-4">
//               <table className="table table-zebra w-full text-xs sm:text-sm">
//                 <thead className="bg-gray-200 text-gray-700">
//                   <tr className="whitespace-nowrap">
//                     <th>Plot No.</th>
//                     <th>Present Tenant</th>
//                     <th>Payment Area</th>
//                     <th>Compensation Payment</th>
//                     <th>Apportionment (%)</th>
//                     <th>Bank A/C</th>
//                     <th>Bank</th>
//                     <th>IFSC</th>
//                     <th>Status</th>
//                     <th>Txn No.</th>
//                     <th>Upload</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {khata.records.map((r, rIndex) => (
//                     <tr key={rIndex} className="whitespace-nowrap">
//                       <td>{r.plotNo}</td>
//                       <td>{r.tenant}</td>
//                       <td>{r.paymentArea}</td>

//                       <td>
//                         <input
//                           type="number"
//                           value={r.compPayment}
//                           className="input input-bordered input-xs sm:input-sm w-24"
//                           onChange={(e) =>
//                             handlePaymentChange(kIndex, rIndex, e.target.value)
//                           }
//                         />
//                       </td>

//                       <td>
//                         <input
//                           type="number"
//                           value={r.apportionment}
//                           className="input input-bordered input-xs sm:input-sm w-20"
//                           onChange={(e) =>
//                             handleApportionChange(
//                               kIndex,
//                               rIndex,
//                               e.target.value
//                             )
//                           }
//                         />
//                       </td>

//                       <td>{r.bankAcc ?? "-"}</td>
//                       <td>{r.bankName ?? "-"}</td>
//                       <td>{r.ifsc ?? "-"}</td>

//                       <td>
//                         <span
//                           className={`badge text-xs ${
//                             r.status === "Paid"
//                               ? "badge-success"
//                               : "badge-warning"
//                           }`}
//                         >
//                           {r.status}
//                         </span>
//                       </td>

//                       <td>
//                         <input
//                           type="text"
//                           className="input input-bordered input-xs sm:input-sm w-24"
//                           value={r.txnNumber}
//                           onChange={(e) =>
//                             setKhatas((prev) => {
//                               const data = [...prev];
//                               data[kIndex].records[rIndex].txnNumber =
//                                 e.target.value;
//                               return data;
//                             })
//                           }
//                         />
//                       </td>

//                       <td>
//                         <label className="cursor-pointer flex items-center gap-2">
//                           <Upload size={16} />
//                           <input
//                             type="file"
//                             className="hidden"
//                             onChange={(e) =>
//                               handleFileChange(
//                                 kIndex,
//                                 rIndex,
//                                 e.target.files[0]
//                               )
//                             }
//                           />

//                           {/* Show file name if uploaded */}
//                           {r.file ? (
//                             <span
//                               className="text-green-600 text-xs max-w-[120px] truncate"
//                               title={r.file.name}
//                             >
//                               {r.file.name}
//                             </span>
//                           ) : (
//                             <span className="text-gray-400 text-xs">
//                               Choose
//                             </span>
//                           )}
//                         </label>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         );
//       })}
//       <div className="flex justify-end mt-4 md:mt-6">
//         <button className="btn btn-primary w-full md:w-auto">
//           Mark Payment Ready
//         </button>
//       </div>
//     </main>
//   );
// };

// export default Compensation;

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

const Compensation = () => {
  const [khatas, setKhatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  const token = useSelector((state) => state.auth.userToken);
  const selectedProject = useSelector((state) => state.selectedProject);
  const projectId = selectedProject?.project?.id;

  const fetchData = async () => {
    if (!projectId) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/plots/getCompensationDetails?project_id=${projectId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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
            plotNo: t.plot_no,
            tenant: t.present_tenant,
            paymentArea: Number(t.payment_area),
            compPayment: Number(t.compensation_payment),
            apportionment: Number(t.apportionment_percent),
            bankAcc: t.bank_ac,
            bankName: t.bank_name,
            ifsc: t.ifsc,
            status: t.status,
            txnNumber: "",
            file: null,
          })),
        }));

        setKhatas(mapped);
      } else {
        setKhatas([]);
      }
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [projectId]);

  const validateTotals = (khata) => {
    const compSum = khata.records.reduce(
      (sum, r) => sum + Number(r.compPayment || 0),
      0
    );

    return {
      valid: Math.round(compSum) === Math.round(khata.totalComp),
    };
  };

  // const handleApportionChange = (kIndex, rIndex, value) => {
  //   setKhatas((prev) => {
  //     const newData = [...prev];
  //     const khata = newData[kIndex];
  //     const record = khata.records[rIndex];

  //     record.apportionment = value;
  //     record.compPayment = ((value / 100) * khata.totalComp).toFixed(2);

  //     return newData;
  //   });
  // };
const handleApportionChange = (kIndex, rIndex, value) => {
  let num =(value);
  if (num < 0) num = 0;
  if (num > 100) num = 100;

  setKhatas((prev) => {
    const newData = [...prev];
    const khata = newData[kIndex];
    const records = khata.records;

    records[rIndex].apportionment = num;
    let usedPercent = 0;
    records.forEach((r, i) => {
      if (i !== records.length - 1) {
        usedPercent += Number(r.apportionment || 0);
      }
    });

    const remaining = Math.max(0, 100 - usedPercent);
    const lastIndex = records.length - 1;

    records[lastIndex].apportionment =
      rIndex === lastIndex ? num : remaining;
    records.forEach((r) => {
      r.compPayment = (
        (Number(r.apportionment) / 100) *
        khata.totalComp
      ).toFixed(2);
    });

    return newData;
  });
};
const handlePaymentChange = (kIndex, rIndex, value) => {
  let amount = (value);

  if (amount < 0) amount = 0;

  setKhatas((prev) => {
    const newData = [...prev];
    const khata = newData[kIndex];
    const records = khata.records;
    const lastIndex = records.length - 1;

    // Update edited row
    records[rIndex].compPayment = amount;

    // Sum of all rows except last
    let usedAmount = 0;
    records.forEach((r, i) => {
      if (i !== lastIndex) {
        usedAmount += Number(r.compPayment || 0);
      }
    });

    // Prevent exceeding total compensation
    if (usedAmount > khata.totalComp) {
      records[rIndex].compPayment -= usedAmount - khata.totalComp;
      usedAmount = khata.totalComp;
    }

    // Auto-fill last row (remaining amount)
    if (rIndex !== lastIndex) {
      records[lastIndex].compPayment = Number(
        Math.max(0, khata.totalComp - usedAmount).toFixed(2)
      );
    }

    // Auto-calculate apportionment %
    records.forEach((r) => {
      r.apportionment = Number(
        ((Number(r.compPayment) / khata.totalComp) * 100).toFixed(2)
      );
    });

    return newData;
  });
};

  const handleFileChange = (kIndex, rIndex, file) => {
    setKhatas((prev) => {
      const newData = [...prev];
      newData[kIndex].records[rIndex].file = file;
      return newData;
    });
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
  if (!projectId) {
    return (
      <main className="p-4">
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
            {/* Accordion Header */}
            <div
              onClick={() => toggleAccordion(kIndex)}
              className="w-full flex justify-between items-center p-4 shadow-lg hover:bg-gray-50"
            >
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
              <div className="text-left space-y-1">
                <p>
                  <strong>Total Area:</strong> {khata.totalArea}
                </p>
                <p>
                  <strong>Total Compensation:</strong> ₹
                  {khata.totalComp.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {valid ? (
                  <span className="flex items-center text-green-600 text-sm">
                    <CheckCircle size={18} className="mr-1" /> Totals Matched
                  </span>
                ) : (
                  <span className="flex items-center text-orange-600 text-sm">
                    <AlertTriangle size={18} className="mr-1" /> Values do not
                    match
                  </span>
                )}

                <button
                  className="btn bg-green-600 text-white flex items-center gap-2"
                  onClick={handleExportExcel}
                >
                  Export Excel
                </button>

                {openIndex === kIndex ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>

            {openIndex === kIndex && (
              <div className="p-4">
                <div className="overflow-x-auto mt-4">
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

                          <td>
                            <input
                              type="text"
                              className="input input-bordered input-xs sm:input-sm w-24"
                              value={r.txnNumber}
                              onChange={(e) =>
                                setKhatas((prev) => {
                                  const data = [...prev];
                                  data[kIndex].records[rIndex].txnNumber =
                                    e.target.value;
                                  return data;
                                })
                              }
                            />
                          </td>

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

                              {/* Show file name if uploaded */}
                              {r.file ? (
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
                 
                    >
                      <Pencil size={14} /> Edit
                    </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mt-4 md:mt-6">
                  <button
                    className="btn btn-primary w-full md:w-auto"
                    disabled={!valid}
                    title={!valid ? "Totals do not match!" : ""}
                  >
                    Payment Completed
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </main>
  );
};

export default Compensation;
