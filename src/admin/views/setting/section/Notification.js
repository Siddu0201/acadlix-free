import React from "react";
import {
  Grid,
  Box,
  FormControlLabel,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";
import CustomSwitch from "../../../../components/CustomSwitch";

function Notification(props) {
  return (
    <Box sx={{ color: "black" }}>
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">Email Settings</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={4}
        sx={{
          alignItems: "center",
        }}
      >
        <Grid item xs={12} lg={4}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            Notify Course Purchase To
          </Typography>
        </Grid>
        <Grid item xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="Student"
            value="yes"
            checked={props?.watch("acadlix_notify_course_purchase_to_student") === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue(
                  "acadlix_notify_course_purchase_to_student",
                  e?.target?.checked ? e?.target?.value : "no",
                  {
                    shouldDirty: true,
                  }
                );
              }
            }}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="Admin"
            value="yes"
            checked={props?.watch("acadlix_notify_course_purchase_to_admin") === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue(
                  "acadlix_notify_course_purchase_to_admin",
                  e?.target?.checked ? e?.target?.value : "no",
                  {
                    shouldDirty: true,
                  }
                );
              }
            }}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            Notify Course Completion To
          </Typography>
        </Grid>
        <Grid item xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="Student"
            value="yes"
            checked={props?.watch("acadlix_notify_course_completion_to_student") === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue(
                  "acadlix_notify_course_completion_to_student",
                  e?.target?.checked ? e?.target?.value : "no",
                  {
                    shouldDirty: true,
                  }
                );
              }
            }}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="Admin"
            value="yes"
            checked={props?.watch("acadlix_notify_course_completion_to_admin") === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue(
                  "acadlix_notify_course_completion_to_admin",
                  e?.target?.checked ? e?.target?.value : "no",
                  {
                    shouldDirty: true,
                  }
                );
              }
            }}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            Notify Failed Transaction To
          </Typography>
        </Grid>
        <Grid item xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="Student"
            value="yes"
            checked={props?.watch("acadlix_notify_failed_transation_to_student") === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue(
                  "acadlix_notify_failed_transation_to_student",
                  e?.target?.checked ? e?.target?.value : "no",
                  {
                    shouldDirty: true,
                  }
                );
              }
            }}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="Admin"
            value="yes"
            checked={props?.watch("acadlix_notify_failed_transation_to_admin") === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue(
                  "acadlix_notify_failed_transation_to_admin",
                  e?.target?.checked ? e?.target?.value : "no",
                  {
                    shouldDirty: true,
                  }
                );
              }
            }}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="Send Custom Notification"
          />
        </Grid>
        <Grid item xs={12} lg={12}>
          <CustomTextField fullWidth size="small" label="To" />
        </Grid>
        <Grid item xs={12} lg={12}>
          <CustomTextField fullWidth size="small" label="Subject" />
        </Grid>
        <Grid item xs={12} lg={12}>
          <CustomTextField
            fullWidth
            size="small"
            label="Message"
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12} lg={12}>
          <Button variant="contained" color="primary">
            Send
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Notification;
