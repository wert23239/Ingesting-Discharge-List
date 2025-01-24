import React from "react";

function FinalizedListPage() {
  const verifiedRecords = [
    {
      name: "Sunshine, Melody",
      epicId: "EP001234567",
      phoneNumber: "202-555-0152",
      insurance: "BCBS",
    },
  ];

  return (
    <div style={styles.container}>
      <h2>Finalized Records</h2>
      <ul>
        {verifiedRecords.map((record, index) => (
          <li key={index}>
            {record.name} - {record.phoneNumber} - {record.insurance}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "'Poppins', sans-serif",
  },
};

export default FinalizedListPage;
