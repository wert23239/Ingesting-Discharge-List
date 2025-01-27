import React, { useState, useEffect } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function FinalizedListPage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // Fetch records that are "verified"
    fetch(`${API_BASE_URL}/records/?status=verified`)
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

  const handleSendBack = async (recordId, verified_by) => {
    try {
      // Call your PUT endpoint with status=needs_review
      await fetch(`${API_BASE_URL}/${recordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "needs_review",
          verified_by,
        }),
      });

      // Remove or update this record in local state so it doesn't appear in the final list
      setRecords((prev) => prev.filter((r) => r.id !== recordId));

      // Alternatively, you could re-fetch the entire list:
      // reFetchData();
    } catch (error) {
      console.error("Error sending record back:", error);
    }
  };

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
              <th>Action</th>
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
                <td>
                  {/* Button to revert status to needs_review */}
                  <button
                    onClick={() =>
                      handleSendBack(record.id, record.verified_by)
                    }
                  >
                    Send Back
                  </button>
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
