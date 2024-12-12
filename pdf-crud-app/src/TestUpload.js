// TestUpload.js
import { useState } from "react";
import axios from "axios";
import PdfViewer from "./PdfViewer";

const TestUpload = () => {
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload file to local server
  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a file first !!!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        "http://localhost:5080/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPdfUrl(response.data.fileURL);
      alert("File uploaded successfully!");
      setError(true);
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  return (
    <div className="App">
      <h1>PDF Upload and View</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload PDF</button>
      {error && (
        <div>
          <h2>View uploaded pdf</h2>
          {/* Use PdfViewer component to render the uploaded PDF */}
          <PdfViewer pdfUrl={pdfUrl} />
        </div>
      )}
    </div>
  );
};

export default TestUpload;
