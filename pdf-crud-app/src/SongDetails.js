import { useLocation, useParams } from "react-router-dom";
import SpotifyEmbed from "./SpotifyEmbed";
import YoutubeEmbed from "./YoutubeEmbed";
import FileDownload from "./FileDownload";
import useFetchRtdb from "./useFetchRtdb";
const SongDetails = () => {
  const { setlistId, songId } = useParams();
  const { data: selectedSong, isPending, error } = useFetchRtdb(`setlistsNew/${setlistId}/songs/${songId}`);
  
  return (
    <div className="song-details">
      <h2>Song Details</h2>
      
      {selectedSong ? (
        <div>
          <p>Song Name: {selectedSong.song_name}</p>
            <SpotifyEmbed song_url={selectedSong.spotify_link} />   
            <YoutubeEmbed song_url={selectedSong.youtube_link} />
            <FileDownload chords={selectedSong.chords} />
        </div>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};

export default SongDetails;