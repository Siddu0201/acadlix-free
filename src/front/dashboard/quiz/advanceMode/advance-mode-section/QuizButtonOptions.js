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
        backgroundColor: props?.colorCode?.button_option_background,
        width: props?.isOpen ? `calc(100% - ${props?.sidebarWidth}px)` : "100%",
        border: `1px solid ${props?.colorCode?.button_option_border}`,
        margin: "1px",
      }}
      id="acadlix_quiz_button_options"
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: "100% !important",
          paddingY: 1,
          paddingLeft: "0.75rem !important",
          paddingRight: "0.10rem !important",
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
              fontSize: 13,
              fontWeight: 400,
              paddingX: "18px",
              boxShadow: "none",
              border: `1px solid ${props?.colorCode?.mark_for_review_and_next_border}`,
              backgroundColor: props?.colorCode?.mark_for_review_and_next_background,
              color: props?.colorCode?.mark_for_review_and_next_color,
              ':hover': {
                border: `1px solid ${props?.colorCode?.mark_for_review_and_next_hover_border}`,
                backgroundColor: props?.colorCode?.mark_for_review_and_next_hover_background,
                color: props?.colorCode?.mark_for_review_and_next_hover_color,
                boxShadow: "none",
              },
            }}
          >
            Mark for Review & Next
          </Button>

          <Button
            size={props?.isDesktop ? "medium" : "small"}
            variant="contained"
            color="primary"
            sx={{
              margin: `4px!important`,
              borderRadius: 0,
              fontSize: 13,
              fontWeight: 400,
              paddingX: "18px",
              boxShadow: "none",
              border: `1px solid ${props?.colorCode?.clear_response_border}`,
              backgroundColor: props?.colorCode?.clear_response_background,
              color: props?.colorCode?.clear_response_color,
              ':hover': {
                border: `1px solid ${props?.colorCode?.clear_response_hover_border}`,
                backgroundColor: props?.colorCode?.clear_response_hover_background,
                color: props?.colorCode?.clear_response_hover_color,
                boxShadow: "none",
              },
            }}
          >
            Clear Response
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
              fontSize: 13,
              fontWeight: 400,
              paddingX: "18px",
              boxShadow: "none",
              border: `1px solid ${props?.colorCode?.previous_response_border}`,
              backgroundColor: props?.colorCode?.previous_response_background,
              color: props?.colorCode?.previous_response_color,
              ':hover': {
                border: `1px solid ${props?.colorCode?.previous_response_hover_border}`,
                backgroundColor: props?.colorCode?.previous_response_hover_background,
                color: props?.colorCode?.previous_response_hover_color,
                boxShadow: "none",
              },
            }}
          >
            Previous
          </Button>
          <Button
            size={props?.isDesktop ? "medium" : "small"}
            variant="contained"
            color="primary"
            sx={{
              margin: `4px!important`,
              borderRadius: 0,
              fontSize: 13,
              fontWeight: 400,
              paddingX: "18px",
              boxShadow: "none",
              border: `1px solid ${props?.colorCode?.save_and_next_border}`,
              backgroundColor: props?.colorCode?.save_and_next_background,
              color: props?.colorCode?.save_and_next_color,
              ':hover': {
                border: `1px solid ${props?.colorCode?.save_and_next_hover_border}`,
                backgroundColor: props?.colorCode?.save_and_next_background,
                color: props?.colorCode?.save_and_next_color,
                boxShadow: "none",
              },
            }}
          >
            Save & Next
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default QuizButtonOptions;
