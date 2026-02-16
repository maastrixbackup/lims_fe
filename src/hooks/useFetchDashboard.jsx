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

    apiClient(url)
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));

  }, [landType, projectId]);

  return { data, loading, error };
}

