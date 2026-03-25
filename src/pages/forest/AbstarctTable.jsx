import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiClient } from "../../utils/apiClient";

const AbstractTable = ({landData}) => {
  const token = useSelector((s) => s.auth.userToken);
  const selectedProject = useSelector((s) => s.selectedProject.project);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedProject?.id || !token) return;
    fetchAbstract();
  }, [selectedProject, token,landData ]);

  const fetchAbstract = async () => {
    try {
      setLoading(true);

      const res = await apiClient(
        `/forestland/forestLandAbstract?project_master_id=${selectedProject.id}`,
        { method: "GET" },
      );

      console.log("API RESPONSE:", res);

      const apiRows = res?.data || [];

      setRows(
        apiRows.map((item) => ({
          label: item.label,
          roR: item.total || 0,
          acquired: item.proposed || 0,
          digital: item.digital || 0,
          isBold:
            item.label === "Total Project Area" ||
            item.label === "Total Land Under FD Framework",

          bg:
            item.label === "Total Project Area"
              ? "bg-base-200"
              : item.label === "Total Land Under FD Framework"
                ? "bg-lime-400"
                : "",
        })),
      );
    } catch (err) {
      console.error("Abstract API error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto bg-base-100 shadow rounded-lg">
      

      {loading ? (
        <div className="text-center py-6">Loading...</div>
      ) : (
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-200 font-semibold">
              <th>Land Category</th>
              <th className="text-center">Total Area - RoR (ha)</th>
              <th className="text-center">Proposed / Acquired Area (ha)</th>
              <th className="text-center">Digital Area (ha)</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No data found available
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr
                  key={index}
                  className={`${row.bg} ${row.isBold ? "font-semibold" : ""}`}
                >
                  <td>{row.label}</td>
                  <td className="text-center">{row.roR}</td>
                  <td className="text-center">{row.acquired}</td>
                  <td className="text-center">{row.digital}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AbstractTable;

