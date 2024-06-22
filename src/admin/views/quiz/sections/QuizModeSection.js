import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";
import CustomSwitch from "../../../../components/CustomSwitch";
import CustomTextField from "../../../../components/CustomTextField";

const QuizModeSection = (props) => {
  const setAdvanceModeDefaultSettings = () => {
    // default general setting
    props?.setValue("hide_quiz_title", false, { shouldDirty: true });
    props?.setValue("hide_restart_button", true, { shouldDirty: true });
    props?.setValue("quiz_timing_type", "full_quiz_time", {
      shouldDirty: true,
    });
    props?.setValue("prerequisite", false, { shouldDirty: true });
    props?.setValue("enable_login_register", true, { shouldDirty: true });
    props?.setValue("login_register_type", "at_start_of_quiz", {
      shouldDirty: true,
    });
    props?.setValue("save_statistic", true, { shouldDirty: true });

    // default question setting
    props?.setValue("show_marks", true, { shouldDirty: true });
    props?.setValue("display_subject", true, { shouldDirty: true });
    props?.setValue("skip_question", false, { shouldDirty: true });
    props?.setValue("answer_bullet", false, { shouldDirty: true });
    props?.setValue("question_overview", true, { shouldDirty: true });
    props?.setValue("question_overview", true, { shouldDirty: true });
    props?.setValue("hide_question_numbering", false, { shouldDirty: true });
    props?.setValue("force_user_to_answer_each_question", false, {
      shouldDirty: true,
    });

    // default result setting
    props?.setValue("hide_result", false, { shouldDirty: true });
    props?.setValue("hide_negative_marks", true, { shouldDirty: true });
    props?.setValue("hide_quiz_time", false, { shouldDirty: true });
    props?.setValue("show_speed", true, { shouldDirty: true });
    props?.setValue("show_percentile", false, { shouldDirty: true });
    props?.setValue("show_accuracy", true, { shouldDirty: true });
    props?.setValue("show_rank", false, { shouldDirty: true });
    props?.setValue("show_average_score", true, { shouldDirty: true });
    props?.setValue("show_subject_wise_analysis", false, { shouldDirty: true });
    props?.setValue("show_marks_distribution", false, { shouldDirty: true });
    props?.setValue("show_status_based_on_min_percent", false, {
      shouldDirty: true,
    });
    props?.setValue("result_comparision_with_top_five_student", false, {
      shouldDirty: true,
    });
    props?.setValue("hide_answer_sheet", false, { shouldDirty: true });
    props?.setValue("show_per_question_time", true, { shouldDirty: true });
    props?.setValue("was_the_solution_helpful", false, { shouldDirty: true });
    props?.setValue("bookmark", false, { shouldDirty: true });
    props?.setValue("report_question_answer", true, { shouldDirty: true });
    props?.setValue("leaderboard", false, { shouldDirty: true });
  };

  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <CardHeader
          title="Mode"
          titleTypographyProps={{
            sx: {
              fontWeight: 500,
              color: "black",
            },
          }}
        />
        <CardContent>
          <Grid container spacing={3}>
            {/* Used to enable normal mode 
                - contain enable back button
                - contain enable check button
            */}
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      textAlign: "center",
                      marginY: 2,
                    }}
                  >
                    <Radio
                      checked={props?.watch("mode") === "normal"}
                      name="mode"
                      sx={{
                        padding: 1,
                      }}
                      value="normal"
                      onClick={() => {
                        props?.setValue("mode", "normal", {
                          shouldDirty: true,
                        });
                        if (props?.watch("quiz_section") === "5") {
                          props?.setValue("quiz_section", "1", {
                            shouldDirty: true,
                          });
                        }
                      }}
                    />
                    <h3
                      style={{
                        margin: "5px 0 10px 0",
                        cursor: "pointer",
                      }}
                    >
                      Normal
                    </h3>
                  </Box>
                  <Box>
                    <FormControlLabel
                      control={
                        <CustomSwitch
                          checked={props?.watch("enable_back_button") ?? false}
                          disabled={props?.watch("mode") !== "normal"}
                          onChange={(e) => {
                            props?.setValue(
                              "enable_back_button",
                              e?.target?.checked,
                              { shouldDirty: true }
                            );
                          }}
                        />
                      }
                      label="Enable Back Button"
                    />

                    <FormControlLabel
                      control={
                        <CustomSwitch
                          checked={props?.watch("enable_check_button") ?? false}
                          disabled={props?.watch("mode") !== "normal"}
                          onChange={(e) => {
                            props?.setValue(
                              "enable_check_button",
                              e?.target?.checked,
                              { shouldDirty: true }
                            );
                          }}
                        />
                      }
                      label="Enable Check Button"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Used to enable check and continue mode
                - contain enable on option selected
                - skip button
            */}
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      textAlign: "center",
                      marginY: 2,
                    }}
                  >
                    <Radio
                      checked={props?.watch("mode") === "check_and_continue"}
                      name="mode"
                      sx={{
                        padding: 1,
                      }}
                      value="check_and_continue"
                      onClick={() => {
                        props?.setValue("mode", "check_and_continue", {
                          shouldDirty: true,
                        });
                        if (props?.watch("quiz_section") === "5") {
                          props?.setValue("quiz_section", "1", {
                            shouldDirty: true,
                          });
                        }
                      }}
                    />
                    <h3
                      style={{
                        margin: "5px 0 10px 0",
                        cursor: "pointer",
                      }}
                    >
                      Check And Continue
                    </h3>
                  </Box>
                  <Box>
                    <FormControlLabel
                      control={
                        <CustomSwitch
                          checked={
                            props?.watch("enable_check_on_option_selected") ??
                            false
                          }
                          disabled={
                            props?.watch("mode") !== "check_and_continue"
                          }
                          onChange={(e) => {
                            props?.setValue(
                              "enable_check_on_option_selected",
                              e?.target?.checked,
                              { shouldDirty: true }
                            );
                          }}
                        />
                      }
                      label="Enable Check on Option Selected"
                    />

                    <FormControlLabel
                      control={
                        <CustomSwitch
                          checked={props?.watch("skip_question") ?? false}
                          onChange={(e) => {
                            props?.setValue(
                              "skip_question",
                              e?.target?.checked,
                              {
                                shouldDirty: true,
                              }
                            );
                          }}
                          disabled={
                            props?.watch("mode") !== "check_and_continue"
                          }
                        />
                      }
                      label="Skip Question"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Used to enable question below each other mode
                - contain question per page textfield
            */}
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      textAlign: "center",
                      marginY: 2,
                    }}
                  >
                    <Radio
                      checked={
                        props?.watch("mode") === "question_below_each_other"
                      }
                      name="mode"
                      sx={{
                        padding: 1,
                      }}
                      value="question_below_each_other"
                      onClick={() => {
                        props?.setValue("mode", "question_below_each_other", {
                          shouldDirty: true,
                        });
                        if (props?.watch("quiz_section") === "5") {
                          props?.setValue("quiz_section", "1", {
                            shouldDirty: true,
                          });
                        }
                      }}
                    />
                    <h3
                      style={{
                        margin: "5px 0 10px 0",
                        cursor: "pointer",
                      }}
                    >
                      Question Below Each Other
                    </h3>
                  </Box>
                  <Box>
                    <h3>Question per page</h3>
                    <CustomTextField
                      size="small"
                      fullWidth
                      type="number"
                      label="Question per page"
                      value={props?.watch("question_per_page") ?? 10}
                      disabled={
                        props?.watch("mode") !== "question_below_each_other"
                      }
                      onChange={(e) => {
                        props?.setValue(
                          "question_per_page",
                          Number(e?.target?.value),
                          { shouldDirty: true }
                        );
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Used to enable advance mode
                - Advance Panel
                - IBPS
                - SSC
                - GATE
                - SBI
                - JEE
                - Railway
            */}
            <Grid item xs={12} sm={12}>
              <Card
                sx={{
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      textAlign: "center",
                      marginY: 2,
                    }}
                  >
                    <Radio
                      checked={props?.watch("mode") === "advance_mode"}
                      name="mode"
                      sx={{
                        padding: 1,
                      }}
                      value="advance_mode"
                      onClick={() => {
                        props?.setValue("mode", "advance_mode", {
                          shouldDirty: true,
                        });

                        setAdvanceModeDefaultSettings();
                      }}
                    />
                    <h3
                      style={{
                        margin: "5px 0 5px 0",
                        cursor: "pointer",
                      }}
                    >
                      Advance mode
                    </h3>
                    <h5
                      style={{
                        margin: "5px 0",
                      }}
                    >
                      (Quiz Option will only set as per the exam)
                    </h5>
                  </Box>
                  <Box
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <FormControl>
                      <RadioGroup
                        row
                        name="advance_mode"
                        onChange={(e) => {
                          props?.setValue("advance_mode_type", e.target.value, {
                            shouldDirty: true,
                          });

                          setAdvanceModeDefaultSettings();
                        }}
                        sx={{
                          display:
                            props?.watch("mode") === "advance_mode"
                              ? ""
                              : "none",
                        }}
                      >
                        <FormControlLabel
                          value="advance_panel"
                          control={<Radio />}
                          label="Advance Panel"
                          checked={
                            props?.watch("advance_mode_type") ===
                            "advance_panel"
                          }
                        />
                        <FormControlLabel
                          value="ibps"
                          control={<Radio />}
                          label="IBPS"
                          checked={props?.watch("advance_mode_type") === "ibps"}
                        />
                        <FormControlLabel
                          value="ssc"
                          control={<Radio />}
                          label="SSC"
                          checked={props?.watch("advance_mode_type") === "ssc"}
                        />
                        <FormControlLabel
                          value="gate"
                          control={<Radio />}
                          label="GATE"
                          checked={props?.watch("advance_mode_type") === "gate"}
                        />
                        <FormControlLabel
                          value="sbi"
                          control={<Radio />}
                          label="SBI"
                          checked={props?.watch("advance_mode_type") === "sbi"}
                        />
                        <FormControlLabel
                          value="jee"
                          control={<Radio />}
                          label="JEE"
                          checked={props?.watch("advance_mode_type") === "jee"}
                        />
                        <FormControlLabel
                          value="railway"
                          control={<Radio />}
                          label="Railway"
                          checked={
                            props?.watch("advance_mode_type") === "railway"
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default QuizModeSection;
