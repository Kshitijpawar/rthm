import { supabase } from "./supabaseInit";
const FileDownload = ({ chords }) => {

  const handleFileDownload = async (fileUrl) => {
    try {
       console.log(fileUrl);
      const { data, error } = await supabase.storage
        .from("chords")
        .download(fileUrl);
      if (error) {
        throw console.error("Error downloading file: ", error);
      } else {
        const url = URL.createObjectURL(data);
        console.log("constructed url : ")
        console.log(url)
        window.open(url, "_blank");
      }
      
    } catch (error) {
      console.error("File download failed:", error); 
    }
  };


  return (
    <div>
      <h3>Download files</h3>
      {Object.entries(chords).map(([instrument, url]) => (
        <div key={instrument} style={{ marginBottom: "10px" }}>
          {url ? (
            <button
              onClick={() => handleFileDownload(url)}
            //  {     window.open(url, "_blank");
              // }

              
            
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Download {instrument.charAt(0).toUpperCase() + instrument.slice(1)} Chords
            </button>
          ) : (
            <p>PDF not uploaded for {instrument.charAt(0).toUpperCase() + instrument.slice(1)} chords.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileDownload;
