import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfView = () => {
  const location = useLocation();
  const pdfUrl = location.state || { default: "No data passed" };

  const [numPages, setNumPages] = useState(0);
  const scaleRef = useRef(1); // For dynamic scaling
  const pageRefs = useRef([]); // To hold references to individual pages

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    pageRefs.current = Array.from({ length: numPages }, () => React.createRef());
  };

  useEffect(() => {
    const updateScale = () => {
      const screenWidth = window.innerWidth;
      const calculateScale =
        screenWidth < 600 ? 0.5 : screenWidth < 900 ? 0.8 : 1;
      scaleRef.current = calculateScale;
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const handleGoLastPage = () => {
    if (numPages > 0) {
      const lastPageRef = pageRefs.current[numPages - 1];
      if (lastPageRef && lastPageRef.current) {
        lastPageRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div>
      <p>Hello</p>
      <div className="pdf-container">
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from({ length: numPages }, (_, index) => (
            <div
              key={`page_${index + 1}`}
              ref={pageRefs.current[index]} // Attach ref to each page wrapper
            >
              <Page
                pageNumber={index + 1}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                className="pdf-page"
                scale={scaleRef.current}
              />
            </div>
          ))}
        </Document>
      </div>
      <div className="bottom-bar">
        <p>This is a fixed bottom bar. It stays here</p>
        <button onClick={handleGoLastPage}>Go to last page</button>
      </div>
    </div>
  );
};

export default PdfView;
