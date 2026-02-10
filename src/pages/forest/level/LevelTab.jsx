// import React, { useState } from "react";
// import stage0 from "./LevelZero";
// import Level1 from "./LevelOne";
// import Level2 from "./LevelTwo";
// import LevelThree from "./LevelThree";
// import LevelFour from "./LevelFour";

// const LevelTab = () => {
//   const [activeTab, setActiveTab] = useState("stage0");

//   const tabs = [
//     { id: "stage0", label: "Level 0" },
//     { id: "level1", label: "Level 1" },
//     { id: "level2", label: "Level 2" },
//     { id: "level3", label: "Level 3" },
//     { id: "level4", label: "Level 4" },
//   ];

//   return (
//     <div className="w-full mt-4">
//       <div className="flex mb-2 overflow-x-auto scrollbar-hide">
//         {tabs.map((tab) => (
//           <div
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`px-6 py-3 whitespace-nowrap font-medium text-md
//               border-b-2 transition
//               ${
//                 activeTab === tab.id
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent font-semibold text-gray-700 hover:text-gray-700 hover:border-gray-300"
//               }`}
//           >
//             {tab.label}
//           </div>
//         ))}
//       </div>

//       <div className="font-semibold ">
//         {activeTab === "stage0" && <stage0 />}

//         {activeTab === "level1" && <Level1 />}

//         {activeTab === "level2" && <Level2 />}
//         {activeTab === "level3" && <LevelThree />}
//         {activeTab === "level4" && <LevelFour />}
//       </div>
//     </div>
//   );
// };

// export default LevelTab;

// import React, { useState } from "react";
// import LevelZeroForm from "./levelforms/LevelZeroForm";
// import LevelOneForm from "./levelforms/LevelOneForm";
// import LevelTwoForm from "./levelforms/LevelTwoForm";
// import LevelThreeForm from "./levelforms/LevelThreeForm";
// import LevelFourForm from "./levelforms/LevelFourForm";


// const steps = [
//   { id: "stage0", label: "Level 0" },
//   { id: "level1", label: "Level 1" },
//   { id: "level2", label: "Level 2" },
//   { id: "level3", label: "Level 3" },
//   { id: "level4", label: "Level 4" },
// ];

// const LevelTab = () => {
//   const [currentStep, setCurrentStep] = useState(0);

//   const nextStep = () => {
//     if (currentStep < steps.length - 1) {
//       setCurrentStep((prev) => prev + 1);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 0) {
//       setCurrentStep((prev) => prev - 1);
//     }
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 0:
//         return <LevelZeroForm/>;
//       case 1:
//         return <LevelOneForm />;
//       case 2:
//         return <LevelTwoForm/>;
//       case 3:
//         return <LevelThreeForm />;
//       case 4:
//         return <LevelFourForm />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="w-full mt-4">

//       {/* Step Indicator */}
//       <div className="flex justify-between mb-6">
//         {steps.map((step, index) => (
//           <div key={step.id} className="flex-1 text-center">
//             <div
//               className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-sm
//               ${
//                 index <= currentStep
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-300 text-gray-600"
//               }`}
//             >
//               {index + 1}
//             </div>

//             <p
//               className={`text-sm mt-2 ${
//                 index === currentStep ? "text-blue-600 font-semibold" : "text-gray-500"
//               }`}
//             >
//               {step.label}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Step Content */}
//       <div className="shadow-md p-4 mb-4">
//         {renderStep()}
//       </div>

//       {/* Navigation Buttons */}
//       <div className="flex justify-between">

//         <button
//           onClick={prevStep}
//           disabled={currentStep === 0}
//           className={`px-6 py-2 rounded
//             ${
//               currentStep === 0
//                 ? "bg-gray-300 cursor-not-allowed"
//                 : "bg-gray-600 text-white hover:bg-gray-700"
//             }`}
//         >
//           Previous
//         </button>

//         {currentStep === steps.length - 1 ? (
//           <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
//             Submit
//           </button>
//         ) : (
//           <button
//             onClick={nextStep}
//             className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Next
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LevelTab;
import React, { useState } from "react";
import LevelZeroForm from "./levelforms/LevelZeroForm";
import LevelOneForm from "./levelforms/LevelOneForm";
import LevelTwoForm from "./levelforms/LevelTwoForm";
import LevelThreeForm from "./levelforms/LevelThreeForm";
// import LevelFourForm from "./levelforms/LevelFourForm";

const LevelTab = () => {
  const [activeTab, setActiveTab] = useState("stage0");

  const tabs = [
    { id: "stage0", label: "Stage 0" },
    { id: "stage1", label: "Stage I" },
    { id: "stage2", label: "Stage II" },
    { id: "stage3", label: "Post Clearance" },
   
  ];

  return (
    <div className="w-full mt-6">
      {/* Tabs */}
      <div className="flex gap-2 mb-4 bg-gray-100 p-2 rounded-lg shadow-sm overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-md text-sm font-semibold transition-all whitespace-nowrap
              ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white p-2 rounded-lg shadow-sm">
        {activeTab === "stage0" && <LevelZeroForm />}
        
        {activeTab === "stage1" &&  <LevelOneForm />}
        {activeTab === "stage2" && <LevelTwoForm />}
        {activeTab === "stage3" && <LevelThreeForm />}
        {/* {activeTab === "stage4" && <LevelFourForm />} */}
      </div>
    </div>
  );
};

export default LevelTab;

