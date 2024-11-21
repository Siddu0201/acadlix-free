import React, { useEffect, useRef } from "react";
import Plyr from "plyr";
import { convertTime } from "../../../../helpers/util";
import parse from "html-react-parser";
import { PostUpdateLessonTime } from "../../../../requests/front/FrontDashboardRequest";
import { GiNextButton, GiPreviousButton } from "react-icons/gi";
import { createRoot } from "react-dom/client";
import { RiExpandDiagonalFill } from "react-icons/ri";
import { MdCloseFullscreen } from "react-icons/md";

const VideoPlyr = (props) => {
  const content = props?.watch(
    `sections.${props?.index}.content.${props?.c_index}`
  );
  const playerRef = useRef(null);

  const updateTimeMutation = PostUpdateLessonTime();
  useEffect(() => {
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
      ],
      fullscreen: {
        enabled: false,
      },
      settings: ["quality", "speed"],
      keyboard: {
        focused: true, // Enable keyboard controls only when the player is focused
        global: true, // Allow keyboard controls even when the player is not focused
      },
      quality: {
        default: 720, // Default quality (e.g., 720p)
        options: [1080, 720, 480, 360], // Available quality levels
        forced: true, // Force Plyr to use the quality options provided
        onChange: (quality) => {
          // console.log(`Quality changed to: ${quality}p`);
        },
      },
      youtube: {
        noCookie: true,
        rel: 0,
        modestbranding: 1,
      },
      vimeo: {
        byline: false,
        portrait: false,
        title: false,
      },
    });

    const handleDuration = (duration = 0) => {
      if (duration > 0) {
        const { hours, minutes, seconds } = convertTime(duration);
        if (
          Number(props?.c?.hours) !== hours ||
          Number(props?.c?.minutes) !== minutes ||
          Number(props?.c?.seconds) !== seconds
        ) {
          updateTimeMutation?.mutate(
            {
              lesson_id: props?.c?.content_type_id,
              hours: hours,
              minutes: minutes,
              seconds: seconds,
            },
            {
              onSuccess: (data) => {
                if (data?.data?.success && data?.data?.lesson) {
                  props?.setValue(
                    `sections.${props?.index}.content.${props?.c_index}.hours`,
                    data?.data?.lesson?.hours > 0
                      ? data?.data?.lesson?.hours < 10
                        ? `0${data?.data?.lesson?.hours}`
                        : String(data?.data?.lesson?.hours)
                      : "00",
                    { shouldDirty: true }
                  );
                  props?.setValue(
                    `sections.${props?.index}.content.${props?.c_index}.minutes`,
                    data?.data?.lesson?.minutes > 0
                      ? data?.data?.lesson?.minutes < 10
                        ? `0${data?.data?.lesson?.minutes}`
                        : String(data?.data?.lesson?.minutes)
                      : "00",
                    { shouldDirty: true }
                  );
                  props?.setValue(
                    `sections.${props?.index}.content.${props?.c_index}.seconds`,
                    data?.data?.lesson?.seconds > 0
                      ? data?.data?.lesson?.seconds < 10
                        ? `0${data?.data?.lesson?.seconds}`
                        : String(data?.data?.lesson?.seconds)
                      : "00",
                    { shouldDirty: true }
                  );
                }
              },
            }
          );
        }
      }
    };

    const fetchVimeoDuration = (plyrInstance) => {
      const vimeoPlayer = plyrInstance.embed;
      if (vimeoPlayer && typeof vimeoPlayer.getDuration === "function") {
        vimeoPlayer.getDuration().then((duration) => {
          handleDuration(duration);
        });
      }
      return 0;
    };

    const handlePrevious = () => {
      if (!props?.first) {
        const previousContent = props
          ?.watch("sections")
          ?.find((s) => s?.content?.find((c) => c?.i === content?.i - 1))
          ?.content?.find((c) => c?.i === content?.i - 1);

        if (previousContent) {
          props?.handleNavigate(previousContent?.id);
        }
      }
    };

    const addPreviousButton = () => {
      const play = plyrInstance?.elements?.buttons?.play?.[0];
      const previousButton = document.createElement("button");
      previousButton.classList.add("plyr__control");
      previousButton.title = "Previous Button";
      previousButton.disabled = props?.first;
      createRoot(previousButton).render(<GiPreviousButton />);

      if (play) {
        play?.after(previousButton);
      }

      previousButton.addEventListener("click", handlePrevious);
    };

    const handleNext = () => {
      if (!props?.last) {
        const nextContent = props
          ?.watch("sections")
          ?.find((s) => s?.content?.find((c) => c?.i === content?.i + 1))
          ?.content?.find((c) => c?.i === content?.i + 1);

        if (nextContent) {
          props?.handleNavigate(nextContent?.id);
        }
      }
    };

    const addNextButton = () => {
      const play = plyrInstance?.elements?.buttons?.play?.[0];
      const nextButton = document.createElement("button");
      nextButton.classList.add("plyr__control");
      nextButton.title = "Next";
      nextButton.disabled = props?.last;
      createRoot(nextButton).render(<GiNextButton />);

      if (play) {
        play?.after(nextButton);
      }

      nextButton.addEventListener("click", handleNext);
    };

    const handleFullScreen = () => {
      props?.handleFullScreen();
      addFullscreenButton();
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
        fullScreenButton.title = "Exit Fullscreeen";
        createRoot(fullScreenButton).render(<MdCloseFullscreen />);
      } else {
        fullScreenButton.title = "Fullscreeen";
        createRoot(fullScreenButton).render(<RiExpandDiagonalFill />);
      }

      if (control) {
        control.appendChild(fullScreenButton);
      }

      fullScreenButton.addEventListener("click", handleFullScreen);
    };

    const handleReady = (e) => {
      addNextButton();
      addPreviousButton();
      addFullscreenButton();

      let duration = plyrInstance.duration;
      if (duration === 0) {
        // Handle case where duration is 0 (e.g., Vimeo videos)
        if (plyrInstance?.isVimeo) {
          fetchVimeoDuration(plyrInstance);
        } else {
          plyrInstance.on("loadedmetadata", () => {
            duration = plyrInstance.duration;
            handleDuration(duration);
          });
        }
      } else {
        handleDuration(duration);
      }
    };

    const handleEnded = () => {
      props?.handleComplete(props?.c?.id, props?.index, props?.c_index, props?.c?.i);
    }

    const handleFullscreenChange = () => {
      if (document.fullscreenElement === null) {
        handleFullScreen();
      }
    };

    plyrInstance.on("ready", handleReady);
    plyrInstance.on("ended", handleEnded);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    // Cleanup: Destroy the Plyr instance when the component unmounts
    return () => {
      plyrInstance.off("ready", handleReady);
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
    };
  }, []);

  const renderContent = () => {
    if (props?.src !== "") {
      switch (props?.c?.video?.video_type) {
        case "html_5":
        case "external_link":
        case "shortcode":
          return (
            <video
              ref={playerRef} // Attach the ref to the video element
              className="plyr-react plyr"
              src={props?.src} // Dynamic video URL
              playsInline
              controls
            />
          );
        case "youtube":
        case "vimeo":
          return (
            <div className="plyr__video-embed" ref={playerRef}>
              <iframe
                src={props?.src}
                allow="autoplay; fullscreen; picture-in-picture"
                title="Video player"
              ></iframe>
            </div>
          );
        case "embedded":
          return (
            <div className="plyr__video-embed" ref={playerRef}>
              {parse(props?.src)}
            </div>
          );
        default:
          return <></>;
      }
    } else {
      return <></>;
    }
  };

  return <div>{renderContent()}</div>;
};

export default VideoPlyr;
