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
} from "@mui/material";
import GridItem1 from "../../../components/GridItem1";
import BoxMain from "../../../components/BoxMain";
function General() {
  const Subjects = [
    { label: "subject1" },
    { label: "subject2" },
    { label: "subject3" },
  ];
  return (
    <div>
      <Box sx={{ color: "black" }}>
        <Grid container>
          <GridItem1 lg={4} xs={12}>
            <FormControlLabel control={<Switch />} label="Quiz Title" />
            <FormControlLabel control={<Switch />} label="Save Statistics" />
          </GridItem1>
          <GridItem1 lg={4} xs={12}>
            <FormControlLabel control={<Switch />} label="Restart Button" />

            <FormControlLabel
              control={<TextField type="number" />}
              label="Stastitics IP Lock"
            />
          </GridItem1>
          <GridItem1 lg={4} xs={12}>
            <FormControlLabel control={<Switch />} label="Answer Sheet" />
          </GridItem1>
        </Grid>
        <FormControlLabel
          control={<Switch />}
          label="Specific Number of Questions Subject Wise"
        />
        <BoxMain
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Autocomplete
            sx={{ width: "250px" }}
            disablePortal
            id="combo-box-demo"
            options={Subjects}
            renderInput={(params) => (
              <TextField {...params} label="Select Subject" />
            )}
          />
          <FormControlLabel
            control={<TextField type="number" />}
            label="Questions"
          />
        </BoxMain>
        <Button style={{ margin: "5px" }} variant="contained" color="success">
          Add More
        </Button>
        <Grid container>
          <GridItem1 lg={4} xs={12}>
            <h4>Quiz Time</h4>
            <FormControlLabel control={<TextField type="number" />} />
            <h4>Allowed Attempt</h4>
            <FormControlLabel control={<TextField type="number" />} />
          </GridItem1>
          <GridItem1 lg={4} xs={12}>
            <h4>Per Question Time</h4>
            <FormControlLabel control={<TextField type="number" />} />

            <FormControlLabel control={<Switch />} label="Prerequisite" />
          </GridItem1>
          <GridItem1 lg={4} xs={12}>
            <FormControlLabel control={<Switch />} label="Subject Wise Time" />
            <FormControlLabel control={<Switch />} label="Pause Quiz" />
          </GridItem1>
        </Grid>
        <Divider sx={{ margin: "10px" }} />
        <h3>Login/Register Form</h3>
        <Grid container>
          <GridItem1 lg={4} xl={12}>
            <FormControlLabel control={<Switch />} label="At Start of Quiz" />
          </GridItem1>
          <GridItem1 lg={4} xl={12}>
            <FormControlLabel control={<Switch />} label="At Finish of Quiz" />
          </GridItem1>
          <GridItem1 lg={4} xl={12}>
            <FormControlLabel
              control={<Switch />}
              label="To View Answer Sheet"
            />
          </GridItem1>
        </Grid>
        <Divider sx={{ margin: "10px" }} />
        <Grid container>
          <GridItem1 lg={4} xl={12}>
            <FormControlLabel
              control={<Switch />}
              label="On Screen Calculator"
            />
            <FormControlLabel
              control={<Switch />}
              label="Specific Number of Questions"
            />
            <FormControlLabel control={<TextField type="number" />} />
            <FormControlLabel
              control={<Switch />}
              label="Resume Unfinished Quiz"
            />
            <FormControlLabel control={<Switch />} label="Proctoring" />
          </GridItem1>
          <GridItem1 lg={4} xl={12}>
            <FormControlLabel control={<Switch />} label="Quiz Certificate" />
            <FormControlLabel control={<Switch />} label="Rate Quiz" />
          </GridItem1>
          <GridItem1 lg={4} xl={12}>
            <FormControlLabel
              control={<Switch />}
              label="Force User To Answer All Question"
            />
            <FormControlLabel control={<Switch />} label="Quiz Feedback" />
          </GridItem1>
        </Grid>
      </Box>
    </div>
  );
}

export default General;
