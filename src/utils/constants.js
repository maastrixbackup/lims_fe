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

export const projectVillageKhataMap = {
  "GMDC - Baitarani-West Coal Block": {
    "Chhendipada Jangal": ["Khata-101", "Khata-102", "Khata-103"],
    Handigora: ["Khata-201", "Khata-202"],
  },
};

 export const sections = {
    "Basic Information": [
      "ses_survey_no",
      "la_case_file_no",
      "village_name",
       "village_code",
        "date_of_award", 
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
export const getTypeName = (type) => {
  switch (Number(type)) {
    case 1:
      return "Pvt Land";
    case 2:
      return "Govt Land";
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
  "Notice by GMDC",
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
  "Form 9A + Sample Photo (if any)",
  "Form 9B + Sample Photo (if any)",
  "Form 9C + Sample Photo (if any)",
  "Land Acquisition Award",
  "Indemnity Bond",
  "Physical Possession Certificate (Bond Paper)",
  "Apportionment Affidavit (if applicable)",
  "Affidavit for Legal Issues (if any)",
  "Aadhaar / Voter Card Copy",
  "PAN Proof",
  "Bank Passbook / Cancelled Cheque Copy",
  "Electronic Fund Transfer Form",
  "Receipt of Compensation",
  "Payment Voucher",
  "Photo of Physical Possession",
];