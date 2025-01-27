import React, { useState, useEffect } from "react";
import VerificationRow from "./VerificationRow";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function VerificationPage() {
  const [goodRecords, setGoodRecords] = useState([]);
  const [reviewRecords, setReviewRecords] = useState([]);
  const [currentVerifier, setCurrentVerifier] = useState("Alex");

  useEffect(() => {
    // 1) Fetch "non-verified" records
    fetch(`${API_BASE_URL}/records/?status=non-verified`)
      .then((res) => res.json())
      .then((data) => setGoodRecords(data))
      .catch((err) => console.error("Error fetching non-verified:", err));

    // 2) Fetch "needs_review" records
    fetch(`${API_BASE_URL}/records/?status=needs_review`)
      .then((res) => res.json())
      .then((data) => setReviewRecords(data))
      .catch((err) => console.error("Error fetching needs_review:", err));
  }, []);

  // PUT request to update a record's fields in the backend
  const updateRecord = async (recordId, updatedFields) => {
    try {
      console.log(updatedFields);
      await fetch(`${API_BASE_URL}/records/${recordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      // If status changes from non-verified -> verified, remove from goodRecords
      // Or if from needs_review -> verified, remove from reviewRecords, etc.
      // For now, we just update local arrays in place:
      setGoodRecords((prev) =>
        prev.map((r) => (r.id === recordId ? { ...r, ...updatedFields } : r))
      );
      setReviewRecords((prev) =>
        prev.map((r) => (r.id === recordId ? { ...r, ...updatedFields } : r))
      );
    } catch (error) {
      console.error("Error updating record:", error);
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
        </select>
      </div>

      {/* "Probably Good" Table */}
      <h3>Probably Good</h3>
      {goodRecords.length === 0 ? (
        <p className="no-records">No complete records found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Epic ID</th>
              <th>Phone Number</th>
              <th>Insurance</th>
              <th>Provider</th>
              <th>Status</th>
              <th>Verified By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {goodRecords.map((record) => (
              <VerificationRow
                key={record.id}
                record={record}
                currentVerifier={currentVerifier}
                onUpdate={updateRecord}
              />
            ))}
          </tbody>
        </table>
      )}

      {/* "Needs More Review" Table */}
      <h3>Needs More Review</h3>
      {reviewRecords.length === 0 ? (
        <p className="no-records">No incomplete records.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Epic ID</th>
              <th>Phone Number</th>
              <th>Insurance</th>
              <th>Provider</th>
              <th>Status</th>
              <th>Verified By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviewRecords.map((record) => (
              <VerificationRow
                key={record.id}
                record={record}
                currentVerifier={currentVerifier}
                onUpdate={updateRecord}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VerificationPage;
