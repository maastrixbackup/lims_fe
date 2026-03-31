import { API_BASE_URL } from "../utils/config";
import { getLandScheduleList } from "../utils/LandAreaSchedule";


const SCHEDULE_TYPE_MAP = {
  forest: "FOREST_AREA",
  nonForest: "NON_FOREST_AREA",
  ca: "CA_LAND",
};

export const deleteForestLand= async ({
  id,
  activeTab,
  token,
  selectedProject,
  page = 1,
  limit = 10,
  setTableData,
  onSuccess,
  onError,
}) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/forestland/deleteForestLand/${id}`, // ✅ single API
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await res.json();
    if (!res.ok) throw json;

    // 🔥 refresh list based on active tab
    const scheduleType = SCHEDULE_TYPE_MAP[activeTab];
    const updatedList = await getLandScheduleList(
      token,
      scheduleType,
      selectedProject,
      page,
      limit
    );

    setTableData(updatedList?.data || []);

    onSuccess?.(json);
  } catch (err) {
    onError?.(err);
  }
};
