export const odishaDistricts = [
  "Angul",
  "Balangir",
  "Balasore",
  "Bargarh",
  "Bhadrak",
  "Boudh",
  "Cuttack",
  "Deogarh",
  "Dhenkanal",
  "Gajapati",
  "Ganjam",
  "Jagatsinghpur",
  "Jajpur",
  "Jharsuguda",
  "Kalahandi",
  "Kandhamal",
  "Kendrapara",
  "Kendujhar",
  "Khordha",
  "Koraput",
  "Malkangiri",
  "Mayurbhanj",
  "Nabarangpur",
  "Nayagarh",
  "Nuapada",
  "Puri",
  "Rayagada",
  "Sambalpur",
  "Subarnapur",
  "Sundargarh",
];

// export const projectVillageKhataMap = {
//   "GMDC - Baitarani-West Coal Block": {
//     "Chhendipada Jangal": ["Khata-101", "Khata-102", "Khata-103"],
//     Handigora: ["Khata-201", "Khata-202"],
//   },
// };

export const sections = {
  "Basic Information": [
    "village_name",
    "village_code",
    "khata_no",
    "la_case_file_no",
    "plot_no",
    "full_part",
    "date_of_award",
    "tahasil_name",
    "ri_circle_name",
    "thana_no",
    "kissam_of_land",
    "land_category",
    "priority_urgency",
    // "land_use_plan",
    "lo13_remarks",
    "la21_remarks",
    "ses_survey_no",
  ],
  "Tenant Information": [
    "name_of_recorded_tenant",
    "name_of_present_tenant",
    "present_address",
    "displaced_affected_person",
  ],
  "Land Area Valuation Details": [
    "land_area_total_acres",
    "land_area_total_hectares",
    "land_area_acquired_acres",
    "land_area_acquired_hectares",
    "market_value_per_acre",
    "basic_land_value",
    "land_value_with_mf",
    "no_of_trees",
    "total_value_of_trees",
    "no_of_house",
    "value_of_house",
    "details_of_other_structures",
    "value_of_other_structures",
    "total_value",
    "solatium_100",
    "no_days_interest",
    "additional_12_percent",
    "total_compensation",
    // "apportionment_amount",
  ],
  // "Compensation Details": [
  //   "no_of_trees",
  //   "total_value_of_trees",
  //   "no_of_house",
  //   "value_of_house",
  //   "details_of_other_structures",
  //   "value_of_other_structures",
  //   "total_value",
  //   "solatium_100",
  //   "Days_of_interest",
  //   "additional_12_percent",
  //   "total_compensation",
  //   "apportionment_amount",
  // ],
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
export const getTypeName = (type) => {
  switch (Number(type)) {
    case 1:
      return "Private Land";
    case 2:
      return "Government Land";
    case 3:
      return "Forest Land";
    default:
      return "-";
  }
};

export const showToast = (message, type = "info") => {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.padding = "10px 16px";
  toast.style.borderRadius = "6px";
  toast.style.color = "#fff";
  toast.style.fontSize = "14px";
  toast.style.zIndex = "9999";
  toast.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.3s ease";
  toast.style.backgroundColor =
    type === "success" ? "#16a34a" : type === "error" ? "#dc2626" : "#2563eb";

  document.body.appendChild(toast);
  setTimeout(() => (toast.style.opacity = "1"), 10);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
};

export const DOCUMENT_TYPES = [
  "Order Sheet",
  "Notice by project proponent",
  "Attendance Sheet",
  "Consent Form",
  "Genealogy Sheet",
  "Legal Heir Certificate",
  "Yadast Register Copy",
  "Self-Attested RoR",
  "Certified Copy of RoR",
  "Patta Original",
  "Encumbrance Certificate",
  "Rent Receipt",
  "Trace Map",
  "Application to Claim for Land Compensation",
  "Calculation of Compensation",
  "Land Acquisition Award",
  "Indemnity Bond",
  "Aadhaar / Voter Card Copy",
  "PAN Proof",
  "Bank Passbook / Cancelled Cheque Copy",
  "Electronic Fund Transfer Form",
  "Receipt of Compensation",
  "Photo of Physical Possession",
  "Grievance doc(if any)",
  "Form 9A + Sample Photo (if any)",
  "Form 9B + Sample Photo (if any)",
  "Form 9C + Sample Photo (if any)",
  "Physical Possession Certificate (Bond Paper)",
  "Apportionment Affidavit (if applicable)",
  "Affidavit for Legal Issues (if any)",
];

// export const plotData = [
//   {
//     id: 1,
//     code: "Chhendipada Jangal1005/322",
//     village: "Chhendipada Jangal",
//     sl: 1,
//     khataNo: "1005/322",
//     plotNo1: "1994",
//     plotNo2: "1994",
//     tenant: "Abhin Ch. Besan",
//     kissam: "Taila",
//     rorArea: 0.073,
//     occupiedArea: 0.0403,
//     remarks: "PART",
//     yadast: "10th Min",
//     bmv: "",
//     ses: 3300000,
//   },
//   {
//     id: 2,
//     code: "Chhendipada Jangal912",
//     village: "Chhendipada Jangal",
//     sl: 2,
//     khataNo: "912",
//     plotNo1: "1995",
//     plotNo2: "1995",
//     tenant: "Sanand Behera",
//     kissam: "Taila",
//     rorArea: 0.0565,
//     occupiedArea: 0.0008,
//     remarks: "PART",
//     yadast: "10th Min",
//     bmv: "",
//     ses: 3300000,
//   },
//   {
//     id: 3,
//     code: "Chhendipada Jangal913",
//     village: "Chhendipada Jangal",
//     sl: 3,
//     khataNo: "913",
//     plotNo1: "1999",
//     plotNo2: "1999",
//     tenant: "Sananda Behera & others",
//     kissam: "Taila",
//     rorArea: 0.126,
//     occupiedArea: 0.1173,
//     remarks: "PART",
//     yadast: "10th Min",
//     bmv: "",
//     ses: 3300000,
//   },
//   {
//     id: 4,
//     code: "Chhendipada Jangal912",
//     village: "Chhendipada Jangal",
//     sl: 4,
//     khataNo: "912",
//     plotNo1: "2000",
//     plotNo2: "2000",
//     tenant: "Sananda Behera",
//     kissam: "SAJS-III",
//     rorArea: 0.038,
//     occupiedArea: 0.0295,
//     remarks: "PART",
//     yadast: "10th Min",
//     bmv: "",
//     ses: 3300000,
//   },
//   {
//     id: 5,
//     code: "Chhendipada Jangal203",
//     village: "Chhendipada Jangal",
//     sl: 5,
//     khataNo: "203",
//     plotNo1: "2001",
//     plotNo2: "2001",
//     tenant: "Gobinda Behera",
//     kissam: "SAJS-III",
//     rorArea: 0.0405,
//     occupiedArea: 0.0032,
//     remarks: "PART",
//     yadast: "10th Min",
//     bmv: "",
//     ses: 3300000,
//   },
//   {
//     id: 6,
//     code: "Chhendipada Jangal348",
//     village: "Chhendipada Jangal",
//     sl: 6,
//     khataNo: "348",
//     plotNo1: "2084",
//     plotNo2: "2084",
//     tenant: "Dasarathi Sahu & Others",
//     kissam: "Patita",
//     rorArea: 0.665,
//     occupiedArea: 0.2042,
//     remarks: "PART",
//     yadast: "10th Min",
//     bmv: "",
//     ses: 3300000,
//   },
//   {
//     id: 7,
//     code: "Chhendipada Jangal348",
//     village: "Chhendipada Jangal",
//     sl: 7,
//     khataNo: "348",
//     plotNo1: "2088",
//     plotNo2: "2088",
//     tenant: "Dasarathi Sahu & Others",
//     kissam: "Taila",
//     rorArea: 0.1,
//     occupiedArea: 0.1,
//     remarks: "",
//     yadast: "10th Min",
//     bmv: "",
//     ses: 3300000,
//   },
//   {
//     id: 8,
//     code: "Chhendipada Jangal805",
//     village: "Chhendipada Jangal",
//     sl: 8,
//     khataNo: "805",
//     plotNo1: "2089",
//     plotNo2: "2089",
//     tenant: "Rabindra Pradhan",
//     kissam: "Taila",
//     rorArea: 0.044,
//     occupiedArea: 0.044,
//     remarks: "",
//     yadast: "10th Min",
//     bmv: "",
//     ses: 3300000,
//   },
//   {
//     id: 9,
//     code: "Chhendipada Jangal805",
//     village: "Chhendipada Jangal",
//     sl: 9,
//     khataNo: "805",
//     plotNo1: "2091",
//     plotNo2: "2091",
//     tenant: "Rabindra Pradhan",
//     kissam: "Taila",
//     rorArea: 0.03,
//     occupiedArea: 0.0199,
//     remarks: "PART",
//     yadast: "10th Min",
//     bmv: "",
//     ses: 3300000,
//   },
//   {
//     id: 10,
//     code: "Handigora383",
//     village: "Handigora",
//     sl: 3527,
//     khataNo: "383",
//     plotNo1: "47",
//     plotNo2: "47",
//     tenant: "Sebaka sahu & others",
//     kissam: "Taila",
//     rorArea: 0.0835,
//     occupiedArea: 0.0682,
//     remarks: "Part",
//     yadast: "Extra Area",
//     bmv: "",
//     ses: null,
//   },
//   {
//     id: 11,
//     code: "Handigora327",
//     village: "Handigora",
//     sl: 3528,
//     khataNo: "327",
//     plotNo1: "70",
//     plotNo2: "70",
//     tenant: "Rajkishore Sahu & others",
//     kissam: "Patita",
//     rorArea: 0.178,
//     occupiedArea: 0.177,
//     remarks: "Part",
//     yadast: "Extra Area",
//     bmv: "",
//     ses: null,
//   },
//   {
//     id: 12,
//     code: "Handigora407/352",
//     village: "Handigora",
//     sl: 3529,
//     khataNo: "407/352",
//     plotNo1: "70/2965",
//     plotNo2: "2965",
//     tenant: "Brajasundar Sahu",
//     kissam: "Taila",
//     rorArea: 0.009,
//     occupiedArea: 0.009,
//     remarks: "",
//     yadast: "Extra Area",
//     bmv: "",
//     ses: null,
//   },
//   {
//     id: 13,
//     code: "Handigora407/349",
//     village: "Handigora",
//     sl: 3530,
//     khataNo: "407/349",
//     plotNo1: "70/3764",
//     plotNo2: "3764",
//     tenant: "Raj Kishore Sahu",
//     kissam: "Taila",
//     rorArea: 0.0085,
//     occupiedArea: 0.0085,
//     remarks: "",
//     yadast: "Extra Area",
//     bmv: "",
//     ses: null,
//   },
//   {
//     id: 14,
//     code: "Handigora407/350",
//     village: "Handigora",
//     sl: 3531,
//     khataNo: "407/350",
//     plotNo1: "70/3767",
//     plotNo2: "3767",
//     tenant: "Bhajamana Sahu",
//     kissam: "Taila",
//     rorArea: 0.0085,
//     occupiedArea: 0.0085,
//     remarks: "",
//     yadast: "Extra Area",
//     bmv: "",
//     ses: null,
//   },
//   {
//     id: 15,
//     code: "Handigora407/351",
//     village: "Handigora",
//     sl: 3532,
//     khataNo: "407/351",
//     plotNo1: "70/3770",
//     plotNo2: "3770",
//     tenant: "Kunjabihari Sahu",
//     kissam: "Taila",
//     rorArea: 0.0085,
//     occupiedArea: 0.0085,
//     remarks: "",
//     yadast: "Extra Area",
//     bmv: "",
//     ses: null,
//   },
//   {
//     id: 16,
//     code: "Handigora284",
//     village: "Handigora",
//     sl: 3533,
//     khataNo: "284",
//     plotNo1: "71",
//     plotNo2: "71",
//     tenant: "Bhubaneswar Dehury & others",
//     kissam: "Taila",
//     rorArea: 0.7295,
//     occupiedArea: 0.7295,
//     remarks: "",
//     yadast: "Extra Area",
//     bmv: "",
//     ses: null,
//   },
//   {
//     id: 17,
//     code: "Handigora407/352",
//     village: "Handigora",
//     sl: 3534,
//     khataNo: "407/352",
//     plotNo1: "71/2966",
//     plotNo2: "2966",
//     tenant: "Brajasundar Sahu",
//     kissam: "SAJS-II",
//     rorArea: 0.021,
//     occupiedArea: 0.021,
//     remarks: "",
//     yadast: "Extra Area",
//     bmv: "",
//     ses: null,
//   },
//   {
//     id: 18,
//     code: "Handigora407/349",
//     village: "Handigora",
//     sl: 3535,
//     khataNo: "407/349",
//     plotNo1: "71/3765",
//     plotNo2: "3765",
//     tenant: "Raj Kishore Sahu",
//     kissam: "SAJS-II",
//     rorArea: 0.0215,
//     occupiedArea: 0.0215,
//     remarks: "",
//     yadast: "Extra Area",
//     bmv: "",
//     ses: null,
//   },
//   {
//     id: 19,
//     code: "Handigora407/350",
//     village: "Handigora",
//     sl: 3536,
//     khataNo: "407/350",
//     plotNo1: "71/3768",
//     plotNo2: "3768",
//     tenant: "Bhajamana Sahu",
//     kissam: "SAJS-II",
//     rorArea: 0.0215,
//     occupiedArea: 0.0215,
//     remarks: "",
//     yadast: "Extra Area",
//     bmv: "",
//     ses: null,
//   },
//   {
//     id: 20,
//     code: "Handigora407/351",
//     village: "Handigora",
//     sl: 3537,
//     khataNo: "407/351",
//     plotNo1: "71/3771",
//     plotNo2: "3771",
//     tenant: "Kunjabihari Sahu",
//     kissam: "SAJS-II",
//     rorArea: 0.0215,
//     occupiedArea: 0.0215,
//     remarks: "",
//     yadast: "Extra Area",
//     bmv: "",
//     ses: null,
//   },
//   {
//     id: 21,
//     code: "Handigora224",
//     village: "Handigora",
//     sl: 3538,
//     khataNo: "224",
//     plotNo1: "72",
//     plotNo2: "72",
//     tenant: "Prahlada Dehury& others",
//     kissam: "Taila",
//     rorArea: 0.79,
//     occupiedArea: 0.7795,
//     remarks: "Part",
//     yadast: "Extra Area",
//     bmv: "",
//     ses: null,
//   },
// ];

export const columns = [
  { label: "Project ID", key: "project_id" },
  { label: "SES Survey No", key: "ses_survey_no" },
  { label: "LA Case File No", key: "la_case_file_no" },
  { label: "Date of Award", key: "date_of_award" },
  { label: "Recorded Tenant Name", key: "name_of_recorded_tenant" },
  { label: "Present Tenant Name", key: "name_of_present_tenant" },
  { label: "Present Address", key: "present_address" },
  { label: "Displaced/Affected Person", key: "displaced_affected_person" },
  { label: "Village Name", key: "village_name" },
  { label: "Village Code", key: "village_code" },
  { label: "Tahasil Name", key: "tahasil_name" },
  { label: "RI Circle Name", key: "ri_circle_name" },
  { label: "Thana No", key: "thana_no" },
  { label: "Khata No", key: "khata_no" },
  { label: "Plot No", key: "plot_no" },
  { label: "Kissam of Land", key: "kissam_of_land" },
  { label: "Land Category", key: "land_category" },
  { label: "LO13 Remarks", key: "lo13_remarks" },
  { label: "Land Area Total (Acres)", key: "land_area_total_acres" },
  { label: "Land Area Total (Hectares)", key: "land_area_total_hectares" },
  { label: "Land Area Acquired (Acres)", key: "land_area_acquired_acres" },
  {
    label: "Land Area Acquired (Hectares)",
    key: "land_area_acquired_hectares",
  },
  { label: "Market Value per Acre", key: "market_value_per_acre" },
  { label: "Basic Land Value", key: "basic_land_value" },
  { label: "Land Value with MF", key: "land_value_with_mf" },
  { label: "Number of Trees", key: "no_of_trees" },
  { label: "Total Value of Trees", key: "total_value_of_trees" },
  { label: "Number of House", key: "no_of_house" },
  { label: "Value of House", key: "value_of_house" },
  { label: "Other Structures", key: "details_of_other_structures" },
  { label: "Value of Other Structures", key: "value_of_other_structures" },
  { label: "Total Value", key: "total_value" },
  { label: "Solatium 100%", key: "solatium_100" },
  { label: "Additional 12%", key: "additional_12_percent" },
  { label: "Total Compensation", key: "total_compensation" },
  { label: "Apportionment Amount", key: "apportionment_amount" },
  { label: "Priority/Urgency", key: "priority_urgency" },
  { label: "Land Use Plan", key: "land_use_plan" },
  { label: "LA21 Remarks", key: "la21_remarks" },
  { label: "Bank Account No", key: "bank_account_no" },
  { label: "Bank Name", key: "bank_name" },
  { label: "Branch IFSC", key: "branch_ifsc" },
  { label: "Aadhaar No", key: "aadhaar_no" },
  { label: "PAN No", key: "pan_no" },
  { label: "Age", key: "age" },
  { label: "Caste", key: "caste" },
  { label: "Marital Status", key: "marital_status" },
  { label: "Education", key: "education" },
  { label: "Occupation", key: "occupation" },
  { label: "Annual Income", key: "annual_income" },
  { label: "Skill Acquired", key: "skill_acquired" },
  { label: "Affidavit Details", key: "affidavit_details" },
  { label: "Family Major Male", key: "family_major_male" },
  { label: "Family Major Female", key: "family_major_female" },
  { label: "Family Minor Male", key: "family_minor_male" },
  { label: "Family Minor Female", key: "family_minor_female" },
  { label: "Family Major Transgender", key: "family_major_transgender" },
  { label: "Family Minor Transgender", key: "family_minor_transgender" },
  { label: "Persons with Disability", key: "persons_with_disability" },
  { label: "Family with Orphan Members", key: "family_with_orphan_members" },
  { label: "Legal Heir Certificate No", key: "legal_heir_certificate_no" },
  { label: "Land Case No", key: "land_case_no" },
  { label: "Land Case Date", key: "land_case_date" },
  { label: "Land Case Type", key: "land_case_type" },
  { label: "Land Case Status", key: "land_case_status" },
  { label: "Land Case Action", key: "land_case_action" },
  { label: "RR Employment", key: "rr_employment" },
  { label: "RR Cash in Lieu", key: "rr_cash_in_lieu" },
  {
    label: "RR Training/Skill Upgradation",
    key: "rr_training_skill_upgradation",
  },
  { label: "RR Self Employment", key: "rr_self_employment" },
  {
    label: "RR Special Allowance ST/NTFP",
    key: "rr_special_allowance_st_ntfp",
  },
  { label: "RR Homestead Allotment", key: "rr_homestead_allotment" },
  {
    label: "RR House Building Assistance",
    key: "rr_house_building_assistance",
  },
  { label: "RR Constructed By", key: "rr_constructed_by" },
  { label: "RR Transit Shed", key: "rr_transit_shed" },
  { label: "RR Transport Allowance", key: "rr_transport_allowance" },
  { label: "RR Maintenance Allowance", key: "rr_maintenance_allowance" },
  {
    label: "RR Multiple Displacement Allowance",
    key: "rr_multiple_displacement_allowance",
  },
  { label: "RR Exgratia", key: "rr_exgratia" },
  { label: "RR Other Benefits", key: "rr_other_benefits" },
  { label: "Grievance No", key: "grievance_no" },
  { label: "Grievance Date", key: "grievance_date" },
  { label: "Grievance Subject", key: "grievance_subject" },
  { label: "Grievance Status", key: "grievance_status" },
  { label: "Grievance Action", key: "grievance_action" },
  { label: "Tribunal", key: "tribunal" },
  { label: "Tribunal Deposit Date", key: "tribunal_deposit_date" },
  { label: "Tribunal Amount", key: "tribunal_amount" },
  { label: "Premium", key: "premium" },
  { label: "Ground Rent", key: "ground_rent" },
  { label: "Cess", key: "cess" },
  { label: "Incidental Charges", key: "incidental_charges" },
  { label: "Total", key: "total" },
  { label: "Abatement", key: "abatement" },
  { label: "Type", key: "type" },
];

export const khataColumn = [
  { label: "Sl/No", key: "id" },
  { label: "Name of Village", key: "village_name" },
  { label: "Village Code", key: "village_code" },
  { label: "Khata No.", key: "khata_no" },
  { label: "Plot No.", key: "plot_no" },
  { label: "Kissam of the Land", key: "kissam_of_land" },
  { label: "Category of Land", key: "land_category" },
  { label: "Total Area (Ac)", key: "land_area_total_acres" },
  { label: "Total Area (Ha)", key: "land_area_total_hectares" },
  {
    label: "Acquired Area (Ac)",
    key: "land_area_acquired_acres",
  },
  {
    label: "Acquired Area (Ha)",
    key: "land_area_acquired_hectares",
  },
  { label: "Remarks", key: "lo13_remarks" },
  { label: "Tahasil", key: "tahasil_name" },
  { label: "R.I. Circle", key: "ri_circle_name" },
  { label: "Thana No.", key: "thana_no" },
  { label: "Date of Award", key: "date_of_award" },
  { label: "RT Name", key: "name_of_recorded_tenant" },
  { label: "PT Name", key: "name_of_present_tenant" },
  { label: "Present Address", key: "present_address" },
  {
    label: "Affected Person",
    key: "displaced_affected_person",
  },
  { label: "Case No", key: "unique_id" },
  { label: "Plot Count", key: "plot_count" },
  { label: "Created", key: "created_at" },
  { label: "Reference Document", key: "reference_document" },
];

export const REQUIRED_FIELDS = [
  // "name_of_recorded_tenant",
  // "name_of_present_tenant",
  // "village_name",
  // "village_code",
  // "tahasil_name",
  // "ri_circle_name",
  // "thana_no",
  // "khata_no",
  // "plot_no",
  // "kissam_of_land",
  // "land_category",
  // "land_area_total_acres",
  // "land_area_total_hectares",
  // "land_area_acquired_acres",
  // "land_area_acquired_hectares",
  // "la_case_file_no",
  // "project_name",
  // "land_type"
];

export const LA_CASE_REGEX = /^.+\/.+\/.+$/;

export const stickyActionHeader =
  "p-3 text-right bg-gray-200 font-semibold text-sm text-gray-700 md:sticky md:right-0 z-[30] shadow-md";

export const stickyActionCell =
  "text-right md:sticky md:right-0 border-gray-100 shadow-sm bg-white";
export const stickyPaymentHeader =
  "p-3 text-left bg-gray-200 md:sticky md:right-0 z-[30] shadow-md";
export const stickyPaymentCell =
  "p-3 text-center bg-white md:sticky md:right-0  border-gray-100 shadow-sm text-sm";

export const stickyCol1Header =
  "p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-0 z-[30] shadow-md";
export const stickyCol1Cell =
  "p-3 text-left bg-white md:sticky md:left-0 shadow-sm ";

// export const stickyCol2Header =
//   "p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-[130px] z-[30] shadow-md";
// export const stickyCol2Cell =
//   "p-3 text-left bg-white md:sticky md:left-[130px] shadow-sm";
export const stickyCol2Header =
  "p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-[90px] z-[30] shadow-md";
export const stickyCol2Cell =
  "p-3 text-left bg-white md:sticky md:left-[90px] shadow-sm";

export const stickyCol3Header =
  "p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-[180px] z-[30] shadow-md";
export const stickyCol3Cell =
  "p-3 text-left bg-white md:sticky md:left-[180px] shadow-sm";
export const COMMON_COLUMNS = [
  { label: "Present Tenant", field: "name_of_present_tenant" },
  { label: "Village Code", field: "village_code" },
  { label: "Plot No.", field: "plot_no", format: "multi" },
  { label: "Kissam", field: "kissam_of_land", format: "multi" },
  { label: "Category", field: "land_category", format: "multi" },
  { label: "Total Area (Ac)", field: "land_area_total_acres" },
  { label: "Total Area (Ha)", field: "land_area_total_hectares" },
  { label: "Acquired Area (Ac)", field: "land_area_acquired_acres" },
  { label: "Acquired Area (Ha)", field: "land_area_acquired_hectares" },
  { label: "Remarks", field: "lo13_remarks" },
  { label: "Tahasil", field: "tahasil_name" },
  { label: "RI Circle", field: "ri_circle_name", format: "multi" },
  { label: "Thana", field: "thana_no" },
  // { label: "Recorded Tenant", field: "name_of_recorded_tenant" },
  // { label: "Present Tenant", field: "name_of_present_tenant" },
  { label: "Plot Count", field: "plot_count" },
  { label: "Created At", field: "created_at" },
];

export const RR_FIELDS = [
  "name_of_present_tenant",
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
];

export const RR_FIELDS_FORMS = [
  { label: "RR Employment", field: "rr_employment", type: "text" },
  { label: "RR Cash in Lieu", field: "rr_cash_in_lieu", type: "text" },
  {
    label: "RR Training / Skill Upgradation",
    field: "rr_training_skill_upgradation",
    type: "text",
  },
  { label: "RR Self Employment", field: "rr_self_employment", type: "text" },
  {
    label: "RR Special Allowance (ST / NTFP)",
    field: "rr_special_allowance_st_ntfp",
    type: "text",
  },
  {
    label: "RR Homestead Allotment",
    field: "rr_homestead_allotment",
    type: "text",
  },
  {
    label: "RR House Building Assistance",
    field: "rr_house_building_assistance",
    type: "text",
  },
  { label: "RR Constructed By", field: "rr_constructed_by", type: "text" },
  { label: "RR Transit Shed", field: "rr_transit_shed", type: "text" },
  {
    label: "RR Transport Allowance",
    field: "rr_transport_allowance",
    type: "text",
  },
  {
    label: "RR Maintenance Allowance",
    field: "rr_maintenance_allowance",
    type: "text",
  },
  {
    label: "RR Multiple Displacement Allowance",
    field: "rr_multiple_displacement_allowance",
    type: "text",
  },
  { label: "RR Ex-gratia", field: "rr_exgratia", type: "text" },
  { label: "RR Other Benefits", field: "rr_other_benefits", type: "text" },
];

export const GOVERNMENT_LAND_COLUMNS = [
  ...COMMON_COLUMNS,
  { label: "Plot Count", field: "plot_count" },
  { label: "Created", field: "created_at" },
  // { label: "Remarks", field: "lo13_remarks" },
];
export const RR_COLUMNS = RR_FIELDS_FORMS.map((rr) => ({
  label: rr.label,
  field: rr.name,
}));
export const PRIVATE_LAND_COLUMNS = [
  ...COMMON_COLUMNS,
  ...RR_COLUMNS,
  // { label: "Remarks", field: "lo13_remarks" },
];

export const FOREST_LAND_COLUMNS = [
  ...COMMON_COLUMNS,
  ...RR_COLUMNS,
  { label: "Forest Type", field: "forest_type" },
];

//    const stickyActionHeader =
//   "p-3 text-right bg-gray-200 text-gray-700 md:sticky md:right-0 z-[30] shadow-md";

// const stickyActionCell =
//   "p-3 text-right bg-white md:sticky md:right-0 border-l border-gray-100 shadow-sm";
// const stickyPaymentHeader =
//   "p-3 text-left bg-gray-200 md:sticky md:right-34 z-[30] shadow-md";
// const stickyPaymentCell =
//   "p-3 bg-white md:sticky md:right-34 border-l border-gray-100 shadow-sm";
// const stickyCol1Header =
//   "p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-0 z-[30] shadow-md min-w-[220px]";

// const stickyCol1Cell =
//   "p-3 text-left bg-white md:sticky md:left-0 shadow-sm min-w-[220px]";
// const stickyCol2Header =
//   "p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-[220px] z-[30] shadow-md min-w-[130px]";

// const stickyCol2Cell =
//   "p-3 text-left bg-white md:sticky md:left-[220px] shadow-sm min-w-[130px]";

// const stickyCol3Header =
//   "p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-[350px] z-[30] shadow-md min-w-[140px]";

// const stickyCol3Cell =
//   "p-3 text-left bg-white md:sticky md:left-[350px] shadow-sm min-w-[140px]";
export const PAYMENT_STATUSES = {
  READY: {
    label: "Ready for Payment",
    short: "RP",
    color: "bg-orange-500",
    value: "READY",
  },
  PROCESSING: {
    label: "Payment in Processing",
    short: "PR",
    color: "bg-lime-500",
    value: "PROCESSING",
  },
  COMPLETED: {
    label: "Payment Completed",
    short: "PC",
    color: "bg-green-700",
    value: "COMPLETED",
  },
};

export const GovernmentPlotFields = [
  { key: "khataNo", label: "Khata No", type: "text" },
  { key: "plotNo", label: "Plot No", type: "text" },
  { key: "thanaNo", label: "Thana No", type: "text" },
  { key: "village", label: "Village", type: "text" },
  { key: "tahashil", label: "Tahashil", type: "text" },
  { key: "riCircle", label: "RI Circle", type: "text" },
  { key: "kissam", label: "Kissam", type: "text" },
  { key: "rorName", label: "Name of ROR", type: "text" },

  { key: "totalAreaAcres", label: "Total Area (Acres)", type: "number" },
  { key: "proposedAreaAcres", label: "Proposed Area (Acres)", type: "number" },
  {
    key: "totalAreaHectares",
    label: "Total Area (Hectares)",
    type: "number",
  },
  {
    key: "proposedAreaHectares",
    label: "Proposed Area (Hectares)",
    type: "number",
  },

  { key: "leaseCaseNo", label: "Lease Case No", type: "text" },

  {
    key: "presentStatus",
    label: "Present Status",
    type: "select",
    options: [
      "Lease Case to Sub-Collector",
      "Lease Case to ADM (Rev Sec)",
      "Demand Raised",
      "Lease Sanctioned by Collector",
    ],
  },

  {
    key: "uaIdcoToTahasildar",
    label: "UA / IDCO to Tahasildar",
    type: "yesno",
  },

  {
    key: "caseDetails",
    label: "Case Details/Deservation Req.",
    type: "text",
  },
  { key: "actionToBeTaken", label: "Action to be Taken", type: "text" },

  { key: "riReport", label: "RI Report", type: "status" },

  { key: "proclamation", label: "Proclamation", type: "text" },
  { key: "objectionReceived", label: "Objection Received", type: "yesno" },
  { key: "others", label: "Others", type: "text" },
  { key: "modificationRevision", label: "Modification/Revision", type: "yesno" },
  {
    key: "missingCasePrep",
    label: "Missing Case Prep./DR Case Prep.",
    type: "yesno",
  },
  {
    key: "missingCasePrepNo",
    label: "Missing Case Prep./DR Case Number",
    type: "text",
  },
  { key: "reasonForMiscDrCase", label: "Reason for Misc/DR Case", type: "text" },
  { key: "treeEnumeration", label: "Tree Enumeration", type: "status" },
  { key: "orderSheet", label: "Order Sheet", type: "status" },
  { key: "leaseToIDCO", label: "Lease to IDCO", type: "yesno" },
  { key: "leaseToUA", label: "Lease to UA", type: "yesno" },
  { key: "remarks", label: "Remarks", type: "text" },
  // { key: "ri_report_attachment", label: "RI Report Attachment", type: "text" },
  // { key: "tree_enumeration_attachment", label: "Tree Enumeration Attachment", type: "text" },
  // { key: "lease_to_idco_attachment", label: "Lease to IDCO Attachment", type: "text" },
  // { key: "lease_to_ua_attachment", label: "Lease to UA Attachment", type: "text" },
];



// export const GovernmentPlotFields = [
//   { key: "khata_no", label: "Khata No", type: "text" },
//   { key: "plot_no", label: "Plot No", type: "text" },
//   { key: "thana_no", label: "Thana No", type: "text" },
//   { key: "mouza", label: "Village", type: "text" },
//   { key: "tahasil", label: "Tahasil", type: "text" },
//   { key: "ri_circle", label: "RI Circle", type: "text" },
//   { key: "kissam", label: "Kissam", type: "text" },
//   { key: "name_of_ror", label: "Name of ROR", type: "text" },

//   { key: "total_area_acres", label: "Total Area (Acres)", type: "number" },
//   {
//     key: "proposed_area_acres",
//     label: "Proposed Area (Acres)",
//     type: "number",
//   },
//   {
//     key: "total_area_hectares",
//     label: "Total Area (Hectares)",
//     type: "number",
//   },
//   {
//     key: "proposed_area_hectares",
//     label: "Proposed Area (Hectares)",
//     type: "number",
//   },

//   { key: "lease_case_no", label: "Lease Case No", type: "text" },

//   {
//     key: "present_status",
//     label: "Present Status",
//     type: "select",
//     options: [
//       "Lease Case to Sub-Collector",
//       "Lease Case to ADM (Rev Sec)",
//       "Demand Raised",
//       "Lease Sanctioned by Collector",
//     ],
//   },

//   {
//     key: "ua_idco_to_tahasildar",
//     label: "UA / IDCO to Tahasildar",
//     type: "yesno",
//   },

//   {
//     key: "case_details",
//     label: "Case Details/Deservation Req.",
//     type: "text",
//   },
//   { key: "action_to_be_taken", label: "Action to be Taken", type: "text" },
//   { key: "ri_report", label: "RI Report", type: "status" },

//   { key: "proclamation", label: "Proclamation", type: "text" },
//   { key: "objection_received", label: "Objection Received", type: "yesno" },
//   { key: "others", label: "Others", type: "text" },
//   {
//     key: "modification_revision",
//     label: "Modification/Revision",
//     type: "yesno",
//   },
//   {
//     key: "misc_dr_case_prep",
//     label: "Missing Case Prep./DR Case Prep.",
//     type: "yesno",
//   },
//   {
//     key: "misc_dr_case_prep_number",
//     label: "Missing Case Prep./DR Case Number",
//     type: "text",
//   },
//   {
//     key: "reason_for_misc_dr_case",
//     label: "Reason for Misc/DR Case",
//     type: "text",
//   },
//   { key: "tree_enumeration", label: "Tree Enumeration", type: "status" },
//   { key: "order_sheet", label: "Order Sheet", type: "status" },
//   { key: "lease_to_idco", label: "Lease to IDCO", type: "yesno" },
//   { key: "lease_to_ua", label: "Lease to UA", type: "yesno" },
//   { key: "remarks", label: "Remarks", type: "text" },
//   { key: "ri_report_attachment", label: "RI Report Attachment", type: "text" },
//   {
//     key: "tree_enumeration_attachment",
//     label: "Tree Enumeration Attachment",
//     type: "text",
//   },
//   {
//     key: "lease_to_idco_attachment",
//     label: "Lease to IDCO Attachment",
//     type: "text",
//   },
//   {
//     key: "lease_to_ua_attachment",
//     label: "Lease to UA Attachment",
//     type: "text",
//   },
// ];

export const GovtKhataColumn = [
  { key: "plot_no", label: "Plot No", type: "text" },
  { key: "lease_case_no", label: "Lease Case No", type: "text" },
  {
    key: "present_status",
    label: "Present Status",
    type: "select",
    options: ["Vacant", "Occupied"],
  },
  { key: "case_details", label: "Case Details", type: "text" },
  { key: "plot_count", label: "Plot Count", type: "text" },
];
