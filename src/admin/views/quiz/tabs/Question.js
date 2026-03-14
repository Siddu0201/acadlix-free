import React from "react";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import GridItem1 from "@acadlix/components/GridItem1";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import CustomTypography from "@acadlix/components/CustomTypography";
import { __ } from "@wordpress/i18n";
import CustomFeatureTooltip from "@acadlix/components/CustomFeatureTooltip";

const RandomLastOptionButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_quiz_pro_random_last_option_button" */
      "@acadlix/pro/admin/quiz/tabs/question/RandomLastOptionButton"
    )
    : import(
      /* webpackChunkName: "admin_quiz_free_random_last_option_button" */
      "@acadlix/free/admin/quiz/tabs/question/RandomLastOptionButton"
    )
);
const AttemptMoveForwardButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_quiz_pro_attempt_move_forward_button" */
      "@acadlix/pro/admin/quiz/tabs/question/AttemptMoveForwardButton"
    )
    : import(
      /* webpackChunkName: "admin_quiz_free_attempt_move_forward_button" */
      "@acadlix/free/admin/quiz/tabs/question/AttemptMoveForwardButton"
    )
);
const ForceUserButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_quiz_pro_force_user_button" */
      "@acadlix/pro/admin/quiz/tabs/question/ForceUserButton"
    )
    : import(
      /* webpackChunkName: "admin_quiz_free_force_user_button" */
      "@acadlix/free/admin/quiz/tabs/question/ForceUserButton"
    )
);

const Question = (props) => {
  return (
    <Box>
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h4">{__("Question Options", "acadlix")}</Typography>
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
        {/* Used to show morks - +points & -points in question */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Show Marks", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("Enabling this will display positive and negative marks in the frontend quiz.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/question-options/#show-marks`}
            />

          </CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={props?.watch("meta.quiz_settings.show_marks") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.show_marks", e?.target?.checked, {
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

        {/* Display subject in question */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Display Subject", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("Enabling this will display the question subject in the frontend quiz.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/question-options/#display-subject`}
            />
          </CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={props?.watch("meta.quiz_settings.display_subject") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.display_subject", e?.target?.checked, {
                shouldDirty: true,
              });
            }}
            disabled={props?.watch("meta.mode") === "advance_mode"}
            label={__("Activate", "acadlix")}
          />
        </GridItem1>

        {/* Show bullets in answer option- only for single and multiple choice */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>
            {__("Answer Bullet", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("Enabling this will set the bullets in the frontend quiz according to your selection (Numerical / Alphabetical).", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/question-options/#answer-bullet`}
            />
          </CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={props?.watch("meta.quiz_settings.answer_bullet") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.answer_bullet", e?.target?.checked, {
                shouldDirty: true,
              });
            }}
            disabled={props?.watch("meta.mode") === "advance_mode" && props?.watch("meta.advance_mode_type") !== "advance_panel"}
            label={__("Activate", "acadlix")}
          />

        </GridItem1>

        {/* Type of bullets to show Numeric/Alphabatic */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Answer Bullet Type", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("Numeric: It will set the answer bullets starting from 1. </br> Alphabet: It will set the answer bullets starting from A.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/question-options/#answer-bullet`}
            />
          </CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }} sx={{ display: 'flex', alignItems: 'center' }}>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.answer_bullet_type", e?.target?.value, { shouldDirty: true });
            }}
          >
            <FormControlLabel
              value="numeric"
              control={<Radio />}
              label={__("Numeric", "acadlix")}
              checked={props?.watch("meta.quiz_settings.answer_bullet_type") === "numeric"}
              disabled={!props?.watch("meta.quiz_settings.answer_bullet")}
              slotProps={{
                typography: {
                  variant: "body2",
                }
              }}
            />
            <FormControlLabel
              value="alphabet"
              control={<Radio />}
              label={__("Alphabet", "acadlix")}
              checked={props?.watch("meta.quiz_settings.answer_bullet_type") === "alphabet"}
              disabled={!props?.watch("meta.quiz_settings.answer_bullet")}
              slotProps={{
                typography: {
                  variant: "body2",
                }
              }}
            />
          </RadioGroup>
        </GridItem1>

        {/* Used to show question overview in top of quiz */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Question Overview", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("Enabling this will display the question overview panel in the quiz, student can navigate to the questions using this panel", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/question-options/#question-overview`}
            />
          </CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={props?.watch("meta.quiz_settings.question_overview") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.question_overview", e?.target?.checked, {
                shouldDirty: true,
              });
            }}
            disabled={props?.watch("meta.mode") === "advance_mode"}
            label={__("Activate", "acadlix")}
          />
        </GridItem1>

        {/* Used to show difficulty level in question */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Show Difficulty Level", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("Enabling this will display the question difficulty level in the frontend quiz.", "acadlix")}
              placement="right-start"
            />
          </CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={props?.watch("meta.quiz_settings.show_difficulty_level") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.show_difficulty_level", e?.target?.checked, {
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

        {/* Used to randomize question */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Random Question", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("Enabling this option will randomize the question order for each user/attempt in the frontend quiz.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/question-options/#random-question`}
            />
          </CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={props?.watch("meta.quiz_settings.random_question") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.random_question", e?.target?.checked, {
                shouldDirty: true,
              });
            }}
            label={__("Activate", "acadlix")}
          />
        </GridItem1>

        {/* Used to randomize answer options - only for single and multiple choice */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Random Option", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("Enabling this option will randomize the options order for each user/attempt in the frontend quiz.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/question-options/#random-options`}
            />
          </CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={props?.watch("meta.quiz_settings.random_option") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.random_option", e?.target?.checked, {
                shouldDirty: true,
              });
            }}
            label={__("Activate", "acadlix")}
          />
        </GridItem1>

        {/* Used to stop randomization of last option */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Do not randomize last option", "acadlix")}
            <CustomFeatureTooltip
              plan={acadlixOptions?.isActive ? "open" : "closed"}
              msg={__("This will fix the position of the last option to the end and randomize all other options. Useful for questions with options like 'None of the above' or 'All of the above'.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/question-options/#random-options`}
            />
          </CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <RandomLastOptionButton
            {...props}
          />
        </React.Suspense>

        {/* Used to hide question numbering  */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Hide Question Numbering", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("When enabled, question numbers will be hidden in the front-end quiz interface, helping create a cleaner layout and reducing distractions for learners.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/question-options/#hide-question-numbering`}
            />
          </CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={props?.watch("meta.quiz_settings.hide_question_numbering") ?? false}
            onChange={(e) => {
              props?.setValue(
                "meta.quiz_settings.hide_question_numbering",
                e?.target?.checked,
                { shouldDirty: true }
              );
            }}
            disabled={props?.watch("meta.mode") === "advance_mode" && props?.watch("meta.advance_mode_type") !== "advance_panel"}
            label={__("Activate", "acadlix")}
          />
        </GridItem1>

        {/* Sort question according to subject */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Sort Questions By Subject", "acadlix")}
            <CustomFeatureTooltip
              plan="open"
              msg={__("This will sort all questions alphabetically based on their subjects.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/question-options/#sort-questions-by-subject`}
            />
          </CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={props?.watch("meta.quiz_settings.sort_by_subject") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.sort_by_subject", e?.target?.checked, {
                shouldDirty: true,
              });
            }}
            disabled={
              props?.watch("meta.mode") === "advance_mode"
            }
            label={__("Activate", "acadlix")}
          />
        </GridItem1>

        {/* Attempt question and move forward automatically- only for single choice */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Attempt & move forward automatically", "acadlix")}
            <CustomFeatureTooltip
              plan={acadlixOptions?.isActive ? "open" : "closed"}
              msg={__("Users will automatically navigate to the next question after selecting an option. This feature is only available for single-choice and true-false questions.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/question-options/#attempt-move-forward-automatically`}
            />
          </CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <AttemptMoveForwardButton
            {...props}
          />
        </React.Suspense>

        {/* Force user to answer each question */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Force User to Answer Each Question", "acadlix")}
            <CustomFeatureTooltip
              plan={acadlixOptions?.isActive ? "open" : "closed"}
              msg={__("Enabling this option will allow users to finish the quiz only after answering all questions or when time has elapsed.", "acadlix")}
              placement="right-start"
              redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/question-options/#force-user-to-answer-each-question`}
            />
          </CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <ForceUserButton
            {...props}
          />
        </React.Suspense>

        {/* Disable hint option */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Disable Hint", "acadlix")}</CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={props?.watch("meta.quiz_settings.disable_hint") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.disable_hint", e?.target?.checked, {
                shouldDirty: true,
              });
            }}
            label={__("Activate", "acadlix")}
          />
        </GridItem1>
      </Grid>
    </Box>
  );
};

export default Question;
