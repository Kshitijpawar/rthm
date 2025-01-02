

import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfView = () => {
  let globalId;

  const scrollSpeed = useRef(0.6);

  const location = useLocation();
  const pdfUrl = location.state || { default: "No data passed" };

  const [numPages, setNumPages] = useState(0);
  const scaleRef = useRef(1); // For dynamic scaling
  const [scale, setScale] = useState(1);
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
        screenWidth < 600 ? 0.5 : screenWidth < 900 ? 0.8 : 1.75;
      //   scaleRef.current = calculateScale;
      setScale(calculateScale);
      console.log(scale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, [scale]);

  const autoScroll = () => {
    // console.log("auto scroll function");
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (Math.ceil(scrollTop) + clientHeight >= scrollHeight) {
      console.log("reached end of page cancelling scroll");
      cancelAnimationFrame(globalId);
      return;
    }
    // console.log("current scroll speed", scrollSpeed.current);
    window.scrollBy(0, scrollSpeed.current);
    globalId = requestAnimationFrame(autoScroll);
  };
  const handleStartScroll = () => {
    // console.log("inside start scroll");

    globalId = requestAnimationFrame(autoScroll);
  };
  const handleStopScroll = () => {
    // console.log("inside stop scroll");
    cancelAnimationFrame(globalId);
  };

  const handleScrollSpeedChange = (e) => {
    scrollSpeed.current = e.target.value;
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
                // scale={scaleRef.current}
                scale={scale}
              />
            </div>
          ))}
        </Document>
      </div>
      <div className="bottom-bar">
        {/* <p>This is a fixed bottom bar. It stays here</p> */}
        <input
          id="scroll-speed"
          type="range"
          min="0"
          max="1"
          step="0.0005"
          defaultValue={scrollSpeed.current}
          onChange={handleScrollSpeedChange}
        />
        <button onClick={handleStartScroll}>Start</button>
        <button onClick={handleStopScroll}>Stop</button>
      </div>
    </div>
  );
};

export default PdfView;
