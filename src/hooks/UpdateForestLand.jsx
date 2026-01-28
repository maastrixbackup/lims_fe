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
  selectedProject,  
  onSuccess,
  onError,
}) => {
  try {
    if (!id) throw new Error("Missing record id");
    if (!selectedProject?.id) throw new Error("Project not selected");

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

    if (activeTab === "forest") {
      payload.forest_division = formData.forest_division;
      payload.forest_range = formData.forest_range;
      payload.forest_category_id = formData.forest_category_id;
    }

    if (activeTab === "ca") {
      payload.ca_area_ha = Number(formData.ca_area_ha || 0);
      payload.patch_name = formData.patch_name;
      payload.forest_division = formData.forest_division;
      payload.forest_range = formData.forest_range;
    }

    const res = await fetch(
      `${API_BASE_URL}/forestland/updateForestLand/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json?.message || "Update failed");
    }

    onSuccess?.(json);
  } catch (err) {
    console.error("Update error:", err);
    onError?.(err);
  }
};
