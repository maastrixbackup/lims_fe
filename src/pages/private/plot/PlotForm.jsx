// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { API_BASE_URL } from "../../../utils/config";
// import { sections, showToast } from "../../../utils/constants";
// import { useLandTypeParam } from "../../../utils/landtypes";
// import { apiClient } from "../../../utils/apiClient";

// const PlotForm = ({ fetchPlots }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const token = useSelector((s) => s.auth.userToken);
//   const selectedProject = useSelector((s) => s.selectedProject.project);
//   const projects = useSelector((state) => state.list.projects || []);
//   const projectId = useSelector((state) => state.selectedProject.project?.id);
//   const [villages, setVillages] = useState([]);
//   const [errors, setErrors] = useState({});

//   const editingPlot = location.state?.plot || null;
//   const { landType } = useParams();
//   const typeParam = useLandTypeParam();

//   const [userChangedProject, setUserChangedProject] = useState(false);

//   const [formData, setFormData] = useState(() => ({
//     type: typeParam,
//     ...Object.fromEntries(
//       Object.values(sections)
//         .flat()
//         .map((f) => [f, ""])
//     ),
//     project_id: "",
//     villages,
//   }));

//   const [loading, setLoading] = useState(false);

//   const fetchVillages = async () => {
//     if (!projectId) {
//       setVillages([]);
//       return;
//     }

//     try {
//       const url = `/village/villageList?project_id=${projectId}&type=${typeParam}`;
//       const data = await apiClient(url);
//       console.log("vilaage list in plot", data);
//       if (data.success) {
//         setVillages(data.villages || []);
//       }
//     } catch (err) {
//       console.error("Error loading villages:", err);
//     }
//   };
//   useEffect(() => {
//     fetchVillages();
//   }, [projectId, typeParam]);

//   useEffect(() => {
//     if (editingPlot) {
//       setFormData((prev) => ({
//         ...prev,
//         ...editingPlot,
//         type: editingPlot.type || typeParam,
//         project_id: editingPlot.project_id,
//       }));
//       setUserChangedProject(true);
//     }
//   }, [editingPlot]);

//   useEffect(() => {
//     if (!editingPlot && selectedProject && !userChangedProject) {
//       setFormData((prev) => ({
//         ...prev,
//         project_id: selectedProject.id,
//       }));
//     }
//   }, [selectedProject, userChangedProject, editingPlot]);

//   const requiredFields = [
//     "name_of_recorded_tenant",
//     "name_of_present_tenant",
//     "village_name",
//     "village_code",
//     "tahasil_name",
//     "ri_circle_name",
//     "thana_no",
//     "khata_no",
//     "plot_no",
//     "kissam_of_land",
//     "land_category",
//     "land_area_total_acres",
//     "land_area_total_hectares",
//     "land_area_acquired_acres",
//     "land_area_acquired_hectares",
//     "la_case_file_no",
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // clear error while typing
//     setErrors((prev) => ({ ...prev, [name]: "" }));

//     if (name === "project_id") {
//       setUserChangedProject(true);
//     }

//     if (name === "village_name") {
//       const found = villages.find((v) => v.village_name === value);

//       setFormData({
//         ...formData,
//         village_name: value,
//         village_code: found?.village_code || "",
//       });
//       return;
//     }

//     // uppercase for LA case file no
//     if (name === "la_case_file_no") {
//       setFormData({ ...formData, [name]: value.toUpperCase() });
//       return;
//     }

//     setFormData({ ...formData, [name]: value });
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const newErrors = {};

//   requiredFields.forEach((field) => {
//     if (!formData[field] || formData[field].trim() === "") {
//       newErrors[field] = "This field is required";
//     }
//   });

//   const laCaseRegex = /^[A-Z0-9]+\/[A-Z0-9]+\/[A-Z0-9]+$/;
//   if (
//     formData.la_case_file_no &&
//     !laCaseRegex.test(formData.la_case_file_no)
//   ) {
//     newErrors.la_case_file_no =
//       "Format must be PROJECT/VILLAGE_CODE/KHATA_NO (e.g. IRCT/PPJ/012)";
//   }
//   if (Object.keys(newErrors).length > 0) {
//     setErrors(newErrors);
//     showToast( "All required fields must be filled correctly.","error");
//     return;
//   }

//   setLoading(true);

//   try {
//     const payload = {
//       ...formData,
//       type: typeParam,
//       project_id: formData.project_id,
//     };

//     const url = editingPlot
//       ? `${API_BASE_URL}/plots/updatePlot/${editingPlot.id}`
//       : `${API_BASE_URL}/plots/createPlot`;

//     const method = editingPlot ? "PUT" : "POST";

//     const res = await fetch(url, {
//       method,
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     const data = await res.json();

//     if (data.success) {
//      showToast("Plot saved successfully!");
//       fetchPlots?.();
//       navigate(`/${landType}/plots`);
//     }
//   } catch (err) {
//     console.error("Save Error:", err);
//     alert("Something went wrong");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <main className="overflow-y-auto">
//       <div className="max-w-6xl mx-auto bg-white shadow-xl p-6 rounded-lg">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold">
//             {editingPlot ? "Edit Plot" : "Add New Plot"}
//           </h2>

//           <button
//             onClick={() => navigate(`/${landType}/plots`)}
//             className="btn btn-outline btn-sm"
//           >
//             ← Back
//           </button>
//         </div>

//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div>
//             <label className="block text-sm font-medium mb-1">Project</label>
//             <select
//               name="project_id"
//               value={formData.project_id || ""}
//               onChange={handleChange}
//               className="select select-bordered w-full"
//               required
//             >
//               <option value="">Select Project</option>
//               {projects.map((p) => (
//                 <option key={p.id} value={p.id}>
//                   {p.project_name || p.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="font-semibold text-sm mb-1 block">
//               Land Type
//             </label>
//             <input
//               readOnly
//               className="input input-bordered w-full bg-gray-100"
//               value={
//                 typeParam === 1
//                   ? "Private Land"
//                   : typeParam === 2
//                   ? "Government Land"
//                   : "Forest Land"
//               }
//             />
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {Object.entries(sections).map(([section, fields]) => (
//             <div key={section} className="p-4 border rounded-md bg-gray-50">
//               <h3 className="font-semibold text-lg mb-3">{section}</h3>

//               <div className="grid grid-cols-2 gap-4">
//                 {fields.map((field) => (
//                   <div key={field}>
//                     <label className="text-xs font-semibold mb-1 block">
//                       {field.replace(/_/g, " ").toUpperCase()}{" "}
//                       {requiredFields.includes(field) && (
//                         <span className="text-red-500">*</span>
//                       )}
//                     </label>

//                  {field === "village_name"  ? (
//                       <select
//                         name={field}
//                         // className="select select-bordered w-full"
//                            className={`select select-bordered w-full ${
//                           errors[field] ? "border-red-500" : ""
//                         }`}
//                         value={formData[field]}
//                         // required
//                         onChange={handleChange}
//                       >
//                         <option value="">Select Village</option>
//                         {villages.map((v) => (
//                           <option key={v.id} value={v.village_name}>
//                             {v.village_name}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <input
//                         name={field}
//                         value={formData[field]}
//                         onChange={handleChange}
//                         placeholder={
//                           field === "la_case_file_no"
//                             ? "PROJECT/VILLAGE_CODE/KHATA_NO"
//                             : ""
//                         }
//                         type={
//                           field.includes("date")
//                             ? "date"
//                             : field.includes("area") ||
//                               field.includes("acres") ||
//                               field.includes("hectares")
//                             ? "number"
//                             : "text"
//                         }
//                         // required={requiredFields.includes(field)}
//                         className={`input input-bordered w-full ${
//                           errors[field] ? "border-red-500" : ""
//                         }`}
//                       />
//                     )}
//                     {errors[field] && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {" "}
//                         {errors[field]}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}

//           <div className="flex justify-end gap-3">
//             <button
//               type="button"
//               className="btn"
//               onClick={() => navigate(`/${landType}/plots`)}
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={loading}
//             >
//               {loading ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </main>
//   );
// };

// export default PlotForm;

// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { API_BASE_URL } from "../../../utils/config";
// import {
//   sections,
//   showToast,
//   LA_CASE_REGEX,
//   REQUIRED_FIELDS,
// } from "../../../utils/constants";
// import { useLandTypeParam } from "../../../utils/landtypes";
// import { apiClient } from "../../../utils/apiClient";

// const PlotForm = ({ fetchPlots }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { landType } = useParams();

//   const token = useSelector((s) => s.auth.userToken);
//   const selectedProject = useSelector((s) => s.selectedProject.project);
//   const projects = useSelector((s) => s.list.projects || []);

//   const editingPlot = location.state?.plot || null;
//   const typeParam = useLandTypeParam();

//   const [villages, setVillages] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [userChangedProject, setUserChangedProject] = useState(false);

//   const [formData, setFormData] = useState(() => ({
//     type: typeParam,
//     ...Object.fromEntries(
//       Object.values(sections)
//         .flat()
//         .map((f) => [f, ""])
//     ),
//     project_id: "",
//   }));

//   const REQUIRED_SET = useMemo(() => new Set(REQUIRED_FIELDS), []);

//   const projectCode = useMemo(() => {
//     const project = projects.find(
//       (p) => String(p.id) === String(formData.project_id)
//     );

//     return project
//       ? (project.project_name || project.name || "")
//           .replace(/\s+/g, "")
//           .toUpperCase()
//       : "";
//   }, [projects, formData.project_id]);

//   const fetchVillages = useCallback(async () => {
//     if (!formData.project_id) {
//       setVillages([]);
//       return;
//     }

//     try {
//       const data = await apiClient(
//         `/village/villageList?project_id=${formData.project_id}&type=${typeParam}`
//       );

//       if (data.success) setVillages(data.villages || []);
//     } catch (err) {
//       console.error(err);
//     }
//   }, [formData.project_id, typeParam]);

//   useEffect(() => {
//     fetchVillages();
//   }, [fetchVillages]);

//   useEffect(() => {
//     if (!editingPlot) return;

//     setFormData((prev) => ({
//       ...prev,
//       ...editingPlot,
//       type: editingPlot.type || typeParam,
//       project_id: editingPlot.project_id,
//     }));

//     setUserChangedProject(true);
//   }, [editingPlot, typeParam]);

//   useEffect(() => {
//     if (!editingPlot && selectedProject && !userChangedProject) {
//       setFormData((prev) => ({
//         ...prev,
//         project_id: selectedProject.id,
//       }));
//     }
//   }, [selectedProject, userChangedProject, editingPlot]);

//   useEffect(() => {
//     if (editingPlot) return;

//     if (projectCode && formData.village_code && formData.khata_no) {
//       setFormData((prev) => ({
//         ...prev,
//         la_case_file_no: `${projectCode}/${formData.village_code}/${formData.khata_no}`,
//       }));
//     }
//   }, [projectCode, formData.village_code, formData.khata_no, editingPlot]);

//   const handleChange = ({ target: { name, value } }) => {
//     setErrors((e) => ({ ...e, [name]: "" }));

//     setFormData((prev) => {
//       if (name === "project_id") {
//         setUserChangedProject(true);
//         return {
//           ...prev,
//           project_id: value,
//           village_name: "",
//           village_code: "",
//         };
//       }

//       if (name === "village_name") {
//         const found = villages.find((v) => v.village_name === value);
//         return {
//           ...prev,
//           village_name: value,
//           village_code: found?.village_code || "",
//         };
//       }

//       return { ...prev, [name]: value };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};

//     REQUIRED_FIELDS.forEach((f) => {
//       if (!formData[f]) newErrors[f] = "This field is required";
//     });

//     if (!LA_CASE_REGEX.test(formData.la_case_file_no)) {
//       newErrors.la_case_file_no =
//         "Format must be PROJECT/VILLAGECODE/KHATANO (e.g. IRCT/PPJ/012)";
//     }

//     if (Object.keys(newErrors).length) {
//       setErrors(newErrors);
//       showToast("All required fields must be filled correctly.", "error");
//       return;
//     }

//     setLoading(true);

//     try {
//       const url = editingPlot
//         ? `${API_BASE_URL}/plots/updatePlot/${editingPlot.id}`
//         : `${API_BASE_URL}/plots/createPlot`;

//       const res = await fetch(url, {
//         method: editingPlot ? "PUT" : "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ ...formData, type: typeParam }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         showToast("Plot saved successfully!");
//         fetchPlots?.();
//         navigate(`/${landType}/plots`);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="overflow-y-auto">
//       <div className="max-w-6xl mx-auto bg-white shadow-xl p-6 rounded-lg">
//         <div className="flex justify-between mb-6">
//           <h2 className="text-xl font-semibold">
//             {editingPlot ? "Edit Plot" : "Add New Plot"}
//           </h2>
//           <button
//             onClick={() => navigate(`/${landType}/plots`)}
//             className="btn btn-outline btn-sm"
//           >
//             ← Back
//           </button>
//         </div>

//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div>
//             <label className="block text-sm font-medium mb-1">Project</label>
//             <select
//               name="project_id"
//               value={formData.project_id}
//               onChange={handleChange}
//               className="select select-bordered w-full"
//               required
//             >
//               <option value="">Select Project</option>
//               {projects.map((p) => (
//                 <option key={p.id} value={p.id}>
//                   {p.project_name || p.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="font-semibold text-sm mb-1 block">
//               Land Type
//             </label>
//             <input
//               readOnly
//               className="input input-bordered w-full bg-gray-100"
//               value={
//                 typeParam === 1
//                   ? "Private Land"
//                   : typeParam === 2
//                   ? "Government Land"
//                   : "Forest Land"
//               }
//             />
//           </div>
//         </div>
//         <form onSubmit={handleSubmit} className="space-y-8">
//           {Object.entries(sections).map(([section, fields]) => (
//             <div key={section} className="p-4 border rounded-md bg-gray-50">
//               <h3 className="font-semibold text-lg mb-3">{section}</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 {fields.map((field) => (
//                   <div key={field}>
//                     <label className="text-xs font-semibold block mb-1">
//                       {field.replace(/_/g, " ").toUpperCase()}
//                       {REQUIRED_SET.has(field) && (
//                         <span className="text-red-500">*</span>
//                       )}
//                     </label>

//                     {field === "village_name" ? (
//                       <select
//                         name={field}
//                         value={formData[field]}
//                         onChange={handleChange}
//                         disabled={!formData.project_id}
//                         className="select select-bordered w-full"
//                       >
//                         <option value="">Select Village</option>
//                         {villages.map((v) => (
//                           <option key={v.id} value={v.village_name}>
//                             {v.village_name}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <input
//                         name={field}
//                         value={formData[field]}
//                         onChange={handleChange}
//                         readOnly={
//                           field === "la_case_file_no" ||
//                           field === "village_code"
//                         }
//                         type={
//                           field.includes("date")
//                             ? "date"
//                             : field.includes("area") ||
//                               field.includes("acres") ||
//                               field.includes("hectares")
//                             ? "number"
//                             : "text"
//                         }
//                         className="input input-bordered w-full"
//                       />
//                     )}

//                     {errors[field] && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errors[field]}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}

//           <div className="flex justify-end gap-3">
//             <button
//               type="button"
//               className="btn"
//               onClick={() => navigate(`/${landType}/plots`)}
//             >
//               Cancel
//             </button>
//             <button className="btn btn-primary" disabled={loading}>
//               {loading ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </main>
//   );
// };

// export default PlotForm;
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../utils/config";
import {
  sections,
  showToast,
  LA_CASE_REGEX,
  REQUIRED_FIELDS,
} from "../../../utils/constants";
import { useLandTypeParam } from "../../../utils/landtypes";
import { apiClient } from "../../../utils/apiClient";

const PlotForm = ({ fetchPlots }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { landType } = useParams();

  const token = useSelector((s) => s.auth.userToken);
  const selectedProject = useSelector((s) => s.selectedProject.project);
  const projects = useSelector((s) => s.list.projects || []);

  const editingPlot = location.state?.plot || null;
  const typeParam = useLandTypeParam();

  const [villages, setVillages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [userChangedProject, setUserChangedProject] = useState(false);
  const [khatas, setKhatas] = useState([]);

  const [formData, setFormData] = useState(() => ({
    type: typeParam,
    ...Object.fromEntries(
      Object.values(sections)
        .flat()
        .map((f) => [f, ""])
    ),
    project_id: "",
  }));

  const REQUIRED_SET = useMemo(() => new Set(REQUIRED_FIELDS), []);

  const projectCode = useMemo(() => {
    const project = projects.find(
      (p) => String(p.id) === String(formData.project_id)
    );

    return project
      ? (project.project_name || project.name || "")
          .replace(/\s+/g, "")
          .toUpperCase()
      : "";
  }, [projects, formData.project_id]);

  const fetchVillages = useCallback(async () => {
    if (!formData.project_id) {
      setVillages([]);
      return;
    }

    try {
      const data = await apiClient(
        `/village/villageList?project_id=${formData.project_id}&type=${typeParam}`
      );

      if (data.success) setVillages(data.villages || []);
    } catch (err) {
      console.error(err);
    }
  }, [formData.project_id, typeParam]);

  // const fetchKhata = useCallback(async () => {
  //   if (!formData.project_id) {
  //     setKhatas([]);
  //     return;
  //   }

  //   try {
  //     const response = await apiClient(
  //       `/khata/getMasterData?project_id=${formData.project_id}&type=${typeParam}`
  //     );

  //     if (response?.success) {
  //       // adjust this based on actual API structure
  //       console.log("khata list in form", response.data.khatas)
  //       setKhatas(response.data.khatas || []);
  //     } else {
  //       setKhatas([]);
  //     }
  //   } catch (error) {
  //     console.error("Khata List Not Found", error);
  //     setKhatas([]);
  //   }
  // }, [formData.project_id, typeParam]);

  // useEffect(() => {
  //   fetchKhata();
  // }, [fetchKhata]);

  useEffect(() => {
    fetchVillages();
  }, [fetchVillages]);

  useEffect(() => {
    if (!editingPlot) return;

    setFormData((prev) => ({
      ...prev,
      ...editingPlot,
      type: editingPlot.type || typeParam,
      project_id: editingPlot.project_id,
    }));

    setUserChangedProject(true);
  }, [editingPlot, typeParam]);

  useEffect(() => {
    if (!editingPlot && selectedProject && !userChangedProject) {
      setFormData((prev) => ({
        ...prev,
        project_id: selectedProject.id,
      }));
    }
  }, [selectedProject, userChangedProject, editingPlot]);

  useEffect(() => {
    if (editingPlot) return;

    if (projectCode && formData.village_code && formData.khata_no) {
      setFormData((prev) => ({
        ...prev,
        la_case_file_no: `${projectCode}/${formData.village_code}/${formData.khata_no}`,
      }));
    }
  }, [projectCode, formData.village_code, formData.khata_no, editingPlot]);

  const handleChange = ({ target: { name, value } }) => {
    setErrors((e) => ({ ...e, [name]: "" }));

    setFormData((prev) => {
      if (name === "project_id") {
        setUserChangedProject(true);
        return {
          ...prev,
          project_id: value,
          village_name: "",
          village_code: "",
        };
      }

      if (name === "village_name") {
        const found = villages.find((v) => v.village_name === value);
        return {
          ...prev,
          village_name: value,
          village_code: found?.village_code || "",
        };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const newErrors = {};

    // REQUIRED_FIELDS.forEach((f) => {
    //   if (!formData[f]) newErrors[f] = "This field is required";
    // });

    // if (!LA_CASE_REGEX.test(formData.la_case_file_no)) {
    //   newErrors.la_case_file_no =
    //     "Format must be PROJECT/VILLAGECODE/KHATANO (e.g. IRCT/PPJ/012)";
    // }

    // if (Object.keys(newErrors).length) {
    //   setErrors(newErrors);
    //   showToast("All required fields must be filled correctly.", "error");
    //   return;
    // }

    // setLoading(true);

    try {
      const url = editingPlot
        ? `${API_BASE_URL}/plots/updatePlot/${editingPlot.id}`
        : `${API_BASE_URL}/plots/createPlot`;

      const res = await fetch(url, {
        method: editingPlot ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, type: typeParam }),
      });

      const data = await res.json();
  console.log("dataaaaa", data)
      if (data.success) {
        showToast("Plot saved successfully!","success");
        fetchPlots?.();
        navigate(`/${landType}/plots`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="overflow-y-auto">
      <div className="max-w-6xl mx-auto bg-white shadow-xl p-6 rounded-lg">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {editingPlot ? "Edit Plot" : "Add New Plot"}
          </h2>
          <button
            onClick={() => navigate(`/${landType}/plots`)}
            className="btn btn-outline btn-sm"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
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

          <div>
            <label className="font-semibold text-sm mb-1 block">
              Land Type
            </label>
            <input
              readOnly
              className="input input-bordered w-full bg-gray-100"
              value={
                typeParam === 1
                  ? "Private Land"
                  : typeParam === 2
                  ? "Government Land"
                  : "Forest Land"
              }
            />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {Object.entries(sections).map(([section, fields]) => (
            <div key={section} className="p-4 border rounded-md bg-gray-50">
              <h3 className="font-semibold text-lg mb-3">{section}</h3>
              <div className="grid grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field}>
                    <label className="text-xs font-semibold block mb-1">
                      {field.replace(/_/g, " ").toUpperCase()}
                      {REQUIRED_SET.has(field) && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    {field === "village_name" ? (
                      <select
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        disabled={!formData.project_id}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select Village</option>
                        {villages.map((v) => (
                          <option key={v.id} value={v.village_name}>
                            {v.village_name}
                          </option>
                        ))}
                      </select>
                    ) : field === "full_part" ? (
                      <select
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select Type</option>
                        <option value="Full">Full</option>
                        <option value="Part">Part</option>
                      </select>
                    ) : field === "displaced_affected_person" ? (
                      <select
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select Type</option>
                        <option value="PAF">PAF</option>
                        <option value="PDF">PDF</option>
                      </select>
                    ) : ["family_with_orphan_members", "tribunal"].includes(
                        field
                      ) ? (
                      <select
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select</option>
                        <option value="Y">Yes</option>
                        <option value="N">No</option>
                      </select>
                    ) : field === "abatement" ? (
                      <select
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select Type</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : (
                      <input
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        // readOnly={
                        //   field === "la_case_file_no" ||
                        //   field === "village_code" 
                        // }
                        type={
                          field.includes("date")
                            ? "date"
                            : field.includes("area") ||
                              field.includes("acres") ||
                              field.includes("hectares")
                            ? "number"
                            : "text"
                        }
                        className="input input-bordered w-full"
                      />
                    )}

                    {errors[field] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="btn"
              onClick={() => navigate(`/${landType}/plots`)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default PlotForm;

// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { API_BASE_URL } from "../../../utils/config";
// import {
//   sections,
//   showToast,
//   LA_CASE_REGEX,
//   REQUIRED_FIELDS,
// } from "../../../utils/constants";
// import { useLandTypeParam } from "../../../utils/landtypes";
// import { apiClient } from "../../../utils/apiClient";

// const PlotForm = ({ fetchPlots }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { landType } = useParams();

//   const token = useSelector((s) => s.auth.userToken);
//   const selectedProject = useSelector((s) => s.selectedProject.project);
//   const projects = useSelector((s) => s.list.projects || []);

//   const editingPlot = location.state?.plot || null;
//   const typeParam = useLandTypeParam();

//   const [villages, setVillages] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [userChangedProject, setUserChangedProject] = useState(false);

//   const [formData, setFormData] = useState(() => ({
//     type: typeParam,
//     ...Object.fromEntries(
//       Object.values(sections).flat().map((f) => [f, ""])
//     ),
//     project_id: "",
//   }));

//   /* ---------- REQUIRED FIELDS (NOT USED DURING TESTING) ---------- */
//   const REQUIRED_SET = useMemo(() => new Set(REQUIRED_FIELDS), []);

//   /* ---------- PROJECT CODE ---------- */
//   const projectCode = useMemo(() => {
//     const project = projects.find(
//       (p) => String(p.id) === String(formData.project_id)
//     );

//     return project
//       ? (project.project_name || project.name || "")
//           .replace(/\s+/g, "")
//           .toUpperCase()
//       : "";
//   }, [projects, formData.project_id]);

//   /* ---------- FETCH VILLAGES ---------- */
//   const fetchVillages = useCallback(async () => {
//     if (!formData.project_id) {
//       setVillages([]);
//       return;
//     }

//     try {
//       const data = await apiClient(
//         `/village/villageList?project_id=${formData.project_id}&type=${typeParam}`
//       );
//       if (data.success) setVillages(data.villages || []);
//     } catch (err) {
//       console.error(err);
//     }
//   }, [formData.project_id, typeParam]);

//   useEffect(() => {
//     fetchVillages();
//   }, [fetchVillages]);

//   /* ---------- EDIT MODE ---------- */
//   useEffect(() => {
//     if (!editingPlot) return;

//     setFormData((prev) => ({
//       ...prev,
//       ...editingPlot,
//       type: editingPlot.type || typeParam,
//       project_id: editingPlot.project_id,
//     }));

//     setUserChangedProject(true);
//   }, [editingPlot, typeParam]);

//   /* ---------- AUTO PROJECT SELECT ---------- */
//   useEffect(() => {
//     if (!editingPlot && selectedProject && !userChangedProject) {
//       setFormData((prev) => ({
//         ...prev,
//         project_id: selectedProject.id,
//       }));
//     }
//   }, [selectedProject, userChangedProject, editingPlot]);

//   /* ---------- AUTO LA CASE NO ---------- */
//   useEffect(() => {
//     if (editingPlot) return;

//     if (projectCode && formData.village_code && formData.khata_no) {
//       setFormData((prev) => ({
//         ...prev,
//         la_case_file_no: `${projectCode}/${formData.village_code}/${formData.khata_no}`,
//       }));
//     }
//   }, [
//     projectCode,
//     formData.village_code,
//     formData.khata_no,
//     editingPlot,
//   ]);

//   /* ---------- CHANGE HANDLER ---------- */
//   const handleChange = ({ target: { name, value } }) => {
//     // setErrors((e) => ({ ...e, [name]: "" })); //

//     setFormData((prev) => {
//       if (name === "project_id") {
//         setUserChangedProject(true);
//         return {
//           ...prev,
//           project_id: value,
//           village_name: "",
//           village_code: "",
//         };
//       }

//       if (name === "village_name") {
//         const found = villages.find((v) => v.village_name === value);
//         return {
//           ...prev,
//           village_name: value,
//           village_code: found?.village_code || "",
//         };
//       }

//       return { ...prev, [name]: value };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     /*
//     const newErrors = {};

//     REQUIRED_FIELDS.forEach((f) => {
//       if (!formData[f]) newErrors[f] = "This field is required";
//     });

//     if (!LA_CASE_REGEX.test(formData.la_case_file_no)) {
//       newErrors.la_case_file_no =
//         "Format must be PROJECT/VILLAGECODE/KHATANO";
//     }

//     if (Object.keys(newErrors).length) {
//       setErrors(newErrors);
//       showToast("All required fields must be filled correctly.", "error");
//       return;
//     }
//     */

//     setLoading(true);

//     try {
//       const url = editingPlot
//         ? `${API_BASE_URL}/plots/updatePlot/${editingPlot.id}`
//         : `${API_BASE_URL}/plots/createPlot`;

//       const res = await fetch(url, {
//         method: editingPlot ? "PUT" : "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ ...formData, type: typeParam }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         showToast("Plot saved successfully!");
//         fetchPlots?.();
//         navigate(`/${landType}/plots`);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="overflow-y-auto">
//       <div className="max-w-6xl mx-auto bg-white shadow-xl p-6 rounded-lg">
//         <div className="flex justify-between mb-6">
//           <h2 className="text-xl font-semibold">
//             {editingPlot ? "Edit Plot" : "Add New Plot"}
//           </h2>
//           <button
//             onClick={() => navigate(`/${landType}/plots`)}
//             className="btn btn-outline btn-sm"
//           >
//             ← Back
//           </button>
//         </div>

//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div>
//             <label className="block text-sm font-medium mb-1">Project</label>
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

//           <div>
//             <label className="font-semibold text-sm mb-1 block">
//               Land Type
//             </label>
//             <input
//               readOnly
//               className="input input-bordered w-full bg-gray-100"
//               value={
//                 typeParam === 1
//                   ? "Private Land"
//                   : typeParam === 2
//                   ? "Government Land"
//                   : "Forest Land"
//               }
//             />
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {Object.entries(sections).map(([section, fields]) => (
//             <div key={section} className="p-4 border rounded-md bg-gray-50">
//               <h3 className="font-semibold text-lg mb-3">{section}</h3>

//               <div className="grid grid-cols-2 gap-4">
//                 {fields.map((field) => (
//                   <div key={field}>
//                     <label className="text-xs font-semibold block mb-1">
//                       {field.replace(/_/g, " ").toUpperCase()}
//                       {/* {REQUIRED_SET.has(field) && (
//                         <span className="text-red-500">*</span>
//                       )} */}
//                     </label>

//                     {field === "village_name" ? (
//                       <select
//                         name={field}
//                         value={formData[field]}
//                         onChange={handleChange}
//                         disabled={!formData.project_id}
//                         className="select select-bordered w-full"
//                       >
//                         <option value="">Select Village</option>
//                         {villages.map((v) => (
//                           <option key={v.id} value={v.village_name}>
//                             {v.village_name}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <input
//                         name={field}
//                         value={formData[field]}
//                         onChange={handleChange}
//                         readOnly={
//                           field === "la_case_file_no" ||
//                           field === "village_code"
//                         }
//                         type={
//                           field.includes("date")
//                             ? "date"
//                             : field.includes("area") ||
//                               field.includes("acres") ||
//                               field.includes("hectares")
//                             ? "number"
//                             : "text"
//                         }
//                         className="input input-bordered w-full"
//                       />
//                     )}

//                     {/* error display disabled */}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}

//           <div className="flex justify-end gap-3">
//             <button
//               type="button"
//               className="btn"
//               onClick={() => navigate(`/${landType}/plots`)}
//             >
//               Cancel
//             </button>
//             <button className="btn btn-primary" disabled={loading}>
//               {loading ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </main>
//   );
// };

// export default PlotForm;
