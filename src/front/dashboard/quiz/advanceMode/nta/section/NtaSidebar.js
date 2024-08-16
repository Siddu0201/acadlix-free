import { Box, Drawer, IconButton } from "@mui/material";
import React from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import NtaSidebarStatusTypes from "./NtaSidebarStatusTypes";
import NtaSidebarQuestionOverview from "./NtaSidebarQuestionOverview";

const NtaSidebar = (props) => {
  const [remainingTop, setRemainingTop] = React.useState(0);

  const idList = [
    "acadlix_nta_top_home",
    "acadlix_nta_logo",
    "acadlix_nta_user",
  ];

  React.useLayoutEffect(() => {
    let top = 0;
    idList.forEach((a, i) => {
      top += document.getElementById(a)?.clientHeight ?? 0;
    });
    if (acadlixOptions?.is_admin_bar_showing) {
      top += props?.isDesktop ? 32 : 46;
    }
    setRemainingTop(top);
  },[]);

  return (
    <Box>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="end"
        onClick={props?.handleToggle}
        sx={{
          display: {
            md: "block",
            xs: "none",
          },
          position: "fixed",
          right: {
            md: props?.isOpen ? `calc(33.33% + 40px)` : "40px",
            xs: 0
          },
          zIndex: 999,
          top: "60%",
          borderRadius: 0,
          backgroundColor: "#000",
          borderColor: "#000",
          color: "#fff",
          width: "20px",
          margin: "0px !important",
          padding: "10px 0px",
          "&:hover": {
            backgroundColor: "#000",
          },
        }}
      >
        {props?.isOpen ? (
          <MdKeyboardArrowRight
            style={{
              width: "22px",
              fontWeight: "900",
            }}
          />
        ) : (
          <MdKeyboardArrowLeft
            style={{
              width: "22px",
              fontWeight: "900",
            }}
          />
        )}
      </IconButton>
      <Drawer
        sx={{
          width: "33.33%",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: "33.33%",
            top: remainingTop,
            right: {
              md: "40px",
              xs: 0,
            },
            backgroundColor: props?.colorCode?.sidebar_background,
            border: "none",
            paddingX: 4,
          },
        }}
        anchor="right"
        open={props?.isOpen}
        variant="persistent"
        onClose={props?.handleToggle}
        PaperProps={{
          id: "acadlix_quiz_sidebar",
        }}
      >
        <Box>
          {props?.watch("subjects")?.length > 0 &&
            props?.watch("subjects")?.map((s, s_index) => (
              <React.Fragment key={s_index}>
                <NtaSidebarStatusTypes s_index={s_index} {...s} {...props} />
                <NtaSidebarQuestionOverview
                  s_index={s_index}
                  {...s}
                  {...props}
                />
              </React.Fragment>
            ))}
        </Box>
      </Drawer>
    </Box>
  );
};

export default NtaSidebar;
