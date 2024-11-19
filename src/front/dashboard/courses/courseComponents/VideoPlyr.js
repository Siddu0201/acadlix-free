import React, { useEffect, useRef } from "react";
import Plyr from "plyr";
import { convertTime } from "../../../../helpers/util";
import parse from "html-react-parser";
import { PostUpdateLessonTime } from "../../../../requests/front/FrontDashboardRequest";

const VideoPlyr = (props) => {
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
        "fullscreen",
      ],
      settings: ["quality", "speed"],
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
        } else {
          console.log("time matched");
        }
      }
    };

    const handleReady = (e) => {
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

    const fetchVimeoDuration = (plyrInstance) => {
      const vimeoPlayer = plyrInstance.embed;
      if (vimeoPlayer && typeof vimeoPlayer.getDuration === "function") {
        vimeoPlayer.getDuration().then((duration) => {
          handleDuration(duration);
        });
      }
      return 0;
    };

    const handleMetaData = (e) => {
      // console?.log(e?.detail?.plyr?.duration);
    };

    plyrInstance.on("ready", handleReady);
    plyrInstance.on("loadedmetadata", handleMetaData);

    // Cleanup: Destroy the Plyr instance when the component unmounts
    return () => {
      plyrInstance.off("ready", handleReady);
      plyrInstance.off("loadedmetadata", handleMetaData);
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
                allowFullScreen
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
