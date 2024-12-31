import React from "react";
import { Button, Box } from "@mui/material";
import { TiInfoLarge } from "../../../../../helpers/icons";
import SectionPopover from "./SectionPopover";

const SectionButton = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box>
      <Button
        variant="contained"
        size="small"
        sx={{
          marginBottom: "0px !important",
          boxShadow: "none",
          borderRadius: "3px",
          padding: "3px 13px",
          fontSize: "12px",
          backgroundColor: props?.active
            ? props?.colorCode?.top_subject_button_active_background
            : props?.colorCode?.top_subject_button_background,
          color: props?.active
            ? props?.colorCode?.top_subject_button_active_color
            : props?.colorCode?.top_subject_button_color,
          border: `1px solid ${
            props?.active
              ? props?.colorCode?.top_subject_button_active_border
              : props?.colorCode?.top_subject_button_border
          }`,
          ":hover": {
            backgroundColor: props?.active
              ? props?.colorCode?.top_subject_button_active_background
              : props?.colorCode?.top_subject_button_background,
            color: props?.active
              ? props?.colorCode?.top_subject_button_active_color
              : props?.colorCode?.top_subject_button_color,
            border: `1px solid ${
              props?.active
                ? props?.colorCode?.top_subject_button_active_border
                : props?.colorCode?.top_subject_button_border
            }`,
            boxShadow: "none",
          },
          "& .MuiButton-endIcon": {
            color: props?.colorCode?.info_icon,
            background: props?.colorCode?.info_icon_background,
            borderRadius: "50%",
            position: "relative",
          },
        }}
        aria-owns="basic-menu"
        aria-haspopup="true"
        endIcon={
          <TiInfoLarge onMouseEnter={handleClick} onMouseLeave={handleClose} />
        }
      >
        GENERAL AWARENESS
        <Box
          sx={{
            display: props?.active ? "" : "none",
            position: "absolute",
            background: props?.colorCode?.top_subject_button_active_background,
            height: "7px",
            width: "7px",
            top: "24px",
            transform: "rotate(45deg)",
          }}
        ></Box>
      </Button>
      <SectionPopover
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
        aria="basic-menu"
        {...props}
      />
    </Box>
  );
};

export default SectionButton;
