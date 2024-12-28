import { useParams } from "react-router-dom";
import useFetchRtdb from "./useFetchRtdb";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseInit";
import { database } from "./firebase";
import { ref, set, push } from "firebase/database";
import { useHistory, useLocation } from "react-router-dom";

const SetlistEdit = () => {
  const { setlistId } = useParams();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    console.log("Location changed:", location.pathname);
  }, [location]);

  const {
    data: existingSet,
    isPending,
    error,
  } = useFetchRtdb(`setlistsNew/${setlistId}`);

  const [setlistObj, setSetlistObj] = useState(null);

  useEffect(() => {
    if (existingSet) {
      setSetlistObj(existingSet);
    }
  }, [existingSet]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSetlistObj((prev) => ({ ...prev, [name]: value }));
  };

  const handleSongChange = (key, field, value) => {
    setSetlistObj((prev) => ({
      ...prev,
      songs: { ...prev.songs, [key]: { ...prev.songs[key], [field]: value } },
    }));
  };
  const handleFileUpload = (key, instrument, file) => {
    if (!file) {
      console.error("no file provided");
    }

    const validInstruments = ["guitar", "ukulele", "piano"];
    if (!validInstruments.includes(instrument)) {
      console.error("Invalid instrument");
    }

    setSetlistObj((prev) => {
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
    setSetlistObj((prev) => {
      const updatedSongs = { ...prev.songs };
      delete updatedSongs[key];
      return {
        ...prev,
        songs: updatedSongs,
      };
    });
  };

  const handleAddSong = () => {
    const newSongKey = (Math.random() + 1).toString(36).substring(7);
    setSetlistObj((prev) => ({
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
  const handleSave = async () => {
    try {
      console.log("hey man edit done filled now saving");
      const updatedSetlist = { ...setlistObj }; // created a copy

      for (const [songKey, song] of Object.entries(updatedSetlist.songs)) {
        // console.log(songKey, song);
        for (const instrument of ["guitar", "ukulele", "piano"]) {
          const blobField = `${instrument}_blob`;
          if (song.chords?.[blobField]) {
            const theFile = song.chords[blobField];
            const fileName = `${instrument}-${Date.now()}-${theFile.name}`;

            // upload to supabase storage
            const { data, error } = await supabase.storage
              .from("chords")
              .upload(fileName, theFile);
            if (error) {
              console.error(
                `Failed to upload ${instrument} file for song${songKey}`,
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

      // Firebase RTDB update setlist
      const setlistRef = ref(database, "setlistsNew/" + setlistId);
      set(setlistRef, {
        setlist_name: setlistObj.setlist_name,
        // setlist_created:
        performance_date: setlistObj.performance_date,
      });
      // update songs dynamically
      Object.entries(setlistObj.songs).forEach(([songKey, song]) => {
        const songRef = push(
          ref(database, "setlistsNew/" + setlistId + "/songs")
        );
        set(songRef, {
          song_id: songKey,
          song_name: song.song_name,
          spotify_link: song.spotify_link,
          youtube_link: song.youtube_link,
          chords: song.chords,
        });
      });
      alert("Setlist and songs saved successfully");
      history.goBack();
    } catch (error) {
      alert("Failed to save setlist. please try again");
    }
  };

  return (
    <div className="create" key={location.key}>
      {isPending && <div>Loading...</div>}
      {error && <div>{error}</div>}
      <h2>Edit Setlist</h2>
      {setlistObj && (
        <>
          <label>
            Setlist Name:
            <input
              type="text"
              name="setlist_name"
              value={setlistObj.setlist_name}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Performance Date:
            <input
              type="date"
              name="performance_date"
              value={setlistObj.performance_date}
              onChange={handleInputChange}
            />
          </label>
          <h2>Songs</h2>
          {setlistObj.songs && Object.entries(setlistObj.songs).map(([key, song]) => (
            <div key={key}>
              <h3>
                Song:{" "}
                {song.song_name || `Untitled Song songkey: ${song.song_id}`}
              </h3>
              <label>
                Song Name:
                <input
                  type="text"
                  value={song.song_name || ""}
                  onChange={(e) =>
                    handleSongChange(key, "song_name", e.target.value)
                  }
                />
              </label>
              <label>
                Spotify Link:
                <input
                  type="url"
                  value={song.spotify_link || ""}
                  onChange={(e) =>
                    handleSongChange(key, "spotify_link", e.target.value)
                  }
                />
              </label>
              <label>
                YouTube Link:
                <input
                  type="url"
                  value={song.youtube_link || ""}
                  onChange={(e) =>
                    handleSongChange(key, "youtube_link", e.target.value)
                  }
                />
              </label>
              <h4>Upload / Replace Chords</h4>
              {["guitar", "ukulele", "piano"].map((instrument) => (
                <div key={instrument}>
                  <label>
                    {instrument.charAt(0).toUpperCase() + instrument.slice(1)}:
                    {song.chords?.[`${instrument}`] ? (
                      <p>PDF Chords exist on the server</p>
                    ) : (
                      <p>No chords exist on the server</p>
                    )}
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
              <button onClick={() => handleSongDelete(key)}>Delete Song</button>
            </div>
          ))}
          <button onClick={handleAddSong}>Add Song</button>
          <button onClick={handleSave}>Save Changes</button>
        </>
      )}
    </div>
  );
};

export default SetlistEdit;
