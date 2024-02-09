import React from "react";
import {
  FormControlLabel,
  Grid,
  Box,
  FormControl,
  RadioGroup,
  Radio,
  Typography,
  FormLabel,
} from "@mui/material";
import CustomSwitch from "../../../../components/CustomSwitch";
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";
import DatePicker from "react-datepicker";

const General = (props) => {
  
  return (
    <Box sx={{ color: "black" }}>
      <Grid container>
        <GridItem1 xs={12} lg={12}>
          <Typography variant="h6">General Options</Typography>
        </GridItem1>

        {/* Used to hide quiz title in a quiz */}
        <GridItem1 xs={12} lg={4}>
        <FormControlLabel
          control={
            <CustomSwitch
              checked={props?.watch("hide_quiz_title") ?? false}
              onChange={(e) => {
                props?.setValue("hide_quiz_title", e?.target?.checked, { shouldDirty: true });
              }}
            />
          }
          label="Hide Quiz Title"
        />
        </GridItem1>

        {/* User can restart quiz after submittion */}
        <GridItem1 xs={12} lg={4}>
  <FormControlLabel
    control={
      <CustomSwitch
        checked={props?.watch("hide_restart_button") ?? false}
        onChange={(e) => {
          props?.setValue("hide_restart_button", e?.target?.checked, { shouldDirty: true });
        }}
      />
    }
    label="Hide Restart Button"
  />
    </GridItem1>

    
        {/* Used to clear answer button to clear option selction */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch
        checked={props?.watch("show_clear_response_button") ?? false}
        onChange={(e) => {
          props?.setValue("show_clear_response_button", e?.target?.checked, { shouldDirty: true });
        }}
      />}
            label="Show Clear Response Button"
          />
        </GridItem1>

        {/* Quiz time type 
          - full quiz time
          - per question time
        */}
        <GridItem1 xs={12} lg={6}>
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FormLabel
              id="acadlix-genral-quiz-time-type"
              sx={{
                marginRight: 4,
                color: "black",
                fontWeight: 500,
                fontSize: "1.1rem",
              }}
            >
              Quiz time type
            </FormLabel>
            <RadioGroup
              name="time"
              row
              aria-label="acadlix-genral-quiz-time-type"
            >
              <FormControlLabel
                value="Full Quiz Time"
                control={<Radio />}
                label="Full Quiz Time"
              />
              <FormControlLabel
                value="Per Question Time"
                control={<Radio />}
                label="Per Question Time"
              />
            </RadioGroup>
          </FormControl>
        </GridItem1>

        {/* Timing in sec (0 => infinity) */}
        <GridItem1 xs={12} lg={4}>
          <CustomTextField
            fullWidth
            label="Timing (in sec)"
            size="small"
            type="number"
            value={0}
          />
        </GridItem1>
        <GridItem1 xs={12} lg={2}></GridItem1>

        {/* Button to pause quiz */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel control={<CustomSwitch
        checked={props?.watch("pause_quiz") ?? false}
        onChange={(e) => {
          props?.setValue("pause_quiz", e?.target?.checked, { shouldDirty: true });
        }}
      />}
       label="Pause Quiz" />
        </GridItem1>

        {/* Quiz start date */}
        <GridItem1 xs={12} lg={4}>
          <DatePicker
            dateFormat="MMMM d, yyyy"
            placeholderText="Start Date"
            showTimeSelect
          />
        </GridItem1>

        {/* Quiz End Date */}
        <GridItem1 xs={12} lg={4}>
          <DatePicker
            dateFormat="MMMM d, yyyy"
            placeholderText="End Date"
            showTimeSelect
          />
        </GridItem1>

        {/* Quiz prerequisite */}
        <GridItem1 xs={12} lg={12}>
          <FormControlLabel control={<CustomSwitch
        checked={props?.watch("prerequisite") ?? false}
        onChange={(e) => {
          props?.setValue("prerequisite", e?.target?.checked, { shouldDirty: true });
        }}
      />} label="Prerequisite" />
        </GridItem1>

        <GridItem1 xs={12} lg={12}>
          <Typography variant="h6">Login Options</Typography>
        </GridItem1>

        {/* If login is required for the quiz */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch
        checked={props?.watch("enable_login_register") ?? false}
        onChange={(e) => {
          props?.setValue("enable_login_register", e?.target?.checked, { shouldDirty: true });
        }}
      />}
            label="Enable login/register"
          />
        </GridItem1>

        {/* Login position
          - At Start of Quiz
          - At Finish of Quiz
        */}
        <GridItem1 xl={12} lg={8}>
          <FormControl>
            <RadioGroup name="login" row>
              <FormControlLabel
                control={<Radio />}
                label="At Start of Quiz"
                value="At the Start of Quiz"
              />
              <FormControlLabel
                control={<Radio />}
                label="At Finish of Quiz"
                value="At Finish of Quiz"
              />
            </RadioGroup>
          </FormControl>
        </GridItem1>

        {/* Per user allowed attempt to attent the quiz */}
        <GridItem1 xs={12} lg={4}>
          <CustomTextField
            label="Per User Allowed Attempt"
            variant="outlined"
            size="small"
            type="number"
            defaultValue={0}
          />
        </GridItem1>

        {/* Save Statistic */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch
        checked={props?.watch("save_statistic") ?? false}
        onChange={(e) => {
          props?.setValue("save_statistic", e?.target?.checked, { shouldDirty: true });
        }}
      />}
            label="Save Statistics"
          />
        </GridItem1>

        {/* Number of time statistic saved per user (0 => infinity) */}
        <GridItem1 xs={12} lg={4}>
          <CustomTextField
            label="Number of times"
            variant="outlined"
            size="small"
            type="number"
            defaultValue={0}
          />
        </GridItem1>

        <GridItem1 xs={12} lg={12}>
          <Typography variant="h6">Advance Options</Typography>
        </GridItem1>

        {/* On screen calculator for complex calculation */}
        <GridItem1 xl={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch
        checked={props?.watch("on_screen_calculator") ?? false}
        onChange={(e) => {
          props?.setValue("on_screen_calculator", e?.target?.checked, { shouldDirty: true });
        }}
      />}
            label="On Screen Calculator"
          />
        </GridItem1>

        {/* Used to generate quiz certificate */}
        <GridItem1 xl={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch
        checked={props?.watch("quiz_certificate") ?? false}
        onChange={(e) => {
          props?.setValue("quiz_certificate", e?.target?.checked, { shouldDirty: true });
        }}
      />}
            label="Quiz Certificate"
          />
        </GridItem1>

        {/* Used to set limited number of question in a quiz */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch
        checked={props?.watch("show_only_specific_number_of_questions") ?? false}
        onChange={(e) => {
          props?.setValue("show_only_specific_number_of_questions", e?.target?.checked, { shouldDirty: true });
        }}
      />}
            label="Show Only Specific Number of Questions"
          />
        </GridItem1>

        {/* Number of question to set in quiz */}
        <GridItem1 xs={12} lg={4}>
          <CustomTextField
            fullWidth
            size="small"
            type="number"
            label="Specific Number of Questions"
          />
        </GridItem1>

        {/* Used to resume unfinshed quiz */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch
        checked={props?.watch("resume_unfinished_quiz") ?? false}
        onChange={(e) => {
          props?.setValue("resume_unfinished_quiz", e?.target?.checked, { shouldDirty: true });
        }}
      />}
            label="Resume Unfinished Quiz"
          />
        </GridItem1>

        {/* Rate quiz at the end of quiz */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel control={<CustomSwitch
        checked={props?.watch("rate_quiz") ?? false}
        onChange={(e) => {
          props?.setValue("rate_quiz", e?.target?.checked, { shouldDirty: true });
        }}
      />} label="Rate Quiz" />
        </GridItem1>

        {/* Take feedback from user */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel control={<CustomSwitch
        checked={props?.watch("quiz_feedback") ?? false}
        onChange={(e) => {
          props?.setValue("quiz_feedback", e?.target?.checked, { shouldDirty: true });
        }}
      />} label="Quiz Feedback" />
        </GridItem1>

        {/* Used to set proctoring if used is clicking outside the quiz window */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel control={<CustomSwitch
        checked={props?.watch("proctoring") ?? false}
        onChange={(e) => {
          props?.setValue("proctoring", e?.target?.checked, { shouldDirty: true });
        }}
      />} label="Proctoring" />
        </GridItem1>

        {/* Number of warning for proctoring allowed */}
        <GridItem1 xs={12} lg={4}>
          <CustomTextField
            fullWidth
            size="small"
            type="number"
            label="Max. Number of times Allowed (min 1)"
          />
        </GridItem1>
      </Grid>
    </Box>
  );
}

export default General;
