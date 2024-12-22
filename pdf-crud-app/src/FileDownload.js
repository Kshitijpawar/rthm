const FileDownload = ({ chords }) => {
    console.log(chords)
  return (
    <div>
      <h3>Download files</h3>
      {Object.entries(chords).map(([instrument, url]) => (
        <div key={instrument} style={{ marginBottom: "10px" }}>
          <button
            onClick={() => {
              window.open(url, "_blank");
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Download {instrument.charAt(0).toUpperCase() + instrument.slice(1)}{" "}
            Chords
          </button>
        </div>
      ))}
    </div>
  );
};

export default FileDownload;
