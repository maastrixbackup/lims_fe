import { API_BASE_URL } from "../utils/config";

const SCHEDULE_TYPE_MAP = {
  forest: "FOREST_AREA",
  nonForest: "NON_FOREST_AREA",
  ca: "CA_LAND",
};

export const updateLandSchedule = async ({
  id,            
  formData,
  activeTab,
  token,
  onSuccess,
  onError,
}) => {
  try {
    const payload = {
      project_master_id: 1,
      schedule_type: SCHEDULE_TYPE_MAP[activeTab],

      district: formData.district,
      ri_circle: formData.ri_circle,
      tahasil: formData.tahasil,
      village: formData.village,

      khata_no: formData.khata_no,
      plot_no: formData.plot_no,
      kisam: formData.kisam,

      ownership: formData.ownership,
      fra_allotted: formData.fra_allotted,

      total_area_ha: Number(formData.total_area_ha),
      proposed_acquired_area_ha: Number(
        formData.proposed_acquired_area_ha
      ),
      digital_area_ha: Number(formData.digital_area_ha),

      remarks: formData.remarks,
    };

    // 🌲 Forest specific fields
    if (activeTab === "forest") {
      payload.forest_division = formData.forest_division;
      payload.forest_range = formData.forest_range;
      payload.forest_category_id = formData.forest_category_id;
    }

    // 🌱 CA specific fields
    if (activeTab === "ca") {
      payload.ca_area_ha = Number(formData.ca_area_ha);
      payload.patch_name = formData.patch_name;
        payload.forest_division = formData.forest_division;
      payload.forest_range = formData.forest_range;
    }

    const res = await fetch(
      `${API_BASE_URL}/forestland/updateForestLand/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const json = await res.json();
    if (!res.ok) throw json;

    onSuccess?.(json);
  } catch (err) {
    onError?.(err);
  }
};

