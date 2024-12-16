import React from "react";
import {
  Box,
  Grid,
  FormControlLabel,
  Button,
  FormControl,
  RadioGroup,
  FormLabel,
  Radio,
  Typography,
} from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";
import CustomSwitch from "../../../../components/CustomSwitch";

const Result = (props) => {
  const loadPage = () => {
    props?.loadEditor("result_text", "result_text");
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
    <Box sx={{ color: "black" }}>
      <Grid container>
        {/*           
          Result option used to hide result after quiz finish and options available in result are:
            - Hide Negative Marks
            - Hide Quiz Time
            - Show Speed 
            - Show Percentile 
            - Show Accuracy % 
            - Show Average Score
            - Show Subject Wise Analysis 
            - Show Marks Distribution 
            - Show Status Based on min %
            - Minimum % to pass 
          */}
        <GridItem1 xs={12} lg={12}>
          <Typography variant="h6">Result Options</Typography>
        </GridItem1>
        <GridItem1 xs={12} lg={12}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("hide_result") ?? false}
                onChange={(e) => {
                  props?.setValue("hide_result", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
                disabled={
                  props?.watch("mode") === "advance_mode" &&
                  props?.watch("advance_mode_type") !== "advance_panel"
                }
              />
            }
            label="Hide Result"
          />
        </GridItem1>

        {/* Used to hide negative marks in result  */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("hide_negative_marks") ?? false}
                onChange={(e) => {
                  props?.setValue("hide_negative_marks", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
              />
            }
            label="Hide Negative Marks"
            disabled={
              props?.watch("hide_result") ||
              (props?.watch("mode") === "advance_mode" &&
                props?.watch("advance_mode_type") !== "advance_panel")
            }
          />
        </GridItem1>

        {/* Used to hide quiz time in result  */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("hide_quiz_time") ?? false}
                onChange={(e) => {
                  props?.setValue("hide_quiz_time", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
              />
            }
            label="Hide Quiz Time"
            disabled={
              props?.watch("hide_result") ||
              (props?.watch("mode") === "advance_mode" &&
                props?.watch("advance_mode_type") !== "advance_panel")
            }
          />
        </GridItem1>

        {/* Its an average speed per question - total_time_taken/question  */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("show_speed") ?? false}
                onChange={(e) => {
                  props?.setValue("show_speed", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
              />
            }
            label="Show Speed"
            disabled={
              props?.watch("hide_result") ||
              (props?.watch("mode") === "advance_mode" &&
                props?.watch("advance_mode_type") !== "advance_panel")
            }
          />
        </GridItem1>

        {/* Used to calculate percentage on the basis of topper - my_marks/topper_marks * 100  */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("show_percentile") ?? false}
                onChange={(e) => {
                  props?.setValue("show_percentile", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
              />
            }
            label="Show Percentile"
            disabled={
              props?.watch("hide_result") ||
              (props?.watch("mode") === "advance_mode" &&
                props?.watch("advance_mode_type") !== "advance_panel")
            }
          />
        </GridItem1>

        {/* It tells the % of correct attempt from attempted question - total_correct/total_attempt * 100 */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("show_accuracy") ?? false}
                onChange={(e) => {
                  props?.setValue("show_accuracy", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
              />
            }
            label="Show Accuracy %"
            disabled={
              props?.watch("hide_result") ||
              (props?.watch("mode") === "advance_mode" &&
                props?.watch("advance_mode_type") !== "advance_panel")
            }
          />
        </GridItem1>

        {/* Used to Show Average Score  */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("show_average_score") ?? false}
                onChange={(e) => {
                  props?.setValue("show_average_score", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
              />
            }
            label="Show Average Score"
            disabled={
              props?.watch("hide_result") ||
              (props?.watch("mode") === "advance_mode" &&
                props?.watch("advance_mode_type") !== "advance_panel")
            }
          />
        </GridItem1>

        {/* Used to show subject wise analysis of quiz  */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("show_subject_wise_analysis") ?? false}
                onChange={(e) => {
                  props?.setValue(
                    "show_subject_wise_analysis",
                    e?.target?.checked,
                    { shouldDirty: true }
                  );
                }}
              />
            }
            label="Show Subject Wise Analysis"
            disabled={
              props?.watch("hide_result") ||
              (props?.watch("mode") === "advance_mode" &&
                props?.watch("advance_mode_type") !== "advance_panel")
            }
          />
        </GridItem1>

        {/* Used to show marks Distribution  */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("show_marks_distribution") ?? false}
                onChange={(e) => {
                  props?.setValue(
                    "show_marks_distribution",
                    e?.target?.checked,
                    { shouldDirty: true }
                  );
                }}
              />
            }
            label="Show Marks Distribution"
            disabled={
              props?.watch("hide_result") ||
              (props?.watch("mode") === "advance_mode" &&
                props?.watch("advance_mode_type") !== "advance_panel")
            }
          />
        </GridItem1>

        {/* 
          Used to show Status - Pass /Fail on the basis of Percent 
          On check - Minimum % to pass option will open
           */}
        <GridItem1 xs={12} lg={6}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={
                  props?.watch("show_status_based_on_min_percent") ?? false
                }
                onChange={(e) => {
                  props?.setValue(
                    "show_status_based_on_min_percent",
                    e?.target?.checked,
                    { shouldDirty: true }
                  );
                }}
              />
            }
            label="Show Status Based On Min % (Pass/Fail)"
            disabled={
              props?.watch("hide_result") ||
              (props?.watch("mode") === "advance_mode" &&
                props?.watch("advance_mode_type") !== "advance_panel")
            }
          />
        </GridItem1>

        {/* Minimum marks to pass - default 0  */}
        <GridItem1 xs={12} lg={4}>
          <CustomTextField
            fullWidth
            size="small"
            label="Minimum % to pass"
            type="number"
            value={props?.watch("minimum_percent_to_pass") ?? 0}
            onChange={(e) => {
              props?.setValue("minimum_percent_to_pass", e?.target?.value, {
                shouldDirty: true,
              });
            }}
            disabled={
              props?.watch("hide_result") ||
              !props?.watch("show_status_based_on_min_percent")
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

        {/* End of Result options */}

        {/* 
          Answer sheet option to hide answer sheet and options availbales are: 
           - Show Per Question Time
           - was the solution helpful
           - bookmark
           - report question/answer 
            */}
        <GridItem1 xs={12} lg={12}>
          <Typography variant="h6">Answer Sheet Options</Typography>
        </GridItem1>
        <GridItem1 xs={12} lg={12}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("hide_answer_sheet") ?? false}
                onChange={(e) => {
                  props?.setValue("hide_answer_sheet", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
              />
            }
            label="Hide Answer Sheet"
            disabled={
              props?.watch("mode") === "advance_mode" &&
              props?.watch("advance_mode_type") !== "advance_panel"
            }
          />
        </GridItem1>

        {/* Used to show per question time in answer sheet    */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("show_per_question_time") ?? false}
                onChange={(e) => {
                  props?.setValue(
                    "show_per_question_time",
                    e?.target?.checked,
                    { shouldDirty: true }
                  );
                }}
              />
            }
            label="Show Per Question Time"
            disabled={
              props?.watch("hide_answer_sheet") ||
              (props?.watch("mode") === "advance_mode" &&
                props?.watch("advance_mode_type") !== "advance_panel")
            }
          />
        </GridItem1>

        {/* Used to ask the user as the solution is helpful or not - show like dislike emoji */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("was_the_solution_helpful") ?? false}
                onChange={(e) => {
                  props?.setValue(
                    "was_the_solution_helpful",
                    e?.target?.checked,
                    { shouldDirty: true }
                  );
                }}
              />
            }
            label="Was The Solution Helpful"
            disabled={
              props?.watch("hide_answer_sheet") ||
              (props?.watch("mode") === "advance_mode" &&
                props?.watch("advance_mode_type") !== "advance_panel")
            }
          />
        </GridItem1>

        {/* Used to ask user to bookmark question in answer sheet */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("bookmark") ?? false}
                onChange={(e) => {
                  props?.setValue("bookmark", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
              />
            }
            label="Bookmark"
            disabled={
              props?.watch("hide_answer_sheet") ||
              (props?.watch("mode") === "advance_mode" &&
                props?.watch("advance_mode_type") !== "advance_panel")
            }
          />
        </GridItem1>

        {/* A button to report regarding the question of the answer    */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("report_question_answer") ?? false}
                onChange={(e) => {
                  props?.setValue(
                    "report_question_answer",
                    e?.target?.checked,
                    { shouldDirty: true }
                  );
                }}
              />
            }
            label="Report question/answer"
            disabled={
              props?.watch("hide_answer_sheet") ||
              (props?.watch("mode") === "advance_mode" &&
                props?.watch("advance_mode_type") !== "advance_panel")
            }
          />
        </GridItem1>

        {/* End Answer sheet option  */}

        {/* 
          Options for Leaderboard contains
            - show rank
            - result comparision with topper
            - total number of entries
            - Users can apply multiple times (on selection show field for number of time 0 as default for infinity)
            - Number of times user can apply
            - automatically display leaderboard in quiz result - don't display(default) , below the result , in a button 
             */}
        <GridItem1 xs={12} lg={12}>
          <Typography variant="h6">Leaderboard Options</Typography>
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("leaderboard") ?? false}
                onChange={(e) => {
                  props?.setValue("leaderboard", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
              />
            }
            label="Leaderboard"
            disabled={
              props?.watch("mode") === "advance_mode" &&
              props?.watch("advance_mode_type") !== "advance_panel"
            }
          />
        </GridItem1>

        {/* Total number of entries to be displayed in leaderboard */}
        <GridItem1 xs={12} lg={4}>
          <CustomTextField
            fullWidth
            size="small"
            label="Total number of enteries"
            type="number"
            value={props?.watch("leaderboard_total_number_of_entries") ?? 10}
            onChange={(e) => {
              props?.setValue(
                "leaderboard_total_number_of_entries",
                e?.target?.value,
                { shouldDirty: true }
              );
            }}
            disabled={!props?.watch("leaderboard")}
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
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("show_rank") ?? false}
                onChange={(e) => {
                  props?.setValue("show_rank", e?.target?.checked, {
                    shouldDirty: true,
                  });
                  props?.setValue(
                    "leaderboard_user_can_apply_multiple_times",
                    true,
                    { shouldDirty: true }
                  );
                  props?.setValue(
                    "leaderboard_apply_multiple_number_of_times",
                    0,
                    { shouldDirty: true }
                  );
                }}
              />
            }
            label="Show Rank"
            disabled={!props?.watch("leaderboard")}
          />
        </GridItem1>

        {/* Option for Result Comparison with top 5 student    */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={
                  props?.watch("result_comparision_with_topper") ?? false
                }
                onChange={(e) => {
                  props?.setValue(
                    "result_comparision_with_topper",
                    e?.target?.checked,
                    { shouldDirty: true }
                  );
                  props?.setValue(
                    "leaderboard_user_can_apply_multiple_times",
                    true,
                    { shouldDirty: true }
                  );
                  props?.setValue(
                    "leaderboard_apply_multiple_number_of_times",
                    0,
                    { shouldDirty: true }
                  );
                }}
              />
            }
            label="Result comparison with topper"
            disabled={!props?.watch("leaderboard") && !props?.watch("save_statistic")}
          />
        </GridItem1>

        {/* User can apply multiple times for leaderboard */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={
                  props?.watch("leaderboard_user_can_apply_multiple_times") ??
                  false
                }
                onChange={(e) => {
                  props?.setValue(
                    "leaderboard_user_can_apply_multiple_times",
                    e?.target?.checked,
                    { shouldDirty: true }
                  );
                }}
              />
            }
            label="User can apply multiple times"
            disabled={
              !props?.watch("leaderboard") ||
              props?.watch("show_rank") ||
              props?.watch("result_comparision_with_topper")
            }
          />
        </GridItem1>

        {/* Number of times user can apply for leaderboard */}
        <GridItem1 xs={12} lg={4}>
          <CustomTextField
            fullWidth
            size="small"
            label="Number of time (0 -> Infinity)"
            type="number"
            value={
              props?.watch("leaderboard_apply_multiple_number_of_times") ?? 0
            }
            onChange={(e) => {
              props?.setValue(
                "leaderboard_apply_multiple_number_of_times",
                e?.target?.value,
                { shouldDirty: true }
              );
            }}
            disabled={
              !props?.watch("leaderboard") ||
              !props?.watch("leaderboard_user_can_apply_multiple_times") ||
              props?.watch("show_rank") ||
              props?.watch("result_comparision_with_topper")
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
        <GridItem1 xs={12} lg={12}>
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FormLabel
              id="acadlix-result-display-leaderboard-in-quiz-result"
              sx={{
                marginRight: 4,
                color: "black",
                fontWeight: 500,
                fontSize: "1rem",
              }}
            >
              Automatically display leaderboard in quiz result
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="acadlix-result-display-leaderboard-in-quiz-result"
              onChange={(e) => {
                props?.setValue(
                  "display_leaderboard_in_quiz_result",
                  e?.target?.value,
                  { shouldDirty: true }
                );
              }}
            >
              <FormControlLabel
                value="do_not_display"
                label="don't display"
                control={<Radio />}
                checked={
                  props?.watch("display_leaderboard_in_quiz_result") ===
                  "do_not_display"
                }
                disabled={!props?.watch("leaderboard")}
              />
              <FormControlLabel
                value="below_the_result"
                label="below the result"
                control={<Radio />}
                checked={
                  props?.watch("display_leaderboard_in_quiz_result") ===
                  "below_the_result"
                }
                disabled={!props?.watch("leaderboard")}
              />
              <FormControlLabel
                value="in_the_button"
                label="in the button"
                control={<Radio />}
                checked={
                  props?.watch("display_leaderboard_in_quiz_result") ===
                  "in_the_button"
                }
                disabled={!props?.watch("leaderboard")}
              />
            </RadioGroup>
          </FormControl>
        </GridItem1>
        {/* End leaderboard options */}

        {/* Show result Text
            - show simple text or based on %
          */}
        <GridItem1 xs={12} lg={12}>
          <Typography variant="h6">Result Text</Typography>
        </GridItem1>
        <GridItem1 xs={12} lg={12}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("percent_based_result_text") ?? false}
                onChange={(e) => {
                  props?.setValue(
                    "percent_based_result_text",
                    e?.target?.checked,
                    {
                      shouldDirty: true,
                    }
                  );
                  if (e?.target?.checked) {
                    props?.setValue("result_text", [{ percent: 0, text: "" }], {
                      shouldDirty: true,
                    });
                  } else {
                    props?.setValue("result_text", "", { shouldDirty: true });
                  }
                }}
              />
            }
            label="% Based Result Text"
          />
        </GridItem1>
        <GridItem1
          xs={12}
          lg={12}
          sx={{
            display: props?.watch("percent_based_result_text") ? "none" : "",
          }}
        >
          <textarea
            id="result_text"
            value={
              typeof props?.watch("result_text") === "string"
                ? props?.watch("result_text")
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
              props.setValue("result_text", value, {
                shouldDirty: true,
              });
            }}
          />
        </GridItem1>
        {Array.isArray(props?.watch("result_text")) &&
          props?.watch("result_text")?.map((val, index) => (
            <React.Fragment key={index}>
              <GridItem1 xs={12} lg={2}>
                <CustomTextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Percentage (>=)"
                  value={val?.percent ?? 0}
                  onChange={(e) => {
                    props?.setValue(
                      `result_text.${index}.percent`,
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
              <GridItem1 xs={12} lg={10}>
                <CustomTextField
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  label="% text"
                  value={val?.text ?? ""}
                  onChange={(e) => {
                    props?.setValue(
                      `result_text.${index}.text`,
                      e?.target?.value,
                      { shouldDirty: true }
                    );
                  }}
                />
              </GridItem1>
            </React.Fragment>
          ))}
        <GridItem1
          xs={12}
          lg={12}
          sx={{
            display: props?.watch("percent_based_result_text")
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
                "result_text",
                [...props?.watch("result_text"), { percent: 0, text: "" }],
                { shouldDirty: true }
              );
            }}
          >
            Add More
          </Button>
          <Button
            sx={{
              marginY: 3,
              display: props?.watch("result_text")?.length > 1 ? "" : "none",
            }}
            variant="contained"
            color="error"
            onClick={(e) => {
              props?.setValue(
                "result_text",
                props
                  ?.watch("result_text")
                  ?.filter(
                    (item, i) => i !== props?.watch("result_text")?.length - 1
                  ),
                { shouldDirty: true }
              );
            }}
          >
            Remove
          </Button>
        </GridItem1>
      </Grid>
    </Box>
  );
};

export default Result;
