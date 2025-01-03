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
        title="YouTube Video Embed"
        src={embedUrl}
        style={{
          aspectRatio: "16 / 9",
          width: "100%",
          borderRadius: "8px",
          border: "0",
          allow: "autoplay; encrypted-media",
          allowFullScreen: true,
          title: "YouTube Video Embed",
        }}
      ></iframe>
    </div>
  );
};

export default YoutubeEmbed;
