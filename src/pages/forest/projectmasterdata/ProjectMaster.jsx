// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { addForestProject } from "../addForestProject";
// import { updateForestProject } from "../../../hooks/updateForestProject";
// import SuccessMessage from "../../../shared/SuccessMessage";
// import { useSuccessMessage } from "../../../hooks/useSuccessMessage";

// const ProjectMaster = () => {
//   const token = useSelector((state) => state.auth.userToken);
//   const selectedProject = useSelector((s) => s.selectedProject.project);
//   const projects = useSelector((s) => s.list.projects || []);
//   const [editData, setEditData]=useState()

//   const { modal, showSuccess, showError, closeModal } = useSuccessMessage();

//   const initialFormData = {
//     project_id: "",
//     project_name: "",
//     proposal_no: "",
//     user_agency: "",
//     sector: "",
//     state: "",
//     district: "",
//     tahasil: "",
//     mouza: "",
//     range_division: "",
//     forest_type: "",
//     total_project_area_ha: "",
//     forest_area_ha: "",
//     non_forest_area_ha: "",
//     project_status: "",
//     current_stage: "",
//     eds_flag: 0,
//     edsRefNo: "",
//     issuingAuthority: "",
//     edsIssueDate: "",
//     edsDueDate: "",
//     totalIssues: "",
//     issuesClosed: "",
//     issuesPending: "",
//     edsStatus: "",
//     eds_document: null,
//   };

//   const [formData, setFormData] = useState(initialFormData);

//   useEffect(() => {
//     if (editData) {
//       setFormData({
//         ...initialFormData,
//         ...editData,
//         eds_flag: Number(editData.eds_flag || 0),
//       });
//     }
//   }, [editData]);

//   useEffect(() => {
//     if (selectedProject?.id) {
//       setFormData((prev) => ({
//         ...prev,
//         project_id: selectedProject.id,
//         project_name:
//           selectedProject.project_name || selectedProject.name || "",
//       }));
//     }
//   }, [selectedProject]);

//   const handleChange = (e) => {
//     const { name, value, files, type } = e.target;
//  if (type === "file") {
//       setFormData({ ...formData, [name]: files[0] });
//       return;
//     }

//     if (name === "project_id") {
//       const selected = projects.find((p) => String(p.id) === value);

//       setFormData({
//         ...formData,
//         project_id: value,
//         project_name: selected?.project_name || selected?.name || "",
//       });
//       return;
//     }

//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (editData) {
//       await updateForestProject({
//         id: editData.id,
//         formData,
//         token,
//         onSuccess: () => {
//           showSuccess("Project updated successfully!");
//         //   fetchProjects();
//         },
//         onError: (err) => showError(err?.message || "Error updating project"),
//       });
//       return;
//     }

//     await addForestProject({
//       formData,
//       token,
//       selectedProject,
//       onSuccess: () => {
//         showSuccess("Project added successfully!");
//         // fetchProjects();
//         setFormData(initialFormData);
//       },
//       onError: (err) => showError(err?.message || "Error adding project"),
//     });
//   };

//   return (
//     <div className="p-2 bg-base-100 rounded-xl shadow">

//       <h3 className="text-xl font-bold mb-6">
//         {editData ? "Edit Forest Project Master Data" : "Add Forest Project Master Data"}
//       </h3>

//       <form onSubmit={handleSubmit} className="space-y-4">

//         {/* Project */}
//         <div>
//           <label className="label">Project</label>
//           <select
//             name="project_id"
//             value={formData.project_id}
//             onChange={handleChange}
//             className="select select-bordered w-full"
        
//           >
//             <option value="">Select Project</option>
//             {projects.map((p) => (
//               <option key={p.id} value={p.id}>
//                 {p.project_name || p.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Main Inputs */}
//         <div className="grid grid-cols-2 gap-3">
//           {[
//             { name: "proposal_no", label: "Proposal No", },
//             { name: "user_agency", label: "User Agency" },

//             { name: "state", label: "State" },
//             { name: "district", label: "District" },
//             { name: "tahasil", label: "Tahasil" },
//             { name: "mouza", label: "Mouza" },
//             { name: "range_division", label: "Range / Division" },
//             { name: "forest_type", label: "Forest Type" },
//             { name: "total_project_area_ha", label: "Total Area", type: "number" },
//             { name: "forest_area_ha", label: "Forest Area", type: "number" },
//             { name: "non_forest_area_ha", label: "Non Forest Area", type: "number" },
//             { name: "project_status", label: "Project Status" },
//             { name: "current_stage", label: "Current Stage" },
//           ].map((f) => (
//             <div key={f.name}>
//               <label className="label">{f.label}</label>
//               <input
//                 type={f.type || "text"}
//                 name={f.name}
//                 value={formData[f.name]}
//                 onChange={handleChange}
//                 className="input input-bordered w-full"
//                 // required={f.required}
//               />
//             </div>
//           ))}
//         </div>

//         {/* EDS Flag */}
//         <div>
//           <label className="label font-medium">EDS Flag</label>
//           <div className="flex gap-6">
//             <label className="flex gap-2">
//               <input
//                 type="radio"
//                 checked={formData.eds_flag === 1}
//                 onChange={() => setFormData({ ...formData, eds_flag: 1 })}
//               />
//               Yes
//             </label>

//             <label className="flex gap-2">
//               <input
//                 type="radio"
//                 checked={formData.eds_flag === 0}
//                 onChange={() => setFormData({ ...formData, eds_flag: 0 })}
//               />
//               No
//             </label>
//           </div>
//         </div>

//         {/* 🔹 EDS Section (Only when Yes) */}
//         {formData.eds_flag === 1 && (
//           <div className="grid grid-cols-2 gap-3">

//             {[
//               { name: "edsRefNo", label: "EDS Ref No" },
//               { name: "issuingAuthority", label: "Issuing Authority" },
//               { name: "edsIssueDate", label: "EDS Issue Date", type: "date" },
//               { name: "edsDueDate", label: "EDS Due Date", type: "date" },
//               { name: "totalIssues", label: "Total Issues" },
//               { name: "issuesClosed", label: "Issues Closed" },
//               { name: "issuesPending", label: "Issues Pending" },
//               { name: "edsStatus", label: "EDS Status" },
//             ].map((f) => (
//               <div key={f.name}>
//                 <label className="label">{f.label}</label>
//                 <input
//                   type={f.type || "text"}
//                   name={f.name}
//                   value={formData[f.name]}
//                   onChange={handleChange}
//                   className="input input-bordered w-full"
//                 />
//               </div>
//             ))}

//             <div className="col-span-2">
//               <label className="label">EDS Document</label>
//               <input
//                 type="file"
//                 name="eds_document"
//                 onChange={handleChange}
//                 className="file-input file-input-bordered w-full"
//               />
//             </div>
//           </div>
//         )}

//         <div className="flex justify-end">
//           <button type="submit" className="btn btn-primary">
//             {editData ? "Update" : "Save"}
//           </button>
//         </div>

//       </form>

//       <SuccessMessage
//         open={modal.open}
//         type={modal.type}
//         message={modal.message}
//         onClose={closeModal}
//       />
//     </div>
//   );
// };

// export default ProjectMaster;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { addForestProject } from "../addForestProject";
import { updateForestProject } from "../../../hooks/updateForestProject";
import SuccessMessage from "../../../shared/SuccessMessage";
import { useSuccessMessage } from "../../../hooks/useSuccessMessage";
import { PROJECT_CATEGORY_NATURE_MAP } from "../../../utils/constants";

const ProjectMaster = () => {
  const token = useSelector((state) => state.auth.userToken);
  const selectedProject = useSelector((s) => s.selectedProject.project);
  const projects = useSelector((s) => s.list.projects || []);
  const [editData, setEditData] = useState();

  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();

  const initialFormData = {
    project_id: "",
    project_name: "",
    proposal_no: "",
    user_agency: "",
    sector: "",
    state: "",
    district: "",
    tahasil: "",
    mouza: "",
    range_division: "",
    forest_type: "",
    total_project_area_ha: "",
    forest_area_ha: "",
    non_forest_area_ha: "",
    project_status: "",
    current_stage: "",
    eds_flag: 0,
    edsRefNo: "",
    issuingAuthority: "",
    edsIssueDate: "",
    edsDueDate: "",
    totalIssues: "",
    issuesClosed: "",
    issuesPending: "",
    edsStatus: "",
    eds_document: null,
    project_category: "",
    project_nature: "", // auto-filled
    project_sub_category: "", // only for Mining
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (editData) {
      setFormData({
        ...initialFormData,
        ...editData,
        eds_flag: Number(editData.eds_flag || 0),
      });
    }
  }, [editData]);

  useEffect(() => {
    if (selectedProject?.id) {
      setFormData((prev) => ({
        ...prev,
        project_id: selectedProject.id,
        project_name:
          selectedProject.project_name || selectedProject.name || "",
      }));
    }
  }, [selectedProject]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
      return;
    }

    if (name === "project_category") {
      const nature = PROJECT_CATEGORY_NATURE_MAP[value] || "";

      setFormData({
        ...formData,
        project_category: value,
        project_nature: nature,
        project_sub_category:
          value === "Mining / Quarrying" ? formData.project_sub_category : "",
      });

      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editData) {
      await updateForestProject({
        id: editData.id,
        formData,
        token,
        onSuccess: () => {
          showSuccess("Project updated successfully!");
          //   fetchProjects();
        },
        onError: (err) => showError(err?.message || "Error updating project"),
      });
      return;
    }

    await addForestProject({
      formData,
      token,
      selectedProject,
      onSuccess: () => {
        showSuccess("Project added successfully!");
        // fetchProjects();
        setFormData(initialFormData);
      },
      onError: (err) => showError(err?.message || "Error adding project"),
    });
  };

  return (
    <div className="p-2 bg-base-100 rounded-xl shadow">
      <h3 className="text-xl font-bold mb-2">
        {editData
          ? "Edit Forest Project Master Data"
          : "Add Forest Project Master Data"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

  {/* Project Category */}
  <div>
    <label className="label font-medium">
      Project Category <span className="text-red-500">*</span>
    </label>
    <select
      name="project_category"
      value={formData.project_category}
      onChange={handleChange}
      className="select select-bordered w-full"
    >
      <option value="">Select Project Category</option>
      {Object.keys(PROJECT_CATEGORY_NATURE_MAP).map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  </div>

  {/* Project Nature */}
  <div>
    <label className="label font-medium">Project Nature</label>
    <input
      value={formData.project_nature || ""}
      readOnly
      placeholder="Auto-filled"
      className="input input-bordered w-full bg-gray-50 text-gray-700"
    />
  </div>

  {/* Mining Sub-Category */}
  <div>
    <label className="label font-medium">Mining Sub-Category</label>

    {formData.project_category === "Mining / Quarrying" ? (
      <select
        name="project_sub_category"
        value={formData.project_sub_category}
        onChange={handleChange}
        className="select select-bordered w-full"
      >
        <option value="">Select Mining Type</option>
        <option value="Coal">Coal</option>
        <option value="Non-Coal">Non-Coal</option>
        <option value="Critical Minerals">Critical Minerals</option>
      </select>
    ) : (
      <p className="text-sm text-gray-400 mt-3">
        Applicable only for Mining projects
      </p>
    )}
  </div>

</div>
        {/* Project */}
        <div>
          <label className="label">Project</label>
          <select
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.project_name || p.name}
              </option>
            ))}
          </select>
        </div>



        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "state", label: "State" },
            { name: "district", label: "District" },
            { name: "tahasil", label: "Tahasil" },
            { name: "mouza", label: "Mouza" },
            { name: "proposal_no", label: "Proposal No" },
            { name: "user_agency", label: "User Agency" },

            { name: "range_division", label: "Range / Division" },
            { name: "forest_type", label: "Forest Type" },
            {
              name: "total_project_area_ha",
              label: "Total Area",
              type: "number",
            },
            { name: "forest_area_ha", label: "Forest Area", type: "number" },
            {
              name: "non_forest_area_ha",
              label: "Non Forest Area",
              type: "number",
            },
            { name: "project_status", label: "Project Status" },
            { name: "current_stage", label: "Current Stage" },
          ].map((f) => (
            <div key={f.name}>
              <label className="label">{f.label}</label>
              <input
                type={f.type || "text"}
                name={f.name}
                value={formData[f.name]}
                onChange={handleChange}
                className="input input-bordered w-full"
                // required={f.required}
              />
            </div>
          ))}
        </div>

        {/* EDS Flag */}
        <div>
          <label className="label font-medium">EDS Flag</label>
          <div className="flex gap-6">
            <label className="flex gap-2">
              <input
                type="radio"
                checked={formData.eds_flag === 1}
                onChange={() => setFormData({ ...formData, eds_flag: 1 })}
              />
              Yes
            </label>

            <label className="flex gap-2">
              <input
                type="radio"
                checked={formData.eds_flag === 0}
                onChange={() => setFormData({ ...formData, eds_flag: 0 })}
              />
              No
            </label>
          </div>
        </div>

        {/* 🔹 EDS Section (Only when Yes) */}
        {formData.eds_flag === 1 && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "edsRefNo", label: "EDS Ref No" },
              { name: "issuingAuthority", label: "Issuing Authority" },
              { name: "edsIssueDate", label: "EDS Issue Date", type: "date" },
              { name: "edsDueDate", label: "EDS Due Date", type: "date" },
              { name: "totalIssues", label: "Total Issues" },
              { name: "issuesClosed", label: "Issues Closed" },
              { name: "issuesPending", label: "Issues Pending" },
              { name: "edsStatus", label: "EDS Status" },
            ].map((f) => (
              <div key={f.name}>
                <label className="label">{f.label}</label>
                <input
                  type={f.type || "text"}
                  name={f.name}
                  value={formData[f.name]}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
            ))}

            <div className="col-span-2">
              <label className="label">EDS Document</label>
              <input
                type="file"
                name="eds_document"
                onChange={handleChange}
                className="file-input file-input-bordered w-full"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            {editData ? "Update" : "Save"}
          </button>
        </div>
      </form>

      <SuccessMessage
        open={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={closeModal}
      />
    </div>
  );
};

export default ProjectMaster;

