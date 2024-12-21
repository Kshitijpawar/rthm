import axios from "axios";
import React, { useRef, useState } from "react";
// import axios from "axios";

const CreateSetlist = () => {
  const [setlistName, setSetlistName] = useState("");
  const [performanceDate, setPerformanceDate] = useState("");
  const [songs, setSongs] = useState([
    {
      song_id: (Math.random() + 1).toString(36).substring(7),
      song_name: "",
      spotify_link: "",
      youtube_link: "",
      chords: {
        guitar: null,
        ukulele: null,
        piano: null,
      },
    },
  ]);

  const handleAddSong = () => {
    setSongs([
      ...songs,
      {
        song_id: (Math.random() + 1).toString(36).substring(7),
        song_name: "",
        spotify_link: "",
        youtube_link: "",
        chords: { guitar: null, ukulele: null, piano: null },
      },
    ]);
  };

  const handleRemoveSong = (index) => {
    const updatedSongs = songs.filter((song, i) => i !== index);
    setSongs(updatedSongs);
  };

  const handleSongChange = (index, field, value) => {
    const updatedSongs = songs.map((song, i) =>
      i === index ? { ...song, [field]: value } : song
    );
    setSongs(updatedSongs);
  };

  const handleFileChange = (index, instrument, file) => {
    const updatedSongs = songs.map((song, i) => {
      if (i === index) {
        const updatedChords = { ...song.chords, [instrument]: file };
        return { ...song, chords: updatedChords };
      }
      return song;
    });
    setSongs(updatedSongs);
  };

  const handleSubmit = async (e) => {
    

    const formData = new FormData();
    formData.append("setlist_name", setlistName);
    formData.append("setlist_created", new Date().toISOString().split("T")[0]);
    formData.append("performance_date", performanceDate);
    formData.append("songs", songs);
    // console.log("here is formData");
    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    //   console.log(pair[1].toString());
    // }
    songs.forEach((song, index) => {
      formData.append(`songs[${index}][song_id]`, song.song_id);
      formData.append(`songs[${index}][song_name]`, song.song_name);
      formData.append(`songs[${index}][spotify_link]`, song.spotify_link);
      formData.append(`songs[${index}][youtube_link]`, song.youtube_link);
      // formData.append(`song[song_id]`, song.song_id);
      // formData.append(`song[song_name]`, song.song_name);
      // formData.append(`song[spotify_link]`, song.spotify_link);
      // formData.append(`song[youtube_link]`, song.youtube_link);
      Object.keys(song.chords).forEach((instrument) => {
        if (song.chords[instrument]) {
          formData.append(
            // `song[chords][${instrument}]`,
            `songs[${index}][chords][${instrument}]`,
            song.chords[instrument]
          );
        }
      });
    });

    try {
      // First request : Upload pdf files
      const updatedSongs = await Promise.all(
        songs.map(async (song) => {
          const chordPaths = {};
          for (const [instrument, file] of Object.entries(song.chords)) {
            if (file) {
              const formData = new FormData();
              formData.append("file", file);
              // const response = await fetch("http://localhost:5080/upload", {
              //   method: "POST",
              //   body: formData,
              // });

              const axiosResponse = await axios.post(
                "http://localhost:5080/upload",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              if (axiosResponse.status === 200) {
                console.log("axios response");
                console.log(axiosResponse);
                console.log(
                  "current instrument: " +
                    instrument +
                    "current file name: " +
                    axiosResponse.data.fileURL
                );
                chordPaths[instrument] = axiosResponse.data.fileURL;
              } else {
                throw new Error("Failed to upload file for " + instrument);
              }

              // if (response.ok) {
              //   const { filePath } = await response.json();
              //   console.log("printing file path");
              //   console.log(filePath);
              //   console.log(response);

              // } else {
              //   throw new Error("Failed to upload file for " + instrument);
              // }
            }
          }
          // return { ...songs, chords: chordPaths };
          console.log(chordPaths);
          return {
            song_id: song.song_id,
            song_name: song.song_name,
            spotify_link: song.spotify_link,
            youtube_link: song.youtube_link,
            chords: chordPaths,
          };
        })
      );

      // second request: Update Json with file paths
      const newSetlist = {
        id: Date.now().toString(),
        setlist_name: setlistName,
        setlist_created: new Date().toISOString().split("T")[0],
        performance_date: performanceDate,
        songs: updatedSongs,
      };

      const response = await fetch("http://localhost:8000/setlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSetlist),
      });
      if (response.ok) {
        alert("Setlist created successfully!");
        // reset form state
        setSetlistName("");
        setPerformanceDate("");
        setSongs([
          {
            song_id: (Math.random() + 1).toString(36).substring(7),
            song_name: "",
            spotify_link: "",
            youtube_link: "",
            chords: {
              guitar: null,
              ukulele: null,
              piano: null,
            },
          },
        ]);
      } else {
        throw new Error("Failed to create setlist");
      }
    } catch (error) {
      console.error("Setlist creation failed:", error);
      alert("Setlist creation failed!");
    }
  };

  return (
    <div className="create">
      <h2>Create Setlist</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="setlistName">Setlist Name: </label>
          <input
            type="text"
            id="setlistName"
            value={setlistName}
            onChange={(e) => setSetlistName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="performanceDate">Performance Date:</label>
          <input
            type="date"
            id="performanceDate"
            value={performanceDate}
            onChange={(e) => setPerformanceDate(e.target.value)}
            required
          />
        </div>
        <h3>Songs</h3>
        {songs.map((song, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <label>Song Name:</label>
            <input
              type="text"
              value={song.song_name}
              onChange={(e) =>
                handleSongChange(index, "song_name", e.target.value)
              }
              required
            />
            <label>Spotify Link:</label>
            <input
              type="url"
              value={song.spotify_link}
              onChange={(e) =>
                handleSongChange(index, "spotify_link", e.target.value)
              }
            />
            <label>Youtube Link:</label>
            <input
              type="url"
              value={song.youtube_link}
              onChange={(e) =>
                handleSongChange(index, "youtube_link", e.target.value)
              }
            />
            <div>
              <label>Guitar Chords PDF:</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  // console.log(e.target.files[0]);
                  handleFileChange(index, "guitar", e.target.files[0]);
                }}
              />
            </div>
            <div>
              <label>Ukulele Chords PDF:</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  // console.log(e.target.files[0]);
                  handleFileChange(index, "ukulele", e.target.files[0]);
                }}
              />
            </div>
            <div>
              <label>Piano Chords PDF:</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  // console.log(e.target.files[0]);
                  handleFileChange(index, "piano", e.target.files[0]);
                }}
              />
            </div>
            <button type="button" onClick={() => handleRemoveSong(index)}>
              Remove Song
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddSong}>
          Add another Song
        </button>
        <button type="submit">Add Setlist</button>
      </form>
    </div>
  );
};

export default CreateSetlist;
