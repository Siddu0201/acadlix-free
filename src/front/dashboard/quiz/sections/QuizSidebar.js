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

const QuizSidebar = (props) => {
  const [remainingHeight, setRemainingHeight] = React.useState(0);

  React.useEffect(() => {
    let total = 0;
    total +=
      document.getElementsByClassName("acadlix_quiz_sidebar_top")[0]
        ?.clientHeight ?? 0;
    total +=
      document.getElementsByClassName("acadlix_quiz_sidebar_pallete")[0]
        ?.clientHeight ?? 0;
    total +=
      document.getElementsByClassName("acadlix_quiz_sidebar_subject")[0]
        ?.clientHeight ?? 0;
    total +=
      document.getElementsByClassName("acadlix_quiz_sidebar_bottom")[0]
        ?.clientHeight ?? 0;
    setRemainingHeight(total);
  });

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="end"
        onClick={props?.handleToggle}
        sx={{
          display: props?.isOpen ? "none" : "block",
          position: "fixed",
          right: 0,
          zIndex: 9999,
          top: "40%",
          borderRadius: "4px 0px 0px 4px",
          backgroundColor: "#5a5c69",
          borderColor: "#5a5c69",
          color: "#fff",
          width: "48px",
          "&:hover": {
            backgroundColor: "#5a5c69",
          },
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        sx={{
          width: "300px",
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: "300px" },
        }}
        anchor="right"
        open={props?.isOpen}
        variant="persistent"
        onClose={props?.handleToggle}
      >
        <Box
          sx={{
            backgroundColor: "#f0f0f0", // Grey background color
            padding: 2, // Add some padding to the box
            borderBottom: "1px solid #ccc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="acadlix_quiz_sidebar_top"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar src="https://i.pravatar.cc/150?img=24" />
            <Typography style={{ marginLeft: "10px" }}>
              CHIRAJ PRAJAPATI
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={props?.handleToggle}
              sx={{
                marginBottom: "0px !important",
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: "#f0f0f0",
            height: "72px",
            paddingBottom: "5px",
          }}
          className="acadlix_quiz_sidebar_pallete"
        >
          <Grid
            container
            rowSpacing={2}
            columnSpacing={1}
            sx={{
              marginTop: 0,
              marginLeft: 0,
              width: "100%",
            }}
          >
            {/* First section */}
            <Grid
              item
              sx={{
                width: "14%",
              }}
            >
              <Answered>7</Answered>
            </Grid>
            <Grid
              item
              md={2}
              sx={{
                display: "flex",
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Answerd
              </Typography>
            </Grid>
            <Grid
              item
              sx={{
                width: "14%",
              }}
            >
              <Marked>2</Marked>
            </Grid>
            <Grid
              item
              md={2}
              sx={{
                display: "flex",
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Marked
              </Typography>
            </Grid>
            <Grid
              item
              sx={{
                width: "14%",
              }}
            >
              <NotVisited>1</NotVisited>
            </Grid>
            <Grid
              item
              md
              sx={{
                display: "flex",
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Not Visited
              </Typography>
            </Grid>
          </Grid>
          {/* Second Section  */}
          <Grid
            container
            rowSpacing={2}
            columnSpacing={1}
            sx={{
              marginTop: 0,
              marginLeft: 0,
              width: "100%",
            }}
          >
            <Grid
              item
              sx={{
                width: "14%",
              }}
            >
              <MarkedAndAnswered>1</MarkedAndAnswered>
            </Grid>
            <Grid
              item
              md={5}
              sx={{
                display: "flex",
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Marked And Answered
              </Typography>
            </Grid>
            <Grid
              item
              sx={{
                width: "14%",
              }}
            >
              <NotAnswered>1</NotAnswered>
            </Grid>
            <Grid
              item
              md
              sx={{
                display: "flex",
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Not Answered
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box
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
          {/* <Stack direction="row" spacing={2}>
            <SemiCircularButton number="1" />
            <SemiCircularButton number="2" />
            <SemiCircularButton number="3" />
            <SemiCircularButton number="4" />
            <SemiCircularButton number="5" />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            sx={{ marginTop: "10px", marginBottom: "10px" }}
          >
            <SemiCircularButton number="6" />
            <SemiCircularButton number="7" />
            <SemiCircularButton number="8" />
            <SemiCircularButton number="9" />
            <SemiCircularButton number="10" />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            sx={{ marginTop: "10px", marginBottom: "10px" }}
          >
            <SemiCircularButton number="11" />
            <SemiCircularButton number="12" />
            <SemiCircularButton number="13" />
            <SemiCircularButton number="14" />
            <SemiCircularButton number="15" />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            sx={{ marginTop: "10px", marginBottom: "10px" }}
          >
            <SemiCircularButton number="16" />
            <SemiCircularButton number="17" />
            <SemiCircularButton number="18" />
            <SemiCircularButton number="19" />
            <SemiCircularButton number="20" />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            sx={{ marginTop: "10px", marginBottom: "10px" }}
          >
            <RectangularButton number="21" />
            <RectangularButton number="22" />
            <RectangularButton number="23" />
            <RectangularButton number="24" />
            <RectangularButton number="25" />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            sx={{ marginTop: "10px", marginBottom: "10px" }}
          >
            <RectangularButton number="26" />
            <RectangularButton number="27" />
            <RectangularButton number="28" />
            <RectangularButton number="29" />
            <RectangularButton number="30" />
          </Stack> */}
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              size={props?.isDesktop ? "medium" : "small"}
              variant="contained"
              color="primary"
              sx={{ margin: "3px!important" }}
            >
              Question paper
            </Button>
            <Button
              size={props?.isDesktop ? "medium" : "small"}
              variant="contained"
              color="primary"
              sx={{ margin: "3px!important" }}
            >
              Instruction
            </Button>
          </Box>
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
        </Box>
      </Drawer>
    </>
  );
};

export default QuizSidebar;
