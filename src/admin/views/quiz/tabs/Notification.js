import React from "react";
import { Grid, FormControlLabel, Typography, Box } from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";
import CustomSwitch from "../../../../components/CustomSwitch";

const Notification = (props) => {
  const loadPage = () => {
    props?.loadEditor("admin_message", "admin_message");
    props?.loadEditor("student_message", "student_message");
    props?.loadEditor("instructor_message", "instructor_message");
  };

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      props?.removeEditor("admin_message");
      props?.removeEditor("student_message");
      props?.removeEditor("instructor_message");
      window.removeEventListener("load", loadPage);
    };
  }, []);

  return (
    <div>
      <Box sx={{ color: "black" }}>
        <Grid container>
          {/* 
            Admin email notification is used to send email to admin on quiz submition. Contain
            - To : Whom you want to send mail
            - From : To whom you want to send
            - Subject: Subject of the mail
            - Message: Message you want to send in mail
          */}
          <GridItem1 xs={12} lg={12}>
            <Typography variant="h6">Admin Email Notification</Typography>
          </GridItem1>
          <GridItem1 xs={12} lg={12}>
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={props?.watch("admin_email_notification") ?? false}
                  onChange={(e) => {
                    props?.setValue(
                      "admin_email_notification",
                      e?.target?.checked,
                      { shouldDirty: true }
                    );
                  }}
                />
              }
              label="Admin Email Notification"
            />
          </GridItem1>
          {/* Admin email id to whom you want to send email */}
          <GridItem1 xs={12} lg={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="To"
              onChange={(e) => {
                props?.setValue("admin_to", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
            />
          </GridItem1>
          {/* Student email id from whom you want to send email */}
          <GridItem1 xs={12} lg={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="From"
              onChange={(e) => {
                props?.setValue("admin_from", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
            />
          </GridItem1>
          {/* Subject of email */}
          <GridItem1 xs={12} lg={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="Subject"
              onChange={(e) => {
                props?.setValue("admin_subject", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
            />
          </GridItem1>
          {/* Message of email */}
          <GridItem1 xs={12} lg={12}>
            <textarea
              id="admin_message"
              style={{
                width: "100%",
              }}
              onChange={(e) => {
                let value = e?.target?.value;
                if (window.tinymce) {
                  const editor = window.tinymce.get("admin_message");
                  if (editor && editor.getContent() !== value) {
                    editor.setContent(value || "");
                  }
                }
                props.setValue("admin_message", value, {
                  shouldDirty: true,
                });
              }}
            />
          </GridItem1>

          {/* 
            Student email notification is used to send email to student on quiz submition. Contain
            - To : Whom you want to send mail
            - From : To whom you want to send
            - Subject: Subject of the mail
            - Message: Message you want to send in mail
          */}
          <GridItem1 xs={12} lg={12}>
            <Typography variant="h6">Student Email Notification</Typography>
          </GridItem1>
          <GridItem1 xs={12} lg={12}>
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={props?.watch("student_email_notification") ?? false}
                  onChange={(e) => {
                    props?.setValue(
                      "student_email_notification",
                      e?.target?.checked,
                      { shouldDirty: true }
                    );
                  }}
                />
              }
              label="Student Email Notification"
            />
          </GridItem1>
          {/* Student email to */}
          <GridItem1 xs={12} lg={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="To"
              onChange={(e) => {
                props?.setValue("student_to", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
            />
          </GridItem1>
          {/* From which email id you want to send */}
          <GridItem1 xs={12} lg={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="From"
              onChange={(e) => {
                props?.setValue("student_from", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
            />
          </GridItem1>
          {/* Subject of email */}
          <GridItem1 xs={12} lg={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="Subject"
              onChange={(e) => {
                props?.setValue("student_subject", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
            />
          </GridItem1>
          {/* Message of email */}
          <GridItem1 xs={12} lg={12}>
            <textarea
              id="student_message"
              style={{
                width: "100%",
              }}
              onChange={(e) => {
                let value = e?.target?.value;
                if (window.tinymce) {
                  const editor = window.tinymce.get("student_message");
                  if (editor && editor.getContent() !== value) {
                    editor.setContent(value || "");
                  }
                }
                props.setValue("student_message", value, {
                  shouldDirty: true,
                });
              }}
            />
          </GridItem1>

          {/* 
            Instructor Email Only for Panel Mode 
            Instructor email notification is used to send email to instructor on quiz submition. Contain
            - To : Whom you want to send mail
            - From : To whom you want to send
            - Subject: Subject of the mail
            - Message: Message you want to send in mail
          */}
          <GridItem1 xs={12} lg={12}>
            <Typography variant="h6">Instructor Email Notification</Typography>
          </GridItem1>
          <GridItem1 xs={12} lg={12}>
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={
                    props?.watch("instructor_email_notification") ?? false
                  }
                  onChange={(e) => {
                    props?.setValue(
                      "instructor_email_notification",
                      e?.target?.checked,
                      { shouldDirty: true }
                    );
                  }}
                />
              }
              label="Instructor Email Notification"
            />
          </GridItem1>
          {/* Instructor email */}
          <GridItem1 xs={12} lg={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="To"
              onChange={(e) => {
                props?.setValue("instructor_to", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
            />
          </GridItem1>
          {/* From email id */}
          <GridItem1 xs={12} lg={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="From"
              onChange={(e) => {
                props?.setValue("instructor_from", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
            />
          </GridItem1>
          {/* Subject of email */}
          <GridItem1 xs={12} lg={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="Subject"
              onChange={(e) => {
                props?.setValue("instructor_subject", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
            />
          </GridItem1>
          {/* Message of email */}
          <GridItem1 xs={12} lg={12}>
            <textarea
              id="instructor_message"
              style={{
                width: "100%",
              }}
              onChange={(e) => {
                let value = e?.target?.value;
                if (window.tinymce) {
                  const editor = window.tinymce.get("instructor_message");
                  if (editor && editor.getContent() !== value) {
                    editor.setContent(value || "");
                  }
                }
                props.setValue("instructor_message", value, {
                  shouldDirty: true,
                });
              }}
            />
          </GridItem1>
        </Grid>
      </Box>
    </div>
  );
};

export default Notification;
