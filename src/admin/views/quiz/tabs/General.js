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
          <FormControlLabel control={<Switch />} label="Answer Sheet" />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel control={<Switch />} label="Save Statistics" />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <CustomTextField
            label="Statistic IP Lock"
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
          <FormControlLabel
            control={<Switch />}
            label="Specific Number of Questions Subject Wise"
          />
        </GridItem1>
        <GridItem1 xs={12} lg={12}>
          <Card>
            <CardContent>
              <Grid container>
                <GridItem1 xs={12} lg={4}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={Subjects}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Subject" />
                    )}
                  />
                </GridItem1>
                <GridItem1 xs={12} lg={3}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    label="Questions"
                    type="number"
                  />
                </GridItem1>
                <GridItem1 xs={12} lg={12}>
                  <Button
                    variant="contained"
                    color="success"
                  >
                    Add More
                  </Button>
                </GridItem1>
              </Grid>
            </CardContent>
          </Card>
        </GridItem1>
        <GridItem1 xs={12} lg={6}>
          <FormControl>
            <RadioGroup
              name="time"
              row
            >
              <FormControlLabel value="Full Quiz Time" control={<Radio />} label="Full Quiz Time" />
              <FormControlLabel value="Per Question Time" control={<Radio />} label="Per Question Time" />
              <FormControlLabel value="Subject Wise Time" control={<Radio />} label="Subject Wise Time" />
            </RadioGroup>
          </FormControl>
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <CustomTextField
            fullWidth
            label="Timing (in sec)"
            size="small"
            type="number"
          />
        </GridItem1>
        <GridItem1 xs={12} lg={3}></GridItem1>
        <GridItem1 xs={12} lg={3}>
          <FormControlLabel control={<Switch />} label="Prerequisite" />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <FormControlLabel control={<Switch />} label="Pause Quiz" />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
            <DatePicker 
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Start Date and time"
              showTimeSelect
            />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
            <DatePicker 
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="End Date and time"
              showTimeSelect
            />
        </GridItem1>
      </Grid>
      <Divider sx={{ margin: "10px" }} />
      <h3 style={{
        marginLeft: 10
      }}>Login/Register Form</h3>
      <Grid container>
        <GridItem1 xl={12} lg={12}>
          <FormControl>
            <RadioGroup
              name="login"
              row
            >
              <FormControlLabel control={<Radio />} label="At Start of Quiz" value="At the Start of Quiz" />
              <FormControlLabel control={<Radio />} label="At Finish of Quiz" value="At Finish of Quiz" />
              <FormControlLabel control={<Radio />} label="To View Answer Sheet" value="To View Answer Sheet" />
            </RadioGroup>
          </FormControl>
        </GridItem1>
      </Grid>
      <Divider sx={{ margin: "10px" }} />
      <Grid container>
        <GridItem1 xl={12} lg={4}>
          <FormControlLabel
            control={<Switch />}
            label="On Screen Calculator"
          />
        </GridItem1>
        <GridItem1 xl={12} lg={4}>
          <FormControlLabel control={<Switch />} label="Quiz Certificate" />
        </GridItem1>
        <GridItem1 xl={12} lg={4}>
          <FormControlLabel
            control={<Switch />}
            label="Force User To Answer All Question"
          />
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
