import React from "react";
import {
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormHelperText,
  Box,
  Typography,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import CustomSwitch from "../../../../components/CustomSwitch";
import CustomTypography from "../../../../components/CustomTypography";
import { RiQuestionFill } from "../../../../helpers/icons";
const Question = (props) => {
  return (
    <Box sx={{ color: "black" }}>
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">Question Options</Typography>
        <Divider />
      </Box>
      <Grid container spacing={3} alignItems="center">
        {/* Used to show morks - +points & -points in question */}
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>Show Marks</CustomTypography>
        </GridItem1>
        <GridItem1 xs={12} sm={6} lg={3}>
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
            disabled={props?.watch("meta.mode") === "advance_mode" && props?.watch("meta.advance_mode_type") !== "advance_panel"}
            label="Activate"
          />
          <Tooltip
            title="Show +point & -point"
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
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>Display Subject</CustomTypography>
        </GridItem1>
        <GridItem1 xs={12} sm={6} lg={3}>
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
            disabled={props?.watch("meta.mode") === "advance_mode" && props?.watch("meta.advance_mode_type") !== "advance_panel"}
            label="Activate"
          />
        </GridItem1>

        {/* Show bullets in answer option- only for single and multiple choice */}
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>Answer Bullet</CustomTypography>
        </GridItem1>
        <GridItem1 xs={12} sm={6} lg={3}>
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
            label="Activate"
          />
        </GridItem1>

        {/* Type of bullets to show Numeric/Alphabatic */}
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>Answer Bullet Type</CustomTypography>
        </GridItem1>
        <GridItem1 xs={12} sm={6} lg={3}>
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
              label="Numeric"
              checked={props?.watch("meta.quiz_settings.answer_bullet_type") === "numeric"}
              disabled={!props?.watch("meta.quiz_settings.answer_bullet")}
              componentsProps={{
                typography: {
                  variant: "body2",
                }
              }}
            />
            <FormControlLabel
              value="alphabet"
              control={<Radio />}
              label="Alphabet"
              checked={props?.watch("meta.quiz_settings.answer_bullet_type") === "alphabet"}
              disabled={!props?.watch("meta.quiz_settings.answer_bullet")}
              componentsProps={{
                typography: {
                  variant: "body2",
                }
              }}
            />
          </RadioGroup>
        </GridItem1>

        {/* Used to show question overview in top of quiz */}
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>Question Overview</CustomTypography>
        </GridItem1>
        <GridItem1 xs={12} sm={6} lg={3}>
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
            disabled={props?.watch("meta.mode") === "advance_mode" && props?.watch("meta.advance_mode_type") !== "advance_panel"}
            label="Activate"
          />
        </GridItem1>

        {/* Used to randomize question */}
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>Random Question</CustomTypography>
        </GridItem1>
        <GridItem1 xs={12} sm={6} lg={3}>
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
            label="Activate"
          />
        </GridItem1>

        {/* Used to randomize answer options - only for single and multiple choice */}
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>Random Option</CustomTypography>
        </GridItem1>
        <GridItem1 xs={12} sm={6} lg={3}>
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
            label="Activate"
          />
          <Tooltip
            title="Only for single and mulitple choice"
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
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>Do not randomize last option</CustomTypography>
        </GridItem1>
        <GridItem1 xs={12} sm={6} lg={3}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={
              props?.watch("meta.quiz_settings.do_not_randomize_last_option") ?? false
            }
            onChange={(e) => {
              props?.setValue(
                "meta.quiz_settings.do_not_randomize_last_option",
                e?.target?.checked,
                { shouldDirty: true }
              );
            }}
            disabled={!props?.watch("meta.quiz_settings.random_option")}
            label="Activate"
          />
        </GridItem1>

        {/* Used to hide question numbering  */}
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>Hide Question Numbering</CustomTypography>
        </GridItem1>
        <GridItem1 xs={12} sm={6} lg={3}>
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
            label="Activate"
          />
        </GridItem1>

        {/* Sort question according to subject */}
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>Sort Questions By Subject</CustomTypography>
        </GridItem1>
        <GridItem1 xs={12} sm={6} lg={3}>
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
            disabled={props?.watch("meta.mode") === "advance_mode"}
            label="Activate"
          />
        </GridItem1>

        {/* Attempt question and move forward automatically- only for single choice */}
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>Attempt & move forward automatically</CustomTypography>
        </GridItem1>
        <GridItem1 xs={12} sm={6} lg={3}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={props?.watch("meta.quiz_settings.attempt_and_move_forward") ?? false}
            disabled={["question_below_each_other", "check_and_continue"].includes(props?.watch("meta.mode"))}
            onChange={(e) => {
              props?.setValue(
                "meta.quiz_settings.attempt_and_move_forward",
                e?.target?.checked,
                { shouldDirty: true }
              );
            }}
            label="Activate"
          />
          <Tooltip
            title="This feature will only work for single choice questions in normal mode"
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

        {/* Force user to answer each question */}
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>Force User to Answer Each Question</CustomTypography>
        </GridItem1>
        <GridItem1 xs={12} sm={6} lg={3}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={
              props?.watch("meta.quiz_settings.force_user_to_answer_each_question") ?? false
            }
            onChange={(e) => {
              props?.setValue(
                "meta.quiz_settings.force_user_to_answer_each_question",
                e?.target?.checked,
                { shouldDirty: true }
              );
            }}
            disabled={props?.watch("meta.mode") === "advance_mode" && props?.watch("meta.advance_mode_type") !== "advance_panel"}
            label="Activate"
          />
        </GridItem1>
      </Grid>
    </Box>
  );
};

export default Question;
