// import { useEffect, useState } from "react";
// import { apiClient } from "../utils/apiClient";
// import { useSelector } from "react-redux";

// export default function useFetchDashboard() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const projectId = useSelector(
//     (state) => state.selectedProject?.project?.id
//   );

//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     const url = projectId
//       ? `/getDashboardData?project_id=${projectId}`
//       : `/getDashboardData`;

//     apiClient(url)
//       .then((res) => setData(res.data))
//       .catch((err) => setError(err))
//       .finally(() => setLoading(false));

//   }, [projectId]);

//   return { data, loading, error };
// }

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiClient } from "../utils/apiClient";

export default function useFetchDashboard(landType) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const projectId = useSelector(
    (state) => state.selectedProject?.project?.id
  );

  useEffect(() => {
    const parseNumber = (value) => {
      if (typeof value === "number" && Number.isFinite(value)) return value;
      if (value == null) return 0;

      const normalized = String(value).replace(/,/g, "").trim();
      if (!normalized) return 0;

      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const getPlotAreaTotals = async () => {
      if (!projectId) {
        return {
          total_area_acres: 0,
          total_area_hectares: 0,
          acquired_area_acres: 0,
          acquired_area_hectares: 0,
        };
      }

      const pageSize = 500;
      let currentPage = 1;
      let totalPageCount = 1;

      let totalAreaAcres = 0;
      let totalAreaHectares = 0;
      let acquiredAreaAcres = 0;
      let acquiredAreaHectares = 0;

      do {
        if (landType === "govt") {
          const res = await apiClient(
            `/govtplots/govtPlotList?project_id=${projectId}&type=2&page=${currentPage}&limit=${pageSize}`
          );

          const plots = res?.data || [];
          plots.forEach((plot) => {
            totalAreaAcres += parseNumber(
              plot?.total_area_acres ?? plot?.land_area_total_acres
            );
            totalAreaHectares += parseNumber(
              plot?.total_area_hectares ?? plot?.land_area_total_hectares
            );
            acquiredAreaAcres += parseNumber(
              plot?.proposed_area_acres ?? plot?.land_area_acquired_acres
            );
            acquiredAreaHectares += parseNumber(
              plot?.proposed_area_hectares ?? plot?.land_area_acquired_hectares
            );
          });

          totalPageCount = res?.totalPages || 1;
          if (!plots.length) break;
        } else {
          const typeParam = landType === "forest" ? 3 : 1;
          const res = await apiClient(
            `/plots/plotList?project_id=${projectId}&type=${typeParam}&page=${currentPage}&limit=${pageSize}`
          );

          const plots = res?.plots || [];
          plots.forEach((plot) => {
            totalAreaAcres += parseNumber(plot?.land_area_total_acres);
            totalAreaHectares += parseNumber(plot?.land_area_total_hectares);
            acquiredAreaAcres += parseNumber(plot?.land_area_acquired_acres);
            acquiredAreaHectares += parseNumber(plot?.land_area_acquired_hectares);
          });

          totalPageCount = res?.totalPages || 1;
          if (!plots.length || res?.success === false) break;
        }

        currentPage += 1;
      } while (currentPage <= totalPageCount);

      return {
        total_area_acres: Number(totalAreaAcres.toFixed(2)),
        total_area_hectares: Number(totalAreaHectares.toFixed(2)),
        acquired_area_acres: Number(acquiredAreaAcres.toFixed(2)),
        acquired_area_hectares: Number(acquiredAreaHectares.toFixed(2)),
      };
    };

    setLoading(true);
    setError(null);

    let endpoint = "";

    // ✅ CASE 1: No project selected → fetch ALL data
    if (!projectId) {
      endpoint = "/getDashboardData"; // 👈 your ALL data API
    } 
    // ✅ CASE 2: Project selected → land-specific data
    else {
      switch (landType) {
        case "private":
          endpoint = "/getDashboardData";
          break;
        case "govt":
          endpoint = "/govtDashboardData";
          break;
        case "forest":
          endpoint = "/forestDashboardData";
          break;
        default:
          endpoint = "/getDashboardData";
      }
    }

    const url = projectId
      ? `${endpoint}?project_id=${projectId}`
      : endpoint;

    Promise.all([apiClient(url), getPlotAreaTotals()])
      .then(([dashboardRes, areaTotals]) => {
        setData({
          ...(dashboardRes?.data || {}),
          ...areaTotals,
        });
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));

  }, [landType, projectId]);

  return { data, loading, error };
}

