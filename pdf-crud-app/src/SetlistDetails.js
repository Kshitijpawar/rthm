import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import useFetchRtdb from "./useFetchRtdb";

const SetlistDetails = () => {
  const { id } = useParams();
  const { data: set, isPending, error } = useFetchRtdb("setlistsNew/" + id);

  console.log("setlist details id: ");
  console.log(set);

  return (
    <div className="set-details" id={id}>
      {isPending && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {set && (
        <article>
          <h2>{set.setlist_name}</h2>
          <p>Performance Date: {set.performance_date}</p>
          <Link to={{ pathname: `/edit/${set.id}` }}>
            <button>Edit setlist</button>
          </Link>
        </article>
      )}

      {set &&
        Object.entries(set.songs).map(([songId, song]) => {
          return (
            <div className="song-preview" id={songId} key={songId}>
              <Link
                to={{
                  pathname: `/setlists/${id}/songs/${songId}`,
                  state: { selectedSong: song },
                }}
              >
                <h2>{song.song_name}</h2>
              </Link>
            </div>
          );
        })}
    </div>
  );
};

export default SetlistDetails;
