// src/components/Plots/PlotTable.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const PlotTable = ({ plots, onEdit,setDeleteConfirm }) => {
const navigate = useNavigate();

  return (
    <div className="card bg-white shadow-lg rounded-2xl">
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="table w-full whitespace-nowrap text-sm">
          <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
            <tr>
              <th>#</th>
              <th>Project</th>
              <th>Village</th>
              <th>Khata No</th>
              <th>Code</th>
              <th>Sl</th>
              <th>Plot No. 1</th>
              <th>Plot No. 2</th>
              <th>Tenant</th>
              <th>Kissam</th>
              <th>RoR Area</th>
              <th>Occupied Area</th>
              {[
                "SES Survey No.",
                "LA Case File No.",
                "Date of Award",
                "LO1-Name of Recorded Tenant (RT)",
                "LO2-Name of Present Tenant(s)",
                "Present Address",
                "Displaced/Affected Person",
                "Name of Village",
                "Name of the Tahasil",
                "Name of the R.I. Circle",
                "Thana No.",
                "Khata No.",
                "Plot No.",
                "Kissam of the Land",
                "LO12-Category of Land",
                "LO13-Remarks",
                "LA1-Land Area (Total Area in Acres)",
                "LA2-Land Area (Total Area in Ha.)",
                "Land Area (Total Acquired Area in Acres)",
                "Land Area (Total Acquired Area in Ha.)",
                "Market Value fixed U/S.26 of RFCTLARR Act 2013 (Per Acre)",
                "Basic Land value",
                "Land value  with multiplication factor (Values from 1 to 2)",
                "No. of Trees",
                "Total Value of Trees",
                "No. of House",
                "Value of Structure (house)",
                "Detail of Structures other than House",
                "Value of structures other than house",
                "Total Value  (Land-22 + Tree-24 + House-26 + Structures-28)",
                "Solatium @ of (100%)",
                "12% additional compensation on market value of land area",
                "Total Compensation Amount",
                "LA18-Apportionment Amount of the Award for the Individual Family Member",
                "LA19-Priority/Urgency",
                "LA20-Land Use Plan",
                "LA21-Remarks",
                "BK01-Bank Account No.",
                "BK02-Name of the Bank",
                "BK03-Name of the Branch with IFSC Code",
                "PD01-Aadhaar No.",
                "PAN No.",
                "Age",
                "Caste",
                "Marital Status",
                "Education",
                "Occupation",
                "Annual Income",
                "PD09- Skill Acquired",
                "PD10-Affidavit with subject details (if any)",
                "FD01-No. of Family Members (Major Male)",
                "No. of Family Members (Major Female)",
                "No. of Family Members (Minor Male)",
                "No. of Family Members (Minor Female)",
                "No. of Family Members (Major Transgender)",
                "No. of Family Members (Minor Transgender)",
                "No. of Persons with Disability",
                "Family with Orphan Members (Y/N)",
                "FD09-Legal Heir Certificate No. (if any)",
                "LG01-Land Case - No. (Number)",
                "Land Case - Date (Date)",
                "Land Case Type",
                "Land case - Status",
                "LG05-Land Case - Action",
                "RR Assistance (Rehab) - Employment in the Project",
                "RR Assistance (Rehab) - Cash in lieu of Employment",
                "RR Assistance (Rehab) - Training for Skill Upgradation",
                "RR Assistance (Rehab) - Assistance for Self Employment",
                "RR Assistance (Rehab) - Special Allowance to STs for loss of NTFP",
                "RR Assistance (Resettle) - Homested Land Alloted/Self Relocation",
                "RR Assistance (Resettle) - House Building Assistance",
                "RR Assistance (Resettle) - Constructed by Project Authority/Self",
                "RR Assistance (Resettle) - Assistance for Transit Shed",
                "RR Assistance (Resettle) - Transportation Allowance",
                "RR Assistance (Resettle) - Maintenance Allowance",
                "RR Assistance (Other) - Special Allowance for Multiple Displacement",
                "RR Assistance (Other) - Ex-Gratia (if any)",
                "RR Assistance (Other) - Other Benefits (if any)",
                "GR01-Grievance No.",
                "Grievance  Date",
                "Grievance - Subject Matter",
                "Grievance - Present Status",
                "GR05-Grievance - Action taken",
                "TR01-Tribunal (Y/N)",
                "Tribunal - Date of Deposit",
                "TR03-Tribunal - Amount Deposited",
                "GV01-Premium",
                "GV02-Ground Rent",
                "GV03-Cess",
                "GV04-Incidental Charges",
                "GV05-Total",
                "Abatement",
              ].map((label) => (
                <th key={label}>{label}</th>
              ))}

              <th className="text-right pr-6">Actions</th>
            </tr>
          </thead>

          <tbody>
            {plots.length > 0 ? (
              plots.map((plot, idx) => (
                <tr
                  key={plot.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td>{idx + 1}</td>
                  <td>GMDC - Baitarani-West Coal Block</td>
                  <td>{plot.village}</td>
                  <td>{plot.khataNo}</td>
                  <td>{plot.code}</td>
                  <td>{plot.sl}</td>
                  <td>{plot.plotNo1}</td>
                  <td>{plot.plotNo2}</td>
                  <td>{plot.tenant}</td>
                  <td>{plot.kissam}</td>
                  <td>{plot.rorArea}</td>
                  <td>{plot.occupiedArea}</td>

                  {/* === NEW EXTENDED DATA CELLS === */}
                  {[
                    "SES_Survey_No_",
                    "LA_Case_File_No_",
                    "Date_of_Award",
                    "LO1-Name_of_Recorded_Tenant_(RT)",
                    "LO2-Name_of_Present_Tenant(s)",
                    "Present_Address",
                    "Displaced/Affected_Person",
                    "Name_of_Village",
                    "Name_of_the_Tahasil",
                    "Name_of_the_R.I._Circle",
                    "Thana_No_",
                    "Khata_No_",
                    "Plot_No_",
                    "Kissam_of_the_Land",
                    "LO12-Category_of_Land",
                    "LO13-Remarks",
                    "LA1-Land_Area_(Total_Area_in_Acres)",
                    "LA2-Land_Area_(Total_Area_in_Ha_)",
                    "Land_Area_(Total_Acquired_Area_in_Acres)",
                    "Land_Area_(Total_Acquired_Area_in_Ha_)",
                    "Market_Value_fixed_U_S.26_of_RFCTLARR_Act_2013_(Per_Acre)",
                    "Basic_Land_value",
                    "Land_value_with_multiplication_factor_(Values_from_1_to_2)",
                    "No._of_Trees",
                    "Total_Value_of_Trees",
                    "No._of_House",
                    "Value_of_Structure_(house)",
                    "Detail_of_Structures_other_than_House",
                    "Value_of_structures_other_than_house",
                    "Total_Value_(Land-22_+_Tree-24_+_House-26_+_Structures-28)",
                    "Solatium_@_of_(100%)",
                    "12%_additional_compensation_on_market_value_of_land_area",
                    "Total_Compensation_Amount",
                    "LA18-Apportionment_Amount_of_the_Award_for_the_Individual_Family_Member",
                    "LA19-Priority/Urgency",
                    "LA20-Land_Use_Plan",
                    "LA21-Remarks",
                    "BK01-Bank_Account_No.",
                    "BK02-Name_of_the_Bank",
                    "BK03-Name_of_the_Branch_with_IFSC_Code",
                    "PD01-Aadhaar_No.",
                    "PAN_No.",
                    "Age",
                    "Caste",
                    "Marital_Status",
                    "Education",
                    "Occupation",
                    "Annual_Income",
                    "PD09-_Skill_Acquired",
                    "PD10-Affidavit_with_subject_details_(if_any)",
                    "FD01-No._of_Family_Members_(Major_Male)",
                    "No._of_Family_Members_(Major_Female)",
                    "No._of_Family_Members_(Minor_Male)",
                    "No._of_Family_Members_(Minor_Female)",
                    "No._of_Family_Members_(Major_Transgender)",
                    "No._of_Family_Members_(Minor_Transgender)",
                    "No._of_Persons_with_Disability",
                    "Family_with_Orphan_Members_(Y/N)",
                    "FD09-Legal_Heir_Certificate_No._(if_any)",
                    "LG01-Land_Case_-_No._(Number)",
                    "Land_Case_-_Date_(Date)",
                    "Land_Case_Type",
                    "Land_case_-_Status",
                    "LG05-Land_Case_-_Action",
                    "RR_Assistance_(Rehab)_-_Employment_in_the_Project",
                    "RR_Assistance_(Rehab)_-_Cash_in_lieu_of_Employment",
                    "RR_Assistance_(Rehab)_-_Training_for_Skill_Upgradation",
                    "RR_Assistance_(Rehab)_-_Assistance_for_Self_Employment",
                    "RR_Assistance_(Rehab)_-_Special_Allowance_to_STs_for_loss_of_NTFP",
                    "RR_Assistance_(Resettle)_-_Homested_Land_Alloted/Self_Relocation",
                    "RR_Assistance_(Resettle)_-_House_Building_Assistance",
                    "RR_Assistance_(Resettle)_-_Constructed_by_Project_Authority/Self",
                    "RR_Assistance_(Resettle)_-_Assistance_for_Transit_Shed",
                    "RR_Assistance_(Resettle)_-_Transportation_Allowance",
                    "RR_Assistance_(Resettle)_-_Maintenance_Allowance",
                    "RR_Assistance_(Other)_-_Special_Allowance_for_Multiple_Displacement",
                    "RR_Assistance_(Other)_-_Ex-Gratia_(if_any)",
                    "RR_Assistance_(Other)_-_Other_Benefits_(if_any)",
                    "GR01-Grievance_No.",
                    "Grievance_Date",
                    "Grievance_-_Subject_Matter",
                    "Grievance_-_Present_Status",
                    "GR05-Grievance_-_Action_taken",
                    "TR01-Tribunal_(Y/N)",
                    "Tribunal_-_Date_of_Deposit",
                    "TR03-Tribunal_-_Amount_Deposited",
                    "GV01-Premium",
                    "GV02-Ground_Rent",
                    "GV03-Cess",
                    "GV04-Incidental_Charges",
                    "GV05-Total",
                    "Abatement",
                  ].map((key) => (
                    <td key={key}>{plot[key] || "-"}</td>
                  ))}

                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                     <button
                          className="btn btn-xs btn-warning text-white"
                          onClick={() =>
                            navigate("/plot-form", { state: { plot } }) // 👈 navigate with state for editing
                          }
                        >
                        Edit
                      </button>
                    <button
                          className="btn btn-xs btn-error text-white"
                          onClick={() => setDeleteConfirm(plot)}
                        >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="999" className="text-center py-6 text-gray-500">
                  No plots found. Click{" "}
                  <span className="font-semibold">+ Add Plot</span> to create
                  one.
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
