import React from "react";

const metricCards = [
  {
    key: "total_area_acres",
    title: "Total Area (Acres)",
    valueClass: "text-green-700",
    containerClass: "bg-green-100",
  },
  {
    key: "total_area_hectares",
    title: "Total Area (Hectares)",
    valueClass: "text-blue-700",
    containerClass: "bg-blue-100",
  },
  {
    key: "acquired_area_acres",
    title: "Acquired Area (Acres)",
    valueClass: "text-amber-700",
    containerClass: "bg-yellow-100",
  },
  {
    key: "acquired_area_hectares",
    title: "Acquired Area (Hectares)",
    valueClass: "text-purple-700",
    containerClass: "bg-purple-100",
  },
];

const formatAreaValue = (value) => {
  const numericValue = Number(value ?? 0);
  return Number.isFinite(numericValue) ? numericValue: "0.00";
};

const TotalArea = ({ data = {} }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {metricCards.map((card) => (
        <div
          key={card.key}
          className={`${card.containerClass} rounded-lg px-4 py-2 text-center shadow-sm border border-white`}
        >
          <p className="text-sm font-semibold text-gray-700">{card.title}</p>
          <p className={`text-2xl font-bold leading-tight ${card.valueClass}`}>
            {formatAreaValue(data[card.key])}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TotalArea;
