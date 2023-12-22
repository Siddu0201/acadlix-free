import React from "react";
import {
  FormControlLabel,
  Switch,
  Grid,
  Autocomplete,
  TextField,
  Box,
  Button,
  Divider,
  CardContent,
  Card,
  FormControl,
  RadioGroup,
  Radio,
} from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";
import DatePicker from "react-datepicker";

function General() {
  const Subjects = [
    { label: "subject1" },
    { label: "subject2" },
    { label: "subject3" },
  ];
  return (
    <Box sx={{ color: "black" }}>
      <Grid container>
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel control={<Switch />} label="Quiz Title" />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel control={<Switch />} label="Restart Button" />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={<Switch />}
            label="Clear Response Button"
          />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <FormControl>
            <RadioGroup name="time" row>
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
        <GridItem1 xs={12} lg={4}>
          <CustomTextField
            fullWidth
            label="Timing (in sec)"
            size="small"
            type="number"
          />
        </GridItem1>
        <GridItem1 xs={12} lg={4}></GridItem1>
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel control={<Switch />} label="Pause Quiz" />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <DatePicker
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Start Date and time"
            showTimeSelect
          />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <DatePicker
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="End Date and time"
            showTimeSelect
          />
        </GridItem1>
        <GridItem1 xs={12} lg={12}>
          <FormControlLabel control={<Switch />} label="Prerequisite" />
        </GridItem1>
        <GridItem1 xs={12} lg={12}>
          <Divider sx={{ margin: "10px" }} />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={<Switch />}
            label="Enable login/register"
          />
        </GridItem1>
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
              <FormControlLabel
                control={<Radio />}
                label="To View Answer Sheet"
                value="To View Answer Sheet"
              />
            </RadioGroup>
          </FormControl>
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel control={<Switch />} label="Save Statistics" />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <CustomTextField
            label="Number of times"
            variant="outlined"
            size="small"
            type="number"
            defaultValue={0}
          />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <CustomTextField
            label="Allowed attempt"
            variant="outlined"
            size="small"
            type="number"
            defaultValue={1}
          />
        </GridItem1>
        <GridItem1 xs={12} lg={12}>
          <Divider sx={{ margin: "10px" }} />
        </GridItem1>
        <GridItem1 xl={12} lg={4}>
          <FormControlLabel control={<Switch />} label="On Screen Calculator" />
        </GridItem1>
        <GridItem1 xl={12} lg={4}>
          <FormControlLabel control={<Switch />} label="Quiz Certificate" />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={<Switch />}
            label="Specific Number of Questions"
          />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <CustomTextField
            fullWidth
            size="small"
            type="number"
            label="Question no"
          />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={<Switch />}
            label="Resume Unfinished Quiz"
          />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel control={<Switch />} label="Rate Quiz" />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel control={<Switch />} label="Quiz Feedback" />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel control={<Switch />} label="Proctoring" />
        </GridItem1>
      </Grid>
    </Box>
  );
}

export default General;
