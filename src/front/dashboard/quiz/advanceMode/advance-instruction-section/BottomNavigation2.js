import {
  AppBar,
  Box,
  Checkbox,
  FormControlLabel,
  Toolbar,
} from "@mui/material";
import React from "react";
import CustomButton from "../../normalMode/normal-quiz-component/CustomButton";

const BottomNavigation2 = (props) => {
  const handlePreviousClick = () => {
      props?.setValue("view_instruction2", false, {shouldDirty: true});
      props?.setValue("view_instruction1", true, {shouldDirty: true});
  }  

  const handlelabelChange = (e) => {
    if(e?.target?.checked != undefined){
        props?.setValue("ready_to_begin", !props?.watch("ready_to_begin"), {shouldDirty: true});
    }
  }

  const handleReadyToBegin = () => {
    props?.setValue("view_instruction2", false, {shouldDirty: true});
    props?.setValue("view_question", true, {shouldDirty: true});
    props?.setValue("last", Date.now(), { shouldDirty: true });
    props?.setValue("now", Date.now(), { shouldDirty: true });
    const subject_data = props?.watch("questions")?.reduce((acc, curr, index) => {
      const {subject_name, subject_id} = curr;
      const existingSubject = acc.find(entry => entry.subject_name === subject_name);
      if(!existingSubject){
        acc.push({
          subject_name: subject_name,
          subject_id: subject_id,
          selected: index === 0,
          model: false,
          submitModel: false,
          submitted: false,
        });
      }
      return acc;
    },[]);
    props?.setValue("subjects", subject_data, {shouldDirty: true});
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
        width: props?.instructionIsOpen
          ? `calc(100% - ${props?.sidebarWidth}px)`
          : "100%",
        border: `1px solid ${props?.colorCode?.button_option_border}`,
        margin: "1px",
      }}
      id="acadlix_instruction2_button_options"
    >
      <Toolbar
        sx={{
          display: "block",
          minHeight: "100% !important",
          paddingY: 2,
          paddingLeft: "0.75rem !important",
          paddingRight: "0.10rem !important",
        }}
      >
        {props?.watch("languages")?.length > 0 &&
          props?.watch("languages")?.map((l, index) => (
            <Box
              key={index}
              sx={{
                display: l?.selected ? "" : "none",
                marginTop: 2,
                marginBottom: 4,
              }}
            >
              <FormControlLabel
                control={<Checkbox />}
                checked={props?.watch("ready_to_begin")}
                onChange={handlelabelChange}
                componentsProps={{
                  typography: {
                    variant: "body2",
                    sx: {
                      color: "black",
                    },
                  },
                }}
                label={l?.term_and_condition_text}
              />
            </Box>
          ))}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginY: 2
          }}
        >
          <CustomButton variant="contained" onClick={handlePreviousClick}>Previous</CustomButton>
          <CustomButton
            disabled={!props?.watch("ready_to_begin")}
            variant="contained"
            sx={{
              margin: "auto",
            }}
            onClick={handleReadyToBegin}
          >
            I am ready to begin
          </CustomButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default BottomNavigation2;
