import {
  AppBar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import QuestionLanguage from "./QuestionLanguage";
import { __ } from "@wordpress/i18n";

const BottomNavigation2 = (props) => {
  const handlePreviousClick = () => {
    props?.setValue("view_instruction2", false, { shouldDirty: true });
    props?.setValue("view_instruction1", true, { shouldDirty: true });
  };

  const handlelabelChange = (e) => {
    if (e?.target?.checked != undefined) {
      props?.setValue("ready_to_begin", !props?.watch("ready_to_begin"), {
        shouldDirty: true,
      });
    }
  };

  const handleReadyToBegin = () => {
    if(props?.watch("selected_language_id") === ''){
      alert(__('Please select the default language to procced further', 'acadlix'));
      return;
    }
    // Handle full screen
    props?.handleFullScreen();
    props?.setValue("view_instruction2", false, { shouldDirty: true });
    props?.setValue("view_question", true, { shouldDirty: true });
    props?.setValue("last", Date.now(), { shouldDirty: true });
    props?.setValue("now", Date.now(), { shouldDirty: true });
    const subject_data = props
      ?.watch("questions")
      ?.reduce((acc, curr, index) => {
        const { subject_name, subject_id } = curr;
        const existingSubject = acc.find(
          (entry) => entry.subject_name === subject_name
        );
        if (!existingSubject) {
          acc.push({
            subject_name: subject_name,
            subject_id: subject_id,
            selected: index === 0,
            model: false,
            submitModel: false,
            submitted: false,
            optional: props?.watch("subject_times")?.find(s => subject_id === s?.subject_id)?.optional,
            time: props?.watch("subject_times")?.find(s => subject_id === s?.subject_id)?.time,
            optional_selected: false,
          });
        }
        return acc;
      }, []);
    props?.setValue("subjects", subject_data, { shouldDirty: true });
  };

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
        <QuestionLanguage {...props} />
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "red",
            }}
          >
            {__("Please note all questions will appear in your default language. This language can be changed for a particular question later on.", 'acadlix')}
          </Typography>
        </Box>
        {props?.watch("language_data")?.length > 0 &&
          props?.watch("language_data")?.map((l, index) => (
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
            marginY: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={handlePreviousClick}
            sx={{
              margin: "auto 16px",
              borderRadius: 0,
              border: `1px solid ${props?.colorCode?.instruction_next_button_border}`,
              backgroundColor:
                props?.colorCode?.instruction_next_button_background,
              color: props?.colorCode?.instruction_next_button_color,
              ":hover, :focus": {
                border: `1px solid ${props?.colorCode?.instruction_next_button_hover_border}`,
                backgroundColor:
                  props?.colorCode?.instruction_next_button_hover_background,
                color: props?.colorCode?.instruction_next_button_color,
                boxShadow: "none",
              },
            }}
          >
            {__('Previous', 'acadlix')}
          </Button>
          <Button
            disabled={!props?.watch("ready_to_begin")}
            variant="contained"
            sx={{
              margin: "auto",
              borderRadius: 0,
            }}
            onClick={handleReadyToBegin}
          >
            {__('I am ready to begin', 'acadlix')}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default BottomNavigation2;
