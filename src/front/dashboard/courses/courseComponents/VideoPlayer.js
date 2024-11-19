import React from "react";
import videojs from "video.js";
// import "@devmobiliza/videojs-vimeo";  
import "video.js/dist/video-js.css";
import "videojs-youtube";
import "videojs-vimeo";

function VideoPlayer(props) {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const { options, onReady } = props;

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");
      videoElement.style.height = "100%";
      videoElement.style.width = "100%";

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      console.log(videojs.getComponent("Tech"));
      const player = (playerRef.current = videojs(videoElement, options, () => {
        console.log("player is ready");
        onReady && onReady(player);
      }));

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div
      data-vjs-player
      style={{
        height: "inherit",
      }}
    >
      <div
        ref={videoRef}
        style={{
          height: "inherit",
        }}
      />
    </div>
  );
}

export default VideoPlayer;
