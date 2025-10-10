import { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/config";
import { useSelector } from "react-redux";

const useFetch = (endpoint, queryParams = {}, dependencies = []) => {
  const token = useSelector((state) => state.auth.userToken);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Build query string dynamically
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${API_BASE_URL}/${endpoint}${queryString ? `?${queryString}` : ""}`;

  useEffect(() => {
    if (!endpoint) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, token, ...dependencies]);

  return { data, loading, error };
};

export default useFetch;
