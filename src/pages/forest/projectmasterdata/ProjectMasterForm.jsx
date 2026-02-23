import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { addForestProject } from "../addForestProject";
import { updateForestProject } from "../../../hooks/updateForestProject";
import SuccessMessage from "../../../shared/SuccessMessage";
import { useSuccessMessage } from "../../../hooks/useSuccessMessage";

const ProjectMasterForm = ({ onClose, fetchProjects, editData }) => {
  const token = useSelector((state) => state.auth.userToken);
  const selectedProject = useSelector((s) => s.selectedProject.project);
  const projects = useSelector((s) => s.list.projects || []);
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
    eds_document: null,
  };
  useEffect(() => {
    if (editData) {
      setFormData({
        ...initialFormData,
        ...editData,
        eds_flag: Number(editData.eds_flag || 0),
      });
    }
  }, [editData]);

  const [formData, setFormData] = useState(initialFormData);

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
    const { name, value, files, type } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
      return;
    }

    if (name === "project_id") {
      const selected = projects.find((p) => String(p.id) === value);
      setFormData({
        ...formData,
        project_id: value,
        project_name: selected?.project_name || selected?.name || "",
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
        fetchProjects();

        setTimeout(() => {
          onClose();
        }, 800);
      },
      onError: (err) => {
        showError(err?.message || "Error updating project");
      },
    });

    return;
  }

  await addForestProject({
    formData,
    token,
    selectedProject,
    onSuccess: () => {
      showSuccess("Project added successfully!");
      fetchProjects();

      setTimeout(() => {
        onClose();
      }, 800);
    },
    onError: (err) => {
      showError(err?.message || "Error adding project");
    },
  });
};


  return (
    <div className="modal modal-open">
      <div className="modal-box w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">
          {editData ? "Edit Forest Project" : "Add Forest Project"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project</label>
            <select
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
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
              {
                name: "proposal_no",
                placeholder: "Proposal No",
                required: true,
              },
              { name: "user_agency", placeholder: "User Agency" },
              { name: "sector", placeholder: "Sector" },
              { name: "state", placeholder: "State" },
              { name: "district", placeholder: "District" },
              { name: "tahasil", placeholder: "Tahasil" },
              { name: "mouza", placeholder: "Mouza" },
              { name: "range_division", placeholder: "Range / Division" },
              { name: "forest_type", placeholder: "Forest Type" },
              {
                name: "total_project_area_ha",
                placeholder: "Total Area",
                type: "number",
              },
              {
                name: "forest_area_ha",
                placeholder: "Forest Area",
                type: "number",
              },
              {
                name: "non_forest_area_ha",
                placeholder: "Non Forest Area",
                type: "number",
              },
              { name: "project_status", placeholder: "Project Status" },
              { name: "current_stage", placeholder: "Current Stage" },
            ].map((field) => (
              <input
                key={field.name}
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                className="input input-bordered"
                required={field.required}
              />
            ))}
          </div>
          <div className="flex gap-6 items-center">
            <label>EDS Flag:</label>

            <label className="flex gap-2 items-center">
              <input
                type="radio"
                name="eds_flag"
                checked={formData.eds_flag === 1}
                onChange={() => setFormData({ ...formData, eds_flag: 1 })}
              />
              Yes
            </label>

            <label className="flex gap-2 items-center">
              <input
                type="radio"
                name="eds_flag"
                checked={formData.eds_flag === 0}
                onChange={() => setFormData({ ...formData, eds_flag: 0 })}
              />
              No
            </label>
          </div>

          <input
            type="file"
            name="eds_document"
            onChange={handleChange}
            className="file-input file-input-bordered w-full"
          />
          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editData ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
         <SuccessMessage
        open={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={closeModal}
      />
    </div>
  );
};

export default ProjectMasterForm;




// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { addForestProject } from "../addForestProject";
// import { updateForestProject } from "../../../hooks/updateForestProject";
// import SuccessMessage from "../../../shared/SuccessMessage";
// import { useSuccessMessage } from "../../../hooks/useSuccessMessage";
// import { NON_LINEAR_PROJECTS, PROJECT_CATEGORY_NATURE_MAP } from "../../../utils/constants";

// const ProjectMaster = () => {
//   const token = useSelector((state) => state.auth.userToken);
//   const selectedProject = useSelector((s) => s.selectedProject.project);
//   const projects = useSelector((s) => s.list.projects || []);
//   const [editData, setEditData] = useState();

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
//     project_category: "",
//     project_nature: "", // auto-filled
//     project_sub_category: "", // only for Mining
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
//     const { name, value, type, files } = e.target;

//     if (type === "file") {
//       setFormData({ ...formData, [name]: files[0] });
//       return;
//     }

//     if (name === "project_category") {
//       const nature = PROJECT_CATEGORY_NATURE_MAP[value] || "";

//       setFormData({
//         ...formData,

//         project_category: value,
//         project_nature: nature,
//         project_sub_category:
//           value === "Mining / Quarrying" ? formData.project_sub_category : "",
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
//           //   fetchProjects();
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
//     <div className="bg-white p-2 rounded-lg shadow-sm">
//       <h3 className="text-xl font-bold mb-2">
//         {editData
//           ? "Edit Forest Project Master Data"
//           : "Add Forest Project Master Data"}
//       </h3>

//       <form onSubmit={handleSubmit} className="space-y-4 p-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="label">Project ID</label>
//             <input
//               type="text"
//               name={"project_id"}
//               value={formData.project_id}
//               onChange={handleChange}
//               className="input input-bordered w-full"
//             />
//           </div>
//           <div>
//             <label className="label">Project</label>
//             <select
//               name="project_id"
//               value={formData.project_id}
//               onChange={handleChange}
//               className="select select-bordered w-full"
//             >
//               <option value="">Select Project</option>
//               {projects.map((p) => (
//                 <option key={p.id} value={p.id}>
//                   {p.project_name || p.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="label">Project Category</label>

//             <div className="dropdown w-full">
//               <label
//                 tabIndex={0}
//                 className="input input-bordered w-full flex items-center justify-between cursor-pointer"
//               >
//                 <span className="truncate">
//                   {formData.project_category || "Select Project Category"}
//                 </span>
//                 <span className="text-gray-400">▾</span>
//               </label>

//               <div
//                 tabIndex={0}
//                 className="dropdown-content z-[20] mt-1 w-full rounded-box shadow-lg bg-base-100 shadow max-h-60 overflow-y-auto"
//                 style={{ scrollbarWidth: "thin" }}
//               >
//                 <ul className="menu menu-md p-1">
//                   {Object.keys(PROJECT_CATEGORY_NATURE_MAP).map((cat) => (
//                     <li key={cat}>
//                       <button
//                         type="button"
//                         className={`whitespace-normal ${
//                           formData.project_category === cat ? "active" : ""
//                         }`}
//                         onClick={() =>
//                           handleChange({
//                             target: {
//                               name: "project_category",
//                               value: cat,
//                             },
//                           })
//                         }
//                       >
//                         {cat}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>

//           <div>
//             <label className="label">Project Nature</label>
//             <input
//               value={formData.project_nature || ""}
//               readOnly
//               placeholder="Auto-filled"
//               className="input input-bordered w-full bg-gray-50 text-gray-700"
//             />
//           </div>

//           <div>
//             <label className="label">Mining Sub-Category</label>

//             {NON_LINEAR_PROJECTS.includes(formData.project_category) ? (
//               <select
//                 name="project_sub_category"
//                 value={formData.project_sub_category}
//                 onChange={handleChange}
//                 className="select select-bordered w-full"
//               >
//                 <option value="">Select Mining Type</option>
//                 <option value="Coal">Coal</option>
//                 <option value="Non-Coal">Non-Coal</option>
//                 <option value="Critical Minerals">Critical Minerals</option>
//               </select>
//             ) : (
//               <p className="text-sm text-gray-400 mt-3">
//                 Applicable only for NON-LINEAR projects
//               </p>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-3">
//           {[
//             { name: "user_agency", label: "User Agency" },
//             { name: "state", label: "State" },
//             { name: "district", label: "District" },
//             { name: "tahasil", label: "Tahasil" },
//             { name: "mouza", label: "Mouza" },
//             { name: "proposal_no", label: "Proposal No" },

//             { name: "range_division", label: "Range / Division" },
//             { name: "forest_type", label: "Forest Type" },
//             {
//               name: "total_project_area_ha",
//               label: "Total Area",
//               type: "number",
//             },
//             { name: "forest_area_ha", label: "Forest Area", type: "number" },
//             {
//               name: "non_forest_area_ha",
//               label: "Non Forest Area",
//               type: "number",
//             },
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
