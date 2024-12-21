import React, { useState } from "react";
// import axios from "axios";

const CreateSetlist = () => {
  const [setlistName, setSetlistName] = useState("");
  const [performanceDate, setPerformanceDate] = useState("");
  const [songs, setSongs] = useState([
    { song_id: (Math.random() + 1).toString(36).substring(7), song_name: "", spotify_link: "", youtube_link: "" },
  ]);

  const handleAddSong = () => {
    setSongs([...songs, { song_name: "", spotify_link: "", youtube_link: "" }]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSetlist = {
      id: Date.now().toString(),
      setlist_name: setlistName,
      setlist_created: new Date().toISOString().split("T")[0],
      performance_date: performanceDate,
      songs: songs.filter((song) => song.song_name),
    };


    try {
      const response = await fetch("http://localhost:8000/setlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSetlist),
      });
      if (response.ok){
        alert("Setlist added successfully");
        setSetlistName("");
        setPerformanceDate("");
        setSongs([{ song_id: (Math.random() + 1).toString(36).substring(7), song_name: "", spotify_link: "", youtube_link: "" }]);

      }else{
        alert("Failed to add setlist");
      }
      
    } catch (error) {
      console.error("Error adding setlist: ", error);
      alert("Failed to add setlist");

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
