import React from "react";
import { Grid, FormControlLabel, Typography, Box, Divider } from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";
import CustomSwitch from "../../../../components/CustomSwitch";
import CustomTypography from "../../../../components/CustomTypography";

const Notification = (props) => {
  return (
    <div>
      <Box sx={{ color: "black" }}>
        <Box
          sx={{
            marginY: 2,
          }}
        >
          <Typography variant="h6">Admin Email Notification</Typography>
          <Divider />
        </Box>
        <Grid container spacing={3} alignItems="center">
          {/* 
            Admin email notification is used to send email to admin on quiz submition. Contain
            - To : Whom you want to send mail
            - From : To whom you want to send
            - Subject: Subject of the mail
            - Message: Message you want to send in mail
          */}
          <GridItem1 xs={12} sm={6} lg={3}>
            <CustomTypography>Enable Admin Email Notification</CustomTypography>
          </GridItem1>
          <GridItem1 xs={12} sm={6} lg={3}>
            <FormControlLabel
              control={
                <CustomSwitch />
              }
              checked={props?.watch("meta.quiz_settings.admin_email_notification") ?? false}
              onChange={(e) => {
                props?.setValue(
                  "meta.quiz_settings.admin_email_notification",
                  e?.target?.checked,
                  { shouldDirty: true }
                );
              }}
              label="Activate"
            />
          </GridItem1>
          <GridItem1 xs={12} sm={12} lg={6}></GridItem1>
          
          {
            props?.watch("meta.quiz_settings.admin_email_notification") && (
              <AdminNotification {...props} />
            )
          }
        </Grid>

        <Box
          sx={{
            marginY: 2,
          }}
        >
          <Typography variant="h6">Student Email Notification</Typography>
          <Divider />
        </Box>
        <Grid
          container
          spacing={3}
          alignItems="center"
        >

          {/* 
            Student email notification is used to send email to student on quiz submition. Contain
            - To : Whom you want to send mail
            - From : To whom you want to send
            - Subject: Subject of the mail
            - Message: Message you want to send in mail
          */}

          <GridItem1 xs={12} sm={6} lg={3}>
            <CustomTypography>Enable Student Email Notification</CustomTypography>
          </GridItem1>
          <GridItem1 xs={12} sm={6} lg={3}>
            <FormControlLabel
              control={
                <CustomSwitch />
              }
              checked={props?.watch("meta.quiz_settings.student_email_notification") ?? false}
              onChange={(e) => {
                props?.setValue(
                  "meta.quiz_settings.student_email_notification",
                  e?.target?.checked,
                  { shouldDirty: true }
                );
              }}
              label="Activate"
            />
          </GridItem1>
          <GridItem1 xs={12} sm={12} lg={6}></GridItem1>
          
          {
            props?.watch("meta.quiz_settings.student_email_notification") && (
              <StudentNotification {...props} />
            )
          }
        </Grid>
      </Box>
    </div>
  );
};

export default Notification;

const AdminNotification = (props) => {
  const loadPage = () => {
    props?.loadEditor("admin_message", "meta.quiz_settings.admin_message");
  };

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      props?.removeEditor("admin_message");
      window.removeEventListener("load", loadPage);
    };
  }, []);
  return (
    <React.Fragment>
      {/* Admin email id to whom you want to send email */}
      <GridItem1 xs={12} sm={6} lg={3}>
        <CustomTypography>To</CustomTypography>
      </GridItem1>
      <GridItem1 xs={12} sm={6} lg={9}>
        <CustomTextField
          fullWidth
          size="small"
          label="To"
          value={props?.watch("meta.quiz_settings.admin_to") ?? ""}
          onChange={(e) => {
            props?.setValue("meta.quiz_settings.admin_to", e?.target?.value, {
              shouldDirty: true,
            });
          }}
        />
      </GridItem1>

      {/* Student email id from whom you want to send email */}
      <GridItem1 xs={12} sm={6} lg={3}>
        <CustomTypography>From</CustomTypography>
      </GridItem1>
      <GridItem1 xs={12} sm={6} lg={9}>
        <CustomTextField
          fullWidth
          size="small"
          label="From"
          value={props?.watch("meta.quiz_settings.admin_from") ?? ""}
          onChange={(e) => {
            props?.setValue("meta.quiz_settings.admin_from", e?.target?.value, {
              shouldDirty: true,
            });
          }}
        />
      </GridItem1>


      {/* Subject of email */}
      <GridItem1 xs={12} sm={6} lg={3}>
        <CustomTypography>Subject</CustomTypography>
      </GridItem1>
      <GridItem1 xs={12} sm={6} lg={9}>
        <CustomTextField
          fullWidth
          size="small"
          label="Subject"
          value={props?.watch("meta.quiz_settings.admin_subject") ?? ""}
          onChange={(e) => {
            props?.setValue("meta.quiz_settings.admin_subject", e?.target?.value, {
              shouldDirty: true,
            });
          }}
        />
      </GridItem1>

      {/* Message of email */}
      <GridItem1 xs={12} sm={6} lg={3}>
        <CustomTypography>Message</CustomTypography>
      </GridItem1>
      <GridItem1 xs={12} sm={6} lg={9}>
        <textarea
          id="admin_message"
          style={{
            width: "100%",
          }}
          value={props?.watch("meta.quiz_settings.admin_message") ?? ""}
          onChange={(e) => {
            let value = e?.target?.value;
            if (window.tinymce) {
              const editor = window.tinymce.get("admin_message");
              if (editor && editor.getContent() !== value) {
                editor.setContent(value || "");
              }
            }
            props.setValue("meta.quiz_settings.admin_message", value, {
              shouldDirty: true,
            });
          }}
        />
      </GridItem1>
    </React.Fragment>
  )
}

const StudentNotification = (props) => {
  const loadPage = () => {
    props?.loadEditor("student_message", "meta.quiz_settings.student_message");
  };

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      props?.removeEditor("student_message");
      window.removeEventListener("load", loadPage);
    };
  }, []);
  return (
    <React.Fragment>
      {/* From which email id you want to send */}
      <GridItem1 xs={12} sm={6} lg={3}>
        <CustomTypography>From</CustomTypography>
      </GridItem1>
      <GridItem1 xs={12} sm={6} lg={9}>
        <CustomTextField
          fullWidth
          size="small"
          label="From"
          value={props?.watch("meta.quiz_settings.student_from") ?? ""}
          onChange={(e) => {
            props?.setValue("meta.quiz_settings.student_from", e?.target?.value, {
              shouldDirty: true,
            });
          }}
        />
      </GridItem1>

      {/* Subject of email */}
      <GridItem1 xs={12} sm={6} lg={3}>
        <CustomTypography>Subject</CustomTypography>
      </GridItem1>
      <GridItem1 xs={12} sm={6} lg={9}>
        <CustomTextField
          fullWidth
          size="small"
          label="Subject"
          value={props?.watch("meta.quiz_settings.student_subject") ?? ""}
          onChange={(e) => {
            props?.setValue("meta.quiz_settings.student_subject", e?.target?.value, {
              shouldDirty: true,
            });
          }}
        />
      </GridItem1>

      {/* Message of email */}
      <GridItem1 xs={12} sm={6} lg={3}>
        <CustomTypography>Message</CustomTypography>
      </GridItem1>
      <GridItem1 xs={12} sm={6} lg={9}>
        <textarea
          id="student_message"
          style={{
            width: "100%",
          }}
          value={props?.watch("meta.quiz_settings.student_message") ?? ""}
          onChange={(e) => {
            let value = e?.target?.value;
            if (window.tinymce) {
              const editor = window.tinymce.get("student_message");
              if (editor && editor.getContent() !== value) {
                editor.setContent(value || "");
              }
            }
            props.setValue("meta.quiz_settings.student_message", value, {
              shouldDirty: true,
            });
          }}
        />
      </GridItem1>
    </React.Fragment>
  )
}
