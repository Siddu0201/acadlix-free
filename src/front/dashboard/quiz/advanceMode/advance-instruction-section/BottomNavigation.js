import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { AppBar, Toolbar } from "@mui/material";
import CustomButton from "../../normalMode/normal-quiz-component/CustomButton";

const BottomNavigation = (props) => {
  const handleNextClick = () => {
    props?.setValue("view_instruction1", false, {shouldDirty: true});
    props?.setValue("view_instruction2", true, {shouldDirty: true});
  }
  return (
    <AppBar
      position="fixed"
      sx={{
        top: "auto",
        bottom: 0,
        left: 0,
        right: "auto",
        backgroundColor: props?.colorCode?.button_option_background,
        width: props?.instructionIsOpen ? `calc(100% - ${props?.sidebarWidth}px)` : "100%",
        border: `1px solid ${props?.colorCode?.button_option_border}`,
        margin: "1px",
      }}
      id="acadlix_instruction1_button_options"
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "end",
          minHeight: "100% !important",
          paddingY: 2,
          paddingLeft: "0.75rem !important",
          paddingRight: "0.10rem !important",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
          }}
        >
          <CustomButton
            variant="contained"
            sx={{
              margin: "auto 16px",
            }}
            onClick={handleNextClick}
          >
            Next →
          </CustomButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default BottomNavigation;
