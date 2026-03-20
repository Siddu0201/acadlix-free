import { Box } from '@mui/material'
import React from 'react'
import { __, sprintf } from "@wordpress/i18n";

const ContentLocked = (props) => {
  const getType = () => {
    switch (props?.c?.type) {
      case "lesson":
        return __("lesson", "acadlix");
      case "assignment":
        return __("assignment", "acadlix");
      case "quiz":
        return __("quiz", "acadlix");
      case "zoom":
        return __("zoom meeting", "acadlix");
      default:
        return props?.c?.type;
    }
  };

  return (
    <Box
      sx={{
        paddingX: {
          xs: 1,
          sm: 10,
        },
        paddingY: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: {
          xs: props?.watch("is_fullscreen") ? "100%" : "80vh",
          sm: props?.watch("is_fullscreen") ? "100%" : "80vh",
          xl: props?.watch("is_fullscreen") ? "100%" : "80vh",
        },
        maxHeight: {
          xs: "80vh",
          sm: "80vh",
          xl: "80vh",
        },
        overflowY: "auto",
      }}
    >
      {sprintf(
        /* translators: %s is replaced with content type (lesson, assignment, quiz, zoom meeting) */
        __("You have already completed this %s.", "acadlix"),
        getType()
      )}
    </Box>
  )
}

export default ContentLocked