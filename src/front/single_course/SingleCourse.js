import { Box } from '@mui/material';
import React from 'react'
import VideoPlayer from '../../modules/video-player/VideoPlayer';
import {RawHTML} from '@wordpress/element';
import { getVimeoVideoId, getYouTubeVideoId } from '../../helpers/util';

const SingleCourse = (props) => {
  return (
    <Box>
      {
        props?.c?.type === "lesson"
          ?
          props?.c?.lesson_type === "video"
            ?
            <LessonVideoPreview {...props} />
            :
            <LessonTextPreview {...props} />
          :
          <QuizPreview {...props} />
      }
    </Box>
  )
}

export default SingleCourse

const LessonVideoPreview = (props) => {
  let src = "";
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
      <VideoPlayer
        src={src}
        thumbnail={props?.c?.video?.video_thumbnail}
        controls={["fullscreen"]}
        videoType={props?.c?.video?.video_type}
        hasNext={false}
        hasPrev={false}
        hasExternalFullscreen={false}
        {...props}
      />
    </Box>
  )

}

const LessonTextPreview = (props) => {
  return (
      <RawHTML>
        {props?.c?.content}
      </RawHTML>
  )
}


const QuizPreview = (props) => {

}
