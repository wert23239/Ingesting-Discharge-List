import "./App.css";
import React, from "react";
import FileUploadPage from "./pages/FileUploadPage";
import VerificationPage from "./pages/VerificationPage";
import FinalizedListPage from "./pages/FinalizedListPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div style={styles.navbar}>
        <h1 style={styles.title}>Discharge Records Management</h1>
        <nav>
          <Link to="/" style={styles.link}>
            File Upload
          </Link>
          <Link to="/verify" style={styles.link}>
            Verification
          </Link>
          <Link to="/finalized" style={styles.link}>
            Finalized List
          </Link>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<FileUploadPage />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/finalized" element={<FinalizedListPage />} />
      </Routes>
    </Router>
  );
}
const styles = {
  navbar: {
    backgroundColor: "#007BFF",
    padding: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
  },
  title: {
    margin: 0,
    fontFamily: "'Poppins', sans-serif",
  },
  link: {
    margin: "0 1rem",
    textDecoration: "none",
    color: "white",
    fontWeight: "bold",
  },
};

export default App;
