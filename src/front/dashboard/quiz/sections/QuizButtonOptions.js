import { AppBar, Box, Button, Toolbar } from "@mui/material";
import React from "react";

const QuizButtonOptions = (props) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        top: "auto",
        bottom: 0,
        left: 0,
        right: "auto",
        backgroundColor: "#ffffff",
        width: {
          xs: "100%",
          sm: props?.isOpen ? "calc(100% - 300px)" : "100%",
        },
      }}
      className="acadlix_quiz_button_options"
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: "100% !important",
          paddingX: {
            xs: '0px!important',
            xs: '4px!important',
          },
        }}
      >
        <Box>
          <Button
            size={props?.isDesktop ? "medium" : "small"}
            variant="contained"
            color="primary"
            sx={{
              margin: `4px!important`,
              borderRadius: 0,
              paddingX: {
                xs: "5px",
                md: "10px",
              },
            }}
          >
            Mark for Review
          </Button>

          <Button
            size={props?.isDesktop ? "medium" : "small"}
            variant="contained"
            color="primary"
            sx={{
              margin: `4px!important`,
              borderRadius: 0,
              paddingX: {
                xs: "5px",
                md: "10px",
              },
            }}
          >
            Clear Selection
          </Button>
        </Box>
        <Box>
          <Button
            size={props?.isDesktop ? "medium" : "small"}
            variant="contained"
            color="primary"
            sx={{
              margin: `4px!important`,
              borderRadius: 0,
              paddingX: {
                xs: "5px",
                md: "10px",
              },
            }}
          >
            Save & next
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default QuizButtonOptions;
