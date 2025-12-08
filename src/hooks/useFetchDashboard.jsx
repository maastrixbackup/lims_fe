import { useEffect, useState } from "react";
import { apiClient } from "../utils/apiClient";
import { useSelector } from "react-redux";

export default function useFetchDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const projectId = useSelector(
    (state) => state.selectedProject?.project?.id
  );

  useEffect(() => {
    setLoading(true);
    setError(null);

    const url = projectId
      ? `/getDashboardData?project_id=${projectId}`
      : `/getDashboardData`;

    apiClient(url)
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));

  }, [projectId]);

  return { data, loading, error };
}
