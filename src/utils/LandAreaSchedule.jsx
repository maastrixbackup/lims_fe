
import { API_BASE_URL } from "./config";



export const getLandScheduleList = async (
  token,
  scheduleType,
  selectedProject,
  page,
  limit 
) => {
  
  const url = `${API_BASE_URL}/forestland/forestLandList?project_master_id=${selectedProject?.id}&schedule_type=${scheduleType}&page=${page}&limit=${limit}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch land schedule");
  }

  return res.json();
};
