import React, { useEffect, useRef } from "react";
import { createRoot } from "@wordpress/element";
// import Plyr from "plyr";
import { RawHTML } from "@wordpress/element";
import {
  GiNextButton,
  GiPreviousButton,
  RiExpandDiagonalFill,
  MdCloseFullscreen,
  RiReplay10Line,
  RiForward10Line
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobileRef = useRef(isMobile);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const saveIntervalRef = useRef(null);
  const lastSavedSecondRef = useRef(0);
  const hasResumedRef = useRef(false);
  const doubleTapRef = useRef({ lastTapTime: 0, lastTapSide: null });
  const pendingResumeRef = useRef(
    meta_value?.current_time || 0
  );

  console.log(isMobile, 'isMobile')

  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

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

    const addReplayButton = () => {
      const play = plyrInstance?.elements?.buttons?.play?.[0];
      if (!play) return;
      const replayButton = document.createElement("button");
      replayButton.classList.add("plyr__control");
      replayButton.title = __("Replay 10 seconds", 'acadlix');
      createRoot(replayButton).render(<RiReplay10Line />);
      play.after(replayButton);
      replayButton.addEventListener("click", () => plyrInstance.rewind(10));
    };

    const addForwardButton = () => {
      const play = plyrInstance?.elements?.buttons?.play?.[0];
      if (!play) return;
      const forwardButton = document.createElement("button");
      forwardButton.classList.add("plyr__control");
      forwardButton.title = __("Forward 10 seconds", 'acadlix');
      createRoot(forwardButton).render(<RiForward10Line />);
      play.after(forwardButton);
      forwardButton.addEventListener("click", () => plyrInstance.forward(10));
    };

    const getGestureDirection = (clientX) => {
      const wrapperElement = containerRef.current;
      if (!wrapperElement || typeof clientX !== "number") return null;
      const rect = wrapperElement.getBoundingClientRect();
      const middlePoint = rect.left + rect.width / 2;
      return clientX < middlePoint ? "backward" : "forward";
    };

    const isControlTarget = (target) => {
      if (!target?.closest) return false;
      return Boolean(
        target.closest(
          ".plyr__controls, .plyr__control, .plyr__menu, .plyr__progress, button, input, select, textarea, a"
        )
      );
    };

    const handleGestureSkip = (event) => {
      if (!isMobileRef.current || !playerRef.current || !plyrInstance.playing) {
        return;
      }

      if (isControlTarget(event.target)) {
        return;
      }

      const touchPoint = event.changedTouches?.[0] || event;
      const direction = getGestureDirection(touchPoint?.clientX);

      if (!direction) {
        return;
      }

      const now = Date.now();
      const isDoubleTap =
        doubleTapRef.current.lastTapSide === direction &&
        now - doubleTapRef.current.lastTapTime <= 300;

      if (isDoubleTap) {
        event.preventDefault();
        if (direction === "backward") {
          plyrInstance.rewind(10);
        } else {
          plyrInstance.forward(10);
        }

        doubleTapRef.current = { lastTapTime: 0, lastTapSide: null };
        return;
      }

      doubleTapRef.current = {
        lastTapTime: now,
        lastTapSide: direction,
      };
    };

    const handleDoubleClickSkip = (event) => {
      if (!plyrInstance.playing) {
        return;
      }

      if (isControlTarget(event.target)) {
        return;
      }

      const direction = getGestureDirection(event.clientX);

      if (direction === "backward") {
        plyrInstance.rewind(10);
      } else if (direction === "forward") {
        plyrInstance.forward(10);
      }
    };

    // Consolidated handler for mobile touch events
    const handleTouchStart = (event) => {
      if (!isMobileRef.current) return;
      if (isControlTarget(event.target)) return;

      const touchPoint = event.changedTouches?.[0];
      const direction = getGestureDirection(touchPoint?.clientX);
      if (!direction) return;

      const now = Date.now();
      const lastTap = doubleTapRef.current;

      // Check if it's a double tap (within 300ms on the same side)
      if (lastTap.lastTapSide === direction && now - lastTap.lastTapTime <= 300) {
        event.preventDefault(); // Prevent native zooming or triggers
        if (direction === "backward") {
          plyrInstance.rewind(10);
        } else {
          plyrInstance.forward(10);
        }
        // Reset after registering double tap
        doubleTapRef.current = { lastTapTime: 0, lastTapSide: null };
      } else {
        // Single tap behavior: Toggle control visibility visibility safely
        doubleTapRef.current = { lastTapTime: now, lastTapSide: direction };

        // Let Plyr handle its UI toggle smoothly or execute manual toggle:
        if (plyrInstance.elements.controls) {
          plyrInstance.toggleControls();
        }
      }
    };

    // Desktop double click logic fallback
    const handleDoubleClick = (event) => {
      if (isMobileRef.current || isControlTarget(event.target)) return;
      const direction = getGestureDirection(event.clientX);
      if (direction === "backward") {
        plyrInstance.rewind(10);
      } else if (direction === "forward") {
        plyrInstance.forward(10);
      }
    };

    const addPreviousButton = () => {
      const play = plyrInstance?.elements?.buttons?.play?.[0];
      if (!play) return;
      const previousButton = document.createElement("button");
      previousButton.classList.add("plyr__control");
      if (previousTitle) previousButton.title = previousTitle;
      previousButton.disabled = isFirst;
      createRoot(previousButton).render(<GiPreviousButton />);
      play.after(previousButton);
      previousButton.addEventListener("click", () => {
        if (hasPrev && onClickPrevious) onClickPrevious();
      });
    };

    const addNextButton = () => {
      const play = plyrInstance?.elements?.buttons?.play?.[0];
      if (!play) return;
      const nextButton = document.createElement("button");
      nextButton.classList.add("plyr__control");
      if (nextTitle) nextButton.title = nextTitle;
      nextButton.disabled = isLast;
      createRoot(nextButton).render(<GiNextButton />);
      play.after(nextButton);
      nextButton.addEventListener("click", () => {
        if (hasNext && onClickNext) onClickNext();
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
      if (isMobile) {
        addForwardButton();
        addReplayButton();
      } else {
        if (hasNext) {
          addNextButton();
        }
        if (hasPrev) {
          addPreviousButton();
        }
      }
      if (hasExternalFullscreen) {
        addFullscreenButton();
      }
    };

    const handleReady = (e) => {
      addExtraButtons();
      let duration = plyrInstance.duration;

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
      const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

      if (Math.floor(currentTime) === lastSavedSecondRef.current) return;
      lastSavedSecondRef.current = Math.floor(currentTime);

      updateTimeStatistics(currentTime, duration, progress);
    };

    const handlePlay = () => {
      if (
        !hasResumedRef.current &&
        pendingResumeRef.current > 3 &&
        pendingResumeRef.current < plyrInstance.duration - 3
      ) {
        plyrInstance.currentTime = pendingResumeRef.current;
        hasResumedRef.current = true;
        pendingResumeRef.current = 0;

        setTimeout(() => {
          plyrInstance.currentTime = plyrInstance.currentTime;
        }, 200);
      }

      saveTimeStatistics();
      saveIntervalRef.current = setInterval(() => {
        saveTimeStatistics();
      }, 10000);
    };

    const handlePause = () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
      }
      doubleTapRef.current = { lastTapTime: 0, lastTapSide: null };
      saveTimeStatistics();
    };

    const handleEnded = () => {
      saveTimeStatistics();
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
      }
      if (onEnded) onEnded();
    };

    const handleFullscreenChange = () => {
      if (
        hasExternalFullscreen &&
        document.fullscreenElement === null &&
        props?.watch?.("is_fullscreen")
      ) {
        handleFullScreen();
      }
    };

    plyrInstance.on("ready", handleReady);
    plyrInstance.on("play", handlePlay);
    plyrInstance.on("pause", handlePause);
    plyrInstance.on("ended", handleEnded);

    const wrapper = containerRef.current;
    if (wrapper) {
      wrapper.addEventListener("touchstart", handleTouchStart, { passive: false });
      wrapper.addEventListener("dblclick", handleDoubleClick);
    }

    // const playerElement = playerRef.current;
    // if (playerElement) {
    //   playerElement.addEventListener("touchend", handleGestureSkip, {
    //     passive: false,
    //   });
    //   playerElement.addEventListener("dblclick", handleDoubleClickSkip);
    // }

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

      if (wrapper) {
        wrapper.removeEventListener("touchstart", handleTouchStart);
        wrapper.removeEventListener("dblclick", handleDoubleClick);
      }
      // if (playerElement) {
      //   playerElement.removeEventListener("touchend", handleGestureSkip);
      //   playerElement.removeEventListener("dblclick", handleDoubleClickSkip);
      // }
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
  return <div ref={containerRef} className="acadlix-video-wrapper acadlix-video-player">
    {renderContent()}
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
