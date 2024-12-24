// TestUpload.js
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import TestRtdb from "./TestRtdb";

// import axios from "axios";
// import PdfViewer from "./PdfViewer";

const TestUpload = () => {
  const [file, setFile] = useState(null);
//   const [pdfUrl, setPdfUrl] = useState("");
//   const [error, setError] = useState(false);
  const [supaResponse, setSupaResponse] = useState(null);

  // supabase init
  const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_API_KEY
  );

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
      // upload to supabase
      const fileName = file.name;
      const { data, error } = await supabase.storage
        .from("chords")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });
        console.log("got data : ", data);
        setSupaResponse(data);
      if (error) {
        // setError(error);
        throw console.error("Error uploading file: ", error);
      } else {
        // alert("File succesffully uploaded to supabase");
        console.log("File uploaded to supabase");
      }
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  // Download pdf file from supabase 
  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("rthm-store")
        .download(supaResponse.path);
      if (error) {
        throw console.error("Error downloading file: ", error);
      } else {
        const url = URL.createObjectURL(data);
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("File download failed:", error);
    }
  };

  return (
    <div className="App">
      <h1>PDF Upload and View</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload PDF</button>
      {supaResponse && (
        <div>
          <p>File uploaded at {supaResponse.fullPath}</p>
          <button onClick={handleDownload}>Download PDF</button>
        </div>
      )}
      <TestRtdb></TestRtdb>
    </div>
  );
};

export default TestUpload;
