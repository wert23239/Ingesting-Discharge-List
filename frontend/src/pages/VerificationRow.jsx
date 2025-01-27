import React, { useState } from "react";

function VerificationRow({ record, currentVerifier, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  // Initialize local editable data from record
  const [localData, setLocalData] = useState({
    name: record.name || "",
    epic_id: record.epic_id || record.EpicId || "",
    phone_number: record.phone_number || record.PhoneNumber || "",
    insurance: record.insurance || "",
    status: record.status || "non-verified",
  });

  // Handle input changes for each field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes (PUT request via onUpdate callback)
  const handleSave = () => {
    // Prepare the update object
    const updatedFields = {
      name: localData.name,
      epic_id: localData.epic_id,
      phone_number: localData.phone_number,
      insurance: localData.insurance,
      status: localData.status,
      verified_by: currentVerifier, // attach the current verifier
    };

    onUpdate(record.id, updatedFields);

    setIsEditing(false);
  };

  // Cancel reverts localData back to original
  const handleCancel = () => {
    setLocalData({
      name: record.name || "",
      epic_id: record.epic_id || record.EpicId || "",
      phone_number: record.phone_number || record.PhoneNumber || "",
      insurance: record.insurance || "",
      status: record.status || "non-verified",
    });
    setIsEditing(false);
  };

  return (
    <tr className={record.status}>
      {/* Name */}
      <td>
        {isEditing ? (
          <input name="name" value={localData.name} onChange={handleChange} />
        ) : (
          record.name
        )}
      </td>

      {/* Epic ID */}
      <td>
        {isEditing ? (
          <input
            name="epic_id"
            value={localData.epic_id}
            onChange={handleChange}
          />
        ) : (
          localData.epic_id // or record.epic_id
        )}
      </td>

      {/* Phone Number */}
      <td>
        {isEditing ? (
          <input
            name="phone_number"
            value={localData.phone_number}
            onChange={handleChange}
          />
        ) : (
          record.phone_number || record.PhoneNumber
        )}
      </td>

      {/* Insurance */}
      <td>
        {isEditing ? (
          <input
            name="insurance"
            value={localData.insurance}
            onChange={handleChange}
          />
        ) : (
          record.insurance
        )}
      </td>

      {/* Status */}
      <td>
        {isEditing ? (
          <select
            name="status"
            value={localData.status}
            onChange={handleChange}
          >
            <option value="verified">Verified</option>
            <option value="non-verified">Non-Verified</option>
            <option value="needs_review">Needs Review</option>
          </select>
        ) : (
          record.status
        )}
      </td>

      {/* Verified By */}
      <td>{record.verified_by || "—"}</td>

      {/* Actions: Edit / Save / Cancel */}
      <td>
        {isEditing ? (
          <>
            <button onClick={handleSave} style={{ marginRight: 4 }}>
              Save
            </button>
            <button onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        )}
      </td>
    </tr>
  );
}

export default VerificationRow;
