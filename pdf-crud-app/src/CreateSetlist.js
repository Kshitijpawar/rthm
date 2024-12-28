import React, { useState } from "react";
import { database } from "./firebase";
import { ref, set, push } from "firebase/database";
import { supabase } from "./supabaseInit";
import { useNavigate } from "react-router-dom";

const CreateSetlist = () => {
  const [newSetlist, setNewSetlist] = useState({
    setlist_created: new Date().toISOString().split("T")[0],
  });

  const [isUpload, setIsUpload] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name: fieldName, value } = e.target;
    // console.log(fieldName, value, e.target);
    setNewSetlist((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleAddNewSong = () => {
    const newSongKey = (Math.random() + 1).toString(36).substring(7);
    setNewSetlist((prev) => ({
      ...prev,
      songs: {
        ...prev.songs,
        [newSongKey]: {
          song_id: newSongKey,
          song_name: "",
          spotify_link: "",
          youtube_link: "",
          chords: {
            guitar: "",
            ukulele: "",
            piano: "",
          },
        },
      },
    }));
  };
  const handleSongChange = (key, field, value) => {
    setNewSetlist((prev) => ({
      ...prev,
      songs: { ...prev.songs, [key]: { ...prev.songs[key], [field]: value } },
    }));
  };
  const handleFileUpload = (key, instrument, file) => {
    if (!file) {
      console.error("No file provided");
    }

    const validInstruments = ["guitar", "ukulele", "piano"];
    if (!validInstruments.includes(instrument)) {
      console.error("Invalid instrument");
    }
    setNewSetlist((prev) => {
      if (!prev.songs || !prev.songs[key]) {
        console.error("song not found");
        return prev;
      }

      const temp = {
        ...prev,
        songs: {
          ...prev.songs,
          [key]: {
            ...prev.songs[key],
            chords: {
              ...prev.songs[key].chords,
              [instrument + "_blob"]: file,
            },
          },
        },
      };

      return temp;
    });
  };

  const handleSongDelete = (key) => {
    setNewSetlist((prev) => {
      const updatedSongs = { ...prev.songs };
      delete updatedSongs[key];
      return {
        ...prev,
        songs: updatedSongs,
      };
    });
  };
  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsUpload(true);
      console.log("submit form");
      console.log(newSetlist);
      const updatedSetlist = { ...newSetlist };
      console.log("burh");
      console.log(updatedSetlist);
      if ("songs" in updatedSetlist) {
        for (const [songKey, song] of Object.entries(updatedSetlist.songs)) {
          for (const instrument of ["guitar", "ukulele", "piano"]) {
            const blobField = `${instrument}_blob`;
            if (song.chords?.[blobField]) {
              const theFile = song.chords[blobField];
              const fileName = `${instrument}-${Date.now()}-${theFile.name}`;

              // upload to supabase
              const { error } = await supabase.storage
                .from("chords")
                .upload(fileName, theFile);

              if (error) {
                console.error(
                  `Failed to upload  ${instrument} file for song ${songKey}`,
                  error.message
                );
                throw error;
              }
              // get the public url for the uploaded file
              const publicUrl = supabase.storage
                .from("chords")
                .getPublicUrl(fileName).data.publicUrl;

              // update the chords field with the new path
              updatedSetlist.songs[songKey].chords[instrument] = publicUrl;
              // remove the blob field after upload
              delete updatedSetlist.songs[songKey].chords[blobField];
            }
          }
        }
      }

      // Firebase RTDB create setlist
      const setlistRef = ref(database, "setlistsNew");
      const setlistRefKey = push(setlistRef);
      set(setlistRefKey, {
        setlist_name: newSetlist.setlist_name,
        performance_date: newSetlist.performance_date,
      });

      // update songs dynamically
      if ("songs" in updatedSetlist) {
        Object.entries(updatedSetlist.songs).forEach(([songKey, song]) => {
          const songRef = push(
            ref(database, `setlistsNew/${setlistRefKey.key}/songs`)
          );
          set(songRef, {
            song_id: songKey,
            song_name: song.song_name,
            spotify_link: song.spotify_link,
            youtube_link: song.youtube_link,
            chords: song.chords,
          });
        });
      }
      alert("Setlist created successfully");
    } catch (error) {
      alert("Failed to save setlist. please try again");
      console.log(error);
    } finally {
      e.target.reset();
      setNewSetlist({
        setlist_created: new Date().toISOString().split("T")[0],
      });
      setIsUpload(false);
      navigate.push("/");
    }
  };
  return (
    <div className="create">
      <p>Create Setlist remastered</p>
      {isUpload && <p>Uploading setlist... Please wait.</p>}
      {!isUpload && (
        <form onSubmit={handleFormSubmit}>
          <div>
            <label>Setlist Name:</label>
            <input
              type="text"
              name="setlist_name"
              onChange={handleInputChange}
              required
            />
            <label>Performance Date:</label>
            <input
              type="date"
              name="performance_date"
              onChange={handleInputChange}
            />
            <h2>Songs</h2>
            {/* {newSetlist.songs && console.log(newSetlist.songs)} */}
            {newSetlist.songs &&
              Object.entries(newSetlist.songs).map(([key, song]) => (
                <div key={key}>
                  {/* <h3>
                  Song {song.song_name || `Untitled Song songkey: ${key}`}
                </h3> */}
                  <label>Song Name:</label>
                  <input
                    type="text"
                    value={song.song_name || ""}
                    onChange={(e) =>
                      handleSongChange(key, "song_name", e.target.value)
                    }
                    required
                  />
                  <label>Spotify Link:</label>
                  <input
                    type="url"
                    value={song.spotify_link || ""}
                    onChange={(e) =>
                      handleSongChange(key, "spotify_link", e.target.value)
                    }
                  />
                  <label>YouTube Link:</label>
                  <input
                    type="url"
                    value={song.youtube_link || ""}
                    onChange={(e) =>
                      handleSongChange(key, "youtube_link", e.target.value)
                    }
                  />
                  <h4>Upload Chords</h4>
                  {["guitar", "ukulele", "piano"].map((instrument) => (
                    <div key={instrument}>
                      <label>
                        {instrument.charAt(0).toUpperCase() +
                          instrument.slice(1)}
                        :
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) =>
                            handleFileUpload(key, instrument, e.target.files[0])
                          }
                        />
                      </label>
                    </div>
                  ))}
                  <button onClick={() => handleSongDelete(key)}>
                    Delete Song
                  </button>
                </div>
              ))}
            <button onClick={handleAddNewSong}>Add Song</button>
          </div>
          <button type="submit">Create Setlist</button>
        </form>
      )}
    </div>
  );
};

export default CreateSetlist;
