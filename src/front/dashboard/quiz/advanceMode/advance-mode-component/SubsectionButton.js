import React from "react";
import SectionPopover from "./SectionPopover";
import { Box, Button } from "@mui/material";
import { TiInfoLarge } from "react-icons/ti";

const SubsectionButton = (props) => {
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
          borderRadius: 0,
          boxShadow: "none",
          marginBottom: "0px !important",
          backgroundColor: props?.active ? props?.colorCode?.subsection_button_active_background : props?.colorCode?.subsection_button_background,
          color: props?.active ? props?.colorCode?.subsection_button_active_color : props?.colorCode?.subsection_button_color,
          borderLeft: props?.active ? "0px" :`1px solid ${props?.colorCode?.subsection_button_border}`,
          borderRight: props?.active ? "0px" : `1px solid ${props?.colorCode?.subsection_button_border}`,
          ":hover": {
            backgroundColor: props?.active ? props?.colorCode?.subsection_button_active_background : props?.colorCode?.subsection_button_background,
            color: props?.active ? props?.colorCode?.subsection_button_active_color : props?.colorCode?.subsection_button_color,
            boxShadow: "none",
          },
          "& .MuiButton-endIcon": {
            color: props?.colorCode?.info_icon,
            background: props?.colorCode?.info_icon_background,
            borderRadius: "50%",
          },
        }}
        aria-owns="basic-menu"
        aria-haspopup="true"
        endIcon={
          <TiInfoLarge onMouseEnter={handleClick} onMouseLeave={handleClose} />
        }
      >
        General Awareness
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

export default SubsectionButton;
