import React from "react";
import {
  Box,
  FormControlLabel,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import CustomTextField from "@acadlix/components/CustomTextField";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import { useForm } from "react-hook-form";
import { PostTestEmail } from "@acadlix/requests/admin/AdminSettingRequest";
import { __ } from "@wordpress/i18n";
import CustomTypography from "@acadlix/components/CustomTypography";

function Notification(props) {
  return (
    <Box>
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h4">{__("Email Settings", "acadlix")}</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={4}
        sx={{
          alignItems: "center",
        }}
      >
        <Grid size={{ xs: 12, lg: 4 }}>
          <CustomTypography>
            {__("Notify Course Purchase To", "acadlix")}
          </CustomTypography>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
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
        <Grid size={{ xs: 12, lg: 4 }}>
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
        <Grid size={{ xs: 12, lg: 4 }}>
          <CustomTypography>
            {__("Notify Course Completion To", "acadlix")}
          </CustomTypography>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
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
        <Grid size={{ xs: 12, lg: 4 }}>
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
        <Grid size={{ xs: 12, lg: 4 }}>
          <CustomTypography>
            {__("Notify Failed Transaction To", "acadlix")}
          </CustomTypography>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
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
        <Grid size={{ xs: 12, lg: 4 }}>
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
        toast.success(__('Email sent successfully.', 'acadlix'));
      }
    });
  }
  return (
    <React.Fragment>
      <Grid size={{ xs: 12, lg: 12 }}>
        <CustomTextField
          {...methods?.register("to")}
          fullWidth
          size="small"
          label={__("To", "acadlix")}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 12 }}>
        <CustomTextField
          {...methods?.register("subject")}
          fullWidth
          size="small"
          label={__("Subject", "acadlix")}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 12 }}>
        <CustomTextField
          {...methods?.register("message")}
          fullWidth
          size="small"
          label={__("Message", "acadlix")}
          multiline
          rows={3}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 12 }}>
        <Button variant="contained" color="primary" onClick={methods?.handleSubmit(handleSend)}>
          {__("Send", "acadlix")}
        </Button>
      </Grid>
    </React.Fragment>
  )
}
