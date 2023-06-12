import React from "react";
import {
  Box,
  Grid,
  FormControlLabel,
  Switch,
  TextareaAutosize,
  Button,
  TextField,
} from "@mui/material";
import GridItem1 from "../../../components/GridItem1";
import BoxMain from "../../../components/BoxMain";
function Notification() {
  return (
    <div>
      <Box sx={{ color: "black" }}>
        <Grid container>
          <GridItem1 lg={6} xs={12}>
            <FormControlLabel
              control={<Switch />}
              label="Admin Email Notification"
            />
            <FormControlLabel
              control={<Switch />}
              label="Student Email Notification"
            />
          </GridItem1>
          <GridItem1 lg={6} xs={12}>
            <FormControlLabel
              control={<Switch />}
              label="Instructor Email Notification"
            />
            <FormControlLabel
              control={<Switch />}
              label="Parent Email Notification"
            />
          </GridItem1>
        </Grid>
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
              From:
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
            <TextField fullWidth sx={{ marginBottom: "10px" }} />
            <TextField fullWidth sx={{ marginBottom: "10px" }} />
            <TextField fullWidth sx={{ marginBottom: "10px" }} />
            <TextareaAutosize minRows={4} style={{ width: "100%" }} />
          </GridItem1>
        </Grid>
      </Box>
    </div>
  );
}

export default Notification;
