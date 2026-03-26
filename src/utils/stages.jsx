export const STAGE_II_DATA = [
  {
    "sl": 1,
    "key": "environmental_clearance",
    "label": "Environmental Clearance",
    "type": "status",
    "options": ["Obtained", "Not Obtained"],
    "remark": "EC letter (if applicable)",
    "allowUpload": true
  },
  {
    "sl": 2,
    "key": "nbwl_clearance",
    "label": "NBWL Clearance",
    "type": "status",
    "options": ["Obtained", "Not Obtained"],
    "remark": "NBWL approval (if applicable)",
    "allowUpload": true
  },
  {
    "sl": 3,
    "key": "final_ca_execution",
    "label": "Final CA Execution",
    "type": "status",
    "options": ["Completed", "Pending"],
    "remark": "Execution proof",
    "allowUpload": true
  },
  {
    "sl": 4,
    "key": "final_maps_approved",
    "label": "Final Maps Approved",
    "type": "yesno",
    "remark": "Approved maps",
    "allowUpload": true
  },
  {
    "sl": 5,
    "key": "final_technical_approval",
    "label": "Final Technical Approval",
    "type": "status",
    "options": ["Completed", "Pending"],
    "remark": "Mining / Linear approval",
    "allowUpload": true
  },
  {
    "sl": 6,
    "key": "stage_2_approval_letter",
    "label": "Stage-II Approval Letter",
    "type": "yesno",
    "remark": "Final FC Letter Upload",
    "allowUpload": true
  },
  {
    "sl": 7,
    "key": "stage_2_approval_date",
    "label": "Stage-II Approval Date",
    "type": "date"
  },
  {
    "sl": 8,
    "key": "approved_forest_area",
    "label": "Approved Forest Area (Ha)",
    "type": "text"
  },
  {
    "sl": 9,
    "key": "approved_non_forest_area",
    "label": "Approved Non-Forest Area (Ha)",
    "type": "text"
  },
  {
    "sl": 10,
    "key": "stage_2_status",
    "label": "Stage-II Status",
    "type": "chip"
  },
  {
    "sl": 11,
    "key": "eligible_post_clearance",
    "label": "Eligible for Post-Clearance?",
    "type": "yesno"
  }
]

export const POST_CLEARANCE_DATA = [
  { sl: 1, key: "ca_plantation_started", label: "CA Plantation Started", type: "yesno", remark: "Plantation report", allowUpload: true },
  { sl: 2, key: "ca_plantation_completed", label: "CA Plantation Completed", type: "yesno", remark: "Completion report", allowUpload: true },
  { sl: 3, key: "survival_report_submitted", label: "Survival Report Submitted", type: "yesno", remark: "Annual survival report", allowUpload: true },
  { sl: 4, key: "wildlife_mitigation", label: "Wildlife Mitigation Implemented", type: "yesno", remark: "If applicable", allowUpload: true },
  { sl: 5, key: "safety_zone_maintained", label: "Safety Zone Maintained", type: "yesno", remark: "Inspection report", allowUpload: true },
  { sl: 6, key: "periodic_compliance", label: "Periodic Compliance Submitted", type: "yesno", remark: "Half-yearly / Annual", allowUpload: false },
  { sl: 7, key: "inspection_observations", label: "Inspection Observations", type: "status", options: ["Open", "Closed"], remark: "Remarks", allowUpload: false },
  { sl: 8, key: "post_clearance_status", label: "Post-Clearance Status", type: "dropdown", options: ["Ongoing", "Completed"], remark: "", allowUpload: false },
];