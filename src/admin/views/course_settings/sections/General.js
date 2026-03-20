import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import CustomTextField from "@acadlix/components/CustomTextField";
import { __ } from "@wordpress/i18n";
import CustomFeatureTooltip from "@acadlix/components/CustomFeatureTooltip";

const StartDate = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import(
      /* webpackChunkName: "admin_course_settings_general_start_date" */
      "@acadlix/pro/admin/course_settings/StartDate") :
    import(
      /* webpackChunkName: "admin_course_settings_general_start_date" */
      "@acadlix/free/admin/course_settings/StartDate")
);

const EndDate = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import(
      /* webpackChunkName: "admin_course_settings_general_end_date" */
      "@acadlix/pro/admin/course_settings/EndDate") :
    import(
      /* webpackChunkName: "admin_course_settings_general_end_date" */
      "@acadlix/free/admin/course_settings/EndDate")
);

const LockCompletedContent = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import(
      /* webpackChunkName: "admin_course_settings_general_lock_completed_content" */
      "@acadlix/pro/admin/course_settings/LockCompletedContent") :
    import(
      /* webpackChunkName: "admin_course_settings_general_lock_completed_content" */
      "@acadlix/free/admin/course_settings/LockCompletedContent")
);

const DisableMarkAsIncomplete = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import(
      /* webpackChunkName: "admin_course_settings_general_disable_mark_as_incomplete" */
      "@acadlix/pro/admin/course_settings/DisableMarkAsIncomplete") :
    import(
      /* webpackChunkName: "admin_course_settings_general_disable_mark_as_incomplete" */
      "@acadlix/free/admin/course_settings/DisableMarkAsIncomplete")
);

const General = (props) => {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 12 }}>
          <Typography
            variant="h4"
          >
            {__("Course Duration", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                variant="h6"
              >
                {__("Duration Type", "acadlix")}
                <CustomFeatureTooltip
                  plan={"open"}
                  msg={__("Choose from the available options to set the duration type, such as weeks, days, hours, or minutes. This duration will be displayed on the front-end single course page.", "acadlix")}
                  placement="right-start"
                  redirectTo={`${acadlixOptions?.acadlix_docs_url}course-management/creating-a-new-course-in-acadlix/#general`}
                />
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <FormControl
                fullWidth
                size="small"
              >
                <InputLabel id="demo-simple-select-label">
                  {__("Select Type", "acadlix")}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={props?.watch("meta.duration.type")}
                  label={__("Select Type", "acadlix")}
                  onChange={(e) => {
                    props?.setValue("meta.duration.type", e?.target?.value, {
                      shouldDirty: true,
                    });
                  }}
                >
                  <MenuItem value="week">{__("Week(s)", "acadlix")}</MenuItem>
                  <MenuItem value="day">{__("Day(s)", "acadlix")}</MenuItem>
                  <MenuItem value="hour">{__("Hour(s)", "acadlix")}</MenuItem>
                  <MenuItem value="minute">{__("Minute(s)", "acadlix")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                variant="h6"
              >
                {__("Duration", "acadlix")}
                <CustomFeatureTooltip
                  plan={"open"}
                  msg={__("Enter the duration value for the course according to the duration type you selected (weeks, days, hours, or minutes).", "acadlix")}
                  placement="right-start"
                  redirectTo={`${acadlixOptions?.acadlix_docs_url}course-management/creating-a-new-course-in-acadlix/#general`}
                />
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <CustomTextField
                fullWidth
                size="small"
                type="number"
                value={props?.watch("meta.duration.duration")}
                slotProps={{
                  htmlInput: {
                    min: 0,
                  },
                }}
                onChange={(e) => {
                  props?.setValue("meta.duration.duration", Number(e?.target?.value), {
                    shouldDirty: true,
                  });
                }}
                onKeyDown={props?.handleKeyDown}
                sx={{
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 12 }}>
          <Typography
            variant="h4"
          >
            {__("Registration Scheduling", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                variant="h6"
              >
                {__("Registration Start Date", "acadlix")}
                <CustomFeatureTooltip
                  plan={acadlixOptions?.isActive ? "open" : "closed"}
                  msg={__("Specify the course registration start date and time. Students will be able to purchase the course once this date and time are reached.", "acadlix")}
                  placement="right-start"
                  redirectTo={`${acadlixOptions?.acadlix_docs_url}course-management/creating-a-new-course-in-acadlix/#general`}
                />
              </Typography>
            </Grid>
            <React.Suspense fallback={null}>
              <StartDate {...props} />
            </React.Suspense>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                variant="h6"
              >
                {__("Registration End Date", "acadlix")}
                <CustomFeatureTooltip
                  plan={acadlixOptions?.isActive ? "open" : "closed"}
                  msg={__("Define the course registration end date and time. After this deadline, students will no longer be able to purchase the course. If left unset, registration will remain open indefinitely.", "acadlix")}
                  placement="right-start"
                  redirectTo={`${acadlixOptions?.acadlix_docs_url}course-management/creating-a-new-course-in-acadlix/#general`}
                />
              </Typography>
            </Grid>
            <React.Suspense fallback={null}>
              <EndDate {...props} />
            </React.Suspense>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                variant="h6"
              >
                {__("Difficulty Level", "acadlix")}
                <CustomFeatureTooltip
                  plan={"open"}
                  msg={__("Sets the Difficulty Level of the course", "acadlix")}
                  placement="right-start"
                  redirectTo={`${acadlixOptions?.acadlix_docs_url}course-management/creating-a-new-course-in-acadlix/#general`}
                />
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <FormControl
                fullWidth
                size="small"
              >
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={props?.watch("meta.difficulty_level")}
                  onChange={(e) => {
                    props?.setValue("meta.difficulty_level", e?.target?.value, {
                      shouldDirty: true,
                    });
                  }}
                >
                  <MenuItem value="all_levels">{__("All Levels", "acadlix")}</MenuItem>
                  <MenuItem value="beginner">{__("Beginner", "acadlix")}</MenuItem>
                  <MenuItem value="intermediate">{__("Intermediate", "acadlix")}</MenuItem>
                  <MenuItem value="advance">{__("Advance", "acadlix")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                variant="h6"
              >
                {__("Enable Certificate", "acadlix")}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <FormControlLabel
                label={__("Activate", "acadlix")}
                control={
                  <Checkbox />
                }
                onChange={(e) => {
                  if (e?.target?.checked !== undefined) {
                    props?.setValue("meta.enable_certificate", e?.target?.checked, {
                      shouldDirty: true,
                    });
                  }
                }}
                checked={props?.watch("meta.enable_certificate") ?? false}
                onKeyDown={props?.handleKeyDown}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                variant="h6"
              >
                {__("Lock Completed Content", "acadlix")}
                <CustomFeatureTooltip
                  plan={acadlixOptions?.isActive ? "open" : "closed"}
                  msg={__("Prevents students from reopening or accessing content after completing it.", "acadlix")}
                />
              </Typography>
            </Grid>
            <React.Suspense fallback={null}>
              <LockCompletedContent {...props} />
            </React.Suspense>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                variant="h6"
              >
                {__("Disable Mark As Incomplete", "acadlix")}
                <CustomFeatureTooltip
                  plan={acadlixOptions?.isActive ? "open" : "closed"}
                  msg={__("Prevents students from marking completed content as incomplete.", "acadlix")}
                />
              </Typography>
            </Grid>
            <React.Suspense fallback={null}>
              <DisableMarkAsIncomplete {...props} />
            </React.Suspense>
          </Grid>
        </Grid>
        {/* <Grid size={{  xs: 12 ,  sm: 6  }}>
          <Grid container  spacing={2}>
            <Grid size={{  xs: 12 ,  sm: 12  }}>
              <Typography
                variant="h6"
              >
                {__("Q&A", "acadlix")}
              </Typography>
            </Grid>
            <Grid size={{  xs: 12 ,  sm: 12  }}>
              <FormControlLabel label={__("Activate", "acadlix")} control={<Checkbox />} />
            </Grid>
          </Grid>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default General;
