import { API_BASE_URL } from "../utils/config";

const SCHEDULE_TYPE_MAP = {
  forest: "FOREST_AREA",
  nonForest: "NON_FOREST_AREA",
  ca: "CA_LAND",
};

export const submitLandSchedule = async ({
  formData,
  activeTab,
  token,
  selectedProject,  
  onSuccess,
  onError,
}) => {
  try {
    if (!selectedProject?.id) {
      throw new Error("Project not selected");
    }

    const payload = {
      project_master_id: selectedProject.id,
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

      total_area_ha: Number(formData.total_area_ha || 0),
      proposed_acquired_area_ha: Number(formData.proposed_acquired_area_ha || 0),
      digital_area_ha: Number(formData.digital_area_ha || 0),

      remarks: formData.remarks,
    };

    // Forest specific
    if (activeTab === "forest") {
      payload.forest_division = formData.forest_division;
      payload.forest_range = formData.forest_range;
      payload.forest_category_id = formData.forest_category_id;
    }

    // CA specific
    if (activeTab === "ca") {
      payload.ca_area_ha = Number(formData.ca_area_ha || 0);
      payload.patch_name = formData.patch_name;
    }

    const res = await fetch(`${API_BASE_URL}/forestland/addForestLand`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) throw json;

    onSuccess?.(json);
  } catch (err) {
    console.error("Submit land schedule error:", err);
    onError?.(err);
  }
};
