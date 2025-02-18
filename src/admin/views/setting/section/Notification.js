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
import { useForm } from "react-hook-form";
import { PostTestEmail } from "../../../../requests/admin/AdminSettingRequest";
import { __ } from "@wordpress/i18n";

function Notification(props) {
  return (
    <Box sx={{ color: "black" }}>
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">{__("Email Settings", "acadlix")}</Typography>
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
            {__("Notify Course Purchase To", "acadlix")}
          </Typography>
        </Grid>
        <Grid item xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
            label={__("Student", "acadlix")}
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
            label={__("Admin", "acadlix")}
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
            {__("Notify Course Completion To", "acadlix")}
          </Typography>
        </Grid>
        <Grid item xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
            label={__("Student", "acadlix")}
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
            label={__("Admin", "acadlix")}
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
            {__("Notify Failed Transaction To", "acadlix")}
          </Typography>
        </Grid>
        <Grid item xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
            label={__("Student", "acadlix")}
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
            label={__("Admin", "acadlix")}
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

        {/* <TestingEmail /> */}
      </Grid>
    </Box>
  );
}

export default Notification;

const TestingEmail = (props) => {
  const methods = useForm({
    defaultValues: {
      to: "",
      subject: "",
      message: "",
    }
  });
  const testingEmailMutation = PostTestEmail();
  const handleSend = (data) => {
    testingEmailMutation?.mutate(data, {
      onSuccess: (data) => {
        console.log(data?.data);
      }
    });
  }
  return (
    <React.Fragment>
      <Grid item xs={12} lg={12}>
        <CustomTextField
          {...methods?.register("to")}
          fullWidth
          size="small"
          label={__("To", "acadlix")}
        />
      </Grid>
      <Grid item xs={12} lg={12}>
        <CustomTextField
          {...methods?.register("subject")}
          fullWidth
          size="small"
          label={__("Subject", "acadlix")}
        />
      </Grid>
      <Grid item xs={12} lg={12}>
        <CustomTextField
          {...methods?.register("message")}
          fullWidth
          size="small"
          label={__("Message", "acadlix")}
          multiline
          rows={3}
        />
      </Grid>
      <Grid item xs={12} lg={12}>
        <Button variant="contained" color="primary" onClick={methods?.handleSubmit(handleSend)}>
          {__("Send", "acadlix")}
        </Button>
      </Grid>
    </React.Fragment>
  )
}
