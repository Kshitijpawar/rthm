import { useParams, useHistory } from "react-router-dom";
import useFetch from "./useFetch";

const SetlistDetails = () => {
  const { id } = useParams();
  const history = useHistory();

  const {
    data: set,
    error,
    isPending,
  } = useFetch("http://localhost:8000/setlists/" + id);
  // console.log("printing set");
  // console.log(set);
  return (
    <div className="set-details" id= {id}>
      {isPending && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {set && (
        <article>
          <h2>{set.setlist_name}</h2>
          <p>Performance Date: {set.performance_date}</p>
        </article>
      )}
      {set?.songs &&
        set.songs.map((song) => (
          <div className= "song-preview" id= {song.song_id} key= {song.song_id}>
            <h2>{song.song_name}</h2>
          </div>
        ))}
    </div>
  );
};

export default SetlistDetails;
