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
    let total = 6;
    idList.forEach((a,i) => {
      total += document.getElementById(a)?.clientHeight ?? 0;
    });
    if (acadlixFront?.is_admin_bar_showing) {
      total += props?.isDesktop ? 32 : 46;
    }
    setRemainingHeight(total);

    let top = 0;
    if (acadlixFront?.is_admin_bar_showing) {
      top += props?.isDesktop ? 32 : 46;
    }
    top += document.getElementById("acadlix_quiz_logo_and_title")?.clientHeight ?? 0;
    top += document.getElementById("acadlix_quiz_title_and_instruction")?.clientHeight ?? 0;
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
          right: props?.isOpen ? "250px": "0px",
          zIndex: 9999,
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
        {
          props?.isOpen ?
          <MdKeyboardArrowRight style={{
            width: "22px",
          }} />
          :
          <MdKeyboardArrowLeft style={{
            width: "22px",
          }} />
        }
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
        <Box sx={{
          border: `2px solid black`,
          height: `calc(100% - ${remainingHeight}px)`,
        }}>
          <QuizSidebarStatusTypes {...props} />
          <QuizSidebarSection {...props} />
          <QuizSidebarQuestionOverview {...props} />
        </Box>
        <QuizSidebarSubmit {...props} />
        {/* <Box
          sx={{
            backgroundColor: "#e0dede",
            padding: 2,
            color: "#000",
            paddingLeft: 4,
            display: "flex",
            alignItems: "center",
          }}
          className="acadlix_quiz_sidebar_subject"
        >
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 400,
              marginRight: "3px!important",
            }}
          >
            Section:
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            English Language
          </Typography>
        </Box>
        <Box
          sx={{
            border: "1px solid #ccc", // Add a border around the box
            padding: 3, // Add some padding to the box
            height: `calc(100% - ${remainingHeight + 16}px)`,
            backgroundColor: "#f0f0f0",
            overflowY: "scroll",
            paddingBottom: 0,
          }}
        >
          <Grid container rowSpacing={3} columnSpacing={1}>
            <Grid
              item
              sx={{
                minWidth: "20%",
              }}
            >
              <Answered>1</Answered>
            </Grid>
            <Grid
              item
              sx={{
                minWidth: "20%",
              }}
            >
              <Marked>2</Marked>
            </Grid>
            <Grid
              item
              sx={{
                minWidth: "20%",
              }}
            >
              <NotVisited>3</NotVisited>
            </Grid>
            <Grid
              item
              sx={{
                minWidth: "20%",
              }}
            >
              <MarkedAndAnswered>4</MarkedAndAnswered>
            </Grid>
            <Grid
              item
              sx={{
                minWidth: "20%",
              }}
            >
              <NotAnswered>5</NotAnswered>
            </Grid>
            <Grid
              item
              sx={{
                minWidth: "20%",
              }}
            >
              <Answered>6</Answered>
            </Grid>
            <Grid
              item
              sx={{
                minWidth: "20%",
              }}
            >
              <Answered>7</Answered>
            </Grid>
            <Grid
              item
              sx={{
                minWidth: "20%",
              }}
            >
              <Answered>8</Answered>
            </Grid>
            <Grid
              item
              sx={{
                minWidth: "20%",
              }}
            >
              <Answered>9</Answered>
            </Grid>
            <Grid
              item
              sx={{
                minWidth: "20%",
              }}
            >
              <Answered>10</Answered>
            </Grid>
            <Grid
              item
              sx={{
                minWidth: "20%",
              }}
            >
              <Marked>11</Marked>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            right: 0,
            zIndex: 1100,
            width: "300px",
          }}
          className="acadlix_quiz_sidebar_bottom"
        >
          <Box>
            <Button
              size={props?.isDesktop ? "medium" : "small"}
              variant="contained"
              color="primary"
              sx={{
                display: "flex",
                alignItems: "center",
                margin: "2px!important",
                justifyContent: "center",
                width: "98%",
                marginBottom: "5px!important",
              }}
            >
              Submit Test
            </Button>
          </Box>
        </Box> */}
      </Drawer>
    </Box>
  );
};

export default QuizSidebar;
