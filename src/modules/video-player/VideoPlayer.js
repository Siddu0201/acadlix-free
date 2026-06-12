import React, { useEffect, useRef } from "react";
import { createRoot } from "@wordpress/element";
// import Plyr from "plyr";
import {
  GiNextButton,
  GiPreviousButton,
  RiExpandDiagonalFill,
  MdCloseFullscreen,
  FaPlay
} from "@acadlix/helpers/icons";
import { convertTime } from "@acadlix/helpers/util";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { useMediaQuery, useTheme } from "@mui/material";

const VideoPlayer = ({
  src = '',
  thumbnail = '',
  videoType = '',
  hours = 0,
  minutes = 0,
  seconds = 0,
  meta_value = null,
  controls = [],
  settings = [],
  keyboard = {},
  quality = {},
  youtube = {},
  vimeo = {},
  onUpdateDuration = null,
  isFirst = false,
  isLast = false,
  hasNext = false,
  nextTitle = '',
  hasPrev = false,
  previousTitle = '',
  onClickNext = null,
  onClickPrevious = null,
  hasExternalFullscreen = false,
  onClickFullscreen = null,
  onEnded = null,
  updateTimeStatistics = null,
  ...props
}) => {
  const playerRef = useRef(null);
  const plyrInstanceRef = useRef(null);
  const saveIntervalRef = useRef(null);
  const lastSavedSecondRef = useRef(0);
  const lastMobileTapRef = useRef({
    backward: 0,
    forward: 0,
  });
  const hasResumedRef = useRef(false);
  const pendingResumeRef = useRef(
    meta_value?.current_time || 0
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMobileDoubleTap = (direction) => (event) => {
    // const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)")?.matches;
    if (!isMobile) {
      return;
    }

    const now = Date.now();
    const previousTapTime = lastMobileTapRef.current?.[direction] || 0;
    lastMobileTapRef.current[direction] = now;

    if (now - previousTapTime > 280) {
      return;
    }

    event.preventDefault();

    const player = plyrInstanceRef.current;
    if (!player) {
      return;
    }

    const duration = player.duration || 0;
    const currentTime = player.currentTime || 0;
    const delta = direction === "forward" ? 10 : -10;
    let nextTime = currentTime + delta;

    if (duration > 0) {
      nextTime = Math.min(duration, Math.max(0, nextTime));
    } else {
      nextTime = Math.max(0, nextTime);
    }

    player.currentTime = nextTime;
  };

  const handleCenterPlayPause = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const player = plyrInstanceRef.current;
    if (!player) {
      return;
    }

    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
  };

  const handleMobileControlBarToggle = (event) => {
    // const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)")?.matches;
    if (!isMobile) {
      return;
    }

    const target = event.target;
    if (
      target?.closest?.(".plyr__controls, .plyr__control, .acadlix-center-play-toggle")
    ) {
      return;
    }

    const player = plyrInstanceRef.current;
    const playerContainer = player?.elements?.container;
    if (!player?.toggleControls || !playerContainer) {
      return;
    }

    const isSeekZoneTouch = target?.closest?.(".acadlix-mobile-doubletap-zone");
    const controlsHidden = playerContainer.classList.contains("plyr--hide-controls");

    if (isSeekZoneTouch) {
      if (controlsHidden) {
        player.toggleControls(true);
      }
      return;
    }

    player.toggleControls(controlsHidden);
  };

  useEffect(() => {
    const Plyr = window.Plyr;
    if (!Plyr) {
      console.error('Plyr not loaded');
      return;
    }
    // Initialize Plyr when the component mounts
    const plyrInstance = new Plyr(playerRef.current, {
      controls: [
        "play",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "settings",
        ...controls,
      ],
      fullscreen: {
        enabled: !hasExternalFullscreen,
      },
      settings: ["quality", "speed", ...settings],
      keyboard: {
        focused: true, // Enable keyboard controls only when the player is focused
        global: true, // Allow keyboard controls even when the player is not focused
        ...keyboard,
      },
      quality: {
        default: 720, // Default quality (e.g., 720p)
        options: [1080, 720, 480, 360], // Available quality levels
        forced: true, // Force Plyr to use the quality options provided
        onChange: (quality) => {
          // Handle quality change
        },
        ...quality,
      },
      youtube: {
        noCookie: true,
        rel: 0,
        modestbranding: 1,
        iv_load_policy: 3,
        playsInline: 1,
        disablekb: 1,
        ...youtube,
      },
      vimeo: {
        byline: false,
        portrait: false,
        title: false,
        ...vimeo,
      },
    });
    plyrInstanceRef.current = plyrInstance;


    const updateDuration = (duration = 0) => {
      if (duration > 0) {
        const convertedTime = convertTime(duration);
        const currentHours = Number(hours);
        const currentMinutes = Number(minutes);
        const currentSeconds = Number(seconds);

        if (
          currentHours !== convertedTime?.hours ||
          currentMinutes !== convertedTime?.minutes ||
          currentSeconds !== convertedTime?.seconds
        ) {
          if (onUpdateDuration) {
            onUpdateDuration(convertedTime);
          }
        }
      }
    };


    const fetchVimeoDuration = (plyrInstance) => {
      const vimeoPlayer = plyrInstance.embed;
      if (vimeoPlayer) {
        vimeoPlayer.getDuration().then((duration) => {
          updateDuration(duration);
        });
      }
      return 0;
    };

    const addPreviousButton = () => {
      const play = plyrInstance?.elements?.buttons?.play?.[0];
      const previousButton = document.createElement("button");
      previousButton.classList.add("plyr__control");
      if (previousTitle) {
        previousButton.title = previousTitle;
      }
      previousButton.disabled = isFirst;
      createRoot(previousButton).render(<GiPreviousButton />);

      if (play) {
        play?.after(previousButton);
      }

      previousButton.addEventListener("click", () => {
        if (hasPrev && onClickPrevious) {
          onClickPrevious();
        }
      });
    };

    const addNextButton = () => {
      const play = plyrInstance?.elements?.buttons?.play?.[0];
      const nextButton = document.createElement("button");
      nextButton.classList.add("plyr__control");
      if (nextTitle) {
        nextButton.title = nextTitle;
      }
      nextButton.disabled = isLast;
      createRoot(nextButton).render(<GiNextButton />);

      if (play) {
        play?.after(nextButton);
      }

      nextButton.addEventListener("click", () => {
        if (hasNext && onClickNext) {
          onClickNext();
        }
      });
    };

    const handleFullScreen = () => {
      if (hasExternalFullscreen && onClickFullscreen) {
        onClickFullscreen();
        addFullscreenButton();
      }
    };

    const addFullscreenButton = () => {
      const control = document
        .querySelector("#acadlix-video-player")
        .querySelector(".plyr__controls");
      const fullScreenButton = document.createElement("button");
      fullScreenButton.classList.add(
        "plyr__control",
        "acadlix-course-fullscreen-button"
      );

      if (control) {
        const existingButton = control?.querySelector(
          ".acadlix-course-fullscreen-button"
        );
        if (existingButton) {
          existingButton.remove();
        }
      }

      if (props?.watch("is_fullscreen")) {
        fullScreenButton.title = __("Exit Fullscreen", 'acadlix');
        createRoot(fullScreenButton).render(<MdCloseFullscreen />);
      } else {
        fullScreenButton.title = __("Fullscreen", 'acadlix');
        createRoot(fullScreenButton).render(<RiExpandDiagonalFill />);
      }

      if (control) {
        control.appendChild(fullScreenButton);
      }

      fullScreenButton.addEventListener("click", handleFullScreen);
    };

    const addExtraButtons = () => {
      if (hasNext) {
        addNextButton();
      }
      if (hasPrev) {
        addPreviousButton();
      }
      if (hasExternalFullscreen) {
        addFullscreenButton();
      }
    };

    const handleReady = (e) => {
      addExtraButtons();

      let duration = plyrInstance.duration;

      // // ✅ Resume only once
      // const resumeTime = meta_value?.current_time || 0;
      // if (
      //   !hasResumedRef.current &&
      //   resumeTime > 5 &&
      //   resumeTime < plyrInstance.duration - 5
      // ) {
      //   try {
      //     plyrInstance.currentTime = resumeTime;
      //     hasResumedRef.current = true;
      //   } catch (e) {
      //     console.warn("Resume failed", e);
      //   }
      // }

      if (duration === 0) {
        // Handle case where duration is 0 (e.g., Vimeo videos)
        if (plyrInstance?.isVimeo) {
          fetchVimeoDuration(plyrInstance);
        } else {
          plyrInstance.on("loadedmetadata", () => {
            duration = plyrInstance.duration;
            updateDuration(duration);
          });
        }
      } else {
        updateDuration(duration);
      }
    };

    const saveTimeStatistics = () => {
      if (!updateTimeStatistics) return;

      const currentTime = plyrInstance.currentTime || 0;
      const duration = plyrInstance.duration || 0;

      const progress =
        duration > 0 ? (currentTime / duration) * 100 : 0;

      // prevent duplicate saves
      if (Math.floor(currentTime) === lastSavedSecondRef.current) {
        return;
      }

      lastSavedSecondRef.current = Math.floor(currentTime);

      updateTimeStatistics(
        currentTime,
        duration,
        progress,
      );
    };

    const handlePlay = () => {
      // ✅ Resume ONLY once
      if (
        !hasResumedRef.current &&
        pendingResumeRef.current > 3 &&
        pendingResumeRef.current < plyrInstance.duration - 3 
      ) {
        plyrInstance.currentTime = pendingResumeRef.current;

        hasResumedRef.current = true;
        pendingResumeRef.current = 0;

        // small trick for YouTube stability
        setTimeout(() => {
          plyrInstance.currentTime = plyrInstance.currentTime;
        }, 200);
      }

      // Save immediately when video starts
      saveTimeStatistics();

      // Start interval (every 10 sec)
      saveIntervalRef.current = setInterval(() => {
        saveTimeStatistics();
      }, 10000);
    };

    const handlePause = () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
      }

      // Save once when paused
      saveTimeStatistics();
    };

    const handleEnded = () => {
      saveTimeStatistics();

      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
      }

      if (onEnded) {
        onEnded();
      }
    };

    const handleFullscreenChange = () => {
      if (
        hasExternalFullscreen &&
        document.fullscreenElement === null &&
        props?.watch("is_fullscreen")
      ) {
        handleFullScreen();
      }
    };

    plyrInstance.on("ready", handleReady);
    plyrInstance.on("play", handlePlay);
    plyrInstance.on("pause", handlePause);
    plyrInstance.on("ended", handleEnded);
    plyrInstance.on("ended", handleEnded);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    // Cleanup: Destroy the Plyr instance when the component unmounts
    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
      plyrInstance.off("ready", handleReady);
      plyrInstance.off("play", handlePlay);
      plyrInstance.off("pause", handlePause);
      plyrInstance.off("ended", handleEnded);
      plyrInstance.off("ended", handleEnded);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
      plyrInstance.destroy();
      plyrInstanceRef.current = null;
    };
  }, []);

  const renderContent = () => {
    if (src !== "") {
      switch (videoType) {
        case "html_5":
        case "external_link":
        case "shortcode":
          return (
            <video
              ref={playerRef} // Attach the ref to the video element
              className="plyr-react plyr"
              src={src} // Dynamic video URL
              playsInline
              controls
              poster={thumbnail}
            />
          );
        case "youtube":
          return (
            <div className="plyr__video-embed" ref={playerRef}>
              <iframe
                src={src}
                allow="autoplay; fullscreen; picture-in-picture"
                title="Video player"
              ></iframe>
            </div>
          );
        case "vimeo":
          return (
            <div className="plyr__video-embed" ref={playerRef}>
              <iframe
                src={src}
                allow="autoplay; fullscreen; picture-in-picture"
                title="Video player"
              ></iframe>
            </div>
          );
        // case "embedded":
        //   return (
        //     <>
        //       {/* <RawHTML>
        //       {src}
        //       </RawHTML> */}
        //       {
        //         src?.type === "youtube" ?
        //           <div className="plyr__video-embed" ref={playerRef}>
        //             <iframe
        //               src={src.src}
        //               allow="autoplay; fullscreen; picture-in-picture"
        //               title="Video player"
        //             ></iframe>
        //           </div>
        //           :
        //           <video
        //             ref={playerRef} // Attach the ref to the video element
        //             className="plyr-react plyr"
        //             src={src?.src} // Dynamic video URL
        //             playsInline
        //             controls
        //           // poster={thumbnail}
        //           />
        //       }
        //     </>
        //   );
        default:
          return <></>;
      }
    } else {
      return <></>;
    }
  };
  // console.log('src', src)
  return <div className="acadlix-video-wrapper" onTouchStart={handleMobileControlBarToggle}>
    {renderContent()}
    <button
      type="button"
      className="icon-button player-control-play-pause-icon acadlix-center-play-toggle"
      onClick={handleCenterPlayPause}
      onTouchEnd={handleCenterPlayPause}
      aria-label="Play/Pause"
    >
      <span className="acadlix-center-play-toggle-icon" aria-hidden="true">
        <FaPlay />
      </span>
    </button>
    <div className="acadlix-mobile-doubletap-overlay" aria-hidden="true">
      <button
        type="button"
        className="acadlix-mobile-doubletap-zone acadlix-mobile-doubletap-zone-backward"
        onTouchEnd={handleMobileDoubleTap("backward")}
        tabIndex={-1}
        aria-label="Seek backward 10 seconds"
      ></button>
      <span className="acadlix-mobile-doubletap-gap"></span>
      <button
        type="button"
        className="acadlix-mobile-doubletap-zone acadlix-mobile-doubletap-zone-forward"
        onTouchEnd={handleMobileDoubleTap("forward")}
        tabIndex={-1}
        aria-label="Seek forward 10 seconds"
      ></button>
    </div>
  </div>;
};

VideoPlayer.prototype = {
  src: PropTypes.string,
  thumbnail: PropTypes.string,
  videoType: PropTypes.string,
  hours: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minutes: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  seconds: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  meta_value: PropTypes.any,
  controls: PropTypes.array,
  settings: PropTypes.array,
  keyboard: PropTypes.object,
  quality: PropTypes.object,
  youtube: PropTypes.object,
  vimeo: PropTypes.object,
  onUpdateDuration: PropTypes.func,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  hasNext: PropTypes.bool,
  nextTitle: PropTypes.string,
  hasPrev: PropTypes.bool,
  previousTitle: PropTypes.string,
  onClickNext: PropTypes.func,
  onClickPrevious: PropTypes.func,
  hasExternalFullscreen: PropTypes.bool,
  onClickFullscreen: PropTypes.func,
  onEnded: PropTypes.func,
  updateTimeStatistics: PropTypes.func,
};

export default VideoPlayer;
