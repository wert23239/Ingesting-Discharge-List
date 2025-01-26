import React, { useState, useEffect } from "react";

function VerificationPage() {
  const [goodRecords, setGoodRecords] = useState([]);
  const [reviewRecords, setReviewRecords] = useState([]);
  const [currentVerifier, setCurrentVerifier] = useState("Alex");

  useEffect(() => {
    // "Good" records
    fetch("http://localhost:8000/records/?status=non-verified")
      .then((res) => res.json())
      .then((data) => setGoodRecords(data));

    // "Needs Review" records
    fetch("http://localhost:8000/records/?status=needs_review")
      .then((res) => res.json())
      .then((data) => setReviewRecords(data));
  }, []);

  // Handler to update record status
  const handleStatusChange = async (recordId, newStatus) => {
    try {
      await fetch(`http://localhost:8000/records/${recordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          verified_by: currentVerifier,
        }),
      });
      // Locally update the correct array
      setGoodRecords((prev) =>
        prev.map((record) =>
          record.id === recordId
            ? { ...record, status: newStatus, verified_by: currentVerifier }
            : record
        )
      );
      setReviewRecords((prev) =>
        prev.map((record) =>
          record.id === recordId
            ? { ...record, status: newStatus, verified_by: currentVerifier }
            : record
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

      {/* Probably Good Table */}
      <h3>Probably Good</h3>
      {goodRecords.length === 0 ? (
        <p className="no-records">No complete records found.</p>
      ) : (
        <Table rows={goodRecords} onStatusChange={handleStatusChange} />
      )}

      {/* Needs Review Table */}
      <h3>Needs More Review</h3>
      {reviewRecords.length === 0 ? (
        <p className="no-records">No incomplete records.</p>
      ) : (
        <Table rows={reviewRecords} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}

function Table({ rows, onStatusChange }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Epic Id</th>
          <th>Phone Number</th>
          <th>Insurance</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((record) => (
          <tr key={record.id} className={record.status}>
            <td>{record.name}</td>
            <td>{record.epic_id || record.EpicId}</td>
            <td>{record.phone_number || record.PhoneNumber}</td>
            <td>{record.insurance}</td>
            <td>{record.status}</td>
            <td>
              <select
                value={record.status}
                onChange={(e) => onStatusChange(record.id, e.target.value)}
              >
                <option value="verified">Mark Verified</option>
                <option value="non-verified">Non-Verified</option>
                <option value="needs_review">Needs Review</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default VerificationPage;
