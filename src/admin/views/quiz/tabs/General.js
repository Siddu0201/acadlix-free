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
import CustomFeatureTooltip from "@acadlix/components/CustomFeatureTooltip";

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
          <CustomTypography>
            {__("Hide Quiz Title", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("Hides the quiz title on the front end.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/general-options/#hide-quiz-title`}
            />
          </CustomTypography>
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
          <CustomTypography>{__("Hide Restart Button", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("Hides the restart button on the front end.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/general-options/#hide-restart-button`}
            />
          </CustomTypography>
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
          <CustomTypography>{__("Show Clear Response Button", "acadlix")}
            <CustomFeatureTooltip
              plan={acadlixOptions?.isActive ? "open" : "closed"}
              msg={__("Enables clear response button to reset answers.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/general-options/#show-clear-response-button`}
            />
          </CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <ClearResponseButton
            {...props}
          />
        </React.Suspense>

        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Show Review Button", "acadlix")}
            <CustomFeatureTooltip
              plan={"open"}
              msg={__("Enables the Review button, allowing users to mark questions for review later.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/general-options/#show-review-button`}
            />
          </CustomTypography>
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
          <CustomTypography>{__("Quiz Time Type", "acadlix")}
            <CustomFeatureTooltip
              plan={acadlixOptions?.isActive ? "open" : "closed"}
              msg={__("Full Quiz Time: Applies total time limit to the quiz; auto-submits after time expires. <br/> Per Question Time: Enables time limit per question.<br/> Subject wise Time: Enables time limit per subject or section. Configure this option after creating a quiz from the quiz listing page from subject wise actions.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/general-options/#quiz-time-type`}
            />
          </CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <QuizTimeType
            {...props}
          />
        </React.Suspense>

        {/* Timing in sec (0 => infinity) */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Quiz Timing", "acadlix")}
            <CustomFeatureTooltip
              plan={"open"}
              msg={__("Enter total quiz time or per question time in seconds (0 = Unlimited).", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/general-options/#quiz-time-type`}
            />
          </CustomTypography>
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
                  slotProps={{
                    htmlInput: {
                      min: 0,
                    },
                  }}
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
          <CustomTypography>{__("Start date", "acadlix")}
            <CustomFeatureTooltip
              plan={acadlixOptions?.isActive ? "open" : "closed"}
              msg={__("Set the quiz start date and time. After this set date and time, your student will be able to attempt this quiz. Before that they will see quiz description and a message, \"Quiz will start on Day Month Date Year Time Time Zone (Time zone name) (Quiz will start on Thu Jan 01 2026 00:50:00 GMT+0530 (India Standard Time)", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/general-options/#start-date-and-end-date`}
            />
          </CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <StartDate
            {...props}
          />
        </React.Suspense>

        {/* Quiz End Date */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("End date", "acadlix")}
            <CustomFeatureTooltip
              plan={acadlixOptions?.isActive ? "open" : "closed"}
              msg={__("Set the quiz end date and time; quiz expires after this. Once this set date and time pass, the student will see a message (Quiz has expired)", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/general-options/#start-date-and-end-date`}
            />
          </CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <EndDate
            {...props}
          />
        </React.Suspense>

        {/* Start Button text */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Start Button text", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("Enables you to customize the start button text as per your requirement. eg. 'start quiz', 'start exam', 'start test'.", "acadlix")}
              placement="right-start"
            />
          </CustomTypography>
        </GridItem1>

        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTextField
            fullWidth
            label={__("Start Button text", "acadlix")}
            size="small"
            type="text"
            value={props?.watch("meta.quiz_settings.start_button_text") ?? "Start Quiz"}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.start_button_text", e?.target?.value, {
                shouldDirty: true,
              });
            }}
          />
        </GridItem1>

        {/* Auto Start */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Auto Start", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("Enables the quiz to start automatically without user interaction (Only for normal, check and continue, and question below each other modes).", "acadlix")}
              placement="right-start"
            />
          </CustomTypography>
        </GridItem1>

        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={<CustomSwitch />}
            checked={props?.watch("meta.quiz_settings.auto_start") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.auto_start", e?.target?.checked, {
                shouldDirty: true,
              });
            }}
            disabled={
              props?.watch("meta.mode") === "advance_mode"
            }
            label={__("Activate", "acadlix")}
          />
        </GridItem1>

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
          <CustomTypography>{__("Enable login/register", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("Enabling this option will display the login/register form for users who are not logged in.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/general-options/#login-options-%E2%80%94`}
            />
          </CustomTypography>
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
          <CustomTypography>{__("Per User Allowed Attempt", "acadlix")}
            <CustomFeatureTooltip
              plan={acadlixOptions?.isActive ? "open" : "closed"}
              msg={__("You can set a maximum limit for allowed attempts per user (0 = Unlimited). User must be logged in before starting the quiz.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/general-options/#per-user-allowed-attempt`}
            />  
          </CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <AllowedAttemptButton
            {...props}
          />
        </React.Suspense>

        {/* Quiz prerequisite */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Enable Prerequisite", "acadlix")}
            <CustomFeatureTooltip
              plan={acadlixOptions?.isActive ? "open" : "closed"}
              msg={__("If you enable this option, you can choose one or more quizzes, which student have to finish or Pass before he/she can start this quiz.<br/>In all selected quizzes statistic function have to be active. If it is not it will be activated automatically.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/general-options/#enable-prerequisite`}
            />
          </CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <PrerequisiteButton
            {...props}
          />
        </React.Suspense>

        <GridItem1 size={{ xs: 12, sm: 12, lg: 6 }} sx={{
          display: {
            xs: "none",
            sm: "none",
            lg: "block",
          }
        }}></GridItem1>
        {
          props?.watch("meta.quiz_settings.enable_prerequisite") &&
          <>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>{__("Select Prerequisite", "acadlix")}
                <CustomFeatureTooltip
                  plan={acadlixOptions?.isActive ? "open" : "closed"}
                  msg={__("Select one or more prerequisite quizzes that learners are required to attempt first. You may also define a minimum passing percentage for those quizzes to unlock this quiz.", "acadlix")}
                  placement="right-start"
                  redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/general-options/#enable-prerequisite`}
                />
              </CustomTypography>
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
