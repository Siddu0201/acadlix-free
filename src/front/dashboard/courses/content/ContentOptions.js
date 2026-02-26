import { Box, Button, IconButton, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { AiOutlineFullscreen, AiOutlineFullscreenExit, FaCaretSquareDown } from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";

const ContentOptions = (props) => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleScrollToContent = () => {
    const contentElement = document.getElementById("acadlix_course_content");
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {!(
        props?.active_content?.type === "lesson" &&
        props?.active_content?.lesson_type === "video"
      ) && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: {
                xs: "39px",
                sm: "38px",
                md: "41px",
              },
              width: "100%",
              borderTop: `1px solid #d1d7dc`,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 2,
            }}
          >
            {
              isMobile && acadlixOptions?.settings?.acadlix_enable_course_content_scroll_button == "yes" && (
                <IconButton
                  onClick={handleScrollToContent}
                  sx={{
                    backgroundColor: "transparent",
                    borderRadius: 0,
                    boxShadow: "none",
                    color: "inherit",
                    ":hover, :focus": {
                      backgroundColor: "transparent",
                      borderRadius: 0,
                      boxShadow: "none",
                      color: "inherit",
                    },
                  }}
                >
                  <FaCaretSquareDown />
                </IconButton>
              )
            }
            {props?.watch("sections")?.map((s, index) =>
              s?.content?.map((c, c_index) => (
                <React.Fragment key={c?.id}>
                  {
                    c?.type !== "assignment" && (
                      <>
                        {c?.is_completed ? (
                          <Button
                            onClick={props?.handleIncomplete.bind(
                              this,
                              c?.id,
                              index,
                              c_index
                            )}
                            variant="contained"
                            color="error"
                            size="small"
                            sx={{
                              display: c?.is_active ? "" : "none",
                              "&:hover,&:focus": {
                                backgroundColor: (theme) => theme.palette.error.dark,
                              },
                            }}
                          >
                            {__("Mark as incomplete", "acadlix")}
                          </Button>
                        ) : (
                          <Button
                            key={c_index}
                            onClick={props?.handleComplete.bind(
                              this,
                              c?.id,
                              index,
                              c_index,
                              c?.i
                            )}
                            variant="contained"
                            size="small"
                            sx={{
                              display: c?.is_active ? "" : "none",
                            }}
                          >
                            {__("Mark as complete", "acadlix")}
                          </Button>
                        )}
                      </>
                    )
                  }
                </React.Fragment>
              ))
            )}
            {(props?.active_content?.type === "quiz" ||
              props?.active_content?.type === "assignment" ||
              (props?.active_content?.lesson_type !== "video" &&
                props?.active_content?.type === "lesson")) && (
                <>
                  <IconButton
                    onClick={props?.handleFullScreen}
                    sx={{
                      backgroundColor: "transparent",
                      borderRadius: 0,
                      boxShadow: "none",
                      color: "inherit",
                      ":hover, :focus": {
                        backgroundColor: "transparent",
                        borderRadius: 0,
                        boxShadow: "none",
                        color: "inherit",
                      },
                    }}
                  >
                    {props?.watch("is_fullscreen") ? (
                      <AiOutlineFullscreenExit />
                    ) : (
                      <AiOutlineFullscreen />
                    )}
                  </IconButton>
                </>
              )}
          </Box>
        )}
    </>
  );
};

export default ContentOptions;
