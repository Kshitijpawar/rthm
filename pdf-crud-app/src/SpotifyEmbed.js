const SpotifyEmbed = ({ song_url }) => {
  const extractSpotifyUri = (url) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/").filter(Boolean); // Split and remove empty parts
      if (pathParts.length >= 2) {
        const type = pathParts[0]; // e.g., 'track', 'playlist', 'album'
        const id = pathParts[1]; // Spotify resource ID
        return `${type}/${id}`;
      }
    } catch (error) {
      console.error("Invalid Spotify URL", error);
    }
    return null;
  };

  const spotifyUri = extractSpotifyUri(song_url);

  if (!spotifyUri) {
    return <p>Invalid Spotify URL</p>;
  }
  const embedUrl = `https://open.spotify.com/embed/${spotifyUri}`;

  return (
    <div>
    <iframe
      src={embedUrl}
      style={{
        aspectRatio: "16 / 9", 
        width: "90%", 
        borderRadius: "12px",
        border: "0",
      }}
      allow="encrypted-media"
      allowtransparency="true"
      title="Spotify Embed"
    ></iframe>
    </div>
  );
};

export default SpotifyEmbed;
