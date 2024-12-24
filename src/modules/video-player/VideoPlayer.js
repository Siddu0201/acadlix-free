import React, { useEffect, useRef } from "react";
import { createRoot, createElement } from "@wordpress/element";
import Plyr from "plyr";
import parse from "html-react-parser";
import { GiNextButton, GiPreviousButton } from "react-icons/gi";
import { RiExpandDiagonalFill } from "react-icons/ri";
import { MdCloseFullscreen } from "react-icons/md";
import { convertTime } from "../../helpers/util";

const VideoPlayer = ({
    src = '',
    videoType = '',
    hours = 0,
    minutes = 0,
    seconds = 0,
    controls = [],
    settings = [],
    keyboard = {},
    quality = {},
    youtube = {},
    vimeo = {},
    onUpdateDuration = () => { },
    isFirst = false,
    isLast = false,
    hasNext = false,
    nextTitle = '',
    hasPrev = false,
    previousTitle = '',
    onClickNext = () => { },
    onClickPrevious = () => { },
    hasExternalFullscreen = false,
    onClickFullscreen = () => { },
    onEnded = () => { },
    ...props
}) => {
    const playerRef = useRef(null);

    useEffect(() => {
        // Initialize Plyr when the component mounts
        const plyrInstance = new Plyr(playerRef.current, {
            controls: [
                ...controls,
                "play",
                "progress",
                "current-time",
                "duration",
                "mute",
                "volume",
                "settings",
            ],
            fullscreen: {
                enabled: !hasExternalFullscreen,
            },
            settings: [...settings, "quality", "speed"],
            keyboard: {
                ...keyboard,
                focused: true, // Enable keyboard controls only when the player is focused
                global: true, // Allow keyboard controls even when the player is not focused
            },
            quality: {
                ...quality,
                default: 720, // Default quality (e.g., 720p)
                options: [1080, 720, 480, 360], // Available quality levels
                forced: true, // Force Plyr to use the quality options provided
                onChange: (quality) => {
                    // Handle quality change
                },
            },
            youtube: {
                ...youtube,
                noCookie: true,
                rel: 0,
                modestbranding: 1,
            },
            vimeo: {
                ...vimeo,
                byline: false,
                portrait: false,
                title: false,
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
                    if (onUpdateDuration && typeof onUpdateDuration === "function") {
                        onUpdateDuration(convertedTime);
                    }
                }
            }
        };


        const fetchVimeoDuration = (plyrInstance) => {
            const vimeoPlayer = plyrInstance.embed;
            if (vimeoPlayer && typeof vimeoPlayer.getDuration === "function") {
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
                if (hasPrev && onClickPrevious && typeof onClickPrevious === "function") {
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
                if (hasNext && onClickNext && typeof onClickNext === "function") {
                    onClickNext();
                }
            });
        };

        const handleFullScreen = () => {
            if (hasExternalFullscreen && onClickFullscreen && typeof onClickFullscreen === "function") {
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

        const handleEnded = () => {
            if (onEnded && typeof onEnded === "function") {
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
                        />
                    );
                case "youtube":
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
                case "embedded":
                    return (
                        <div className="plyr__video-embed" ref={playerRef}>
                            {parse(src)}
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

export default VideoPlayer;
