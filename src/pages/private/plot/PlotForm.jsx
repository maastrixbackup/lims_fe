import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../utils/config";
import { sections } from "../../../utils/constants";
import { useLandTypeParam } from "../../../utils/landtypes";

const PlotForm = ({ fetchPlots }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = useSelector((s) => s.auth.userToken);
    const selectedProject = useSelector((s) => s.selectedProject.project);
  const editingPlot = location.state?.plot || null;

  const { villages } = useSelector((s) => s.list);
  const { landType } = useParams();
  const typeParam = useLandTypeParam();
  // console.log("LAND TYPE:", landType, " → type =", typeParam);

  const [formData, setFormData] = useState(() => ({
    type: typeParam,
    ...Object.fromEntries(Object.values(sections).flat().map((f) => [f, ""])),
  }));

  // const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingPlot) {
      setFormData({
        ...formData,
        ...editingPlot,
        type: editingPlot.type || typeParam,
      });
      setSelectedProject(editingPlot.project_id || "");
    }
  }, [editingPlot]);

  const requiredFields = [
    "name_of_recorded_tenant",
    "name_of_present_tenant",
    "village_name",
    "village_code",
    "tahasil_name",
    "ri_circle_name",
    "thana_no",
    "khata_no",
    "plot_no",
    "kissam_of_land",
    "land_category",
    "land_area_total_acres",
    "land_area_total_hectares",
    "land_area_acquired_acres",
    "land_area_acquired_hectares",
    "la_case_file_no",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "village_name") {
      const found = villages.find((v) => v.village_name === value);

      setFormData({
        ...formData,
        village_name: value,
        village_code: found?.village_code || "",
      });

      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missing = requiredFields.filter(
      (field) => !formData[field] || formData[field].trim() === ""
    );

    if (missing.length > 0) {
      alert(
        `Please fill all required fields:\n\n${missing
          .map((f) => f.replace(/_/g, " ").toUpperCase())
          .join(", ")}`
      );
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        type: typeParam,
        project_id: selectedProject,
      };

      const url = editingPlot
        ? `${API_BASE_URL}/plots/updatePlot/${editingPlot.id}`
        : `${API_BASE_URL}/plots/createPlot`;

      const method = editingPlot ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("SAVE PLOT:", data);

      if (data.success) {
        alert("Plot saved successfully!");
        if (fetchPlots) fetchPlots();
        navigate(`/${landType}/plots`);
      } else {
        alert(data.message || "Failed to save plot");
      }
    } catch (err) {
      console.error("Save Error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto bg-white shadow-lg p-6 rounded-lg border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {editingPlot ? "Edit Plot" : "Add New Plot"}
             {/* for {landType?.replace("-", " ")} */}
          </h2>

          <button
            onClick={() => navigate(`/${landType}/plots`)}
            className="btn btn-outline btn-sm"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
        <label>Project Name</label>
            <input
              // disabled
              className="input input-bordered w-full bg-gray-100"
              value={
                selectedProject
                  ? selectedProject.project_name || selectedProject.name
                  : "Select Project"
              }
            />
          </div>

          <div>
            <label className="font-semibold text-sm mb-1 block">
              Land Type
            </label>
            <input
              readOnly
              className="input input-bordered w-full bg-gray-100"
              value={
                typeParam === 1
                  ? "Private Land"
                  : typeParam === 2
                  ? "Government Land"
                  : "Forest Land"
              }
            />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {Object.entries(sections).map(([section, fields]) => (
            <div key={section} className="p-4 border rounded-md bg-gray-50">
              <h3 className="font-semibold text-lg mb-3">{section}</h3>

              <div className="grid grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field}>
                    <label className="text-xs font-semibold mb-1 block">
                      {field.replace(/_/g, " ").toUpperCase()}{" "}
                      {requiredFields.includes(field) && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>

                    {field === "village_name" ? (
                      <select
                        name={field}
                        className="select select-bordered w-full"
                        value={formData[field]}
                        required
                        onChange={handleChange}
                      >
                        <option value="">Select Village</option>
                        {villages.map((v) => (
                          <option key={v.id} value={v.village_name}>
                            {v.village_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        type={
                          field.includes("date")
                            ? "date"
                            : field.includes("area") ||
                              field.includes("acres") ||
                              field.includes("hectares")
                            ? "number"
                            : "text"
                        }
                        required={requiredFields.includes(field)}
                        className="input input-bordered w-full"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="btn"
              onClick={() => navigate(`/${landType}/plots`)}
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default PlotForm;
