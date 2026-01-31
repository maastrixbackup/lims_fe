import React, { useState } from "react";
import EDSMasterDataTable from "./EDSMasterDataTable";
import EDSMasterDataForm from "./EDSmasterDataForm";

const EDSMasterData = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-4">

      {/* HEADER + ADD BUTTON */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">EDS Master Data</h2>

        <button
          className="btn btn-sm btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Add
        </button>
      </div>

      {/* TABLE */}
      <EDSMasterDataTable />

      {/* FORM MODAL / SECTION */}
      {showForm && (
        <EDSMasterDataForm setShowForm={setShowForm} />
      )}

    </div>
  );
};

export default EDSMasterData;

