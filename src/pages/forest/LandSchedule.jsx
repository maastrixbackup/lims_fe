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

const SCHEDULE_TYPE_MAP = {
  forest: "FOREST_AREA",
  nonForest: "NON_FOREST_AREA",
  ca: "CA_LAND",
};

const LandSchedule = () => {
  const token = useSelector((state) => state.auth.userToken);

  const [activeTab, setActiveTab] = useState("forest");
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const TABS = [
    { key: "forest", label: "Forest Area Land Schedule" },
    { key: "nonForest", label: "Non-Forest Area Land Schedule" },
    { key: "ca", label: "CA / ACA Land Schedule" },
  ];

  const handleEdit = (row) => {
    setEditData(row);
    setOpenModal(true);
  };

  const fetchData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const scheduleType = SCHEDULE_TYPE_MAP[activeTab];

      const res = await getLandScheduleList(token, scheduleType);

      setData(res?.data || []);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, token]);
  const handleDelete = (row) => {
    setDeleteRow(row);
    setShowDeleteModal(true);
  };

const confirmDelete = () => {
  if (!deleteRow) return;

  deleteForestLand({
    id: deleteRow.id,
    activeTab,
    token,
    setTableData: setData,
    onSuccess: () => {
      setShowDeleteModal(false);
      setDeleteRow(null);
    },
    onError: (err) => {
      console.error("Delete failed", err);
    },
  });
};
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderTable = () => {
    if (loading) {
      return <p className="text-center py-10">Loading...</p>;
    }

    switch (activeTab) {
      case "forest":
        return (
          <ForestTable
            data={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      case "nonForest":
        return (
          <NonForestTable
            data={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      case "ca":
        return (
          <CATable data={data} onEdit={handleEdit} onDelete={handleDelete} />
        );
      default:
        return null;
    }
  };

  const getAddButtonText = () => {
    if (activeTab === "forest") return "Add Forest Land";
    if (activeTab === "nonForest") return "Add Non-Forest Land";
    if (activeTab === "ca") return "Add CA / ACA Land";
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          Land Area Schedule / Land Details
        </h2>

        <button className="btn btn-primary" onClick={() => setOpenModal(true)}>
          {getAddButtonText()}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex gap-4 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2 text-sm font-medium ${
                activeTab === tab.key
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {renderTable()}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <AbstractTable />
      </div>

      {activeTab === "forest" && (
        <ForestLandForm
          open={openModal}
          editData={editData}
          onClose={() => {
            setOpenModal(false);
            setEditData(null);
          }}
          onSuccess={() => {
            fetchData();
            setEditData(null);
            setOpenModal(false);
          }}
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
          onSuccess={() => {
            fetchData();
            setEditData(null);
            setOpenModal(false);
          }}
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
          onSuccess={() => {
            fetchData();
            setEditData(null);
            setOpenModal(false);
          }}
        />
      )}

      <ConfirmDelete
        isOpen={showDeleteModal}
        title="Confirm Delete"
        message={`Are you sure you want to delete "${deleteRow?.id}"?`}
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
