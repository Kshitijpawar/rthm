const YoutubeEmbed = ({ song_url }) => {
  const extractVideoId = (url) => {
    try {
      const urlObj = new URL(url);
      if (
        urlObj.hostname === "www.youtube.com" ||
        urlObj.hostname === "youtube.com"
      ) {
        return urlObj.searchParams.get("v"); // Extract the 'v' parameter
      } else if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.substring(1); // Extract the path for shortened URLs
      }
    } catch (error) {
      console.error("Invalid YouTube URL", error);
    }
    return null;
  };
  const videoId = extractVideoId(song_url);

  if (!videoId) {
    return <p>Invalid YouTube URL</p>;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div>
      <iframe
        src={embedUrl}
        width="80%"
        height="315"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="YouTube Video Embed"
        style={{ borderRadius: "8px" }}
      ></iframe>
    </div>
  );
};

export default YoutubeEmbed;
