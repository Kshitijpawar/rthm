import { useState, useCallback, useMemo, useEffect } from "react";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeObserver } from "@wojtekmaj/react-hooks";

const TestUpload = () => {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const options = useMemo(() => ({
    cMapUrl: "/cmaps/",
    standardFontDataUrl: "/standard_fonts/",
  }), []);

  const resizeObserverOptions = {};
  const maxWidth = 800;

  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState(false);

  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerRef, setContainerRef] = useState(null);
  const [containerWidth, setContainerWidth] = useState();

  const onResize = useCallback((entries) => {
    const [entry] = entries;
    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Auto-scroll function (after PDF is loaded)
  useEffect(() => {
    if (numPages === 0) return; // Wait until the PDF is loaded

    // Wait for all pages to be rendered and then start the scrolling
    const interval = setInterval(() => {
      setPageNumber((prevPageNumber) => {
        const nextPage = prevPageNumber === numPages ? 1 : prevPageNumber + 1; // Loop back to first page
        return nextPage;
      });
    }, 2000); // Scroll every 2 seconds (2000ms)

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [numPages]); // Run only when numPages is updated (after document is loaded)

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
          <div ref={setContainerRef} style={{ width: "100%", overflow: "auto" }}>
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              options={options}
            >
              {numPages > 0 && (
                Array.from(new Array(numPages), (_el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                ))
              )}
            </Document>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestUpload;
