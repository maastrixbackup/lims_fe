import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../utils/config";

export default function useFetchDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = useSelector((state) => state.auth.userToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching dashboard data...");
        const response = await fetch(`${API_BASE_URL}/getDashboardData`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        console.log("Dashboard API response:", result);
        setData(result.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  return { data, loading, error };
}
