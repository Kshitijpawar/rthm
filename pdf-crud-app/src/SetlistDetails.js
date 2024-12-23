import { useParams } from "react-router-dom";
import useFetch from "./useFetch";
import { Link } from "react-router-dom";
// import SetlistEdit from "./SetlistEdit";

const SetlistDetails = () => {
  const { id } = useParams();
  // console.log("brother this is setlist details" + id);
  // const history = useHistory();

  const {
    data: set,
    error,
    isPending,
  } = useFetch("http://localhost:8000/setlists/" + id);
  // console.log("printing set");
  // console.log(set);
  return (
    <div className="set-details" id={id}>
      {isPending && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {set && (
        <article>
          <h2>{set.setlist_name}</h2>
          <p>Performance Date: {set.performance_date}</p>
          {/* <SetlistEdit></SetlistEdit> */}
          <Link to={{ pathname: `/edit/${set.id}` }}>
            <button>Edit setlist</button>
          </Link>
        </article>
      )}
      {set?.songs &&
        set.songs.map((song) => (
          <div className="song-preview" id={song.song_id} key={song.song_id}>
            <Link
              to={{
                pathname: `/setlists/${set.id}/songs/${song.song_id}`,
                state: { selectedSong: song },
              }}
            >
              <h2>{song.song_name}</h2>
            </Link>
          </div>
        ))}
    </div>
  );
};

export default SetlistDetails;
