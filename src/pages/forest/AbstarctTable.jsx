import React from "react";

const AbstractTable = () => {
  const rows = [
    { label: "Total Forest Land", roR: 0, acquired: 0, digital: 0 },
    { label: "Total Non-Forest Land", roR: 0, acquired: 0, digital: 0 },
    {
      label: "Total Project Area",
      roR: 0,
      acquired: 0,
      digital: 0,
      isBold: true,
      bg: "bg-base-200",
    },
    { label: "Total CA Land", roR: 0, acquired: 0, digital: 0 },
    { label: "Total ACA Land", roR: 0, acquired: 0, digital: 0 },
    { label: "Total Land (Others, If any)", roR: 0, acquired: 0, digital: 0 },
    {
      label: "Total Land Under FD Framework",
      roR: 0,
      acquired: 0,
      digital: 0,
      isBold: true,
      bg: "bg-lime-400",
    },
  ];

  return (
    <div className="overflow-x-auto bg-base-100 shadow">
         <h2 className="text-xl font-semibold text-gray-800 mb-4">Abstract</h2>
      <table className="table w-full">
        {/* Title */}
        <thead>
          <tr className="bg-gray-200 font-semibold">
            <th>Land Category</th>
            <th>Total Area - RoR (ha)</th>
            <th>Proposed / Acquired Area (ha)</th>
            <th>Digital Area (ha)</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className={`${row.bg || ""} ${row.isBold ? "font-semibold" : ""}`}
            >
              <td>{row.label}</td>
              <td className="text-center">{row.roR}</td>
              <td className="text-center">{row.acquired}</td>
              <td className="text-center">{row.digital}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AbstractTable;
