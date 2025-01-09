import React, { useEffect, useRef } from "react";
import { createRoot, createElement } from "@wordpress/element";
import Plyr from "plyr";
import parse from "html-react-parser";
import { GiNextButton, GiPreviousButton, RiExpandDiagonalFill, MdCloseFullscreen } from "../../helpers/icons";
import { convertTime } from "../../helpers/util";
import PropTypes from "prop-types";

const VideoPlayer = ({
    src= '',
    thumbnail= '',
    videoType= '',
    hours= 0,
    minutes= 0,
    seconds= 0,
    controls= [],
    settings= [],
    keyboard= {},
    quality= {},
    youtube= {},
    vimeo= {},
    onUpdateDuration= null,
    isFirst= false,
    isLast= false,
    hasNext= false,
    nextTitle= '',
    hasPrev= false,
    previousTitle= '',
    onClickNext= null,
    onClickPrevious= null,
    hasExternalFullscreen= false,
    onClickFullscreen= null,
    onEnded= null,
    ...props
}) => {
    const playerRef = useRef(null);

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
                            poster={thumbnail}
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

VideoPlayer.prototype = {
    src: PropTypes.string,
    thumbnail: PropTypes.string,
    videoType: PropTypes.string,
    hours: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    minutes: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    seconds: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
};

export default VideoPlayer;
