import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../utils/config";

const PlotForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userToken: token } = useSelector((s) => s.auth);
  const editingPlot = location.state?.plot || null;

  // Dropdown options
  const dropdownFields = {
    displaced_affected_person: ["PAF", "PDF"],
    family_with_orphan_members: ["Y", "N"],
    tribunal: ["Y", "N"],
    abatement: ["Yes", "No"],
  };

  // Section-wise field grouping
  const sections = {
    "Basic Information": [
      "ses_survey_no",
      "la_case_file_no",
      "date_of_award",
      "village_name",
      "tahasil_name",
      "ri_circle_name",
      "thana_no",
      "khata_no",
      "plot_no",
      "kissam_of_land",
      "land_category",
      "priority_urgency",
      "land_use_plan",
      "lo13_remarks",
      "la21_remarks",
    ],
    "Tenant Information": [
      "name_of_recorded_tenant",
      "name_of_present_tenant",
      "present_address",
      "displaced_affected_person",
    ],
    "Land Details": [
      "land_area_total_acres",
      "land_area_total_hectares",
      "land_area_acquired_acres",
      "land_area_acquired_hectares",
      "market_value_per_acre",
      "basic_land_value",
      "land_value_with_mf",
    ],
    "Compensation Details": [
      "no_of_trees",
      "total_value_of_trees",
      "no_of_house",
      "value_of_house",
      "details_of_other_structures",
      "value_of_other_structures",
      "total_value",
      "solatium_100",
      "additional_12_percent",
      "total_compensation",
      "apportionment_amount",
    ],
    "Bank & Personal Details": [
      "bank_account_no",
      "bank_name",
      "branch_ifsc",
      "aadhaar_no",
      "pan_no",
      "age",
      "caste",
      "marital_status",
      "education",
      "occupation",
      "annual_income",
      "skill_acquired",
      "affidavit_details",
    ],
    "Family Details": [
      "family_major_male",
      "family_major_female",
      "family_minor_male",
      "family_minor_female",
      "family_major_transgender",
      "family_minor_transgender",
      "persons_with_disability",
      "family_with_orphan_members",
      "legal_heir_certificate_no",
    ],
    "Land Case Details": [
      "land_case_no",
      "land_case_date",
      "land_case_type",
      "land_case_status",
      "land_case_action",
    ],
    "R&R Assistance": [
      "rr_employment",
      "rr_cash_in_lieu",
      "rr_training_skill_upgradation",
      "rr_self_employment",
      "rr_special_allowance_st_ntfp",
      "rr_homestead_allotment",
      "rr_house_building_assistance",
      "rr_constructed_by",
      "rr_transit_shed",
      "rr_transport_allowance",
      "rr_maintenance_allowance",
      "rr_multiple_displacement_allowance",
      "rr_exgratia",
      "rr_other_benefits",
    ],
    "Grievance Details": [
      "grievance_no",
      "grievance_date",
      "grievance_subject",
      "grievance_status",
      "grievance_action",
    ],
    "Tribunal & Revenue": [
      "tribunal",
      "tribunal_deposit_date",
      "tribunal_amount",
      "premium",
      "ground_rent",
      "cess",
      "incidental_charges",
      "total",
      "abatement",
    ],
  };

  // Initial form with test values
  const [formData, setFormData] = useState(() =>
    Object.fromEntries(Object.values(sections).flat().map((f) => [f, "Test"]))
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingPlot) setFormData((prev) => ({ ...prev, ...editingPlot }));
  }, [editingPlot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/plots/createPlot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
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

                    {dropdownFields[field] ? (
                      <select
                        id={field}
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
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
                          field.includes("date") ? "date" :
                          ["age", "amount", "value", "area", "acres", "hectares", "income"].some((k) =>
                            field.includes(k)
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
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default PlotForm;
