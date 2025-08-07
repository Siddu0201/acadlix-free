import React from "react";
import { FormControlLabel, Typography, Box, Divider } from "@mui/material";
import Grid from '@mui/material/Grid';
import GridItem1 from "@acadlix/components/GridItem1";
import CustomTextField from "@acadlix/components/CustomTextField";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import CustomTypography from "@acadlix/components/CustomTypography";
import { __ } from "@wordpress/i18n";

const Notification = (props) => {
  return (
    <div>
      <Box>
        <Box
          sx={{
            marginY: 2,
          }}
        >
          <Typography variant="h4">{__("Admin Email Notification", "acadlix")}</Typography>
          <Divider />
        </Box>
        <Grid 
          container 
          spacing={{
            xs: 2,
            sm: 4,
          }} 
          alignItems="center"
        >
          {/* 
            Admin email notification is used to send email to admin on quiz submition. Contain
            - To : Whom you want to send mail
            - From : To whom you want to send
            - Subject: Subject of the mail
            - Message: Message you want to send in mail
          */}
          <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
            <CustomTypography>{__("Enable Admin Email Notification", "acadlix")}</CustomTypography>
          </GridItem1>
          <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
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
              label={__("Activate", "acadlix")}
            />
          </GridItem1>
          <GridItem1 size={{ xs: 12, sm: 12, lg: 6 }}></GridItem1>

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
          <Typography variant="h6">{__("Student Email Notification", "acadlix")}</Typography>
          <Divider />
        </Box>
        <Grid
          container
          spacing={{
            xs: 2,
            sm: 4,
          }}
          alignItems="center"
        >

          {/* 
            Student email notification is used to send email to student on quiz submition. Contain
            - To : Whom you want to send mail
            - From : To whom you want to send
            - Subject: Subject of the mail
            - Message: Message you want to send in mail
          */}

          <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
            <CustomTypography>{__("Enable Student Email Notification", "acadlix")}</CustomTypography>
          </GridItem1>
          <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
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
              label={__("Activate", "acadlix")}
            />
          </GridItem1>
          <GridItem1 size={{ xs: 12, sm: 12, lg: 6 }}></GridItem1>

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
      <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
        <CustomTypography>{__("To", "acadlix")}</CustomTypography>
      </GridItem1>
      <GridItem1 size={{ xs: 12, sm: 6, lg: 9 }}>
        <CustomTextField
          fullWidth
          size="small"
          label={__("To", "acadlix")}
          value={props?.watch("meta.quiz_settings.admin_to") ?? ""}
          onChange={(e) => {
            props?.setValue("meta.quiz_settings.admin_to", e?.target?.value, {
              shouldDirty: true,
            });
          }}
        />
      </GridItem1>

      {/* Student email id from whom you want to send email */}
      <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
        <CustomTypography>{__("From", "acadlix")}</CustomTypography>
      </GridItem1>
      <GridItem1 size={{ xs: 12, sm: 6, lg: 9 }}>
        <CustomTextField
          fullWidth
          size="small"
          label={__("From", "acadlix")}
          value={props?.watch("meta.quiz_settings.admin_from") ?? ""}
          onChange={(e) => {
            props?.setValue("meta.quiz_settings.admin_from", e?.target?.value, {
              shouldDirty: true,
            });
          }}
        />
      </GridItem1>


      {/* Subject of email */}
      <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
        <CustomTypography>{__("Subject", "acadlix")}</CustomTypography>
      </GridItem1>
      <GridItem1 size={{ xs: 12, sm: 6, lg: 9 }}>
        <CustomTextField
          fullWidth
          size="small"
          label={__("Subject", "acadlix")}
          value={props?.watch("meta.quiz_settings.admin_subject") ?? ""}
          onChange={(e) => {
            props?.setValue("meta.quiz_settings.admin_subject", e?.target?.value, {
              shouldDirty: true,
            });
          }}
        />
      </GridItem1>

      {/* Message of email */}
      <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
        <CustomTypography>{__("Message", "acadlix")}</CustomTypography>
      </GridItem1>
      <GridItem1 size={{ xs: 12, sm: 6, lg: 9 }}>
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
      <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}></GridItem1>
      <GridItem1 size={{ xs: 12, sm: 6, lg: 9 }}>
        <Typography variant="body1"><b>{__("Allowed variables.", "acadlix")}</b></Typography>
        <Typography variant="body2">
          $userId - {__("User-ID", "acadlix")} <br />
          $username - {__("Username", "acadlix")} <br />
          $quizname - {__("Quiz-Name", "acadlix")} <br />
          $result - {__("Result in percent", "acadlix")} <br />
          $points - {__("Points", "acadlix")} <br />
          $ip - {__("IP-address of the user", "acadlix")} <br />
        </Typography>
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
      <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
        <CustomTypography>{__("From", "acadlix")}</CustomTypography>
      </GridItem1>
      <GridItem1 size={{ xs: 12, sm: 6, lg: 9 }}>
        <CustomTextField
          fullWidth
          size="small"
          label={__("From", "acadlix")}
          value={props?.watch("meta.quiz_settings.student_from") ?? ""}
          onChange={(e) => {
            props?.setValue("meta.quiz_settings.student_from", e?.target?.value, {
              shouldDirty: true,
            });
          }}
        />
      </GridItem1>

      {/* Subject of email */}
      <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
        <CustomTypography>{__("Subject", "acadlix")}</CustomTypography>
      </GridItem1>
      <GridItem1 size={{ xs: 12, sm: 6, lg: 9 }}>
        <CustomTextField
          fullWidth
          size="small"
          label={__("Subject", "acadlix")}
          value={props?.watch("meta.quiz_settings.student_subject") ?? ""}
          onChange={(e) => {
            props?.setValue("meta.quiz_settings.student_subject", e?.target?.value, {
              shouldDirty: true,
            });
          }}
        />
      </GridItem1>

      {/* Message of email */}
      <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
        <CustomTypography>{__("Message", "acadlix")}</CustomTypography>
      </GridItem1>
      <GridItem1 size={{ xs: 12, sm: 6, lg: 9 }}>
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
      <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}></GridItem1>
      <GridItem1 size={{ xs: 12, sm: 6, lg: 9 }}>
        <Typography variant="body1"><b>{__("Allowed variables.", "acadlix")}</b></Typography>
        <Typography variant="body2">
          $userId - {__("User-ID", "acadlix")} <br />
          $username - {__("Username", "acadlix")} <br />
          $quizname - {__("Quiz-Name", "acadlix")} <br />
          $result - {__("Result in percent", "acadlix")} <br />
          $points - {__("Points", "acadlix")} <br />
          $ip - {__("IP-address of the user", "acadlix")} <br />
        </Typography>
      </GridItem1>
    </React.Fragment>
  )
}
