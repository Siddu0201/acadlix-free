import { Box, IconButton, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import parse from "html-react-parser";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import AppFront from "../../../AppFront";
import VideoPlyr from "../courseComponents/VideoPlyr";

const Content = (props) => {
  useEffect(() => {
    const targetElement = document.getElementById(
      `acadlix_course_listitem_${props?.courseSectionContentId}`
    );
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth", // Smooth scroll animation
        block: "start", // Align the element in the center of the viewport
      });
    }
  }, []);
  return (
    <>
      {props?.watch("sections")?.length > 0 &&
        props?.watch("sections")?.map((element, index, arr) =>
          element?.content?.map((c, c_index, c_arr) => (
            <React.Fragment key={c_index}>
              <Box
                sx={{
                  display: props?.active_content?.i - 1 === c?.i ? "" : "none",
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  zIndex: 10,
                }}
              >
                <Tooltip title={c?.title} placement="right" arrow>
                  <IconButton
                    onClick={props?.handleNavigate.bind(this, c?.id)}
                    sx={{
                      borderRadius: 0,
                      paddingX: 1,
                      paddingY: 3,
                      color: "white",
                      backgroundColor: "black",
                      opacity: "0.2",
                      ":hover, :focus": {
                        color: "white",
                        backgroundColor: "black",
                        opacity: "1",
                      },
                    }}
                  >
                    <FaAngleLeft />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box
                sx={{
                  display: props?.active_content?.i + 1 === c?.i ? "" : "none",
                  position: "absolute",
                  top: "50%",
                  right: 0,
                  zIndex: 10,
                }}
              >
                <Tooltip title={c?.title} placement="left" arrow>
                  <IconButton
                    onClick={props?.handleNavigate.bind(this, c?.id)}
                    sx={{
                      borderRadius: 0,
                      paddingX: 1,
                      paddingY: 3,
                      color: "white",
                      backgroundColor: "black",
                      opacity: "0.2",
                      opacity: "0.2",
                      ":hover, :focus": {
                        color: "white",
                        backgroundColor: "black",
                        opacity: "1",
                      },
                    }}
                  >
                    <FaAngleRight />
                  </IconButton>
                </Tooltip>
              </Box>
            </React.Fragment>
          ))
        )}
      <Box>
        {props?.watch("sections")?.length > 0 &&
          props
            ?.watch("sections")
            ?.map((s, index, s_arr) =>
              s?.content?.map((c, c_index, c_arr) => (
                <React.Fragment key={c?.id}>
                  {c?.id === props?.active_content?.id && (
                    <>
                      {c?.type === "lesson" ? (
                        c?.lesson_type === "video" ? (
                          <LessonVideoContent
                            {...props}
                            c={c}
                            c_index={c_index}
                            s={s}
                            index={index}
                            first={index === 0 && c_index === 0}
                            last={
                              index === s_arr?.length - 1 &&
                              c_index === c_arr?.length - 1
                            }
                          />
                        ) : (
                          <LessonTextContent
                            {...props}
                            c={c}
                            c_index={c_index}
                            s={s}
                            index={index}
                          />
                        )
                      ) : (
                        <QuizContent
                          {...props}
                          c={c}
                          c_index={c_index}
                          s={s}
                          index={index}
                        />
                      )}
                    </>
                  )}
                </React.Fragment>
              ))
            )}
      </Box>
    </>
  );
};

export default Content;

const LessonVideoContent = (props) => {
  let src = "";

  // Function to extract YouTube video ID
  const getYouTubeVideoId = (url = "") => {
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  };

  // Function to extract Vimeo video ID
  const getVimeoVideoId = (url = "") => {
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
    const match = url.match(vimeoRegex);
    return match ? match[1] : null;
  };

  switch (props?.c?.video?.video_type) {
    case "html_5":
      src = props?.c?.video?.video_data?.html_5;
      break;
    case "youtube":
      src =
        props?.c?.video?.video_data?.youtube !== ""
          ? `https://www.youtube.com/embed/${getYouTubeVideoId(
              props?.c?.video?.video_data?.youtube
            )}`
          : "";
      break;
    case "vimeo":
      src =
        props?.c?.video?.video_data?.vimeo !== ""
          ? `https://player.vimeo.com/video/${getVimeoVideoId(
              props?.c?.video?.video_data?.vimeo
            )}`
          : "";
      break;
    case "external_link":
      src = props?.c?.video?.video_data?.external_link;
      break;
    case "embedded":
      src = props?.c?.video?.video_data?.embedded;
      break;
    case "shortcode":
      if (props?.c?.video?.video_data?.shortcode !== "") {
        const parseShortcode = window?.wp?.shortcode?.next(
          "video",
          props?.c?.video?.video_data?.shortcode
        );
        let attribute = {};
        if (parseShortcode) {
          const { attrs } = parseShortcode?.shortcode;
          attribute = attrs?.named;
        }
        src = attribute?.mp4;
      } else {
        src = "";
      }
      break;
    default:
      src = "";
  }

  return (
    <Box id="acadlix-video-player">
      <VideoPlyr {...props} src={src} />
    </Box>
  );
};

const LessonTextContent = (props) => {
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      props?.setValue("is_fullscreen", !!document.fullscreenElement, {
        shouldDirty: true,
      });
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
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
    };
  }, []);
  return (
    <Box
      sx={{
        paddingX: {
          xs: 1,
          sm: 20,
        },
        paddingY: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: {
          xs: props?.watch("is_fullscreen") ? "100%" : "22rem",
          sm: props?.watch("is_fullscreen") ? "100%" : "24rem",
          xl: props?.watch("is_fullscreen") ? "100%" : "28rem",
        },
        maxHeight: {
          xs: "22rem",
          sm: "24rem",
          xl: "28rem",
        },
        overflowY: "auto",
      }}
    >
      {parse(props?.c?.content)}
    </Box>
  );
};

const QuizContent = (props) => {
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      props?.setValue("is_fullscreen", !!document.fullscreenElement, {
        shouldDirty: true,
      });
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
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
    };
  }, []);
  return (
    <Box
      sx={{
        paddingX: {
          xs: 1,
          sm: 20,
        },
        paddingY: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: {
          xs: props?.watch("is_fullscreen") ? "100%" : "22rem",
          sm: props?.watch("is_fullscreen") ? "100%" : "24rem",
          xl: props?.watch("is_fullscreen") ? "100%" : "28rem",
        },
        maxHeight: {
          xs: "22rem",
          sm: "24rem",
          xl: "28rem",
        },
        overflowY: "auto",
      }}
    >
      <AppFront
        quiz_id={props?.c?.content_type_id}
        start={false}
        advance={false}
      />
    </Box>
  );
};
