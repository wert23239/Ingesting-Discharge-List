import "./App.css";
import React from "react";
import FileUploadPage from "./pages/FileUploadPage";
import VerificationPage from "./pages/VerificationPage";
import FinalizedListPage from "./pages/FinalizedListPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./styles.css";

function App() {
  return (
    <Router>
      <div className="navbar">
        <h1>Discharge Records Management</h1>
        <nav>
          <Link to="/">File Upload</Link>
          <Link to="/verify">Verification</Link>
          <Link to="/finalized">Finalized List</Link>
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

export default App;
