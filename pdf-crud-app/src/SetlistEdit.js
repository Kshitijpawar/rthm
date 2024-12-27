import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import useFetch from "./useFetch";
const SetlistEdit = () => {
  const { setlistId } = useParams();
  const [formData, setFormData] = useState(null);
  const history = useHistory();

  const {
    data: set,
    error,
    isPending,
  } = useFetch("http://localhost:8000/setlists/" + setlistId);

  useEffect(() => {
    if (set) {
      setFormData(set); // Initialize formData with fetched set data
    }
  }, [set]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSave = () => {
    fetch(`http://localhost:8000/setlists/${setlistId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save changes");
        }
        return response.json();
      })
      .then((data) => {
        alert("Setlist updated successfully!");
        history.goBack();
      })
      .catch((err) => {
        alert(`Error: ${err.message}`);
      });
  };
  const handleSongChange = (index, key, value) => {
    setFormData((prev) => {
      const updatedSongs = [...prev.songs];
      updatedSongs[index][key] = value;
      return { ...prev, songs: updatedSongs };
    });
  };

  return (
    <div className="create">
      {isPending && <div>Loading...</div>}
      {error && <div>{error}</div>}
      <p>Edit setlist</p>
      {formData && (
        <div>
          <label>
            Setlist Name:
            <input
              type="text"
              name="setlist_name"
              value={formData.setlist_name}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Performance Date:
            <input
              type="date"
              name="performance_date"
              value={formData.performance_date}
              onChange={handleInputChange}
            />
          </label>

          <h2>Songs</h2>
          {formData.songs.map((song, index) => (
            <div key={index}>
              <h3>Song {index + 1}</h3>
              <label>
                Song Name:
                <input
                  type="text"
                  value={song.song_name}
                  onChange={(e) =>
                    handleSongChange(index, "song_name", e.target.value)
                  }
                />
              </label>
              <label>
                Spotify Link:
                <input
                  type="url"
                  value={song.spotify_link}
                  onChange={(e) =>
                    handleSongChange(index, "spotify_link", e.target.value)
                  }
                />
              </label>
              <label>
                YouTube Link:
                <input
                  type="url"
                  value={song.youtube_link}
                  onChange={(e) =>
                    handleSongChange(index, "youtube_link", e.target.value)
                  }
                />
              </label>
            </div>
          ))}
          <button onClick={handleSave}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default SetlistEdit;
