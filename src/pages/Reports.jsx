import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FolderKanban,
  LandPlot,
  Map,
  Layers,
  FileCheck,
  Globe,
  Users,
  FileText,
  Search,
} from "lucide-react";

import KhataSummaryReport from "./reports/KhataSummary";
import KhataDocumentRegister from "./reports/KhataDocumentRegister";
import PlotDetails from "./reports/PlotDetails";
import PlotOwnershipHistory from "./reports/PlotOwnershipHistory";
import VillageLandRegister from "./reports/VillageLandRegister";
import VillageDocumentReport from "./reports/VillageDocumentReport";
import ProjectSummary from "./reports/ProjectSummary";
import ProjectDocumentRegister from "./reports/ProjectDocumentRegister";
import KMZAvailability from "./reports/KMZAvailability";
import MapSummaryReport from "./reports/MapSummaryReport";
import UserActivity from "./reports/UserActivity";
import AuditTrail from "./reports/AuditTrail";

export default function ReportsMasterScreen() {
  const [openCategory, setOpenCategory] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleCategory = (index) => {
    setOpenCategory(openCategory === index ? null : index);
    setOpenSubmenu(null);
  };

  const toggleSubmenu = (key) => {
    setOpenSubmenu(openSubmenu === key ? null : key);
  };

  const reportModules = [
    {
      title: "Khata Reports",
      icon: FolderKanban,
      submenus: [
        { key: "ks", name: "Khata Summary Report", component: <KhataSummaryReport /> },
        { key: "kdr", name: "Khata Document Register", component: <KhataDocumentRegister /> },
      ],
    },

    {
      title: "Plot Reports",
      icon: LandPlot,
      submenus: [
        { key: "pd", name: "Plot Details", component: <PlotDetails /> },
        { key: "poh", name: "Plot Ownership History", component: <PlotOwnershipHistory /> },
      ],
    },

    {
      title: "Village Reports",
      icon: Map,
      submenus: [
        { key: "vlr", name: "Village Land Register", component: <VillageLandRegister /> },
        { key: "vdr", name: "Village Document Report", component: <VillageDocumentReport /> },
      ],
    },

    {
      title: "Project Reports",
      icon: Layers,
      submenus: [
        { key: "ps", name: "Project Summary", component: <ProjectSummary /> },
        { key: "pdr", name: "Project Document Register", component: <ProjectDocumentRegister /> },
      ],
    },

    {
      title: "Document Reports",
      icon: FileCheck,
      submenus: [
        { key: "dur", name: "Document Upload Report", component: null },
        { key: "mdr", name: "Missing Documents Report", component: null },
      ],
    },

    {
      title: "GIS / Maps Reports",
      icon: Globe,
      submenus: [
        { key: "kmz", name: "KMZ Availability", component: <KMZAvailability /> },
        { key: "msr", name: "Map Summary Report", component: <MapSummaryReport /> },
      ],
    },

    {
      title: "User Reports",
      icon: Users,
      submenus: [
        { key: "al", name: "Activity Log", component: <UserActivity /> },
        { key: "at", name: "Audit Trail", component: <AuditTrail /> },
      ],
    },
  ];

  const filteredModules = reportModules.filter((module) =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sticky">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
          <FileText className="text-blue-600" /> 
          All Reports
        </h1>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search report category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredModules.map((module, index) => {
          const Icon = module.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
            >
          
              <button
                onClick={() => toggleCategory(index)}
                className="w-full flex justify-between items-center p-4 hover:bg-gray-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Icon className="text-blue-600" size={22} />
                  <span className="font-semibold text-gray-900">
                    {module.title}
                  </span>
                </div>
                {openCategory === index ? (
                  <ChevronDown className="text-gray-600" />
                ) : (
                  <ChevronRight className="text-gray-600" />
                )}
              </button>

        
              {openCategory === index && (
                <div className="p-4 border-t bg-gray-50 space-y-4 rounded-b-xl">
                  {module.submenus.map((submenu) => (
                    <div
                      key={submenu.key}
                      className="bg-white p-4 rounded-lg border shadow-sm hover:shadow transition-all cursor-pointer"
                      onClick={() => toggleSubmenu(submenu.key)}
                    >
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {submenu.name}
                      </h3>

                      {openSubmenu === submenu.key && (
                        <div className="mt-3 border-t pt-3">
                          {submenu.component ? (
                            submenu.component
                          ) : (
                            <p className="text-gray-500 text-sm">
                              Component not added yet.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
