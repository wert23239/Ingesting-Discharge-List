import React, { useState } from "react";

function FileUploadPage() {
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload-pdf", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setUploadStatus("File uploaded and parsed successfully!");
      } else {
        setUploadStatus("Failed to parse file. Please try again.");
      }
    } catch (error) {
      setUploadStatus("Error uploading file. Please check the server.");
    }
  };

  return (
    <div className="container">
      <h2>Upload Discharge PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      <p className="uploadstatus">{uploadStatus}</p>
    </div>
  );
}

export default FileUploadPage;
