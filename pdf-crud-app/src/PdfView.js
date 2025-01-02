
// on mobile devices the pdf doesn't stop scrolling even after reaching the end of page. 
// I cannot find a way to stop the scrolling.


import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfView = () => {
  let globalId;
  const location = useLocation();
  const pdfUrl = location.state || { default: "No data passed" };

  const [numPages, setNumPages] = useState(0);
  const scaleRef = useRef(1); // For dynamic scaling
  const pageRefs = useRef([]); // To hold references to individual pages

  //   const isScrolling = useRef(false); // Tracks if scrolling was triggered programmatically

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    pageRefs.current = Array.from({ length: numPages }, () =>
      React.createRef()
    );
  };

  useEffect(() => {
    const updateScale = () => {
      const screenWidth = window.innerWidth;
      const calculateScale =
        screenWidth < 600 ? 0.5 : screenWidth < 900 ? 0.8 : 1;
      scaleRef.current = calculateScale;
      console.log(scaleRef.current);
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const autoScroll = () => {
    console.log("auto scroll function");
    const {scrollHeight, scrollTop, clientHeight} = document.documentElement;
    console.log(scrollHeight, scrollTop, clientHeight);
    if (Math.ceil(scrollTop) + clientHeight >= scrollHeight) {
        console.log("reached end of page");
        cancelAnimationFrame(globalId);
        return;
    }


    window.scrollBy(0, 6);
    globalId = requestAnimationFrame(autoScroll);
    // console.log("globalId: ", globalId);
  };
  const handleStartScroll = () => {
    console.log("inside start scroll");

    globalId = requestAnimationFrame(autoScroll);
  };
  const handleStopScroll = () => {
    console.log("inside stop scroll");
    cancelAnimationFrame(globalId);
  };

  const handleGetData = () => {
    const {scrollHeight, scrollTop, clientHeight} = document.documentElement;
    console.log(scrollHeight, scrollTop, clientHeight);
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
        {/* <p>This is a fixed bottom bar. It stays here</p> */}
        <button onClick={handleStartScroll}>Start</button>
        <button onClick={handleStopScroll}>Stop</button>
        <button onClick={handleGetData}>data</button>
      </div>
    </div>
  );
};

export default PdfView;
