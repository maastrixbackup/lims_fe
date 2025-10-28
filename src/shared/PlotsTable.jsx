import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Filter, X } from "lucide-react"; 

const PlotTable = ({ plots, setDeleteConfirm }) => {
  const navigate = useNavigate();
  // 🔹 Filter States
  const [selectedVillage, setSelectedVillage] = useState("");
  const [selectedTahasil, setSelectedTahasil] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Extract unique villages & tahasils for dropdowns
  const villageOptions = useMemo(() => {
    const uniqueVillages = new Set(plots?.map((p) => p.village_name).filter(Boolean));
    return [...uniqueVillages];
  }, [plots]);

  const tahasilOptions = useMemo(() => {
    const uniqueTahasil = new Set(plots?.map((p) => p.tahasil_name).filter(Boolean));
    return [...uniqueTahasil];
  }, [plots]);

  const sortedPlots = useMemo(() => {
    if (!plots || plots.length === 0) return [];
    return [...plots].sort((a, b) => (a.id || 0) - (b.id || 0));
  }, [plots]);

  // 🔹 Apply filters and search
  const filteredPlots = useMemo(() => {
    return sortedPlots.filter((plot) => {
      const matchVillage =
        !selectedVillage || plot.village_name === selectedVillage;
      const matchTahasil =
        !selectedTahasil || plot.tahasil_name === selectedTahasil;

      const query = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        Object.values(plot)
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchVillage && matchTahasil && matchSearch;
    });
  }, [sortedPlots, selectedVillage, selectedTahasil, searchQuery]);

  // 🔹 Reset filters
  const resetFilters = () => {
    setSelectedVillage("");
    setSelectedTahasil("");
    setSearchQuery("");
  };
 

  return (
    <div className="card bg-white shadow-lg rounded-2xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-600">Village:</label>
          <select
            className="select select-bordered select-sm w-40"
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
          >
            <option value="">All Villages</option>
            {villageOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-600">Tahasil:</label>
          <select
            className="select select-bordered select-sm w-40"
            value={selectedTahasil}
            onChange={(e) => setSelectedTahasil(e.target.value)}
          >
            <option value="">All Tahasils</option>
            {tahasilOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search tenant, plot, khata..."
            className="input input-bordered input-sm w-60"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="btn btn-sm btn-ghost text-gray-500"
            onClick={resetFilters}
            title="Reset filters"
          >
            <X size={16} />
          </button>
        </div>

        <div className="ml-auto text-sm text-gray-600 flex items-center gap-1">
          <Filter size={16} /> Showing {filteredPlots.length} results
        </div>
      </div>

      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="table w-full text-xs">
          <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10 whitespace-nowrap">
            <tr>
              <th>#</th>
              <th>Village</th>
              <th>Tahasil</th>
              <th>RI Circle</th>
              <th>Thana No</th>
              <th>Khata No</th>
              <th>Plot No</th>
              <th>Kissam</th>
              <th>Land Category</th>
              <th>Tenant (Recorded)</th>
              <th>Tenant (Present)</th>
              <th>Present Address</th>
              <th>Land Area (Acre)</th>
              <th>Acquired Area (Acre)</th>
              <th>Market Value (₹)</th>
              <th>Basic Land Value (₹)</th>
              <th>Land Value w/ MF (₹)</th>
              <th>No. of Trees</th>
              <th>Value of Trees (₹)</th>
              <th>No. of Houses</th>
              <th>Value of Houses (₹)</th>
              <th>Other Structures</th>
              <th>Value of Other Structures (₹)</th>
              <th>Total Value (₹)</th>
              <th>Solatium 100%</th>
              <th>Additional 12%</th>
              <th>Total Compensation (₹)</th>
              <th>Bank</th>
              <th>Account No</th>
              <th>IFSC</th>
              <th>Aadhaar</th>
              <th>PAN</th>
              <th>Age</th>
              <th>Caste</th>
              <th>Marital Status</th>
              <th>Education</th>
              <th>Occupation</th>
              <th>Annual Income (₹)</th>
              <th>Skill Acquired</th>
              <th>Affidavit</th>
              <th>Family (Major Male)</th>
              <th>Family (Major Female)</th>
              <th>Family (Minor Male)</th>
              <th>Family (Minor Female)</th>
              <th>Family (Major TG)</th>
              <th>Family (Minor TG)</th>
              <th>Disabled Members</th>
              <th>Orphan Members</th>
              <th>Legal Heir Cert No</th>
              <th>Land Case No</th>
              <th>Case Date</th>
              <th>Case Type</th>
              <th>Case Status</th>
              <th>Case Action</th>
              <th>RR Employment</th>
              <th>RR Cash In Lieu</th>
              <th>RR Training/Skill</th>
              <th>RR Self Employment</th>
              <th>RR Special Allowance</th>
              <th>RR Homestead</th>
              <th>RR House Building</th>
              <th>Constructed By</th>
              <th>Transit Shed</th>
              <th>Transport Allowance</th>
              <th>Maintenance Allowance</th>
              <th>Multiple Displacement</th>
              <th>Ex-Gratia</th>
              <th>Other Benefits</th>
              <th>Grievance No</th>
              <th>Grievance Date</th>
              <th>Grievance Subject</th>
              <th>Grievance Status</th>
              <th>Grievance Action</th>
              <th>Tribunal</th>
              <th>Tribunal Deposit Date</th>
              <th>Tribunal Amount</th>
              <th>Premium</th>
              <th>Ground Rent</th>
              <th>Cess</th>
              <th>Incidental Charges</th>
              <th>Total</th>
              <th>Abatement</th>
              <th>Date of Award</th>
              <th>Priority/Urgency</th>
              <th>Land Use Plan</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th className="text-right pr-6">Actions</th>
            </tr>
          </thead>

          <tbody>
             {filteredPlots.length > 0 ? (
              filteredPlots.map((plot, idx) => (
                <tr key={plot.id || idx} className="hover:bg-gray-50 transition-colors whitespace-nowrap">
                  <td>{idx + 1}</td>
                  <td>{plot.village_name || "N/A"}</td>
                  <td>{plot.tahasil_name || "N/A"}</td>
                  <td>{plot.ri_circle_name || "N/A"}</td>
                  <td>{plot.thana_no || "N/A"}</td>
                  <td>{plot.khata_no || "N/A"}</td>
                  <td>{plot.plot_no || "N/A"}</td>
                  <td>{plot.kissam_of_land || "N/A"}</td>
                  <td>{plot.land_category || "N/A"}</td>
                  <td>{plot.name_of_recorded_tenant || "N/A"}</td>
                  <td>{plot.name_of_present_tenant || "N/A"}</td>
                  <td>{plot.present_address || "N/A"}</td>
                  <td>{plot.land_area_total_acres || "N/A"}</td>
                  <td>{plot.land_area_acquired_acres || "N/A"}</td>
                  <td>{plot.market_value_per_acre || "N/A"}</td>
                  <td>{plot.basic_land_value || "N/A"}</td>
                  <td>{plot.land_value_with_mf || "N/A"}</td>
                  <td>{plot.no_of_trees || "N/A"}</td>
                  <td>{plot.total_value_of_trees || "N/A"}</td>
                  <td>{plot.no_of_house || "N/A"}</td>
                  <td>{plot.value_of_house || "N/A"}</td>
                  <td>{plot.details_of_other_structures || "N/A"}</td>
                  <td>{plot.value_of_other_structures || "N/A"}</td>
                  <td>{plot.total_value || "N/A"}</td>
                  <td>{plot.solatium_100 || "N/A"}</td>
                  <td>{plot.additional_12_percent || "N/A"}</td>
                  <td>{plot.total_compensation || "N/A"}</td>
                  <td>{plot.bank_name || "N/A"}</td>
                  <td>{plot.bank_account_no || "N/A"}</td>
                  <td>{plot.branch_ifsc || "N/A"}</td>
                  <td>{plot.aadhaar_no || "N/A"}</td>
                  <td>{plot.pan_no || "N/A"}</td>
                  <td>{plot.age || "N/A"}</td>
                  <td>{plot.caste || "N/A"}</td>
                  <td>{plot.marital_status || "N/A"}</td>
                  <td>{plot.education || "N/A"}</td>
                  <td>{plot.occupation || "N/A"}</td>
                  <td>{plot.annual_income || "N/A"}</td>
                  <td>{plot.skill_acquired || "N/A"}</td>
                  <td>{plot.affidavit_details || "N/A"}</td>
                  <td>{plot.family_major_male || "N/A"}</td>
                  <td>{plot.family_major_female || "N/A"}</td>
                  <td>{plot.family_minor_male || "N/A"}</td>
                  <td>{plot.family_minor_female || "N/A"}</td>
                  <td>{plot.family_major_transgender || "N/A"}</td>
                  <td>{plot.family_minor_transgender || "N/A"}</td>
                  <td>{plot.persons_with_disability || "N/A"}</td>
                  <td>{plot.family_with_orphan_members || "N/A"}</td>
                  <td>{plot.legal_heir_certificate_no || "N/A"}</td>
                  <td>{plot.land_case_no || "N/A"}</td>
                  <td>{plot.land_case_date || "N/A"}</td>
                  <td>{plot.land_case_type || "N/A"}</td>
                  <td>{plot.land_case_status || "N/A"}</td>
                  <td>{plot.land_case_action || "N/A"}</td>
                  <td>{plot.rr_employment || "N/A"}</td>
                  <td>{plot.rr_cash_in_lieu || "N/A"}</td>
                  <td>{plot.rr_training_skill_upgradation || "N/A"}</td>
                  <td>{plot.rr_self_employment || "N/A"}</td>
                  <td>{plot.rr_special_allowance_st_ntfp || "N/A"}</td>
                  <td>{plot.rr_homestead_allotment || "N/A"}</td>
                  <td>{plot.rr_house_building_assistance || "N/A"}</td>
                  <td>{plot.rr_constructed_by || "N/A"}</td>
                  <td>{plot.rr_transit_shed || "N/A"}</td>
                  <td>{plot.rr_transport_allowance || "N/A"}</td>
                  <td>{plot.rr_maintenance_allowance || "N/A"}</td>
                  <td>{plot.rr_multiple_displacement_allowance || "N/A"}</td>
                  <td>{plot.rr_exgratia || "N/A"}</td>
                  <td>{plot.rr_other_benefits || "N/A"}</td>
                  <td>{plot.grievance_no || "N/A"}</td>
                  <td>{plot.grievance_date || "N/A"}</td>
                  <td>{plot.grievance_subject || "N/A"}</td>
                  <td>{plot.grievance_status || "N/A"}</td>
                  <td>{plot.grievance_action || "N/A"}</td>
                  <td>{plot.tribunal || "N/A"}</td>
                  <td>{plot.tribunal_deposit_date || "N/A"}</td>
                  <td>{plot.tribunal_amount || "N/A"}</td>
                  <td>{plot.premium || "N/A"}</td>
                  <td>{plot.ground_rent || "N/A"}</td>
                  <td>{plot.cess || "N/A"}</td>
                  <td>{plot.incidental_charges || "N/A"}</td>
                  <td>{plot.total || "N/A"}</td>
                  <td>{plot.abatement || "N/A"}</td>
                  <td>{plot.date_of_award || "N/A"}</td>
                  <td>{plot.priority_urgency || "N/A"}</td>
                  <td>{plot.land_use_plan || "N/A"}</td>
                  <td>{new Date(plot.created_at).toLocaleDateString() || "N/A"}</td>
                  <td>{plot.updated_at ? new Date(plot.updated_at).toLocaleDateString() : "N/A"}</td>

                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="btn btn-xs btn-warning text-white"
                        onClick={() => navigate("/plot-form", { state: { plot } })}
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        className="btn btn-xs btn-error text-white"
                        onClick={() => setDeleteConfirm(plot)}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="80" className="text-center py-6 text-gray-500">
                  No plots found. Click <span className="font-semibold">+ Add Plot</span> to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlotTable;
