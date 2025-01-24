import React, { useState } from "react";

function VerificationPage() {
  const [records, setRecords] = useState([
    // Example records
    {
      name: "Sunshine, Melody",
      epicId: "EP001234567",
      phoneNumber: "202-555-0152",
      insurance: "BCBS",
      status: "unverified",
    },
    {
      name: "O’Furniture, Patty",
      epicId: "EP001239901",
      phoneNumber: "202-555-0148",
      insurance: "Aetna",
      status: "unverified",
    },
  ]);

  const handleVerify = (index) => {
    const updatedRecords = [...records];
    updatedRecords[index].status = "verified";
    setRecords(updatedRecords);
  };

  return (
    <div style={styles.container}>
      <h2>Verification</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Epic ID</th>
            <th>Phone Number</th>
            <th>Insurance</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr
              key={index}
              style={record.status === "verified" ? styles.rowVerified : {}}
            >
              <td>{record.name}</td>
              <td>{record.epicId}</td>
              <td>{record.phoneNumber}</td>
              <td>{record.insurance}</td>
              <td>{record.status}</td>
              <td>
                {record.status === "unverified" && (
                  <button onClick={() => handleVerify(index)}>Verify</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "'Poppins', sans-serif",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  rowVerified: {
    backgroundColor: "#d3f9d8",
  },
};

export default VerificationPage;
