import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import CustomSwitch from "../../../../components/CustomSwitch";
import CustomTextField from "../../../../components/CustomTextField";
import { __ } from "@wordpress/i18n";

const QuizModeSection = (props) => {
  const setAdvanceModeDefaultSettings = () => {
    // default general setting
    // props?.setValue("meta.quiz_settings.hide_quiz_title", false, { shouldDirty: true });
    props?.setValue("meta.quiz_settings.hide_restart_button", true, { shouldDirty: true });
    props?.setValue("meta.quiz_settings.show_review_button", true, { shouldDirty: true });
    props?.setValue("meta.quiz_settings.quiz_timing_type", "full_quiz_time", {
      shouldDirty: true,
    });
    props?.setValue("meta.quiz_settings.enable_login_register", true, { shouldDirty: true });
    props?.setValue("meta.quiz_settings.login_register_type", "at_start_of_quiz", {
      shouldDirty: true,
    });
    // props?.setValue("meta.quiz_settings.prerequisite", false, { shouldDirty: true });
    props?.setValue("meta.quiz_settings.enable_check_button", false, { shouldDirty: true });

    // default question setting
    // props?.setValue("meta.quiz_settings.skip_question", false, { shouldDirty: true });
    props?.setValue("meta.quiz_settings.show_marks", true, { shouldDirty: true });
    props?.setValue("meta.quiz_settings.display_subject", true, { shouldDirty: true });
    props?.setValue("meta.quiz_settings.answer_bullet", false, { shouldDirty: true });
    props?.setValue("meta.quiz_settings.question_overview", true, { shouldDirty: true });
    props?.setValue("meta.quiz_settings.question_overview", true, { shouldDirty: true });
    props?.setValue("meta.quiz_settings.hide_question_numbering", false, { shouldDirty: true });
    props?.setValue("meta.quiz_settings.sort_by_subject", true, {
      shouldDirty: true,
    });
    props?.setValue("meta.quiz_settings.attempt_and_move_forward", false, {
      shouldDirty: true,
    });
    props?.setValue("meta.quiz_settings.force_user_to_answer_each_question", false, {
      shouldDirty: true,
    });

    // default result setting
    // props?.setValue("meta.quiz_settings.save_statistic", true, { shouldDirty: true });
    // props?.setValue("meta.quiz_settings.hide_result", false, { shouldDirty: true });
    // props?.setValue("meta.quiz_settings.hide_negative_marks", true, { shouldDirty: true });
    // props?.setValue("meta.quiz_settings.hide_quiz_time", false, { shouldDirty: true });
    // props?.setValue("meta.quiz_settings.show_speed", true, { shouldDirty: true });
    // props?.setValue("meta.quiz_settings.show_percentile", false, { shouldDirty: true });
    // props?.setValue("meta.quiz_settings.show_accuracy", true, { shouldDirty: true });
    // props?.setValue("meta.quiz_settings.show_rank", false, { shouldDirty: true });
    // props?.setValue("meta.quiz_settings.show_average_score", true, { shouldDirty: true });
    // props?.setValue("meta.quiz_settings.show_subject_wise_analysis", false, { shouldDirty: true });
    // props?.setValue("meta.quiz_settings.show_marks_distribution", false, { shouldDirty: true });
    // props?.setValue("meta.quiz_settings.show_status_based_on_min_percent", false, {
    //   shouldDirty: true,
    // });
    // props?.setValue("meta.quiz_settings.result_comparision_with_top_five_student", false, {
    //   shouldDirty: true,
    // });
    // props?.setValue("meta.quiz_settings.hide_answer_sheet", false, { shouldDirty: true });
    // props?.setValue("meta.quiz_settings.show_per_question_time", true, { shouldDirty: true });
    // props?.setValue("meta.quiz_settings.leaderboard", false, { shouldDirty: true });
  };

  return (
    <Grid size={{ xs: 12, sm: 12 }}>
      <Card>
        <CardHeader
          title={__('Mode', 'acadlix')}
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
            <Grid size={{ xs: 12, sm: 4 }}>
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
                      checked={props?.watch("meta.mode") === "normal"}
                      name="mode"
                      sx={{
                        padding: 1,
                      }}
                      value="normal"
                      onClick={() => {
                        props?.setValue("meta.mode", "normal", {
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
                      {__("Normal", 'acadlix')}
                    </h3>
                  </Box>
                  {
                    acadlixOptions?.isPro && acadlixOptions?.isActive &&
                    <Box>
                      <FormControlLabel
                        control={
                          <CustomSwitch
                            checked={props?.watch("meta.quiz_settings.enable_back_button") ?? false}
                            disabled={props?.watch("meta.mode") !== "normal"}
                            onChange={(e) => {
                              props?.setValue(
                                "meta.quiz_settings.enable_back_button",
                                e?.target?.checked,
                                { shouldDirty: true }
                              );
                            }}
                          />
                        }
                        label={__('Enable Back Button', 'acadlix')}
                      />
                    </Box>
                  }
                </CardContent>
              </Card>
            </Grid>

            {/* Used to enable check and continue mode
                - contain enable on option selected
                - skip button
            */}
            <Grid size={{ xs: 12, sm: 4 }}>
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
                      checked={props?.watch("meta.mode") === "check_and_continue"}
                      name="mode"
                      sx={{
                        padding: 1,
                      }}
                      value="check_and_continue"
                      onClick={() => {
                        props?.setValue("meta.mode", "check_and_continue", {
                          shouldDirty: true,
                        });
                        props?.setValue("meta.quiz_settings.attempt_and_move_forward", false, {
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
                      {__("Check And Continue", 'acadlix')}
                    </h3>
                  </Box>
                  {
                    acadlixOptions?.isPro && acadlixOptions?.isActive &&
                    <Box>
                      <FormControlLabel
                        control={
                          <CustomSwitch
                            checked={
                              props?.watch("meta.quiz_settings.enable_check_on_option_selected") ??
                              false
                            }
                            disabled={
                              props?.watch("meta.mode") !== "check_and_continue"
                            }
                            onChange={(e) => {
                              props?.setValue(
                                "meta.quiz_settings.enable_check_on_option_selected",
                                e?.target?.checked,
                                { shouldDirty: true }
                              );
                            }}
                          />
                        }
                        label={__("Show Check Button When Option Selected", 'acadlix')}
                      />

                      <FormControlLabel
                        control={
                          <CustomSwitch
                            checked={props?.watch("meta.quiz_settings.skip_question") ?? false}
                            onChange={(e) => {
                              props?.setValue(
                                "meta.quiz_settings.skip_question",
                                e?.target?.checked,
                                {
                                  shouldDirty: true,
                                }
                              );
                            }}
                            disabled={
                              props?.watch("meta.mode") !== "check_and_continue"
                            }
                          />
                        }
                        label={__("Skip Question", 'acadlix')}
                      />
                    </Box>
                  }
                </CardContent>
              </Card>
            </Grid>

            {/* Used to enable question below each other mode
                - contain question per page textfield
            */}
            <Grid size={{ xs: 12, sm: 4 }}>
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
                        props?.watch("meta.mode") === "question_below_each_other"
                      }
                      name="mode"
                      sx={{
                        padding: 1,
                      }}
                      value="question_below_each_other"
                      onClick={() => {
                        props?.setValue("meta.mode", "question_below_each_other", {
                          shouldDirty: true,
                        });
                        props?.setValue("meta.quiz_settings.quiz_timing_type", "full_quiz_time", {
                          shouldDirty: true,
                        });
                        props?.setValue("meta.quiz_settings.attempt_and_move_forward", false, {
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
                      {__("Question Below Each Other", 'acadlix')}
                    </h3>
                  </Box>
                  <Box>
                    <h3>{__("Question per page", 'acadlix')}</h3>
                    <CustomTextField
                      size="small"
                      fullWidth
                      type="number"
                      label="Question per page"
                      value={props?.watch("meta.quiz_settings.question_per_page") ?? 10}
                      disabled={
                        props?.watch("meta.mode") !== "question_below_each_other"
                      }
                      onChange={(e) => {
                        props?.setValue(
                          "meta.quiz_settings.question_per_page",
                          Number(e?.target?.value),
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
            {
              acadlixOptions?.isPro && acadlixOptions?.isActive &&
              <Grid size={{ xs: 12, sm: 12 }}>
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
                        checked={props?.watch("meta.mode") === "advance_mode"}
                        name="mode"
                        sx={{
                          padding: 1,
                        }}
                        value="advance_mode"
                        onClick={() => {
                          props?.setValue("meta.mode", "advance_mode", {
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
                        {__("Advance mode", "acadlix")}
                      </h3>
                      <h5
                        style={{
                          margin: "5px 0",
                        }}
                      >
                        ({__("Quiz Option will only set as per the exam", "acadlix")})
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
                            props?.setValue("meta.advance_mode_type", e.target.value, {
                              shouldDirty: true,
                            });

                            setAdvanceModeDefaultSettings();
                          }}
                          sx={{
                            display:
                              props?.watch("meta.mode") === "advance_mode"
                                ? ""
                                : "none",
                          }}
                        >
                          <FormControlLabel
                            value="advance_panel"
                            control={<Radio />}
                            label={__("Advance Panel", "acadlix")}
                            checked={
                              props?.watch("meta.advance_mode_type") ===
                              "advance_panel"
                            }
                          />
                          <FormControlLabel
                            value="ibps"
                            control={<Radio />}
                            label={__("IBPS", "acadlix")}
                            checked={props?.watch("meta.advance_mode_type") === "ibps"}
                          />
                          <FormControlLabel
                            value="ssc"
                            control={<Radio />}
                            label={__("SSC", "acadlix")}
                            checked={props?.watch("meta.advance_mode_type") === "ssc"}
                          />
                          <FormControlLabel
                            value="gate"
                            control={<Radio />}
                            label={__("GATE", "acadlix")}
                            checked={props?.watch("meta.advance_mode_type") === "gate"}
                          />
                          <FormControlLabel
                            value="sbi"
                            control={<Radio />}
                            label={__("SBI", "acadlix")}
                            checked={props?.watch("meta.advance_mode_type") === "sbi"}
                          />
                          <FormControlLabel
                            value="jee"
                            control={<Radio />}
                            label={__("JEE", "acadlix")}
                            checked={props?.watch("meta.advance_mode_type") === "jee"}
                          />
                          <FormControlLabel
                            value="railway"
                            control={<Radio />}
                            label={__("Railway", "acadlix")}
                            checked={
                              props?.watch("meta.advance_mode_type") === "railway"
                            }
                          />
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            }
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default QuizModeSection;
