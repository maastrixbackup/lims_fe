import React, { useState } from "react";
import EDSMasterDataTable from "./EDSMasterDataTable";
import EDSMasterDataForm from "./EDSmasterDataForm";
import { useLocation } from "react-router-dom";
const EDSMasterData = () => {
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const { state } = useLocation();
  const project = state?.project;

  console.log(project);
  
  return (
    <div className="p-4">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">EDS Master Data</h2>

        <button
          className="btn btn-sm btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Add EDS Master Data
        </button>
      </div>

      <EDSMasterDataTable rows={rows} />
      {showForm && (
        <EDSMasterDataForm
          setRows={setRows}
          setShowForm={setShowForm}
        />
      )}

    </div>
  );
};

export default EDSMasterData;
