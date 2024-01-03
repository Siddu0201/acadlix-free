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
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";
import DatePicker from "react-datepicker";
import CustomSwitch from "../../../../components/CustomSwitch";

function General() {
  return (
    <Box sx={{ color: "black" }}>
      <Grid container>
        <GridItem1 xs={12} lg={12}>
          <Typography variant="h6">General Options</Typography>
        </GridItem1>

        {/* Used to hide quiz title in a quiz */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="Hide Quiz Title"
          />
        </GridItem1>

        {/* User can restart quiz after submittion */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="Hide Restart Button"
          />
        </GridItem1>

        {/* Used to clear answer button to clear option selction */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
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
          <FormControlLabel control={<CustomSwitch />} label="Pause Quiz" />
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
          <FormControlLabel control={<CustomSwitch />} label="Prerequisite" />
        </GridItem1>

        <GridItem1 xs={12} lg={12}>
          <Typography variant="h6">Login Options</Typography>
        </GridItem1>

        {/* If login is required for the quiz */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
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
            control={<CustomSwitch />}
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
            control={<CustomSwitch />}
            label="On Screen Calculator"
          />
        </GridItem1>

        {/* Used to generate quiz certificate */}
        <GridItem1 xl={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="Quiz Certificate"
          />
        </GridItem1>

        {/* Used to set limited number of question in a quiz */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
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
            control={<CustomSwitch />}
            label="Resume Unfinished Quiz"
          />
        </GridItem1>

        {/* Rate quiz at the end of quiz */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel control={<CustomSwitch />} label="Rate Quiz" />
        </GridItem1>

        {/* Take feedback from user */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel control={<CustomSwitch />} label="Quiz Feedback" />
        </GridItem1>

        {/* Used to set proctoring if used is clicking outside the quiz window */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel control={<CustomSwitch />} label="Proctoring" />
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
