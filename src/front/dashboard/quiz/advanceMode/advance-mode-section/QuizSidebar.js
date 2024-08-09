import {
  Avatar,
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Answered from "../answer-type-buttons/Answered";
import Marked from "../answer-type-buttons/Marked";
import NotVisited from "../answer-type-buttons/NotVisited";
import MarkedAndAnswered from "../answer-type-buttons/MarkedAndAnswered";
import NotAnswered from "../answer-type-buttons/NotAnswered";
import QuizSidebarUser from "./QuizSidebarUser";
import QuizSidebarStatusTypes from "./QuizSidebarStatusTypes";
import QuizSidebarSection from "./QuizSidebarSection";
import QuizSidebarQuestionOverview from "./QuizSidebarQuestionOverview";
import QuizSidebarSubmit from "./QuizSidebarSubmit";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const QuizSidebar = (props) => {
  const [remainingHeight, setRemainingHeight] = React.useState(0);
  const [remainingTop, setRemainingTop] = React.useState(0);

  const idList = [
    "acadlix_quiz_logo_and_title",
    "acadlix_quiz_title_and_instruction",
    "acadlix_quiz_sidebar_user",
    "acadlix_quiz_sidebar_submit",
  ];

  React.useLayoutEffect(() => {
    let total = 2;
    setTimeout(() => {
      idList.forEach((a, i) => {
        total += document.getElementById(a)?.clientHeight ?? 0;
      });
      if (acadlixOptions?.is_admin_bar_showing) {
        total += props?.isDesktop ? 32 : 46;
      }
      setRemainingHeight(total);
    },100);

    let top = 0;
    if (acadlixOptions?.is_admin_bar_showing) {
      top += props?.isDesktop ? 32 : 46;
    }
    top +=
      document.getElementById("acadlix_quiz_logo_and_title")?.clientHeight ?? 0;
    top +=
      document.getElementById("acadlix_quiz_title_and_instruction")
        ?.clientHeight ?? 0;
    setRemainingTop(top);
  });

  return (
    <Box>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="end"
        onClick={props?.handleToggle}
        sx={{
          display: "block",
          position: "fixed",
          right: props?.isOpen ? "250px" : "0px",
          zIndex: 999,
          top: "50%",
          borderRadius: "4px 0px 0px 4px",
          backgroundColor: "#5a5c69",
          borderColor: "#5a5c69",
          color: "#fff",
          width: "18px",
          margin: "0px !important",
          padding: "8px 0px",
          "&:hover": {
            backgroundColor: "#5a5c69",
          },
        }}
      >
        {props?.isOpen ? (
          <MdKeyboardArrowRight
            style={{
              width: "22px",
            }}
          />
        ) : (
          <MdKeyboardArrowLeft
            style={{
              width: "22px",
            }}
          />
        )}
      </IconButton>
      <Drawer
        sx={{
          width: props?.sidebarWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: props?.sidebarWidth,
            top: remainingTop,
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
        <QuizSidebarUser {...props} />
        <Box
          sx={{
            border: `2px solid black`,
            height: `calc(100% - ${remainingHeight}px)`,
          }}
        >
          {props?.watch("subjects")?.length > 0 &&
            props
              ?.watch("subjects")
              ?.map((s, s_index) => (
                <QuizSidebarStatusTypes
                  key={s_index}
                  s_index={s_index}
                  {...s}
                  {...props}
                />
              ))}
          <QuizSidebarSection {...props} />
          {props?.watch("subjects")?.length > 0 &&
            props
              ?.watch("subjects")
              ?.map((s, s_index) => (
                <QuizSidebarQuestionOverview
                  key={s_index}
                  s_index={s_index}
                  {...s}
                  {...props}
                />
              ))}
        </Box>
        <QuizSidebarSubmit {...props} />
      </Drawer>
    </Box>
  );
};

export default QuizSidebar;
