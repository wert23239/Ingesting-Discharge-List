import React, { useState } from "react";

function RecordsTable({ records }) {
  // We'll track an array of booleans that tell if each record is "good" (checked) or "bad" (unchecked).
  const [checkedStates, setCheckedStates] = useState(
    records.map(() => false) // initially all false
  );

  const handleCheckboxChange = (index) => {
    // Toggle the "good" state for a particular row
    setCheckedStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Epic Id</th>
          <th style={thStyle}>Phone</th>
          <th style={thStyle}>Attending Physician</th>
          <th style={thStyle}>Date</th>
          <th style={thStyle}>Primary Care Provider</th>
          <th style={thStyle}>Insurance</th>
          <th style={thStyle}>Disposition</th>
          <th style={thStyle}>Good?</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record, i) => {
          const isGood = checkedStates[i];
          return (
            <tr key={i} style={isGood ? rowGoodStyle : rowNormalStyle}>
              <td style={tdStyle}>{record.Name}</td>
              <td style={tdStyle}>{record.EpicId}</td>
              <td style={tdStyle}>{record.PhoneNumber}</td>
              <td style={tdStyle}>{record.AttendingPhysician}</td>
              <td style={tdStyle}>{record.Date}</td>
              <td style={tdStyle}>{record.PrimaryCareProvider}</td>
              <td style={tdStyle}>{record.Insurance}</td>
              <td style={tdStyle}>{record.Disposition}</td>
              <td style={tdStyle}>
                <label style={{ cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={isGood}
                    onChange={() => handleCheckboxChange(i)}
                    style={{ marginRight: "6px" }}
                  />
                  {isGood && <span>😊</span>}
                </label>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// Simple inline styles for demonstration
// ===== STYLES =====
const tableStyle = {
  borderCollapse: "collapse",
  width: "100%",
  fontFamily: "Arial, sans-serif",
};

const thStyle = {
  border: "1px solid #ccc",
  backgroundColor: "#f5f5f5",
  padding: "12px 8px",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};

const rowGoodStyle = {
  backgroundColor: "#d3f9d8", // a light green background
};

const rowNormalStyle = {
  backgroundColor: "white",
};

export default RecordsTable;
