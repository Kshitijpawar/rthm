// import { createClient } from "@supabase/supabase-js";
import React, { useState } from "react";
import { database } from "./firebase";
import { ref, set, push } from "firebase/database";
import { supabase } from "./supabaseInit";

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
        guitar: "",
        ukulele: "",
        piano: "",
      },
    },
  ]);

  // writing to firebase realtime database
  const writeUserData = (
    setlistId,
    setlistName,
    setlistCreated,
    performanceDate,
    songs
  ) => {
    const setlistRef = ref(database, "setlistsNew/" + setlistId);
    set(setlistRef, {
      setlist_name: setlistName,
      setlist_created: setlistCreated,
      performance_date: performanceDate,
    });

    // Push songs dynamically
    songs.forEach((song) => {
      const songRef = push(
        ref(database, "setlistsNew/" + setlistId + "/songs")
      );
      set(songRef, {
        song_id: song.song_id,
        song_name: song.song_name,
        spotify_link: song.spotify_link,
        youtube_link: song.youtube_link,
        chords: song.chords, // Include chords (whether empty or populated)
      });
    });
  };

  const handleAddSong = () => {
    setSongs([
      ...songs,
      {
        song_id: (Math.random() + 1).toString(36).substring(7),
        song_name: "",
        spotify_link: "",
        youtube_link: "",
        chords: { guitar: "", ukulele: "", piano: "" }, // Default empty strings
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

  const handleUploadToSupabase = async (index, instrument, fileObj) => {
    if (!fileObj) return;

    const fileName = `${instrument}-${Date.now()}-${fileObj.name}`;
    const { data, error } = await supabase.storage
      .from("chords")
      .upload(fileName, fileObj, {
        cacheControl: "3600",
        upsert: false,
      });
    const updatedSongs = [...songs];
    updatedSongs[index].chords[instrument] = data.path;
    setSongs(updatedSongs);
    if (error) {
      throw console.error("Error uploading file: ", error);
    } else {
      console.log("File uploaded to Supabase");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("setlist_name", setlistName);
    formData.append("setlist_created", new Date().toISOString().split("T")[0]);
    formData.append("performance_date", performanceDate);
    formData.append("songs", songs);

    try {
      // Upload pdf files for chords if any
      const updatedSongs = await Promise.all(
        songs.map(async (song, index) => {
          const chordPaths = {};

          for (const [instrument, fileObj] of Object.entries(song.chords)) {
            if (fileObj && fileObj !== "") {
              // If the file is not empty, upload to Supabase
              await handleUploadToSupabase(index, instrument, fileObj);
            } else {
              chordPaths[instrument] = ""; // Default empty string if no file
            }
          }

          return {
            song_id: song.song_id,
            song_name: song.song_name,
            spotify_link: song.spotify_link,
            youtube_link: song.youtube_link,
            chords: song.chords, // Use updated chord paths
          };
        })
      );

      // Create a new setlist object
      const newSetlist = {
        id: Date.now().toString(),
        setlist_name: setlistName,
        setlist_created: new Date().toISOString().split("T")[0],
        performance_date: performanceDate,
        songs: updatedSongs,
      };
      console.log(newSetlist);
      // Write to Firebase
      writeUserData(
        newSetlist.id,
        newSetlist.setlist_name,
        newSetlist.setlist_created,
        newSetlist.performance_date,
        newSetlist.songs
      );

      alert("Setlist created successfully!");
      setSetlistName("");
      setPerformanceDate("");
      setSongs([
        {
          song_id: (Math.random() + 1).toString(36).substring(7),
          song_name: "",
          spotify_link: "",
          youtube_link: "",
          chords: {
            guitar: "",
            ukulele: "",
            piano: "",
          },
        },
      ]);
    } catch (error) {
      console.error("Setlist creation failed:", error);
      alert("Setlist creation failed!");
    }
    e.target.reset();
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
                onChange={(e) =>
                  handleFileChange(index, "guitar", e.target.files[0])
                }
              />
            </div>
            <div>
              <label>Ukulele Chords PDF:</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  handleFileChange(index, "ukulele", e.target.files[0])
                }
              />
            </div>
            <div>
              <label>Piano Chords PDF:</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  handleFileChange(index, "piano", e.target.files[0])
                }
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
