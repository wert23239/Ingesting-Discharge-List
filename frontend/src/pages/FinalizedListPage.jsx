import React, { useState, useEffect } from "react";

function FinalizedListPage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // Fetch records that are "verified"
    fetch("http://localhost:8000/records/?status=verified")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched verified records:", data);
        setRecords(data);
        console.log(data);
      })
      .catch((error) =>
        console.error("Error fetching verified records:", error)
      );
  }, []);

  return (
    <div className="container">
      <h2>Finalized Records</h2>
      {records.length === 0 ? (
        <p className="no-records">No verified records found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Epic ID</th>
              <th>Phone Number</th>
              <th>Insurance</th>
              <th>Status</th>
              <th>Verified By</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index} className="finalized">
                <td>{record.name}</td>
                <td>{record.epic_id}</td>
                <td>{record.phone_number}</td>
                <td>{record.insurance}</td>
                <td>{record.status}</td>
                <td style={{ fontSize: "0.9rem" }}>
                  {record.verified_by || "—"}
                  {record.verified_at && (
                    <div style={{ fontSize: "0.75rem", color: "#666" }}>
                      {new Date(record.verified_at).toLocaleString()}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FinalizedListPage;
