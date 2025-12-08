import React from "react";
import upComing from "../assets/upcoming.jpg";

const SocialSurvey = () => {
  return (
    <>
     <h2 className="text-xl font-semibold mb-4 ">Social Survey</h2>
    <div className="p-4 flex flex-col items-center">
     

      <img
        src={upComing}
        alt="Social Survey"
        loading="lazy"                
        className="w-64 h-auto rounded-lg shadow mx-auto"  
      />
    </div>
    </>
  );
};

export default SocialSurvey;
