import React, { useState, useEffect } from "react";

function VerificationPage() {
  const [records, setRecords] = useState([]);
  const [currentVerifier, setCurrentVerifier] = useState("Alex");

  useEffect(() => {
    fetch("http://localhost:8000/records/?status=non-verified")
      .then((response) => response.json())
      .then((data) => {
        setRecords(data);
        console.log(data);
        return;
      })
      .catch((error) => console.error("Error fetching records:", error));
  }, []);

  const handleStatusChange = async (recordId, newStatus) => {
    try {
      await fetch(`http://localhost:8000/records/${recordId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verified_by: currentVerifier }),
      });

      // Update the UI
      setRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.id === recordId ? { ...record, status: newStatus } : record
        )
      );
    } catch (error) {
      console.error("Error updating record status:", error);
    }
  };

  return (
    <div className="container">
      <h2>Verification</h2>

      {/* Verifier Selector */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "0.5rem" }}>Select Verifier:</label>
        <select
          value={currentVerifier}
          onChange={(e) => setCurrentVerifier(e.target.value)}
        >
          <option value="Andrew">Andrew</option>
          <option value="Alex">Alex</option>
          <option value="Hekmat">Hekmat</option>
          <option value="Salman">Salman</option>
          <option value="Ablimit">Ablimit</option>
          <option value="Cutie">Diana</option>
        </select>
      </div>

      {records.length === 0 ? (
        <p className="no-records">No records to verify.</p>
      ) : (
        <table>
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
            {records.map((record) => {
              // Here we define rowClass
              const rowClass = record.status;
              return (
                <tr key={record.id} className={rowClass}>
                  <td>{record.name}</td>
                  <td>{record.epic_id}</td>
                  <td>{record.phone_number}</td>
                  <td>{record.insurance}</td>
                  <td>{record.status}</td>
                  <td>
                    <select
                      value={record.status}
                      onChange={(e) =>
                        handleStatusChange(record.id, e.target.value)
                      }
                    >
                      <option value="verified">Verified</option>
                      <option value="non-verified">Non-Verified</option>
                      <option value="needs_review">Needs Review</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VerificationPage;
