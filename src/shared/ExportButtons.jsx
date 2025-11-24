import React from "react";
import * as XLSX from "xlsx";

const typeMapping = {
  1: "Private Land",
  2: "Government Land",
  3: "Forest Land",
};

const ExportButtons = ({ data, columns, fileName = "export" }) => {

  const exportToExcel = () => {
    if (!data?.length) return alert("No data available!");

    const formattedData = data.map((item) => {
      const row = {};
      columns.forEach((col) => {
        let value = item[col.key];

        // Apply mapping for "type" field
        if (col.key === "type") {
          value = typeMapping[item[col.key]] || "";
        }

        row[col.label] = value ?? "";
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const printData = () => {
    if (!data?.length) return alert("No data available!");

    const tableRows = data
      .map((item) => {
        return `
        <tr>
          ${columns
            .map((col) => {
              let value = item[col.key];

              // apply mapping for print also
              if (col.key === "type") {
                value = typeMapping[item[col.key]] || "";
              }

              return `<td>${value ?? ""}</td>`;
            })
            .join("")}
        </tr>`;
      })
      .join("");

    const headerRow = columns.map((c) => `<th>${c.label}</th>`).join("");

    const html = `
    <html>
      <head>
        <title>${fileName}</title>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #555; padding: 8px; }
          th { background: #f3f3f3; }
        </style>
      </head>

      <body>
        <h2>${fileName}</h2>
        <table>
          <thead><tr>${headerRow}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>`;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="flex gap-3">
      <button  className="btn bg-green-600 text-white flex items-center gap-2" onClick={exportToExcel}>
        Export 
      </button>
      {/* <button className="btn btn-outline btn-sm" onClick={printData}>
        Print
      </button> */}
    </div>
  );
};

export default ExportButtons;
