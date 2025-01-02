import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfView = () => {
  // interesting lesson how since scrolldelay is a local variable it gets set to null
  // when the component re-renders, so we need to use a ref to keep track of it
  // this happens when user clicks scale +/- buttons
  // let scrollDelay; 

  const scrollDelay = useRef(null);

  // const scrollSpeed = useRef(0.6);
  const scrollTime = useRef(200);
  const location = useLocation();
  const pdfUrl = location.state || { default: "No data passed" };

  const [numPages, setNumPages] = useState(0);
  // const scaleRef = useRef(1); // For dynamic scaling
  const [scale, setScale] = useState(1);
  const pageRefs = useRef([]); // To hold references to individual pages

  // const [isScrolling, setIsScrolling] = useState(false);

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
  }, []);

  // const autoScroll = () => {};
  const handleStartScroll = () => {
    console.log("inside start scroll");
    document.getElementById("start-scroll-button").disabled = true;

    // globalId = requestAnimationFrame(autoScroll);
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (Math.ceil(scrollTop) + clientHeight >= scrollHeight) {
      console.log("reached end of page cancelling scroll");
      clearTimeout(scrollDelay.current);
      return;
    }
    // window.scrollBy(0, 0.5);
    window.scrollBy(0, 1);
    
    // console.log("current scroll timer: ", scrollTime.current);
    scrollDelay.current = setTimeout(handleStartScroll, scrollTime.current);
    console.log("current scroll id: ", scrollDelay.current);
  };
  const handleStopScroll = () => {
    console.log("inside stop scroll trying to stop scroll with id: ", scrollDelay.current);
    document.getElementById("start-scroll-button").disabled = false;

    clearTimeout(scrollDelay.current);
  };

  const handleScrollSpeedChange = (e) => {
    scrollTime.current = e.target.value;
  };

  return (
    <div>
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
        <input
          id="scroll-speed"
          type="range"
          min="0"
          max="500"
          step="5"
          defaultValue={scrollTime.current}
          onChange={handleScrollSpeedChange}
        />
        <button id="start-scroll-button" onClick={handleStartScroll}>
          Start
        </button>
        <span style={{ color: "white" }}>Auto-Scroll</span>
        <button id="stop-scroll-button" onClick={handleStopScroll}>
          Stop
        </button>
        <button id="scale-up-button" onClick={() => setScale(scale + 0.5)}>
          +
        </button>
        <span style={{ color: "white" }}>Scale</span>
        <button id="scale-down-button" onClick={() => setScale(scale - 0.5)}>
          -
        </button>
      </div>
    </div>
  );
};

export default PdfView;
