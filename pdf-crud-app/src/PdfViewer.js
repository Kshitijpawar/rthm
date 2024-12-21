// PdfViewer.js
import { useRef, useState, useMemo, React, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeObserver } from "@wojtekmaj/react-hooks";

const PdfViewer = ({ pdfUrl }) => {
  const pdfWorkerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

  const options = useMemo(
    () => ({
      cMapUrl: "/cmaps/",
      standardFontDataUrl: "/standard_fonts/",
    }),
    []
  );

  // const fileUrl = useMemo(() => ({ pdfUrl }), [pdfUrl]);


  const [numPages, setNumPages] = useState(0);
  const [containerRef, setContainerRef] = useState(null);
  const [containerWidth, setContainerWidth] = useState();
  const [pdfLoaded, setPdfLoaded] = useState(false); // Track if PDF is loaded

  const pageRefs = useRef({});

  const onResize = (entries) => {
    const [entry] = entries;
    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  };

  useResizeObserver(containerRef, {}, onResize);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfLoaded(true);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= numPages) {
      pageRefs.current[page].scrollIntoView({ behavior: "smooth" });
    }
  };

  // trying out scrolling time based

  const [scrolling, setScrolling] = useState(false);
  const scrollIntervalRef = useRef(null);
  // const [scrollSpeed, setScrollSpeed] = useState(100);
  const [pixelSpeed, setPixelSpeed] = useState(5);

  const startScrolling = () => {
    if (!scrolling) {
      setScrolling(true);
      scrollIntervalRef.current = setInterval(() => {
        containerRef.scrollBy({ top: pixelSpeed, behavior: "smooth" });
      }, 100);
    }
  };

  const stopScrolling = () => {
    setScrolling(false);
    clearInterval(scrollIntervalRef.current);
  };
  useEffect(() => {
    return () => stopScrolling(); // Cleanup on unmount
  }, []);
  // trying out scrolling time based
  return (
    <div style={{ width: "100%", height: "80vh", position: "relative" }}>
      {numPages !== 0 && pdfLoaded && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            background: "#fff",
            zIndex: 1,
          }}
        >
          <button onClick={() => goToPage(10)}>Jump to Page 10</button>
          <button onClick={startScrolling}>Scroll Start</button>
          <button onClick={stopScrolling}>Scroll Stop</button>
          {/* <label style={{ marginLeft: "10px" }}>
            Scroll Speed:
            <input
              type="range"
              min="0"
              max="200"
              step="50"
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(Number(e.target.value))}
            />
            {scrollSpeed}ms
          </label> */}
          <label style={{ marginLeft: "10px" }}>
          pixelSpeed:
            <input
              type="range"
              min="0"
              max="20"
              step="5"
              value={pixelSpeed}
              onChange={(e) => setPixelSpeed(Number(e.target.value))}
            />
            {pixelSpeed}ms
          </label>
        </div>
      )}

      <div
        ref={setContainerRef}
        style={{
          width: "100%",
          overflow: "auto",
          height: "100%",
          paddingTop: "50px",
        }}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          options={options}
        >
          {numPages > 0 &&
            Array.from(new Array(numPages), (test_page, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={containerWidth ? Math.min(containerWidth, 800) : 800}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                inputRef={(ref) => {
                  pageRefs.current[index + 1] = ref;
                }}
              />
            ))}
        </Document>
      </div>
    </div>
  );
};

export default PdfViewer;
