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
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";
import CustomSwitch from "../../../../components/CustomSwitch";
import CustomTypography from "../../../../components/CustomTypography";
import { RiQuestionFill } from "../../../../helpers/icons";
import { __ } from "@wordpress/i18n";

const Result = (props) => {

  return (
    <Box sx={{ color: "black" }}>
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">{__("Statistic Options", "acadlix")}</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={3}
        alignItems="center"
      >
        {/* Save Statistic */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Save Statistics", "acadlix")}</CustomTypography>
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
          <Tooltip title={__("Used to save statistic", "acadlix")}>
            <IconButton
              sx={{
                fontSize: "1.25rem",
              }}
            >
              <RiQuestionFill />
            </IconButton>
          </Tooltip>
        </GridItem1>
        <GridItem1 size={{ xs: 12, sm: 12, lg: 6 }}></GridItem1>

        {/* Statistic ip Lock */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Statistic IP Lock", "acadlix")}</CustomTypography>
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
          <CustomTypography>{__("Save statistic no. of times", "acadlix")}</CustomTypography>
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
        <Typography variant="h6">{__("Result Options", "acadlix")}</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={3}
        alignItems="center"
      >
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Hide Result", "acadlix")}</CustomTypography>
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

        <GridItem1 size={{ xs: 12, sm: 12, lg: 6 }}></GridItem1>

        {/* Used to hide negative marks in result  */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Hide Negative Marks", "acadlix")}</CustomTypography>
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
          <CustomTypography>{__("Hide Quiz Time", "acadlix")}</CustomTypography>
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
        {
          process.env.REACT_APP_IS_PREMIUM === 'true' && acadlixOptions?.isActive &&
          <>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>{__("Show Speed", "acadlix")}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <FormControlLabel
                control={
                  <CustomSwitch
                  />
                }
                checked={props?.watch("meta.quiz_settings.show_speed") ?? false}
                onChange={(e) => {
                  props?.setValue("meta.quiz_settings.show_speed", e?.target?.checked, {
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
          </>
        }

        {/* Used to calculate percentage on the basis of topper - my_marks/topper_marks * 100  */}
        {
          process.env.REACT_APP_IS_PREMIUM === 'true' && acadlixOptions?.isActive &&
          <>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>{__("Show Percentile", "acadlix")}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <FormControlLabel
                control={
                  <CustomSwitch />
                }
                checked={props?.watch("meta.quiz_settings.show_percentile") ?? false}
                onChange={(e) => {
                  props?.setValue("meta.quiz_settings.show_percentile", e?.target?.checked, {
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
          </>
        }

        {/* It tells the % of correct attempt from attempted question - total_correct/total_attempt * 100 */}
        {
          process.env.REACT_APP_IS_PREMIUM === 'true' && acadlixOptions?.isActive &&
          <>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>{__("Show Accuracy %", "acadlix")}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <FormControlLabel
                control={
                  <CustomSwitch />
                }
                checked={props?.watch("meta.quiz_settings.show_accuracy") ?? false}
                onChange={(e) => {
                  props?.setValue("meta.quiz_settings.show_accuracy", e?.target?.checked, {
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
          </>
        }

        {/* Used to Show Average Score  */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("Show Average Score", "acadlix")}</CustomTypography>
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
        {
          process.env.REACT_APP_IS_PREMIUM === 'true' && acadlixOptions?.isActive &&
          <>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>{__("Show Subject Wise Analysis", "acadlix")}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={props?.watch("meta.quiz_settings.show_subject_wise_analysis") ?? false}
                    onChange={(e) => {
                      props?.setValue(
                        "meta.quiz_settings.show_subject_wise_analysis",
                        e?.target?.checked,
                        { shouldDirty: true }
                      );
                    }}
                  />
                }
                label={__("Activate", "acadlix")}
                disabled={
                  props?.watch("meta.quiz_settings.hide_result")
                  // ||
                  // (props?.watch("meta.mode") === "advance_mode" &&
                  //   props?.watch("meta.advance_mode_type") !== "advance_panel")
                }
              />
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 12, lg: 6 }}></GridItem1>
          </>
        }


        {/* 
          Used to show Status - Pass /Fail on the basis of Percent 
          On check - Minimum % to pass option will open
           */}
        {
          process.env.REACT_APP_IS_PREMIUM === 'true' && acadlixOptions?.isActive &&
          <>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>{__("Show Status Based On Min % (Pass/Fail)", "acadlix")}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <FormControlLabel
                control={
                  <CustomSwitch />
                }
                checked={
                  props?.watch("meta.quiz_settings.show_status_based_on_min_percent") ?? false
                }
                onChange={(e) => {
                  props?.setValue(
                    "meta.quiz_settings.show_status_based_on_min_percent",
                    e?.target?.checked,
                    { shouldDirty: true }
                  );
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

            {/* Minimum marks to pass - default 0  */}
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>{__("Minimum % to pass", "acadlix")}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTextField
                fullWidth
                size="small"
                label={__("Minimum % to pass", "acadlix")}
                type="number"
                value={props?.watch("meta.quiz_settings.minimum_percent_to_pass") ?? 0}
                onChange={(e) => {
                  props?.setValue("meta.quiz_settings.minimum_percent_to_pass",
                    Number(e?.target?.value), {
                    shouldDirty: true,
                  });
                }}
                disabled={
                  props?.watch("meta.quiz_settings.hide_result") ||
                  !props?.watch("meta.quiz_settings.show_status_based_on_min_percent")
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
          </>
        }
      </Grid>

      {/* End of Result options */}

      {/* Start of Answer Sheet options */}
      {
        process.env.REACT_APP_IS_PREMIUM === 'true' && acadlixOptions?.isActive &&
        <>
          <Box
            sx={{
              marginY: 2,
            }}
          >
            <Typography variant="h6">{__("Answer Sheet Options", "acadlix")}</Typography>
            <Divider />
          </Box>
          <Grid
            container
            spacing={3}
            alignItems="center"
          >
            {/* 
              Answer sheet option to hide answer sheet and options availbales are: 
              - Show Per Question Time
                */}
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>{__("Hide Answer Sheet", "acadlix")}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <FormControlLabel
                control={
                  <CustomSwitch />
                }
                checked={props?.watch("meta.quiz_settings.hide_answer_sheet") ?? false}
                onChange={(e) => {
                  props?.setValue("meta.quiz_settings.hide_answer_sheet", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
                label={__("Activate", "acadlix")}
              // disabled={
              //   props?.watch("meta.mode") === "advance_mode" &&
              //   props?.watch("meta.advance_mode_type") !== "advance_panel"
              // }
              />
            </GridItem1>

            {/* Used to show per question time in answer sheet  */}
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>{__("Show Per Question Time", "acadlix")}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <FormControlLabel
                control={
                  <CustomSwitch />
                }
                checked={props?.watch("meta.quiz_settings.show_per_question_time") ?? false}
                onChange={(e) => {
                  props?.setValue(
                    "meta.quiz_settings.show_per_question_time",
                    e?.target?.checked,
                    { shouldDirty: true }
                  );
                }}
                label={__("Activate", "acadlix")}
                disabled={
                  props?.watch("meta.quiz_settings.hide_answer_sheet")
                  // ||
                  // (props?.watch("meta.mode") === "advance_mode" &&
                  //   props?.watch("meta.advance_mode_type") !== "advance_panel")
                }
              />
            </GridItem1>
            {/* End Answer sheet option  */}
          </Grid>
        </>
      }
      {/* End of Answer Sheet options */}

      {/* Start of Leaderboard options */}
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">{__("Leaderboard Options", "acadlix")}</Typography>
        <Divider />
      </Box>

      <Grid
        container
        spacing={3}
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
          <CustomTypography>{__("Leaderboard", "acadlix")}</CustomTypography>
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
          <CustomTypography>{__("Total number of enteries", "acadlix")}</CustomTypography>
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
        {
          process.env.REACT_APP_IS_PREMIUM === 'true' && acadlixOptions?.isActive &&
          <>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>{__("Show Rank", "acadlix")}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <FormControlLabel
                control={
                  <CustomSwitch />
                }
                checked={props?.watch("meta.quiz_settings.show_rank") ?? false}
                onChange={(e) => {
                  props?.setValue("meta.quiz_settings.show_rank", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
                label={__("Activate", "acadlix")}
                disabled={!props?.watch("meta.quiz_settings.leaderboard")}
              />
            </GridItem1>
          </>
        }
        {/* Option for Result Comparison with topper    */}
        {
          process.env.REACT_APP_IS_PREMIUM === 'true' && acadlixOptions?.isActive &&
          <>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>{__("Result comparison with topper", "acadlix")}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <FormControlLabel
                control={
                  <CustomSwitch />
                }
                checked={
                  props?.watch("meta.quiz_settings.result_comparision_with_topper") ?? false
                }
                onChange={(e) => {
                  props?.setValue(
                    "meta.quiz_settings.result_comparision_with_topper",
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
          </>
        }

        {/* User can apply multiple times for leaderboard */}
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTypography>{__("User can apply multiple times", "acadlix")}</CustomTypography>
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
          <CustomTypography>{__("Number of times", "acadlix")}</CustomTypography>
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
          <CustomTypography>{__("Automatically display leaderboard in quiz result", "acadlix")}</CustomTypography>
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
        <Typography variant="h6">{__("Result Text", "acadlix")}</Typography>
        <Divider />
      </Box>

      <Grid
        container
        spacing={3}
        alignItems="center"
      >
        {/* Show result Text
            - show simple text or based on %
          */}
        {
          process.env.REACT_APP_IS_PREMIUM === 'true' && acadlixOptions?.isActive &&
          <>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>{__("% Based Result Text", "acadlix")}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, lg: 3 }}>
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={props?.watch("meta.quiz_settings.percent_based_result_text") ?? false}
                    onChange={(e) => {
                      props?.setValue(
                        "meta.quiz_settings.percent_based_result_text",
                        e?.target?.checked,
                        {
                          shouldDirty: true,
                        }
                      );
                      if (e?.target?.checked) {
                        props?.setValue("meta.quiz_settings.result_text", [{ percent: 0, text: "" }], {
                          shouldDirty: true,
                        });
                      } else {
                        props?.setValue("meta.quiz_settings.result_text", "", { shouldDirty: true });
                      }
                    }}
                  />
                }
                label={__("Activate", "acadlix")}
              />
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 12, lg: 6 }}></GridItem1>
          </>
        }

        {/* Result Text - based on % */}
        {
          props?.watch("meta.quiz_settings.percent_based_result_text") ? (
            <React.Fragment>
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
                xs={12}
                lg={12}
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
