import React from "react";
import {
  Box,
  FormControlLabel,
  Button,
  FormControl,
  RadioGroup,
  Radio,
  Typography,
  Divider,
  Tooltip,
  IconButton,
  Alert,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import GridItem1 from "@acadlix/components/GridItem1";
import CustomTextField from "@acadlix/components/CustomTextField";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import CustomTypography from "@acadlix/components/CustomTypography";
import { RiQuestionFill } from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";
import CustomFeatureTooltip from "@acadlix/components/CustomFeatureTooltip";

const SpeedButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_quiz_pro_speed_button" */
      "@acadlix/pro/admin/quiz/tabs/result/SpeedButton"
    )
    : import(
      /* webpackChunkName: "admin_quiz_free_speed_button" */
      "@acadlix/free/admin/quiz/tabs/result/SpeedButton"
    )
);
const PercentileButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_quiz_pro_percentile_button" */
      "@acadlix/pro/admin/quiz/tabs/result/PercentileButton"
    )
    : import(
      /* webpackChunkName: "admin_quiz_free_percentile_button" */
      "@acadlix/free/admin/quiz/tabs/result/PercentileButton"
    )
);
const AccuracyButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_quiz_pro_accuracy_button" */
      "@acadlix/pro/admin/quiz/tabs/result/AccuracyButton"
    )
    : import(
      /* webpackChunkName: "admin_quiz_free_accuracy_button" */
      "@acadlix/free/admin/quiz/tabs/result/AccuracyButton"
    )
);
const SubjectWiseButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_quiz_pro_subject_wise_button" */
      "@acadlix/pro/admin/quiz/tabs/result/SubjectWiseButton"
    )
    : import(
      /* webpackChunkName: "admin_quiz_free_subject_wise_button" */
      "@acadlix/free/admin/quiz/tabs/result/SubjectWiseButton"
    )
);
const RankButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_quiz_pro_rank_button" */
      "@acadlix/pro/admin/quiz/tabs/result/RankButton"
    )
    : import(
      /* webpackChunkName: "admin_quiz_free_rank_button" */
      "@acadlix/free/admin/quiz/tabs/result/RankButton"
    )
);
const PercentBasedText = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_quiz_pro_percent_based_text" */
      "@acadlix/pro/admin/quiz/tabs/result/PercentBasedText"
    )
    : import(
      /* webpackChunkName: "admin_quiz_free_percent_based_text" */
      "@acadlix/free/admin/quiz/tabs/result/PercentBasedText"
    )
);
const MinPercentOptions = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_quiz_pro_min_percent_options" */
      "@acadlix/pro/admin/quiz/tabs/result/MinPercentOptions"
    )
    : import(
      /* webpackChunkName: "admin_quiz_free_min_percent_options" */
      "@acadlix/free/admin/quiz/tabs/result/MinPercentOptions"
    )
);
const ResultComparissionButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_quiz_pro_result_comparission_button" */
      "@acadlix/pro/admin/quiz/tabs/result/ResultComparissionButton"
    )
    : import(
      /* webpackChunkName: "admin_quiz_free_result_comparission_button" */
      "@acadlix/free/admin/quiz/tabs/result/ResultComparissionButton"
    )
);
const AnswerSheetOptions = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_quiz_pro_answer_sheet_options" */
      "@acadlix/pro/admin/quiz/tabs/result/AnswerSheetOptions"
    )
    : import(
      /* webpackChunkName: "admin_quiz_free_answer_sheet_options" */
      "@acadlix/free/admin/quiz/tabs/result/AnswerSheetOptions"
    )
);

const Result = (props) => {

  return (
    <Box>
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h4">{__("Statistic Options", "acadlix")}</Typography>
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
        {/* Save Statistic */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Save Statistics", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("Enabling this option will save quiz statistics, such as analytics, answer sheets, and top lists.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#save-statistics`}
            />
          </CustomTypography>
        </GridItem1>

        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={props?.watch("meta.quiz_settings.save_statistic") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.save_statistic", e?.target?.checked, {
                shouldDirty: true,
              });
              if (!e?.target?.checked) {
                props?.setValue("meta.quiz_settings.show_percentile", false, {
                  shouldDirty: true
                });
                props?.setValue("meta.quiz_settings.show_average_score", false, {
                  shouldDirty: true
                });
              }
            }}
            // disabled={
            //   (props?.watch("meta.mode") === "advance_mode" &&
            //     props?.watch("meta.advance_mode_type") !== "advance_panel")
            // }
            label={__("Activate", "acadlix")}
          />
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 12, lg: 6 }}
          sx={{
            display: {
              xs: 'none',
              sm: 'none',
              lg: 'block'
            }
          }}
        ></GridItem1>

        {/* Statistic ip Lock */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Statistic IP Lock", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("Set this to avoid spamming. You can configure an IP lock duration (in seconds), meaning statistics from the same IP for this quiz will be saved only after the specified time has passed.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#save-statistics`}
            />
          </CustomTypography>
        </GridItem1>

        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTextField
            label={__("Statistic IP Lock", "acadlix")}
            variant="outlined"
            size="small"
            type="number"
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.statistic_ip_lock", Number(e?.target?.value), {
                shouldDirty: true,
              });
            }}
            value={props?.watch("meta.quiz_settings.statistic_ip_lock") ?? 0}
            disabled={
              !props?.watch("meta.quiz_settings.save_statistic")
            }
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
        </GridItem1>

        {/* Number of time statistic saved per user (0 => infinity) */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Save statistic no. of times", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("If users are allowed multiple attempts, you can set a limit for saving the statistics.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#save-statistics`}
            />
          </CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTextField
            label={__("Save statistic no. of times", "acadlix")}
            variant="outlined"
            size="small"
            type="number"
            onChange={(e) => {
              props?.setValue(
                "meta.quiz_settings.save_statistic_number_of_times",
                Number(e?.target?.value),
                { shouldDirty: true }
              );
            }}
            value={props?.watch("meta.quiz_settings.save_statistic_number_of_times") ?? 0}
            disabled={
              !props?.watch("meta.quiz_settings.save_statistic")
            }
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
        </GridItem1>
      </Grid>
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h4">{__("Result Options", "acadlix")}</Typography>
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
          <CustomTypography>{__("Hide Result", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("Enabling this will hide the result on the frontend.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#hide-result`}
            />
          </CustomTypography>
        </GridItem1>

        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={props?.watch("meta.quiz_settings.hide_result") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.hide_result", e?.target?.checked, {
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

        <GridItem1 size={{ xs: 12, sm: 12, lg: 6 }} sx={{
          display: {
            xs: 'none',
            sm: 'none',
            lg: 'block'
          }
        }}></GridItem1>

        {/* Used to hide negative marks in result  */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Hide Negative Marks", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("It will hide the negative marks card on the frontend.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#hide-negative-marks`}
            />
          </CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={
              <CustomSwitch
              />
            }
            checked={props?.watch("meta.quiz_settings.hide_negative_marks") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.hide_negative_marks", e?.target?.checked, {
                shouldDirty: true,
              });
            }}
            label={__("Activate", "acadlix")}
            disabled={
              props?.watch("meta.quiz_settings.hide_result")
              // ||
              // (props?.watch("meta.mode") === "advance_mode" &&
              //   props?.watch("meta.advance_mode_type") !== "advance_panel")
            }
          />
        </GridItem1>

        {/* Used to hide quiz time in result  */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Hide Quiz Time", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("It will hide the quiz time card on the frontend, which displays the total time a user took to finish the quiz.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#hide-quiz-time`}
            />
          </CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={props?.watch("meta.quiz_settings.hide_quiz_time") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.hide_quiz_time", e?.target?.checked, {
                shouldDirty: true,
              });
            }}
            label={__("Activate", "acadlix")}
            disabled={
              props?.watch("meta.quiz_settings.hide_result")
              // ||
              // (props?.watch("meta.mode") === "advance_mode" &&
              //   props?.watch("meta.advance_mode_type") !== "advance_panel")
            }
          />
        </GridItem1>

        {/* Its an average speed per question - total_time_taken/question  */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Show Speed", "acadlix")}
            <CustomFeatureTooltip
              plan={acadlixOptions?.isActive ? "open" : "closed"}
              msg={__("Enabling this will display the speed card, showing speed as Total Questions Answered / Total Time in minutes.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#show-speed`}
            />
          </CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <SpeedButton
            {...props}
          />
        </React.Suspense>

        {/* Used to calculate percentage on the basis of topper - my_marks/topper_marks * 100  */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Show Percentile", "acadlix")}
            <CustomFeatureTooltip
              plan={acadlixOptions?.isActive ? "open" : "closed"}
              msg={__("Enabling this will display the percentile scored by the user, calculated as (User's Score x 100) / Topper's Score.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#show-percentile`}
            />
          </CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <PercentileButton
            {...props}
          />
        </React.Suspense>

        {/* It tells the % of correct attempt from attempted question - total_correct/total_attempt * 100 */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Show Accuracy %", "acadlix")}
            <CustomFeatureTooltip
              plan={acadlixOptions?.isActive ? "open" : "closed"}
              msg={__("Enabling this will display the accuracy score of user, calculated as ( Total correct questions / Total attempted questions ) x 100.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#show-accuracy`}
            />
          </CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <AccuracyButton
            {...props}
          />
        </React.Suspense>

        {/* Used to Show Average Score  */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Show Average Score", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("This will display the quiz's average score, calculated as Sum of All Users' Scores / Total Users.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#show-average-score`}
            />
          </CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={props?.watch("meta.quiz_settings.show_average_score") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.show_average_score", e?.target?.checked, {
                shouldDirty: true,
              });
            }}
            label={__("Activate", "acadlix")}
            disabled={
              props?.watch("meta.quiz_settings.hide_result")
              // ||
              // (props?.watch("meta.mode") === "advance_mode" &&
              //   props?.watch("meta.advance_mode_type") !== "advance_panel") 
              ||
              !props?.watch("meta.quiz_settings.save_statistic")
            }
          />
        </GridItem1>

        {/* Used to show subject wise analysis of quiz  */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Show Subject Wise Analysis", "acadlix")}
            <CustomFeatureTooltip
              plan={acadlixOptions?.isActive ? "open" : "closed"}
              msg={__("This will display detailed subject-wise analysis, useful for quizzes with questions from multiple subjects.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#show-subject-wise-analysis`}
            />
          </CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <SubjectWiseButton
            {...props}
          />
        </React.Suspense>

        <GridItem1 size={{ xs: 12, sm: 12, lg: 6 }}
          sx={{
            display: {
              xs: 'none',
              sm: 'none',
              lg: 'block'
            }
          }}
        ></GridItem1>


        {/* 
          Used to show Status - Pass /Fail on the basis of Percent 
          On check - Minimum % to pass option will open
           */}
        <React.Suspense fallback={null}>
          <MinPercentOptions
            {...props}
          />
        </React.Suspense>
      </Grid>

      {/* End of Result options */}

      {/* Start of Answer Sheet options */}
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h4">{__("Answer Sheet Options", "acadlix")}</Typography>
        <Divider />
      </Box>
      <React.Suspense fallback={null}>
        <AnswerSheetOptions
          {...props}
        />
      </React.Suspense>
      {/* End of Answer Sheet options */}

      {/* Start of Leaderboard options */}
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h4">{__("Leaderboard Options", "acadlix")}</Typography>
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
          Options for Leaderboard contains
            - show rank
            - result comparision with topper
            - total number of entries
            - Users can apply multiple times (on selection show field for number of time 0 as default for infinity)
            - Number of times user can apply
            - automatically display leaderboard in quiz result - don't display(default) , below the result , in a button 
             */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Leaderboard", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("The leaderboard displays a list of top performers, with the highest scorer shown at the top and others ranked below. This feature helps increase student engagement and motivation in the quiz. You can enable or disable it and configure the settings based on your requirements.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#leaderboard-options`}
            />
          </CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={props?.watch("meta.quiz_settings.leaderboard") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.leaderboard", e?.target?.checked, {
                shouldDirty: true,
              });
              if (!e?.target?.checked) {
                props?.setValue("meta.quiz_settings.leaderboard_user_can_apply_multiple_times", false, {
                  shouldDirty: true
                });
                props?.setValue("meta.quiz_settings.show_rank", false, {
                  shouldDirty: true
                });
                props?.setValue("meta.quiz_settings.result_comparision_with_topper", false, {
                  shouldDirty: true
                });

              }
            }}
            label={__("Activate", "acadlix")}
          // disabled={
          //   props?.watch("meta.mode") === "advance_mode" &&
          //   props?.watch("meta.advance_mode_type") !== "advance_panel"
          // }
          />
        </GridItem1>

        {/* Total number of entries to be displayed in leaderboard */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Total number of enteries", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("You can set the total number of entries to display on the leaderboard on the frontend.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#total-number-of-entries`}
            />
          </CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTextField
            fullWidth
            size="small"
            label={__("Total number of enteries", "acadlix")}
            type="number"
            value={props?.watch("meta.quiz_settings.leaderboard_total_number_of_entries") ?? 10}
            onChange={(e) => {
              props?.setValue(
                "meta.quiz_settings.leaderboard_total_number_of_entries",
                Number(e?.target?.value),
                { shouldDirty: true }
              );
            }}
            disabled={!props?.watch("meta.quiz_settings.leaderboard")}
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
        </GridItem1>

        {/* Used to show rank  */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Show Rank", "acadlix")}
            <CustomFeatureTooltip
              plan={acadlixOptions?.isActive ? "open" : "closed"}
              msg={__("Enabling this will display the Rank card on frontend.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#show-rank`}
            />
          </CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <RankButton
            {...props}
          />
        </React.Suspense>

        {/* Option for Result Comparison with topper    */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Result comparison with topper", "acadlix")}
            <CustomFeatureTooltip
              plan={acadlixOptions?.isActive ? "open" : "closed"}
              msg={__("This will display a comparison of the user's result with the topper", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#result-comparison-with-topper`}
            />
          </CustomTypography>
        </GridItem1>
        <React.Suspense fallback={null}>
          <ResultComparissionButton
            {...props}
          />
        </React.Suspense>

        {/* User can apply multiple times for leaderboard */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("User can apply multiple times", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("Enabling this allows users to save multiple attempts in the leaderboard; you can also set a limit.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#user-can-apply-multiple-times`}
            />
          </CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={
              props?.watch("meta.quiz_settings.leaderboard_user_can_apply_multiple_times") ??
              false
            }
            onChange={(e) => {
              props?.setValue(
                "meta.quiz_settings.leaderboard_user_can_apply_multiple_times",
                e?.target?.checked,
                { shouldDirty: true }
              );
            }}
            label={__("Activate", "acadlix")}
            disabled={
              !props?.watch("meta.quiz_settings.leaderboard")
            }
          />
        </GridItem1>

        {/* Number of times user can apply for leaderboard */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Number of times user can apply", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("Use this option to define how many times a student's quiz results are allowed to appear on the leaderboard.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#number-of-times-a-user-can-apply`}
            />
          </CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTextField
            fullWidth
            size="small"
            label={__("Number of times (0 -> Infinity)", "acadlix")}
            type="number"
            value={
              props?.watch("meta.quiz_settings.leaderboard_apply_multiple_number_of_times") ?? 0
            }
            onChange={(e) => {
              props?.setValue(
                "meta.quiz_settings.leaderboard_apply_multiple_number_of_times",
                Number(e?.target?.value),
                { shouldDirty: true }
              );
            }}
            disabled={
              !props?.watch("meta.quiz_settings.leaderboard") ||
              !props?.watch("meta.quiz_settings.leaderboard_user_can_apply_multiple_times")
            }
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
        </GridItem1>

        {/* Option to show position of leaderboard in quiz result
            - don't display
            - below the result
            - in the button
          */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Automatically display leaderboard in quiz result", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("Choose how the leaderboard should be displayed to students after the quiz: don't display it, show it below the result, or display it via a button.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#automatically-display-leaderboard-in-quiz-results`}
            />
          </CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 9 }}>
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <RadioGroup
              row
              aria-labelledby="acadlix-result-display-leaderboard-in-quiz-result"
              onChange={(e) => {
                props?.setValue(
                  "meta.quiz_settings.display_leaderboard_in_quiz_result",
                  e?.target?.value,
                  { shouldDirty: true }
                );
              }}
            >
              <FormControlLabel
                value="do_not_display"
                label={__("don't display", "acadlix")}
                control={<Radio />}
                checked={
                  props?.watch("meta.quiz_settings.display_leaderboard_in_quiz_result") ===
                  "do_not_display"
                }
                disabled={!props?.watch("meta.quiz_settings.leaderboard")}
                slotProps={{
                  typography: {
                    variant: "body2",
                  }
                }}
              />
              <FormControlLabel
                value="below_the_result"
                label={__("below the result", "acadlix")}
                control={<Radio />}
                checked={
                  props?.watch("meta.quiz_settings.display_leaderboard_in_quiz_result") ===
                  "below_the_result"
                }
                disabled={!props?.watch("meta.quiz_settings.leaderboard")}
                slotProps={{
                  typography: {
                    variant: "body2",
                  }
                }}
              />
              <FormControlLabel
                value="in_the_button"
                label={__("in the button", "acadlix")}
                control={<Radio />}
                checked={
                  props?.watch("meta.quiz_settings.display_leaderboard_in_quiz_result") ===
                  "in_the_button"
                }
                disabled={!props?.watch("meta.quiz_settings.leaderboard")}
                slotProps={{
                  typography: {
                    variant: "body2",
                  }
                }}
              />
            </RadioGroup>
          </FormControl>
        </GridItem1>
      </Grid>
      {/* End leaderboard options */}

      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h4">{__("Result Text", "acadlix")}
          <CustomFeatureTooltip
            plan="open"
            msg={__("This will display a message when a user finishes a quiz. You can add text, images, etc.", "acadlix")}
            placement="right-start"
            redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#result-text-options`}
          />
        </Typography>
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
        {/* Show result Text
            - show simple text or based on %
          */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("% Based Result Text", "acadlix")}
            <CustomFeatureTooltip
              plan={acadlixOptions?.isActive ? "open" : "closed"}
              msg={__("Enabling this allows you to set multiple messages based on the score.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#result-text-options`}
            />
          </CustomTypography>
        </GridItem1>
        <React.Suspense fallback={null}>
          <PercentBasedText
            {...props}
          />
        </React.Suspense>

        <GridItem1 size={{ xs: 12, sm: 12, lg: 6 }} sx={{
          display: {
            xs: 'none',
            sm: 'none',
            lg: 'block'
          }
        }}></GridItem1>

        {/* Result Text - based on % */}
        {
          props?.watch("meta.quiz_settings.percent_based_result_text") ? (
            <React.Fragment>
              <GridItem1
                size={{ xs: 12, lg: 12 }}
                sx={{
                  display: props?.watch("meta.quiz_settings.percent_based_result_text")
                    ? "flex"
                    : "none",
                }}
              >
                <Alert severity="warning">
                  {__("If a student's result does not fall into any of the defined percentage ranges, no message will be displayed to them.", "acadlix")}
                </Alert>
              </GridItem1>
              {
                Array.isArray(props?.watch("meta.quiz_settings.result_text")) &&
                props?.watch("meta.quiz_settings.result_text")?.map((val, index) => (
                  <React.Fragment key={index}>
                    <GridItem1 size={{ xs: 12, lg: 2 }}>
                      <CustomTextField
                        fullWidth
                        size="small"
                        type="number"
                        label={__("Percentage (>=)", "acadlix")}
                        value={val?.percent ?? 0}
                        onChange={(e) => {
                          props?.setValue(
                            `meta.quiz_settings.result_text.${index}.percent`,
                            e?.target?.value,
                            { shouldDirty: true }
                          );
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
                    </GridItem1>
                    <GridItem1 size={{ xs: 12, lg: 10 }}>
                      <CustomTextField
                        fullWidth
                        size="small"
                        multiline
                        rows={3}
                        label={__("% text", "acadlix")}
                        value={val?.text ?? ""}
                        onChange={(e) => {
                          props?.setValue(
                            `meta.quiz_settings.result_text.${index}.text`,
                            e?.target?.value,
                            { shouldDirty: true }
                          );
                        }}
                      />
                    </GridItem1>
                  </React.Fragment>
                ))
              }
              <GridItem1
                size={{ xs: 12, lg: 12 }}
                sx={{
                  display: props?.watch("meta.quiz_settings.percent_based_result_text")
                    ? "flex"
                    : "none",
                }}
              >
                <Button
                  sx={{
                    marginY: 3,
                    marginRight: 2,
                  }}
                  variant="contained"
                  color="success"
                  onClick={(e) => {
                    props?.setValue(
                      "meta.quiz_settings.result_text",
                      [...props?.watch("meta.quiz_settings.result_text"), { percent: 0, text: "" }],
                      { shouldDirty: true }
                    );
                  }}
                >
                  {__("Add More", "acadlix")}
                </Button>
                <Button
                  sx={{
                    marginY: 3,
                    display: props?.watch("meta.quiz_settings.result_text")?.length > 1 ? "" : "none",
                  }}
                  variant="contained"
                  color="error"
                  onClick={(e) => {
                    props?.setValue(
                      "meta.quiz_settings.result_text",
                      props
                        ?.watch("meta.quiz_settings.result_text")
                        ?.filter(
                          (item, i) => i !== props?.watch("meta.quiz_settings.result_text")?.length - 1
                        ),
                      { shouldDirty: true }
                    );
                  }}
                >
                  {__("Remove", "acadlix")}
                </Button>
              </GridItem1>
            </React.Fragment>
          )
            :
            (
              <ResultText {...props} />
            )
        }
      </Grid>
    </Box >
  );
};

export default Result;

const ResultText = (props) => {
  const loadPage = () => {
    props?.loadEditor("result_text", "meta.quiz_settings.result_text");
  };

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      props?.removeEditor("result_text");
      window.removeEventListener("load", loadPage);
    };
  }, []);

  return (
    <React.Fragment>
      <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
        <CustomTypography>{__("Result Text", "acadlix")}</CustomTypography>
      </GridItem1>
      <GridItem1 size={{ xs: 12, sm: 6, lg: 9 }}>
        <textarea
          id="result_text"
          value={
            typeof props?.watch("meta.quiz_settings.result_text") === "string"
              ? props?.watch("meta.quiz_settings.result_text")
              : ""
          }
          style={{
            width: "100%",
          }}
          onChange={(e) => {
            let value = e?.target?.value;
            if (window.tinymce) {
              const editor = window.tinymce.get("result_text");
              if (editor && editor.getContent() !== value) {
                editor.setContent(value || "");
              }
            }
            props.setValue("meta.quiz_settings.result_text", value, {
              shouldDirty: true,
            });
          }}
        />
      </GridItem1>
    </React.Fragment>
  )
}
