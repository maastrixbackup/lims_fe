import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../utils/config";
import {sections} from "../utils/constants"

const PlotForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userToken: token } = useSelector((s) => s.auth);
  const editingPlot = location.state?.plot || null;
  const { projects, villages } = useSelector((s) => s.list);

  const dropdownFields = {
    displaced_affected_person: ["PAF", "PDF"],
    family_with_orphan_members: ["Y", "N"],
    tribunal: ["Y", "N"],
    abatement: ["Yes", "No"],
  };

  const [formData, setFormData] = useState(() =>
    Object.fromEntries(Object.values(sections).flat().map((f) => [f, ""]))
  );

  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingPlot) {
      setFormData((prev) => ({ ...prev, ...editingPlot }));
      setSelectedProject(editingPlot.project_id || "");
    }
  }, [editingPlot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        project_id: selectedProject,
      };

      const res = await fetch(`${API_BASE_URL}/plots/createPlot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Add Plot API Response:", data);

      if (data.success) {
        alert("Plot saved successfully!");
        navigate("/plots");
      } else {
        alert(`Failed: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error adding plot:", err);
      alert("Something went wrong while saving plot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto bg-white shadow-lg p-6 rounded-lg border border-gray-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {editingPlot ? "Edit Plot" : "Add New Plot"}
          </h2>
          <button
            onClick={() => navigate("/plots")}
            className="btn btn-outline btn-sm"
          >
            &larr; Back
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Project Name
          </label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Project</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.project_name}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {Object.entries(sections).map(([section, fields]) => (
            <div
              key={section}
              className="border rounded-lg p-4 bg-gray-50 shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
                {section}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field} className="flex flex-col">
                    <label
                      htmlFor={field}
                      className="text-xs font-semibold text-gray-600 mb-1"
                    >
                      {field.replace(/_/g, " ").toUpperCase()}
                    </label>
  
                    {field === "village_name" ? (
                      <select
                        id={field}
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select Village</option>
                        {villages.map((v) => (
                          <option key={v.id} value={v.village_name}>
                            {v.village_name}
                          </option>
                        ))}
                      </select>
                    ) : dropdownFields[field] ? (
                      <select
                        id={field}
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select</option>
                        {dropdownFields[field].map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={field}
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        placeholder={field.replace(/_/g, " ")}
                        type={
                          field.includes("date")
                            ? "date"
                            : ["age", "amount", "value", "area", "acres", "hectares", "income"].some(
                                (k) => field.includes(k)
                              )
                            ? "number"
                            : "text"
                        }
                        className="input input-bordered w-full"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="btn"
              onClick={() => navigate("/plots")}
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
