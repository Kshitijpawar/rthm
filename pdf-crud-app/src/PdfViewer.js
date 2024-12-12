// PdfViewer.js
import { useRef, useState, useMemo, React, } from "react";
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

  return (
    <div ref={setContainerRef} style={{ width: "100%", overflow: "auto" }}>
      {numPages !== 0 && pdfLoaded && (
        <button
          onClick={(e) => {
            goToPage(70);
          }}
        >
          Jump to Page 10
        </button>
      )}

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
  );
};

export default PdfViewer;
