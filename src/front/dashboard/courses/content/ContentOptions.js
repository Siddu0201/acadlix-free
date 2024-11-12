import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import React from "react";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import {
  PostMarkAsComplete,
  PostMarkAsIncomplete,
} from "../../../../requests/front/FrontDashboardRequest";

const ContentOptions = (props) => {
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
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
  const completeMutation = PostMarkAsComplete();
  const incompleteMutation = PostMarkAsIncomplete();

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        height: "auto",
        width: "100%",
        borderTop: `1px solid #d1d7dc`,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 1,
      }}
    >
      {props?.watch("sections")?.map((s, index) =>
        s?.content?.map((c, c_index) => (
          <React.Fragment key={c?.id}>
            {c?.is_completed ? (
              <Button
                onClick={() => {
                  incompleteMutation?.mutate(
                    {
                      order_item_id: props?.watch("order_item_id"),
                      course_section_content_id: c?.id,
                      user_id: acadlixOptions?.user?.ID,
                    },
                    {
                      onSuccess: (data) => {
                        if (data?.data?.success) {
                          props?.setValue(
                            `sections.${index}.content.${c_index}.is_completed`,
                            false,
                            { shouldDirty: true }
                          );
                        }
                      },
                    }
                  );
                }}
                variant="contained"
                color="error"
                size="small"
                sx={{
                  height: 28,
                  display: c?.is_active ? "" : "none",
                }}
              >
                {incompleteMutation?.isPending ? (
                  <CircularProgress size={15} color="inherit" />
                ) : (
                  "Mark as incomplete"
                )}
              </Button>
            ) : (
              <Button
                key={c_index}
                onClick={() => {
                  completeMutation?.mutate(
                    {
                      order_item_id: props?.watch("order_item_id"),
                      course_section_content_id: c?.id,
                      user_id: acadlixOptions?.user?.ID,
                    },
                    {
                      onSuccess: (data) => {
                        if (data?.data?.success) {
                          props?.setValue(
                            `sections.${index}.content.${c_index}.is_completed`,
                            true,
                            { shouldDirty: true }
                          );
                          const content = props
                            ?.watch("sections")
                            ?.find((s) =>
                              s?.content?.find((co) => co?.i == c?.i + 1)
                            )
                            ?.content?.find((co) => co?.i == c?.i + 1);
                          if (content) {
                            props?.handleNavigate(content?.id);
                          }
                        }
                      },
                    }
                  );
                }}
                variant="contained"
                size="small"
                sx={{
                  height: 28,
                  display: c?.is_active ? "" : "none",
                }}
              >
                {completeMutation?.isPending ? (
                  <CircularProgress size={15} color="inherit" />
                ) : (
                  "Mark as complete"
                )}
              </Button>
            )}
          </React.Fragment>
        ))
      )}
      {isFullScreen ? (
        <IconButton
          onClick={() => {
            setIsFullScreen(!isFullScreen);

            if (document?.fullscreenElement) {
              if (document?.exitFullscreen) {
                document?.exitFullscreen();
              } else if (document?.mozCancelFullScreen) {
                document?.mozCancelFullScreen(); // Firefox
              } else if (document?.webkitExitFullscreen) {
                document?.webkitExitFullscreen(); // Safari
              } else if (document?.msExitFullscreen) {
                document?.msExitFullscreen(); // IE/Edge
              }
            }
          }}
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
          <AiOutlineFullscreenExit />
        </IconButton>
      ) : (
        <IconButton
          onClick={(e) => {
            let elem = document.getElementById("acadlix_course_content");
            setIsFullScreen(!isFullScreen);
            if (elem?.requestFullscreen) {
              elem?.requestFullscreen();
            } else if (elem?.webkitRequestFullscreen) {
              /* Safari */
              elem?.webkitRequestFullscreen();
            } else if (elem?.msRequestFullscreen) {
              /* IE11 */
              elem?.msRequestFullscreen();
            }
          }}
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
          <AiOutlineFullscreen />
        </IconButton>
      )}
    </Box>
  );
};

export default ContentOptions;
