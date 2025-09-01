import React from "react";
import {
  FormControlLabel,
  Box,
  Typography,
  Divider,
  Alert,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import CustomSwitch from "@acadlix/components/CustomSwitch";
import GridItem1 from "@acadlix/components/GridItem1";
import CustomTextField from "@acadlix/components/CustomTextField";
import CustomTypography from "@acadlix/components/CustomTypography";
import { __ } from "@wordpress/i18n";

const ClearResponseButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
        /* webpackChunkName: "admin_quiz_pro_clear_response_button" */
        "@acadlix/pro/admin/quiz/tabs/general/ClearResponseButton"
      )
    : import(
        /* webpackChunkName: "admin_quiz_free_clear_response_button" */
        "@acadlix/free/admin/quiz/tabs/general/ClearResponseButton"
      )
);
const QuizTimeType = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
        /* webpackChunkName: "admin_quiz_pro_quiz_time_type" */
        "@acadlix/pro/admin/quiz/tabs/general/QuizTimeType"
      )
    : import(
        /* webpackChunkName: "admin_quiz_free_quiz_time_type" */
        "@acadlix/free/admin/quiz/tabs/general/QuizTimeType"
      )
);
const StartDate = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
        /* webpackChunkName: "admin_quiz_pro_start_date" */
        "@acadlix/pro/admin/quiz/tabs/general/StartDate"
      )
    : import(
        /* webpackChunkName: "admin_quiz_free_start_date" */
        "@acadlix/free/admin/quiz/tabs/general/StartDate"
      )
);
const EndDate = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
        /* webpackChunkName: "admin_quiz_pro_end_date" */
        "@acadlix/pro/admin/quiz/tabs/general/EndDate"
      )
    : import(
        /* webpackChunkName: "admin_quiz_free_end_date" */
        "@acadlix/free/admin/quiz/tabs/general/EndDate"
      )
);
const AllowedAttemptButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
        /* webpackChunkName: "admin_quiz_pro_allowed_attempt_button" */
        "@acadlix/pro/admin/quiz/tabs/general/AllowedAttemptButton"
      )
    : import(
        /* webpackChunkName: "admin_quiz_free_allowed_attempt_button" */
        "@acadlix/free/admin/quiz/tabs/general/AllowedAttemptButton"
      )
);
const PrerequisiteButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
        /* webpackChunkName: "admin_quiz_pro_prerequisite_button" */
        "@acadlix/pro/admin/quiz/tabs/general/PrerequisiteButton"
      )
    : import(
        /* webpackChunkName: "admin_quiz_free_prerequisite_button" */
        "@acadlix/free/admin/quiz/tabs/general/PrerequisiteButton"
      )
);
const PrerequisiteOptions = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
        /* webpackChunkName: "admin_quiz_pro_prerequisite_options" */
        "@acadlix/pro/admin/quiz/tabs/general/PrerequisiteOptions"
      )
    : import(
        /* webpackChunkName: "admin_quiz_free_prerequisite_options" */
        "@acadlix/free/admin/quiz/tabs/general/PrerequisiteOptions"
      )
);
const AdvanceOptions = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
        /* webpackChunkName: "admin_quiz_pro_advance_options" */
        "@acadlix/pro/admin/quiz/tabs/general/AdvanceOptions"
      )
    : import(
        /* webpackChunkName: "admin_quiz_free_advance_options" */
        "@acadlix/free/admin/quiz/tabs/general/AdvanceOptions"
      )
);

const General = (props) => {
  return (
    <Box>
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h4">{__("General Options", "acadlix")}</Typography>
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
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Hide Quiz Title", "acadlix")}</CustomTypography>
        </GridItem1>

        {/* Used to hide quiz title in a quiz */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={props?.watch("meta.quiz_settings.hide_quiz_title") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.hide_quiz_title", e?.target?.checked, {
                shouldDirty: true,
              });
            }}
            // disabled={
            //   props?.watch("meta.mode") === "advance_mode" &&
            //   props?.watch("meta.advance_mode_type") !== "advance_panel"
            // }
            label={__("Activate", "acadlix")}
          />
        </GridItem1>

        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Hide Restart Button", "acadlix")}</CustomTypography>
        </GridItem1>

        {/* User can restart quiz after submittion */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={<CustomSwitch />}
            checked={props?.watch("meta.quiz_settings.hide_restart_button") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.hide_restart_button", e?.target?.checked, {
                shouldDirty: true,
              });
            }}
            disabled={
              props?.watch("meta.mode") === "advance_mode"
            }
            label={__("Activate", "acadlix")}
          />
        </GridItem1>


        {/* Used to clear answer button to clear option selction */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Show Clear Response Button", "acadlix")}</CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <ClearResponseButton
            {...props}
          />
        </React.Suspense>

        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Show Review Button", "acadlix")}</CustomTypography>
        </GridItem1>

        {/* Button to review quiz  */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={<CustomSwitch />}
            checked={props?.watch("meta.quiz_settings.show_review_button") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.show_review_button", e?.target?.checked, {
                shouldDirty: true,
              });
            }}
            disabled={
              props?.watch("meta.mode") === "advance_mode" &&
              props?.watch("meta.advance_mode_type") !== "advance_panel"
            }
            label={__("Activate", "acadlix")}
          />
        </GridItem1>

        {/* Quiz time type 
          - full quiz time
          - per question time
        */}

        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Quiz Time Type", "acadlix")}</CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <QuizTimeType
            {...props}
          />
        </React.Suspense>

        {/* Timing in sec (0 => infinity) */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Quiz Timing", "acadlix")}</CustomTypography>
        </GridItem1>

        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          {
            props?.watch("meta.quiz_settings.quiz_timing_type") === "subject_wise_time" ?
            (
              <Alert
                severity="info"
              >
                {__("Set time from Subject-wise Actions on Quiz page.", "acadlix")}
              </Alert>
            )
            :
            (
              <CustomTextField
                fullWidth
                label={__("Timing (in sec, 0 => infinite)", "acadlix")}
                size="small"
                type="number"
                value={props?.watch("meta.quiz_settings.quiz_time") ?? 0}
                onChange={(e) => {
                  props?.setValue("meta.quiz_settings.quiz_time", Number(e?.target?.value), {
                    shouldDirty: true,
                  });
                }}
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
            )
          }
        </GridItem1>

        {/* Quiz start date */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Start date", "acadlix")}</CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <StartDate
            {...props}
          />
        </React.Suspense>

        {/* Quiz End Date */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("End date", "acadlix")}</CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <EndDate
            {...props}
          />
        </React.Suspense>

      </Grid>

      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h4">{__("Login Options", "acadlix")}</Typography>
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

        {/* If login is required for the quiz */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Enable login/register", "acadlix")}</CustomTypography>
        </GridItem1>

        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={props?.watch("meta.quiz_settings.enable_login_register") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.enable_login_register", e?.target?.checked, {
                shouldDirty: true,
              });
            }}
            disabled={
              props?.watch("meta.mode") === "advance_mode" &&
              props?.watch("meta.advance_mode_type") !== "advance_panel"
            }
            label={__("Activate", "acadlix")}
          />
        </GridItem1>

        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Per User Allowed Attempt", "acadlix")}</CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <AllowedAttemptButton
            {...props}
          />
        </React.Suspense>

        {/* Quiz prerequisite */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Enable Prerequisite", "acadlix")}</CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <PrerequisiteButton
            {...props}
          />
        </React.Suspense>

        <GridItem1 size={{ xs: 12, sm: 12, lg: 6 }}></GridItem1>
        {
          props?.watch("meta.quiz_settings.enable_prerequisite") &&
          <>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>{__("Select Prerequisite", "acadlix")}</CustomTypography>
            </GridItem1>

            <React.Suspense fallback={null}>
              <PrerequisiteOptions
                {...props}
              />
            </React.Suspense>
          </>
        }
      </Grid>


      {/* Advance Options */}
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h4">{__("Advance Options", "acadlix")}</Typography>
        <Divider />
      </Box>
      <React.Suspense fallback={null}>
        <AdvanceOptions
          {...props}
        />
      </React.Suspense>
    </Box>
  );
};

export default General;
