import React, { useState, useMemo, useEffect } from "react";
import { FileText, Eye, AlertCircle, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../utils/config";

export default function KhataDocumentRegister() {
  const token = useSelector((state) => state.auth.userToken);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [missingFilter, setMissingFilter] = useState("All");

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/report/getAllKhataDocuments`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          const mapped = result.data.map((item) => ({
            khataNo: item.khata_no || "",
            docs:
              item.uploaded_documents?.map((d) => ({
                name: d.file_name || "",
                type: d.document_type || "",
                url: d.url || "",
                uploadedAt: d.uploaded_at?.split("T")[0] || "",
              })) || [],
            date:
              item.uploaded_documents?.[0]?.uploaded_at?.split("T")[0] || "-",
            missing: item.missing_documents_indicator ?? false,
            missingList: item.missing_documents || [],
            showMissing: false,
          }));

          setData(mapped);
        }
      } catch (err) {
        console.error("Error fetching khata documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [token]);
  const filteredData = useMemo(() => {
    return data
      .filter((row) => {
        const text = search.toLowerCase();

        const khataSafe = (row.khataNo || "").toLowerCase();
        const docsSafe = row.docs || [];

        return (
          khataSafe.includes(text) ||
          docsSafe.some((d) => (d.name || "").toLowerCase().includes(text))
        );
      })
      .filter((row) => {
        if (missingFilter === "Missing") return row.missing === true;
        if (missingFilter === "Complete") return row.missing === false;
        return true;
      });
  }, [search, missingFilter, data]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading Khata Documents...
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="text-primary" /> Khata Document Register
        </h2>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white px-3 py-2 rounded-lg border shadow-sm">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search khata / documents..."
              className="bg-transparent focus:outline-none text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={missingFilter}
            onChange={(e) => setMissingFilter(e.target.value)}
            className="px-3 py-2 text-sm border rounded-lg bg-white shadow-sm"
          >
            <option value="All">All</option>
            <option value="Missing">Missing Only</option>
            <option value="Complete">Complete Only</option>
          </select>
        </div>
      </div>

      <div
        className="overflow-auto"
        style={{ maxHeight: "350px", scrollbarWidth: "thin" }}
      >
        <table className="table w-full text-sm">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs sticky top-0 z-10">
            <tr>
              <th>Sl/No</th>
              <th>Khata No</th>
              <th>Documents</th>
              <th>Uploaded Date</th>
              <th>Missing?</th>
              <th className="text-center">View</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row, i) => (
              <React.Fragment key={i}>
                <tr className="hover:bg-gray-50">
                  <td>{i + 1}</td>
                  <td>{row.khataNo}</td>

                  <td>
                    {row.docs.length === 0 && (
                      <p className="text-gray-500">No Documents</p>
                    )}
                    {row.docs.map((doc, idx) => (
                      <p
                        key={idx}
                        className="text-blue-600 underline cursor-pointer"
                        onClick={() => window.open(doc.url, "_blank")}
                      >
                        {doc.type} ({doc.name})
                      </p>
                    ))}
                  </td>

                  <td>{row.date}</td>
                  <td>
                    <div className="flex flex-col gap-1">
                      {row.missing ? (
                        <span className="flex items-center gap-1 text-red-600 font-medium">
                          <AlertCircle size={16} /> Missing (
                          {row.missingList.length})
                        </span>
                      ) : (
                        <span className="text-green-600 font-medium">
                          Complete
                        </span>
                      )}

                      {row.missing && (
                        <button
                          className="text-blue-600 text-xs underline"
                          onClick={() =>
                            setData((prev) =>
                              prev.map((r, index) =>
                                index === i
                                  ? { ...r, showMissing: !r.showMissing }
                                  : r
                              )
                            )
                          }
                        >
                          {row.showMissing ? "Hide Details" : "View Missing List"}
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="text-center">
                    {row.docs.length > 0 ? (
                      <button
                        className="btn btn-sm btn-primary flex items-center gap-1"
                        onClick={() => window.open(row.docs[0].url, "_blank")}
                      >
                        <Eye size={16} /> View
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
                {row.showMissing && row.missing && (
                  <tr className="bg-red-50">
                    <td></td>
                    <td colSpan={5} className="p-3">
                      <h4 className="font-semibold text-red-700 mb-1">
                        Missing Documents:
                      </h4>

                      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 text-red-800 text-sm">
                        {row.missingList.map((doc, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            • <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <p className="text-center py-4 text-gray-500">No records found.</p>
        )}
      </div>
    </div>
  );
}
