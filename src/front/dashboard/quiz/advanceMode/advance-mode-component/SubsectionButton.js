import React from "react";
import SectionPopover from "./SectionPopover";
import { Box, Button, Checkbox, FormControl, FormControlLabel } from "@mui/material";
import { TiInfoLarge } from "../../../../../helpers/icons";

const SubsectionButton = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubjectChange = () => {
    if(props?.watch("quiz_timing_type") === "subject_wise_time"){
      return;
    }
    props?.setValue(
      "subjects",
      props?.watch("subjects")?.map((s, s_index) => {
        if (s_index === props?.s_index) {
          s.selected = true;
        } else {
          s.selected = false;
        }
        return s;
      })
    );
    
    let i = 0;
    props?.setValue("questions", props?.watch("questions")?.map(q => {
      if (q.selected) {
        q.result.time =
          q.result.time +
          Math.round((Date.now() - props?.watch("last")) / 1000);
      }
      if(q?.subject_id == props?.subject_id){
        if(i === 0){
          q.selected = true;
          q.visit = true;
          i++;
        }else{
          q.selected = false;
        }
      }else{
        q.selected = false;
      }
      return q;
    }));
    props?.setValue("last", Date.now(), { shouldDirty: true });
  };
  return (
    <Box>
      <Button
        ref={(el) => (props.subjectRefs.current[props?.s_index] = el)}
        variant="contained"
        size="small"
        onClick={handleSubjectChange}
        sx={{
          width: "max-content",
          borderRadius: 0,
          boxShadow: "none",
          marginBottom: "0px !important",
          backgroundColor: props?.active
            ? props?.colorCode?.subsection_button_active_background
            : props?.colorCode?.subsection_button_background,
          color: props?.active
            ? props?.colorCode?.subsection_button_active_color
            : `${props?.colorCode?.subsection_button_color} !important`,
          borderLeft: props?.active
            ? "0px"
            : `1px solid ${props?.colorCode?.subsection_button_border}`,
          borderRight: props?.active
            ? "0px"
            : `1px solid ${props?.colorCode?.subsection_button_border}`,
          ":hover, :focus": {
            backgroundColor: props?.active
              ? props?.colorCode?.subsection_button_active_background
              : props?.colorCode?.subsection_button_background,
            color: props?.active
              ? props?.colorCode?.subsection_button_active_color
              : `${props?.colorCode?.subsection_button_color} !important`,
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
          <TiInfoLarge 
            onMouseEnter={handleClick} 
            onMouseLeave={handleClose} 
            onClick={(e) => {
              e?.stopPropagation();
              if(anchorEl === null){
                handleClick(e);
              }else{
                handleClose(e);
              }
            }}
          />
        }
      >
        {props?.subject_name}
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
