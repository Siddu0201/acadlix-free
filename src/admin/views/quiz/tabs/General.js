import React from "react";
import {
  FormControlLabel,
  Grid,
  Box,
  FormControl,
  RadioGroup,
  Radio,
  Typography,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import CustomSwitch from "../../../../components/CustomSwitch";
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";
import { RiQuestionFill } from "../../../../helpers/icons";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { convertToPostDate } from "../../../../helpers/util";
import CustomTypography from "../../../../components/CustomTypography";
import { __ } from "@wordpress/i18n";

const General = (props) => {
  return (
    <Box sx={{ color: "black" }}>
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">{__("General Options", "acadlix")}</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={3}
        alignItems="center"
      >
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>{__("Hide Quiz Title", "acadlix")}</CustomTypography>
        </GridItem1>

        {/* Used to hide quiz title in a quiz */}
        <GridItem1 xs={12} sm={6} lg={3}>
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
            disabled={
              props?.watch("meta.mode") === "advance_mode" &&
              props?.watch("meta.advance_mode_type") !== "advance_panel"
            }
            label={__("Activate", "acadlix")}
          />
        </GridItem1>

        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>{__("Hide Restart Button", "acadlix")}</CustomTypography>
        </GridItem1>

        {/* User can restart quiz after submittion */}
        <GridItem1 xs={12} sm={6} lg={3}>
          <FormControlLabel
            control={<CustomSwitch />}
            checked={props?.watch("meta.quiz_settings.hide_restart_button") ?? false}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.hide_restart_button", e?.target?.checked, {
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

        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>{__("Show Clear Response Button", "acadlix")}</CustomTypography>
        </GridItem1>

        {/* Used to clear answer button to clear option selction */}
        <GridItem1 xs={12} sm={6} lg={3}>
          <FormControlLabel
            control={<CustomSwitch />}
            checked={props?.watch("meta.quiz_settings.show_clear_response_button") ?? false}
            onChange={(e) => {
              props?.setValue(
                "meta.quiz_settings.show_clear_response_button",
                e?.target?.checked,
                { shouldDirty: true }
              );
            }}
            label={__("Activate", "acadlix")}
          />
        </GridItem1>

        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>{__("Show Review Button", "acadlix")}</CustomTypography>
        </GridItem1>

        {/* Button to review quiz  */}
        <GridItem1 xs={12} sm={6} lg={3}>
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
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>{__("Quiz Time Type", "acadlix")}</CustomTypography>
        </GridItem1>

        <GridItem1 xs={12} sm={6} lg={3}>
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <RadioGroup
              name="time"
              row
              aria-label="acadlix-genral-quiz-time-type"
              onChange={(e) => {
                props?.setValue("meta.quiz_settings.quiz_timing_type", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
            >
              <FormControlLabel
                value="full_quiz_time"
                control={<Radio />}
                label={__("Full Quiz", "acadlix")}
                checked={props?.watch("meta.quiz_settings.quiz_timing_type") === "full_quiz_time"}
                componentsProps={{
                  typography: {
                    variant: "body2",
                  }
                }}
              />
              <FormControlLabel
                value="per_question_time"
                control={<Radio />}
                label={__("Per Question", "acadlix")}
                checked={
                  props?.watch("meta.quiz_settings.quiz_timing_type") === "per_question_time"
                }
                disabled={
                  (props?.watch("meta.mode") === "advance_mode" &&
                    props?.watch("meta.advance_mode_type") !== "advance_panel") ||
                  props?.watch("meta.mode") === "question_below_each_other"
                }
                componentsProps={{
                  typography: {
                    variant: "body2",
                  }
                }}
              />
            </RadioGroup>
          </FormControl>
        </GridItem1>

        {/* Timing in sec (0 => infinity) */}
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>{__("Quiz Timing", "acadlix")}</CustomTypography>
        </GridItem1>

        <GridItem1 xs={12} sm={6} lg={3}>
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
        </GridItem1>

        {/* Quiz start date */}
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>{__("Start date", "acadlix")}</CustomTypography>
        </GridItem1>

        <GridItem1 xs={12} sm={6} lg={3}>
          <DemoContainer components={["DateTimePicker"]} sx={{
            "& .MuiFormControl-root ": {
              minWidth: "100% !important",
            },
          }}>
            <DateTimePicker
              label={__("Enter Start Date*", "acadlix")}
              format="DD/MM/YYYY hh:mm:a"
              timeSteps={{
                minutes: 1,
              }}
              sx={{
                "& .MuiFormControl-root ": {
                  maxHeight: "42px",
                },
                ".MuiInputBase-input": {
                  padding: "9px 14px !important",
                },
                ".MuiFormLabel-root": {
                  top: "-7px !important",
                },
                ".MuiInputLabel-shrink": {
                  top: "0px !important",
                },
              }}
              value={
                props?.watch("meta.start_date")
                  ? dayjs(props?.watch("meta.start_date"))
                  : null
              }
              onChange={(value) => {
                props?.setValue("meta.start_date", convertToPostDate(value), {
                  shouldDirty: true,
                });
              }}
            />
          </DemoContainer>
          {props?.formState?.errors?.meta?.start_date && (
            <Typography component="p" color="error">
              {props?.formState?.errors?.meta?.start_date?.message}
            </Typography>
          )}
        </GridItem1>

        {/* Quiz End Date */}
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>{__("End date", "acadlix")}</CustomTypography>
        </GridItem1>

        <GridItem1 xs={12} sm={6} lg={3}>
          <DemoContainer components={["DateTimePicker"]} sx={{
            "& .MuiFormControl-root ": {
              minWidth: "100% !important",
            },
          }}>
            <DateTimePicker
              label={__("Enter End Date", "acadlix")}
              timeSteps={{
                minutes: 1,
              }}
              sx={{
                ".MuiFormControl-root ": {
                  maxHeight: "42px",
                },
                ".MuiInputBase-input": {
                  padding: "9px 14px !important",
                },
                ".MuiFormLabel-root": {
                  top: "-7px !important",
                },
                ".MuiInputLabel-shrink": {
                  top: "0px !important",
                },
              }}
              format="DD/MM/YYYY hh:mm:a"
              value={
                props?.watch("meta.end_date")
                  ? dayjs(props?.watch("meta.end_date"))
                  : null
              }
              onChange={(value) => {
                props?.setValue("meta.end_date", convertToPostDate(value), {
                  shouldDirty: true,
                });
              }}
            />
          </DemoContainer>
          {props?.formState?.errors?.meta?.end_date && (
            <Typography component="p" color="error">
              {props?.formState?.errors?.meta?.end_date?.message}
            </Typography>
          )}
        </GridItem1>
      </Grid>

      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">{__("Login Options", "acadlix")}</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={3}
        alignItems="center"
      >

        {/* If login is required for the quiz */}
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>{__("Enable login/register", "acadlix")}</CustomTypography>
        </GridItem1>

        <GridItem1 xs={12} sm={6} lg={3}>
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

        {/* Per user allowed attempt to attent the quiz */}
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>{__("Per User Allowed Attempt", "acadlix")}</CustomTypography>
        </GridItem1>

        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTextField
            label={__("Per User Allowed Attempt", "acadlix")}
            variant="outlined"
            size="small"
            type="number"
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.per_user_allowed_attempt", Number(e?.target?.value), {
                shouldDirty: true,
              });
            }}
            value={props?.watch("meta.quiz_settings.per_user_allowed_attempt") ?? 0}
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
          <Tooltip
            title={__("Sets allowed attempts (0 = unlimited); requires login at quiz start.", "acadlix")}
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
      </Grid>

      {/* Quiz prerequisite */}
      {/* <GridItem1 xs={12} lg={12}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("meta.quiz_settings.prerequisite") ?? false}
                onChange={(e) => {
                  props?.setValue("meta.quiz_settings.prerequisite", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
                disabled={
                  (props?.watch("meta.mode") === "advance_mode" &&
                    props?.watch("meta.advance_mode_type") !== "advance_panel")
                }
              />
            }
            label="Prerequisite"
          />
        </GridItem1> */}

      {/* Advance Options */}
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">{__("Advance Options", "acadlix")}</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={3}
        alignItems="center"
      >
        {/* Used to set limited number of question in a quiz */}
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>{__("Show Only Specific Number of Questions", "acadlix")}</CustomTypography>
        </GridItem1>

        <GridItem1 xs={12} sm={6} lg={3}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={
              props?.watch("meta.quiz_settings.show_only_specific_number_of_questions") ??
              false
            }
            onChange={(e) => {
              props?.setValue(
                "meta.quiz_settings.show_only_specific_number_of_questions",
                e?.target?.checked,
                { shouldDirty: true }
              );
            }}
            label={__("Activate", "acadlix")}
          />
        </GridItem1>

        {/* Number of question to set in quiz */}
        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>{__("Specific Number of Questions", "acadlix")}</CustomTypography>
        </GridItem1>

        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type="number"
            label={__("Specific Number of Questions", "acadlix")}
            value={props?.watch("meta.quiz_settings.specific_number_of_questions") ?? 0}
            onChange={(e) => {
              props?.setValue(
                "meta.quiz_settings.specific_number_of_questions",
                Number(e?.target?.value),
                { shouldDirty: true }
              );
            }}
            disabled={!props?.watch("meta.quiz_settings.show_only_specific_number_of_questions")}
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

        <GridItem1 xs={12} sm={6} lg={3}>
          <CustomTypography>{__("Enable Check Button", "acadlix")}</CustomTypography>
        </GridItem1>

        <GridItem1 xs={12} sm={6} lg={3}>
          <FormControlLabel
            control={
              <CustomSwitch />
            }
            checked={props?.watch("meta.quiz_settings.enable_check_button") ?? false}
            disabled={props?.watch("meta.mode") === "check_and_continue"}
            onChange={(e) => {
              props?.setValue("meta.quiz_settings.enable_check_button", e?.target?.checked, {
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

export default General;
