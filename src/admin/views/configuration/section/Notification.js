import React from "react";
import {
  Grid,
  Box,
  FormControlLabel,
  Switch,
  Button,
  Typography,
} from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";

function Notification() {
  return (
    <Box sx={{ color: "black" }}>
      <h3>Email Settings</h3>
      <Grid container>
        <GridItem1 xs={12} lg={3}>
          <Typography variant="body1" sx={{
            display: 'flex',
            alignItems: 'center',
          }}>
            Notify Course Purchase To
          </Typography>
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <FormControlLabel control={<Switch />} label="Student" />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <FormControlLabel control={<Switch />} label="Instructor" />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <FormControlLabel control={<Switch />} label="Admin" />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <Typography variant="body1" sx={{
            display: 'flex',
            alignItems: 'center',
          }}>
            Notify Course Completion To
          </Typography>
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <FormControlLabel control={<Switch />} label="Student" />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <FormControlLabel control={<Switch />} label="Instructor" />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <FormControlLabel control={<Switch />} label="Admin" />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <Typography variant="body1" sx={{
            display: 'flex',
            alignItems: 'center',
          }}>
            Notify Failed Transaction To
          </Typography>
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <FormControlLabel control={<Switch />} label="Student" />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <FormControlLabel control={<Switch />} label="Instructor" />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <FormControlLabel control={<Switch />} label="Admin" />
        </GridItem1>
        <GridItem1 xs={12} lg={12}>
          <FormControlLabel
            control={<Switch />}
            label="Send Custom Notification"
          />
        </GridItem1>
        <GridItem1 xs={12} lg={12}>
          <CustomTextField
            fullWidth
            size="small"
            label="To"
          />
        </GridItem1>
        <GridItem1 xs={12} lg={12}>
          <CustomTextField
            fullWidth
            size="small"
            label="Subject"
          />
        </GridItem1>
        <GridItem1 xs={12} lg={12}>
          <CustomTextField
            fullWidth
            size="small"
            label="Message"
            multiline
            rows={3}
          />
        </GridItem1>
        <GridItem1 xs={12} lg={12}>
          <Button
            style={{ float: "right", margin: "10px" }}
            variant="contained"
            color="success"
          >
            Send
          </Button>
        </GridItem1>
      </Grid>
    </Box>
  );
}

export default Notification;
