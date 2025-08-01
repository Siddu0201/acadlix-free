import React from "react";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
  Typography,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import GridItem1 from "@acadlix/components/GridItem1";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import CustomTypography from "@acadlix/components/CustomTypography";
import { RiQuestionFill } from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";

const RandomLastOptionButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import("@acadlix/pro/admin/quiz/tabs/question/RandomLastOptionButton") :
    import("@acadlix/free/admin/quiz/tabs/question/RandomLastOptionButton")
);
const AttemptMoveForwardButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import("@acadlix/pro/admin/quiz/tabs/question/AttemptMoveForwardButton") :
    import("@acadlix/free/admin/quiz/tabs/question/AttemptMoveForwardButton")
);
const ForceUserButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import("@acadlix/pro/admin/quiz/tabs/question/ForceUserButton") :
    import("@acadlix/free/admin/quiz/tabs/question/ForceUserButton")
);

const Question = (props) => {
  return (
    <Box>
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">{__("Question Options", "acadlix")}</Typography>
        <Divider />
      </Box>
      <Grid container spacing={3} alignItems="center">
        {/* Used to show morks - +points & -points in question */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Show Marks", "acadlix")}</CustomTypography>
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
          <Tooltip
            title={__("Show +point & -point", "acadlix")}
            placement="right-start"
          >
            <IconButton
              sx={{
                fontSize: "1.25rem",
              }}
            >
              <RiQuestionFill />
            </IconButton>
          </Tooltip>
        </GridItem1>

        {/* Display subject in question */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Display Subject", "acadlix")}</CustomTypography>
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
          <CustomTypography>{__("Answer Bullet", "acadlix")}</CustomTypography>
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
          <CustomTypography>{__("Answer Bullet Type", "acadlix")}</CustomTypography>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
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
          <CustomTypography>{__("Question Overview", "acadlix")}</CustomTypography>
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

        {/* Used to randomize question */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Random Question", "acadlix")}</CustomTypography>
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
          <CustomTypography>{__("Random Option", "acadlix")}</CustomTypography>
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
          <Tooltip
            title={__("Only for single and mulitple choice", "acadlix")}
            placement="right-start"
          >
            <IconButton
              sx={{
                fontSize: "1.25rem",
              }}
            >
              <RiQuestionFill />
            </IconButton>
          </Tooltip>
        </GridItem1>

        {/* Used to stop randomization of last option */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Do not randomize last option", "acadlix")}</CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <RandomLastOptionButton
            {...props}
          />
        </React.Suspense>

        {/* Used to hide question numbering  */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Hide Question Numbering", "acadlix")}</CustomTypography>
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
          <CustomTypography>{__("Sort Questions By Subject", "acadlix")}</CustomTypography>
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
          <CustomTypography>{__("Attempt & move forward automatically", "acadlix")}</CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <AttemptMoveForwardButton
            {...props}
          />
        </React.Suspense>

        {/* Force user to answer each question */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Force User to Answer Each Question", "acadlix")}</CustomTypography>
        </GridItem1>

        <React.Suspense fallback={null}>
          <ForceUserButton
            {...props}
          />
        </React.Suspense>
      </Grid>
    </Box>
  );
};

export default Question;
