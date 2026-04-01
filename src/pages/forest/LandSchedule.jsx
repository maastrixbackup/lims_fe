import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

import ForestTable from "./ForestTable";
import NonForestTable from "./NonForestTable";
import CATable from "./CATable";
import AbstractTable from "../forest/AbstarctTable";

import ForestLandForm from "./ForestLandForm";
import NonForestLandForm from "./NonForestLandForm";
import CALandForm from "./CALandForm";

import { getLandScheduleList } from "../../utils/LandAreaSchedule";
import ConfirmDelete from "../../shared/ConfirmDelete";
import { deleteForestLand } from "../../hooks/deleteForestLand";
import Pagination from "../../shared/Pagination";
import { FolderUp } from "lucide-react";

const SCHEDULE_TYPE_MAP = {
  forest: "FOREST_AREA",
  nonForest: "NON_FOREST_AREA",
  ca: "CA_LAND",
};

const TABS = [
  { key: "forest", label: "Forest Area Land Schedule" },
  { key: "nonForest", label: "Non-Forest Area Land Schedule" },
  { key: "ca", label: "CA / ACA Land Schedule" },
];

const LandSchedule = () => {
  const token = useSelector((state) => state.auth.userToken);
  const selectedProject = useSelector((s) => s.selectedProject.project);

  const [activeTab, setActiveTab] = useState("forest");
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const handleEdit = (row) => {
    setEditData(row);
    setOpenModal(true);
  };

  const handleDelete = (row) => {
    setDeleteRow(row);
    setShowDeleteModal(true);
  };

  const fetchData = useCallback(async () => {
    if (!token || !selectedProject?.id) return;

    setLoading(true);
    try {
      const scheduleType = SCHEDULE_TYPE_MAP[activeTab];
      const res = await getLandScheduleList(
        token,
        scheduleType,
        selectedProject,
        page,
        limit
      );

      const filteredData = (res?.data || []).filter(
        (row) => row?.schedule_type === scheduleType
      );

      setData(filteredData);
      setTotalPages(res?.totalPages || 1);
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, token, selectedProject, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setOpenModal(false);
    setEditData(null);
  }, [activeTab]);

  const confirmDelete = () => {
    if (!deleteRow) return;

    deleteForestLand({
      id: deleteRow.id,
      activeTab,
      token,
      selectedProject,
      setTableData: setData,
      onSuccess: () => {
        setShowDeleteModal(false);
        setDeleteRow(null);
        fetchData();
      },
      onError: (err) => console.error("Delete failed", err),
    });
  };
const exportToCSV = (rows, fileName) => {
  if (!rows || !rows.length) return;

  // 1️⃣ Filter out JSON / object / array type fields
  const validKeys = Object.keys(rows[0]).filter((key) => {
    const value = rows[0][key];
    return (
      value === null ||
      ["string", "number", "boolean"].includes(typeof value)
    );
  });

  // 2️⃣ Convert column names to CAPITAL
  const headers = validKeys.map((key) =>
    key.replace(/_/g, " ").toUpperCase()
  );

  // 3️⃣ Prepare rows
  const csvRows = rows.map((row) =>
    validKeys
      .map((key) => `"${row[key] ?? ""}"`)
      .join(",")
  );

  const csvContent = [headers.join(","), ...csvRows].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
};


const handleExport = async () => {
  if (!token || !selectedProject?.id) return;

  try {
    const scheduleType = SCHEDULE_TYPE_MAP[activeTab];

    // fetch ALL data (no pagination)
    const res = await getLandScheduleList(
      token,
      scheduleType,
      selectedProject,
      1,
      10000 // large limit
    );

    const exportData = res?.data || [];

    exportToCSV(
      exportData,
      `${scheduleType}_LAND_SCHEDULE.csv`
    );
  } catch (error) {
    console.error("Export failed", error);
  }
};

  const getAddButtonText = () => {
    if (activeTab === "forest") return "Add Forest Land";
    if (activeTab === "nonForest") return "Add Non-Forest Land";
    if (activeTab === "ca") return "Add CA / ACA Land";
    return "Add Land";
  };

  const renderTable = () => {
    if (loading) {
      return <p className="text-center py-10 text-gray-500">Loading...</p>;
    }

    return (
      <>
        <div className="overflow-x-auto">
          {activeTab === "forest" && (
            <ForestTable data={data} onEdit={handleEdit} onDelete={handleDelete} />
          )}

          {activeTab === "nonForest" && (
            <NonForestTable data={data} onEdit={handleEdit} onDelete={handleDelete} />
          )}

          {activeTab === "ca" && (
            <CATable data={data} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>

        <div className="mt-4">
          <Pagination
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            totalPages={totalPages}
          />
        </div>
      </>
    );
  };

  return (
    <>
 
   <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
  <h2 className="text-lg sm:text-xl font-semibold">
    Land Area Schedule / Land Details
  </h2>

  <div className="flex gap-2 w-full sm:w-auto">
  
     <button  className="btn bg-green-600 text-white flex items-center gap-2" onClick={handleExport}>
        <FolderUp size={18} /> 
        Export 
      </button>

    <button
      className="btn btn-primary w-full sm:w-auto"
      onClick={() => setOpenModal(true)}
    >
      {getAddButtonText()}
    </button>
  </div>
</div>


      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex gap-4 mb-4 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap pb-2 text-sm font-medium transition ${
                activeTab === tab.key
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {renderTable()}
      </div>

      {/* Abstract Table */}
      <div>
        <h2 className="text-xl p-2 font-semibold text-gray-800 ">Abstract</h2>
        <AbstractTable landData={data} />
      </div>

      {/* Forms */}
      {activeTab === "forest" && (
        <ForestLandForm
          open={openModal}
          editData={editData}
          onClose={() => {
            setOpenModal(false);
            setEditData(null);
          }}
          onSuccess={fetchData}
        />
      )}

      {activeTab === "nonForest" && (
        <NonForestLandForm
          open={openModal}
          editData={editData}
          onClose={() => {
            setOpenModal(false);
            setEditData(null);
          }}
          onSuccess={fetchData}
        />
      )}

      {activeTab === "ca" && (
        <CALandForm
          open={openModal}
          editData={editData}
          onClose={() => {
            setOpenModal(false);
            setEditData(null);
          }}
          onSuccess={fetchData}
        />
      )}

      {/* Delete Modal */}
      <ConfirmDelete
        isOpen={showDeleteModal}
        title="Confirm Delete"
        message={`Are you sure you want to delete record ID "${deleteRow?.id}"?`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeleteRow(null);
        }}
      />
    </>
  );
};

export default LandSchedule;
