import React from "react";
import { Link,useLocation } from "react-router-dom";

const FileDownload = ({ chords }) => {
  const location = useLocation();
  const handleFileDownload = (fileUrl) => {
    if (fileUrl) {
      // Open the file URL in a new tab
      window.open(fileUrl, "_blank");
    } else {
      console.error("Invalid file URL");
    }
  };

  return (
    <div>
      <h3>Download files</h3>
      {Object.entries(chords).map(([instrument, url]) => (
        <div key={instrument} style={{ marginBottom: "10px" }}>
          {url ? (
            <>
              <button
                onClick={() => handleFileDownload(url)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Download{" "}
                {instrument.charAt(0).toUpperCase() + instrument.slice(1)}{" "}
                Chords
              </button>
              <Link to={{ pathname: `${location.pathname}/${instrument}/viewpdf` }} state={url}>
                <button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#4CAD50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  View PDF
                </button>
              </Link>
            </>
          ) : (
            <p>
              PDF not uploaded for{" "}
              {instrument.charAt(0).toUpperCase() + instrument.slice(1)} chords.
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileDownload;
