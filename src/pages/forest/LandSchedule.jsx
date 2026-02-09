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

      setData(res?.data || []);
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
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          Land Area Schedule / Land Details
        </h2>

        <button
          className="btn btn-primary w-full sm:w-auto"
          onClick={() => setOpenModal(true)}
        >
          {getAddButtonText()}
        </button>
      </div>

      {/* Tabs + Table */}
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
