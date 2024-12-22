import { useParams, useLocation } from "react-router-dom";
import SpotifyEmbed from "./SpotifyEmbed";
import YoutubeEmbed from "./YoutubeEmbed";
import FileDownload from "./FileDownload";
const SongDetails = () => {
  const { setlistId, songId } = useParams();
  const location = useLocation();
  const { selectedSong } = location.state || {};
  console.log(selectedSong.chords);
  return (
    <div className="song-details">
      <h2>Song Details</h2>
      <p>Setlist ID: {setlistId}</p>
      <p>Song ID: {songId}</p>
      {selectedSong ? (
        <div>
          <p>Song Name: {selectedSong.song_name}</p>
          {/* <p>Duration: {selectedSong.duration}</p> */}
            {/* <p>Spotify URL: {selectedSong.spotify_link}</p> */}
            <SpotifyEmbed song_url={selectedSong.spotify_link} />   
            <YoutubeEmbed song_url={selectedSong.youtube_link} />
            <FileDownload chords={selectedSong.chords} />
        </div>
      ) : (
        <p>Song details not available. Please navigate from the setlist page.</p>
      )}
    </div>
  );
};

export default SongDetails;
