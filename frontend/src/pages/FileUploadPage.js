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
    <div style={styles.container}>
      <h2>Upload Discharge PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      <p style={styles.status}>{uploadStatus}</p>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
  },
  status: {
    marginTop: "1rem",
    fontWeight: "bold",
    color: "green",
  },
};

export default FileUploadPage;
