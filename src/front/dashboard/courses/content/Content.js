import { Box, IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import AppFront from "../../../AppFront";
// import VideoPlayer from "../courseComponents/VideoPlayer";
import VideoPlyr from "../courseComponents/VideoPlyr";

const Content = (props) => {
  const navigate = useNavigate();
  const content = props
    ?.watch("sections")
    ?.find((s) => s?.active)
    ?.content?.find((c) => c?.id == props?.courseSectionContentId);

  return (
    <>
      {props?.watch("sections")?.length > 0 &&
        props?.watch("sections")?.map((element, index, arr) =>
          element?.content?.map((c, c_index, c_arr) => (
            <React.Fragment key={c_index}>
              <Box
                sx={{
                  display: content?.i - 1 === c?.i ? "" : "none",
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
                  display: content?.i + 1 === c?.i ? "" : "none",
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
            ?.map((s, index) =>
              s?.content?.map((c, c_index) => (
                <React.Fragment key={c?.id}>
                  {c?.id === content?.id && (
                    <>
                      {c?.type === "lesson" ? (
                        c?.lesson_type === "video" ? (
                          <LessonVideoContent
                            {...props}
                            c={c}
                            c_index={c_index}
                            s={s}
                            index={index}
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

  return <VideoPlyr {...props} src={src} />;
};

const LessonTextContent = (props) => {
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
        },
        maxHeight: {
          xs: "22rem",
          sm: "24rem",
        },
        overflowY: "auto",
      }}
    >
      {parse(props?.c?.content)}
    </Box>
  );
};

const QuizContent = (props) => {
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
        },
        maxHeight: {
          xs: "22rem",
          sm: "24rem",
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
