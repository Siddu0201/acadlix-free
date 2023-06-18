import React from "react";
import {
  Grid,
  Box,
  TextField,
  FormControlLabel,
  Switch,
  TextareaAutosize,
  Button,
} from "@mui/material";
import GridItem1 from "../../../components/GridItem1";
function Notification() {
  return (
    <div>
      <Box sx={{ color: "black" }}>
        <h3>Email Settings</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <h4>Notify Course Purchase To</h4>
          <FormControlLabel control={<Switch />} label="Student" />
          <FormControlLabel control={<Switch />} label="Instructor" />
          <FormControlLabel control={<Switch />} label="Admin" />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <h4>Notify Course Completion To</h4>
          <FormControlLabel control={<Switch />} label="Student" />
          <FormControlLabel control={<Switch />} label="Instructor" />
          <FormControlLabel control={<Switch />} label="Admin" />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <h4>Notify Failed Transaction To</h4>
          <FormControlLabel control={<Switch />} label="Student" />
          <FormControlLabel control={<Switch />} label="Instructor" />
          <FormControlLabel control={<Switch />} label="Admin" />
        </div>
        <FormControlLabel
          control={<Switch />}
          label="Send Custom Notification"
        />
        <Grid container>
          <GridItem1 lg={3}>
            <div
              style={{
                marginRight: "40px",
                fontSize: "20px",
                marginBottom: "10px",
              }}
            >
              To:
            </div>

            <div
              style={{
                marginRight: "40px",
                fontSize: "20px",
                marginBottom: "10px",
              }}
            >
              Subject:
            </div>
            <div
              style={{
                marginRight: "40px",
                fontSize: "20px",
                marginBottom: "10px",
              }}
            >
              Message:
            </div>
          </GridItem1>
          <GridItem1 lg={9}>
            <TextField
              fullWidth
              sx={{ marginBottom: "10px" }}
              placeholder="Student, Instructor or Email ID"
            />

            <TextField fullWidth sx={{ marginBottom: "10px" }} />
            <TextareaAutosize minRows={4} style={{ width: "100%" }} />
          </GridItem1>
        </Grid>
        <Button
          style={{ float: "right", margin: "10px" }}
          variant="contained"
          color="success"
        >
          Send
        </Button>
      </Box>
    </div>
  );
}

export default Notification;
