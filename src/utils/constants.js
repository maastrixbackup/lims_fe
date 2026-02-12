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
  "Legal Issues": [
    "legal_heir_certificate_no",
    "land_case_no",
    "land_case_date",
    "land_case_type",
    "land_case_status",
    "land_case_action",
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
    "apportionment_amount",
    "Priority / Urgency",
    "Land Use Plan",
    "Remarks",
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
  ],

  "Grievance Details / Tribunal": [
    "grievance_no",
    "grievance_date",
    "grievance_subject",
    "grievance_status",
    "grievance_action",
    "tribunal",
    "tribunal_deposit_date",
    "tribunal_amount",
    "abatement",
  ],
  // "Tribunal & Revenue": [
  //   // "tribunal",
  //   // "tribunal_deposit_date",
  //   // "tribunal_amount",
  //   // "premium",
  //   // "ground_rent",
  //   // "cess",
  //   // "incidental_charges",
  //   // "total",
  //   // "abatement",
  // ],
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
  "p-3 text-right bg-gray-200 md:sticky md:right-0 z-[30] shadow-md";

export const stickyActionCell =
  "text-right font-bold md:sticky md:right-0 border-gray-100 shadow-sm bg-white";
export const stickyPaymentHeader =
  "p-3  bg-gray-200 md:sticky md:right-14 z-[30] shadow-md";
export const stickyPaymentCell =
  "p-3 text-center bg-white md:sticky md:right-14  border-gray-100 shadow-sm text-sm";

export const stickyCol1Header =
  "p-3 text-left bg-gray-200 md:sticky md:left-10 z-[30] shadow-md";
export const stickyCol1Cell =
  "p-3 text-left bg-white md:sticky md:left-10 shadow-sm ";
export const stickyCol2Header =
  "p-3 text-left bg-gray-200 md:sticky md:left-[170px] z-[30] shadow-md";
export const stickyCol2Cell =
  "p-3 text-left bg-white md:sticky md:left-[170px] shadow-sm";

export const stickyCol3Header =
  "p-3 text-left bg-gray-200 md:sticky md:left-[260px] z-[30] shadow-md";
export const stickyCol3Cell =
  "p-3 text-left bg-white md:sticky md:left-[260px] shadow-sm";
export const stickyCol4Header =
  "p-3 text-left bg-gray-200 md:sticky md:left-[320px] z-[30] shadow-md";
export const stickyCol4Cell =
  "p-3 text-left bg-white md:sticky md:left-[320px] shadow-sm";
export const COMMON_COLUMNS = [
  // { label: "Present Tenant", field: "name_of_present_tenant" },
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
  { label: "Case Count", field: "unique_id" },
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
  { name: "rr_employment", label: "RR Employment", type: "text" },
  { name: "rr_cash_in_lieu", label: "Cash in Lieu", type: "text" },
  {
    name: "rr_training_skill_upgradation",
    label: "Training / Skill Upgradation",
    type: "text",
  },
  { name: "rr_self_employment", label: "Self Employment", type: "text" },
  {
    name: "rr_special_allowance_st_ntfp",
    label: "Special Allowance (ST/NTFP)",
    type: "text",
  },
  {
    name: "rr_homestead_allotment",
    label: "Homestead Allotment",
    type: "text",
  },
  {
    name: "rr_house_building_assistance",
    label: "House Building Assistance",
    type: "text",
  },
  { name: "rr_constructed_by", label: "Constructed By", type: "text" },
  { name: "rr_transit_shed", label: "Transit Shed", type: "text" },
  {
    name: "rr_transport_allowance",
    label: "Transport Allowance",
    type: "text",
  },
  {
    name: "rr_maintenance_allowance",
    label: "Maintenance Allowance",
    type: "text",
  },
  {
    name: "rr_multiple_displacement_allowance",
    label: "Multiple Displacement Allowance",
    type: "text",
  },
  { name: "rr_exgratia", label: "Ex-gratia", type: "text" },
  { name: "rr_other_benefits", label: "Other Benefits", type: "text" },
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

export const legalIssue = [
  { key: "khata_no", label: "Khata No", type: "text" },
  { key: "plot_no", label: "Plot No", type: "text" },
  { key: "legal_heir_case_no", label: "Legal Heir Case No", type: "text" },
  { key: "land_case_no", label: "Land Case No", type: "text" },
  { key: "land_case_date", label: "Land Case Date", type: "text" },
  { key: "land_case_type", label: "Land Case Type", type: "text" },
  { key: "land_case_status", label: "Land Case Status", type: "text" },
  { key: "land_case_details", label: "Land Case Details", type: "text" },
  { key: "payment_status", label: "Payment Status", type: "text" },
];

export const LandAreaEvaluationFields = [
  { key: "khata_no", label: "Khata No", type: "text" },
  { key: "plot_no", label: "Plot No", type: "text" },
  {
    key: "land_area_total_acres",
    label: "Land Area Total (Acres)",
    type: "number",
  },
  {
    key: "land_area_total_hectares",
    label: "Land Area Total (Hectares)",
    type: "number",
  },
  {
    key: "land_area_acquired_acres",
    label: "Land Area Acquired (Acres)",
    type: "number",
  },
  {
    key: "land_area_acquired_hectares",
    label: "Land Area Acquired (Hectares)",
    type: "number",
  },
  {
    key: "market_value_per_acre",
    label: "Market Value Per Acre",
    type: "number",
  },
  { key: "bench_market_value", label: "Bench Market Value", type: "number" },
  { key: "premium", label: "Premium", type: "number" },
  { key: "ground_rate", label: "Ground Rate", type: "number" },
  { key: "cess", label: "Cess", type: "number" },
  { key: "admin_cost", label: "Admin Cost", type: "number" },
  { key: "total_cost", label: "Total Cost", type: "number" },
  { key: "payment_status", label: "Payment Status", type: "text" },
];

export const GovernmentPlotFields = [
  { key: "khata_no", label: "Khata No", type: "text" },
  { key: "plot_no", label: "Plot No", type: "text" },
  { key: "thana_no", label: "Thana No", type: "text" },
  { key: "mouza", label: "Village", type: "text" },
  { key: "tahasil", label: "Tahasil", type: "text" },
  { key: "ri_circle", label: "RI Circle", type: "text" },
  { key: "kissam", label: "Kissam", type: "text" },
  { key: "name_of_ror", label: "Name of ROR", type: "text" },

  { key: "total_area_acres", label: "Total Area (Acres)", type: "number" },
  {
    key: "proposed_area_acres",
    label: "Proposed Area (Acres)",
    type: "number",
  },
  {
    key: "total_area_hectares",
    label: "Total Area (Hectares)",
    type: "number",
  },
  {
    key: "proposed_area_hectares",
    label: "Proposed Area (Hectares)",
    type: "number",
  },

  { key: "lease_case_no", label: "Lease Case No", type: "text" },

  {
    key: "present_status",
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
    key: "ua_idco_to_tahasildar",
    label: "UA / IDCO to Tahasildar",
    type: "yesno",
  },

  {
    key: "case_details",
    label: "Case Details/Deservation Req.",
    type: "text",
  },
  { key: "action_to_be_taken", label: "Action to be Taken", type: "text" },
  { key: "ri_report", label: "RI Report", type: "status" },
  { key: "ri_report_attachment", label: "RI Report Attachment", type: "text" },
  { key: "proclamation", label: "Proclamation", type: "text" },
  { key: "objection_received", label: "Objection Received", type: "yesno" },
  { key: "others", label: "Others", type: "text" },
  {
    key: "modification_revision",
    label: "Modification/Revision",
    type: "yesno",
  },
  {
    key: "misc_dr_case_prep",
    label: "Missing Case Prep./DR Case Prep.",
    type: "yesno",
  },
  {
    key: "misc_dr_case_prep_number",
    label: "Missing Case Prep./DR Case Number",
    type: "text",
  },
  {
    key: "reason_for_misc_dr_case",
    label: "Reason for Misc/DR Case",
    type: "text",
  },
  { key: "tree_enumeration", label: "Tree Enumeration", type: "status" },
  {
    key: "tree_enumeration_attachment",
    label: "Tree Enumeration Attachment",
    type: "text",
  },
  { key: "order_sheet", label: "Order Sheet", type: "status" },
  { key: "lease_to_idco", label: "Lease to IDCO", type: "yesno" },
  {
    key: "lease_to_idco_attachment",
    label: "Lease to IDCO Attachment",
    type: "text",
  },
  { key: "lease_to_ua", label: "Lease to UA", type: "yesno" },

  {
    key: "lease_to_ua_attachment",
    label: "Lease to UA Attachment",
    type: "text",
  },
  { key: "remarks", label: "Remarks", type: "text" },
  { key: "payment_status", label: "Payment Status", type: "text" },
];

export const GovtKhataColumn = [
  { key: "khata_no", label: "Khata No", type: "text" },
  { key: "plot_no", label: "Plot No", type: "text" },
  { key: "villae_name", label: "Village", type: "text" },
  { key: "kissam", label: "Kissam", type: "text" },

  { key: "lease_case_no", label: "Lease Case No", type: "text" },
  {
    key: "present_status",
    label: "Present Status",
    type: "select",
    options: [
      "Lease Case to Sub-Collector",
      "Lease Case to ADM (Rev Sec)",
      "Demand Raised",
      "Lease Sanctioned by Collector",
    ],
  },
  { key: "case_details", label: "Case Details", type: "text" },
  { key: "plot_count", label: "Plot Count", type: "text" },
  { key: "unique_id", label: "Case Count", type: "text" },
  { key: "ror_name", label: "ROR Name", type: "text" },
  { key: "land_category", label: "Land Category", type: "text" },
];

export const BasicDetails = [
  {
    label: "LA Case File No",
    field: "la_case_file_no",
    stickyClass: stickyCol1Header,
  },
  {
    label: "Khata",
    field: "khata_no",
    stickyClass: stickyCol2Header,
  },
  {
    label: "Plot No",
    field: "plot_no",
    stickyClass: stickyCol3Header,
  },
  {
    label: "Full/Part Plot",
    field: "full_part",
  },
  {
    label: "SES Survey No",
    field: "ses_survey_no",
  },
  {
    label: "Date of Award",
    field: "date_of_award",
  },
  {
    label: "Recorded Tenant",
    field: "name_of_recorded_tenant",
  },
  {
    label: "Present Tenant",
    field: "name_of_present_tenant",
  },
  {
    label: "No. of Present Tenant",
    field: "present_tenant_count",
  },
  {
    label: "Present Address",
    field: "present_address",
  },
  {
    label: "Displaced/Affected",
    field: "displaced_affected_person",
  },
  {
    label: "Village Name",
    field: "village_name",
  },
  {
    label: "Tahasil",
    field: "tahasil_name",
  },
  {
    label: "RI Circle",
    field: "ri_circle_name",
  },
  {
    label: "Thana No",
    field: "thana_no",
  },
  {
    label: "Kissam of Land",
    field: "kissam_of_land",
  },
  {
    label: "Land Category",
    field: "land_category",
  },
];
export const TenantDetails = [
  {
    label: "LA Case File No",
    field: "la_case_file_no",
    headerClass: stickyCol1Header,
    cellClass: stickyCol1Cell,
  },
  {
    label: "Khata",
    field: "khata_no",
    headerClass: stickyCol2Header,
    cellClass: stickyCol2Cell,
  },
  {
    label: "Plot No",
    field: "plot_no",
    headerClass: stickyCol3Header,
    cellClass: stickyCol3Cell,
  },
  {
    label: "Recorded Tenant",
    field: "name_of_recorded_tenant",
  },
  {
    label: "Present Tenant",
    field: "name_of_present_tenant",
  },
  {
    label: "Number Of Present Tenant",
    field: "present_tenant_count",
  },
  {
    label: "Present Address",
    field: "present_address",
  },
];

export const BANK_DETAILS_COLUMNS = [
  {
    label: "LA Case File No",
    field: "la_case_file_no",
    headerClass: stickyCol1Header,
  },
  {
    label: "Khata",
    field: "khata_no",
    headerClass: stickyCol2Header,
  },
  {
    label: "Plot No",
    field: "plot_no",
    headerClass: stickyCol3Header,
  },
  {
    label: "Bank",
    field: "bank_name",
  },
  {
    label: "Account No",
  },
  {
    label: "IFSC Code",
    field: "branch_ifsc",
  },
  {
    label: "Aadhar Number",
    field: "aadhaar_no",
  },
  {
    label: "PAN No",
    field: "pan_no",
  },
  {
    label: "Age",
    field: "age",
  },
  {
    label: "Caste",
    field: "caste",
  },
  {
    label: "Marital Status",
    field: "marital_status",
  },
  {
    label: "Education",
    field: "education",
  },
  {
    label: "Occupation",
    field: "occupation",
  },
  {
    label: "Annual Income (₹)",
    field: "annual_income",
  },
  {
    label: "Skill Acquired",
    field: "skill_acquired",
  },
  {
    label: "Affidavit Details",
    field: "affidavit_details",
  },
];

export const LegalIssues = [
  {
    label: "LA Case File No",
    field: "la_case_file_no",
    headerClass: stickyCol1Header,
  },
  {
    label: "Khata",
    field: "khata_no",
    headerClass: stickyCol2Header,
  },
  {
    label: "Plot No",
    field: "plot_no",
    headerClass: stickyCol3Header,
  },
  {
    label: "Legal Heir Cert No",
    field: "legal_heir_certificate_no",
  },
  {
    label: "Land Case No",
    field: "land_case_no",
  },
  {
    label: "Land Case Date",
    field: "land_case_date",
  },
  {
    label: "Land Case Type",
    field: "land_case_type",
  },
  {
    label: "Land Case Status",
    field: "land_case_status",
  },
  {
    label: "Land Case Action",
    field: "land_case_action",
  },
];

export const LAND_AREA_VALUATION_COLUMNS = [
  {
    label: "LA Case File No",
    field: "la_case_file_no",
    headerClass: stickyCol1Header,
  },
  {
    label: "Khata",
    field: "khata_no",
    headerClass: stickyCol2Header,
  },
  {
    label: "Plot No",
    field: "plot_no",
    headerClass: stickyCol3Header,
  },

  { label: "Total Area (Acre)", field: "land_area_total_acres" },
  { label: "Total Area (Hectare)", field: "land_area_total_hectares" },
  { label: "Acquired Area (Acre)", field: "land_area_acquired_acres" },
  { label: "Acquired Area (Hectare)", field: "land_area_acquired_hectares" },

  { label: "Market Value Per Acre", field: "market_value_per_acre" },
  { label: "Basic Land Value (₹)", field: "basic_land_value" },
  { label: "Land Value w/ MF (₹)", field: "land_value_with_mf" },

  { label: "No. of Trees", field: "no_of_trees" },
  { label: "Value of Trees (₹)", field: "total_value_of_trees" },
  { label: "No. of Houses", field: "no_of_house" },

  {
    label: "Value of Structure (House)",
    field: "value_of_house",
  },

  {
    label: "Details of Structure Other Than House",
    field: "details_of_other_structures",
  },
  {
    label: "Value of Structures Other than house",
    field: "value_of_other_structures",
  },

  { label: "Total Value (₹)", field: "total_value" },

  {
    label: "Solatium 100% (₹)",
    field: "solatium_100",
  },

  { label: "Days of Interest", field: "no_days_interest" },
  { label: "12% Additional Compensation", field: "additional_12_percent" },
  { label: "Total Compensation (₹)", field: "total_compensation" },
  { label: "Apportion Amount", field: "apportionment_amount" },
  { label: "Priority / Urgency", field: "Priority / Urgency" },
  { label: "Land Use Plan", field: "Land Use Plan" },
  { label: "LA21 Remarks", field: "la21_remarks" },
];

export const TribunalColumns = [
  {
    label: "LA Case File No",
    field: "la_case_file_no",
    headerClass: stickyCol1Header,
  },
  {
    label: "Khata",
    field: "khata_no",
    headerClass: stickyCol2Header,
  },
  {
    label: "Plot No",
    field: "plot_no",
    headerClass: stickyCol3Header,
  },

  {
    label: "Grievance No",
    field: "grievance_no",
  },
  {
    label: "Grievance Date",
    field: "grievance_date",
  },
  {
    label: "Subject",
    field: "subject",
  },
  {
    label: "Status",
    field: "status",
  },
  {
    label: "Action Taken",
    field: "action_taken",
  },
  {
    label: "Tribunal",
    field: "tribunal",
  },
  {
    label: "Deposit Date",
    field: "deposit_date",
  },
  {
    label: "Tribunal Amount (₹)",
    field: "tribunal_amount",
  },
  {
    label: "Abatement",
    field: "abatement",
  },
];

export const FamilyDetails = [
  {
    label: "LA Case File No",
    field: "la_case_file_no",
    headerClass: stickyCol1Header,
  },
  {
    label: "Khata",
    field: "khata_no",
    headerClass: stickyCol2Header,
  },
  {
    label: "Plot No",
    field: "plot_no",
    headerClass: stickyCol3Header,
  },

  {
    label: "Major Male",
    field: "family_major_male",
  },
  {
    label: "Major Female",
    field: "family_major_female",
  },
  {
    label: "Minor Male",
    field: "family_minor_male",
  },
  {
    label: "Minor Female",
    field: "family_minor_female",
  },
  {
    label: "Major Transgender",
    field: "family_major_transgender",
  },
  {
    label: "Minor Transgender",
    field: "family_minor_transgender",
  },
  {
    label: "PwD Members",
    field: "persons_with_disability",
  },
  {
    label: "Orphan Members",
    field: "family_with_orphan_members",
  },
];
export const levelOne = [
  ["Project ID", "project_id"],
  ["DGPS Survey Done", "dgps_survey"],
  ["DGPS Survey Attachment", "dgps_survey_attachment"],
  ["DGPS Area", "dgps_area"],
  ["ORSAC Auth No", "orsac_auth_no"],
  ["ORSAC Auth Date", "orsac_auth_date"],
  ["Tree Enumeration Done", "tree_enumeration_done"],
  ["Tree Enumeration Documents", "tree_enumeration_docs"],
  ["Total Trees", "total_trees"],
  ["Adminstrative Docs", "admin_docs"],
  ["Adminstrative Docs Attachment", "admin_docs_attachment"],
  ["Legal & Lease Docs", "legal_lease_docs"],
  ["Legal & Lease Attachment", "legal_lease_docs_attachment"],
  ["Technical Data", "technical_data"],
  ["Technical Data Docs", "technical_data_attachment"],
  ["Forest & Land Details", "forest_land_details"],
  ["Forest & Land Details Docs", "forest_land_details_attachment"],
  ["CA/ ACA Planning", "ca_aca_planning"],
  ["CA/ ACA Planning Docs", "ca_aca_planning_attachment"],
  ["FRA/ Community Records", "fra_community_records"],
  ["FRA/ Community Records Docs", "fra_community_records_attachment"],
  ["Environmental And Statutory", "env_statutory"],
  ["Env And Statutory Docs", "env_statutory_attachment"],
  ["Wildlife and Safeguards", "wildlife"],
  ["Wildlife and Safeguards Docs", "wildlife_attachment"],
  ["Maps and Spatial Evidence", "maps_spatial_evidence"],
  ["Maps and Spatial Evidence Docs", "maps_spatial_evidence_attachment"],
  ["Financial Undertaking", "finance_undertaking"],
  ["Financial Undertaking Docs", "finance_undertaking_attachment"],
  ["Proposal Submitted", "proposal_submitted"],
  ["Proposal Submitted Docs", "proposal_submitted_attachment"],
  ["PARIVESH Proposal", "parivesh_proposal"],
  ["Submission Date", "submissionDate"],
  ["Stag 1 Status", "stage1Status"],
  ["Others/ miscellaneous","others"],
  ["Others/ miscellaneous Docs", "others_docs"]
];

export const PROJECT_CATEGORY_NATURE_MAP = {
  // LINEAR
  "Construction / Widening of Roads including approach roads & bridges": "LINEAR",
  "Railway": "LINEAR",
  "Railway Yards, stations + track": "LINEAR",
  "Power Transmission Line": "LINEAR",
  "Telecommunication Line": "LINEAR",
  "Optical Fibre Cable (involving diversion)": "LINEAR",
  "Pipeline": "LINEAR",
  "Canal (other than Minor Irrigation Canal)": "LINEAR",
  "Airport": "LINEAR",

  // NON-LINEAR
  "Dispensary / Hospital": "NON-LINEAR",
  "School / Educational Institution": "NON-LINEAR",
  "Skill Up-gradation / Vocational Training Center": "NON-LINEAR",
  "Power Sub Station": "NON-LINEAR",
  "Petrol Pump": "NON-LINEAR",
  "Government approved Community Toilets": "NON-LINEAR",
  "Water Mill": "NON-LINEAR",
  "Drinking Water (Standalone facilities like WTP, OHT, intake only)": "NON-LINEAR",
  "Industry": "NON-LINEAR",
  "Thermal Power": "NON-LINEAR",
  "Non-Conventional Source of Energy (Solar / Wind parks)": "NON-LINEAR",
  "Communication Post": "NON-LINEAR",
  "Police Establishments (Police stations / outposts / towers)": "NON-LINEAR",
  "Mining / Quarrying": "NON-LINEAR",

  // HYBRID
  "Hydel / Irrigation": "HYBRID",
  "Canal projects with structures (headworks, regulators, colonies)": "HYBRID",
  "Water / Rainwater Harvesting Structures": "HYBRID",
  "Upgradation / Strengthening / Widening of existing bridges": "HYBRID",

  // OTHERS
  "De-reservation / De-notification": "OTHERS",
  "Encroachments": "OTHERS",
  "Forest Village Conversion": "OTHERS",
  "Rehabilitation from Protected Areas": "OTHERS",
  "Defence (strategic sensitive projects)": "OTHERS",
  "ESRD Study": "OTHERS",
  "Others": "OTHERS",
};

export const NON_LINEAR_PROJECTS = [
  "Dispensary / Hospital",
  "School / Educational Institution",
  "Skill Up-gradation / Vocational Training Center",
  "Power Sub Station",
  "Petrol Pump",
  "Government approved Community Toilets",
  "Water Mill",
  "Drinking Water (Standalone facilities like WTP, OHT, intake only)",
  "Industry",
  "Thermal Power",
  "Non-Conventional Source of Energy (Solar / Wind parks)",
  "Communication Post",
  "Police Establishments (Police stations / outposts / towers)",
  "Mining / Quarrying",
];


export const STAGE_0_DATA = [
  {
    sl: 1,
    key: "dgpsSurveyDone",
    label: "DGPS Survey Done",
    type: "yesno",
    remark: "DGPS report (all projects with FL)",
  },
  { sl: 2, key: "dgpsArea", label: "DGPS Area (ha)", type: "text", remark: "" },
  {
    sl: 3,
    key: "orsac",
    label: "ORSAC",
    type: "yesno",
    remark: "ORSAC auth letters (where applicable)",
  },
  {
    sl: 4,
    key: "treeEnumeration",
    label: "Tree Enumeration",
    type: "yesno",
    remark: "Enumeration report",
  },
  {
    sl: 5,
    key: "administrativeDocs",
    label: "Administrative Documents",
    type: "yesno",
    remark: "Authorization, Checklist, Form-A",
  },
  {
    sl: 6,
    key: "legalLease",
    label: "Legal & Lease",
    type: "yesno",
    remark: "Grant Order / Lease (LoI if lease based)",
  },
  {
    sl: 7,
    key: "technicalData",
    label: "Technical Data",
    type: "yesno",
    remark:
      "DPR (all), Mining Plan (Mining), Alignment Plan (Linear), Site Layout (Utility)",
  },
  {
    sl: 8,
    key: "forestLandDetails",
    label: "Forest & Land Details",
    type: "status",
    options: ["Uploaded", "Not Uploaded"],
    remark: "FL location, area, land use",
  },
  {
    sl: 9,
    key: "caPlanning",
    label: "CA / CA Planning",
    type: "yesno",
    remark: "CA land if applicable",
  },
  {
    sl: 10,
    key: "fraCompliance",
    label: "FRA & Community",
    type: "status",
    options: ["Completed", "Not Completed"],
    remark: "FRA certificates / exemption",
  },
  {
    sl: 11,
    key: "envStatutory",
    label: "Environmental & Statutory",
    type: "status",
    options: ["Cleared", "Not Cleared"],
    remark: "EC / SPCB NOC (if required)",
  },
  {
    sl: 12,
    key: "wildlifeSafeguards",
    label: "Wildlife & Safeguards",
    type: "status",
    options: ["Completed", "Not Completed"],
    remark: "WLCP (if PA/ESZ involved)",
  },
  {
    sl: 13,
    key: "mapsSpatial",
    label: "Maps & Spatial Evidence",
    type: "status",
    options: ["Authenticated", "Not Authenticated"],
    remark: "DGPS maps, Toposheets, CA & RCA maps",
  },
  {
    sl: 14,
    key: "financial",
    label: "Financial",
    type: "status",
    options: ["Submitted", "Not Submitted"],
    remark: "NPV, CA, ACA declarations",
  },
  {
    sl: 15,
    key: "proposalSubmitted",
    label: "Proposal Submitted",
    type: "yesno",
    remark: "PARIVESH submission proof",
  },
  {
    sl: 16,
    key: "pariveshProposal",
    label: "PARIVESH Proposal No.",
    type: "text",
    remark: "",
  },
  {
    sl: 17,
    key: "submissionDate",
    label: "Submission Date",
    type: "date",
    remark: "",
  },
  {
    sl: 18,
    key: "stage0Status",
    label: "Stage-0 Status",
    type: "auto",
    remark: "",
  },
];

