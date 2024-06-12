import React from "react";
import {
  FormControlLabel,
  Grid,
  Box,
  FormControl,
  RadioGroup,
  Radio,
  Typography,
  FormLabel,
  Card,
  CardHeader,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItem,
  Button,
} from "@mui/material";
import CustomSwitch from "../../../../components/CustomSwitch";
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";
import { MdAdd } from "react-icons/md";
import { FaMinus } from "react-icons/fa";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const General = (props) => {
  const [quiz, setQuiz] = React.useState([
    { id: 1, title: "test quiz 1 fsdgffb  fgdfg dfg", show: true },
    { id: 2, title: "test quiz 2", show: true },
    { id: 3, title: "test quiz 3", show: true },
    { id: 4, title: "test quiz 4", show: true },
    { id: 5, title: "test quiz 5", show: true },
    { id: 6, title: "test quiz 6", show: true },
    { id: 7, title: "test quiz 7", show: true },
  ]);

  return (
    <Box sx={{ color: "black" }}>
      <Grid container>
        <GridItem1 xs={12} lg={12}>
          <Typography variant="h6">General Options</Typography>
        </GridItem1>

        {/* Used to hide quiz title in a quiz */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("hide_quiz_title") ?? false}
                onChange={(e) => {
                  props?.setValue("hide_quiz_title", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
                disabled={
                  props?.watch("mode") === "advance_mode" &&
                  props?.watch("advance_mode_type") !== "advance_panel"
                }
              />
            }
            label="Hide Quiz Title"
          />
        </GridItem1>

        {/* User can restart quiz after submittion */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("hide_restart_button") ?? false}
                onChange={(e) => {
                  props?.setValue("hide_restart_button", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
                disabled={
                  props?.watch("mode") === "advance_mode" &&
                  props?.watch("advance_mode_type") !== "advance_panel"
                }
              />
            }
            label="Hide Restart Button"
          />
        </GridItem1>

        {/* Used to clear answer button to clear option selction */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("show_clear_response_button") ?? false}
                onChange={(e) => {
                  props?.setValue(
                    "show_clear_response_button",
                    e?.target?.checked,
                    { shouldDirty: true }
                  );
                }}
              />
            }
            label="Show Clear Response Button"
          />
        </GridItem1>

        {/* Quiz time type 
          - full quiz time
          - per question time
        */}
        <GridItem1 xs={12} lg={6}>
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FormLabel
              id="acadlix-genral-quiz-time-type"
              sx={{
                marginRight: 4,
                color: "black",
                fontWeight: 500,
                fontSize: "1.1rem",
              }}
            >
              Quiz time type
            </FormLabel>
            <RadioGroup
              name="time"
              row
              aria-label="acadlix-genral-quiz-time-type"
              onChange={(e) => {
                props?.setValue("quiz_timing_type", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
            >
              <FormControlLabel
                value="full_quiz_time"
                control={<Radio />}
                label="Full Quiz Time"
                checked={props?.watch("quiz_timing_type") === "full_quiz_time"}
              />
              <FormControlLabel
                value="per_question_time"
                control={<Radio />}
                label="Per Question Time"
                checked={
                  props?.watch("quiz_timing_type") === "per_question_time"
                }
                disabled={
                  props?.watch("mode") === "advance_mode" &&
                  props?.watch("advance_mode_type") !== "advance_panel"
                }
              />
            </RadioGroup>
          </FormControl>
        </GridItem1>

        {/* Timing in sec (0 => infinity) */}
        <GridItem1 xs={12} lg={4}>
          <CustomTextField
            fullWidth
            label="Timing (in sec, 0 => infinite)"
            size="small"
            type="number"
            value={props?.watch("quiz_time") ?? 0}
            onChange={(e) => {
              props?.setValue("quiz_time", e?.target?.value, {
                shouldDirty: true,
              });
            }}
          />
        </GridItem1>
        <GridItem1 xs={12} lg={2}></GridItem1>

        {/* Button to enable start date */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("set_start_date") ?? false}
                onChange={(e) => {
                  props?.setValue("set_start_date", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
              />
            }
            label="Enable Start Date"
          />
        </GridItem1>

        {/* Quiz start date */}
        <GridItem1 xs={12} lg={4}>
          <DemoContainer components={["DateTimePicker"]}>
            <DateTimePicker
              {...props?.register("start_date", {
                required: {
                  value: props?.watch("set_start_date"),
                  message: "Start Date is required",
                },
              })}
              required={props?.watch("set_start_date")}
              label="Enter Start Date*"
              format="DD/MM/YYYY hh:mm:a"
              timeSteps={{
                minutes: 1
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
              value={props?.watch("start_date") ? dayjs(props?.watch("start_date")) : null}
              onChange={(value) => {
                props?.setValue("start_date", new Date(value?.$d), {
                  shouldDirty: true,
                });
              }}
              disabled={!props?.watch("set_start_date")}
            />
          </DemoContainer>
          {props?.formState?.errors?.start_date && (
            <Typography component="p" color="error">
              {props?.formState?.errors?.start_date?.message}
            </Typography>
          )}
        </GridItem1>

        <GridItem1 xs={0} lg={4}></GridItem1>

        {/* Button to enable end date */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("set_end_date") ?? false}
                onChange={(e) => {
                  props?.setValue("set_end_date", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
              />
            }
            label="Enable End Date"
          />
        </GridItem1>

        {/* Quiz End Date */}
        <GridItem1 xs={12} lg={4}>
          <DemoContainer components={["DateTimePicker"]}>
            <DateTimePicker
              {...props?.register("end_date", {
                required: {
                  value: props?.watch("set_end_date"),
                  message: "End Date is required",
                },
              })}
              required={props?.watch("set_end_date")}
              label="Enter End Date*"
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
              value={props?.watch("end_date") ? dayjs(props?.watch("end_date")) : null}
              onChange={(value) => {
                props?.setValue("end_date", new Date(value?.$d), {
                  shouldDirty: true,
                });
              }}
              disabled={!props?.watch("set_end_date")}
            />
          </DemoContainer>
          {props?.formState?.errors?.end_date && (
            <Typography component="p" color="error">
              {props?.formState?.errors?.end_date?.message}
            </Typography>
          )}
        </GridItem1>

        <GridItem1 xs={0} lg={4}></GridItem1>

        {/* Button to pause quiz */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("pause_quiz") ?? false}
                onChange={(e) => {
                  props?.setValue("pause_quiz", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
              />
            }
            label="Pause Quiz"
          />
        </GridItem1>

        {/* Quiz prerequisite */}
        <GridItem1 xs={12} lg={8}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("prerequisite") ?? false}
                onChange={(e) => {
                  props?.setValue("prerequisite", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
                disabled={
                  props?.watch("mode") === "advance_mode" &&
                  props?.watch("advance_mode_type") !== "advance_panel"
                }
              />
            }
            label="Prerequisite"
          />
        </GridItem1>
        <GridItem1
          xs={12}
          lg={12}
          sx={{
            display: {
              xs: props?.watch("prerequisite") ? "block" : "none",
              sm: props?.watch("prerequisite") ? "flex" : "none",
            },
          }}
        >
          <Card
            sx={{
              marginX: 2,
              marginBottom: {
                xs: 2,
                md: 0,
              },
              width: "350px",
            }}
          >
            <CardHeader
              title="Quiz"
              subheader={`${
                props?.watch("non_prerequisite_quiz")?.filter((val) => val?.show === true)?.length
              } quizzes.`}
            />
            <Divider />
            <List
              dense
              component="div"
              role="list"
              sx={{
                width: 350,
                height: 280,
                overflow: "auto",
              }}
            >
              {props?.watch("non_prerequisite_quiz")?.length > 0 &&
                props?.watch("non_prerequisite_quiz")?.map((value, _) => {
                  const labelId = `transfer-list-all-item-${value?.title}-label`;
                  return (
                    <ListItem
                      key={value?.id}
                      sx={{
                        display: value?.show ? "" : "none",
                      }}
                    >
                      <ListItemText
                        id={labelId}
                        primary={
                          value?.title?.length > 20
                            ? value?.title?.substring(0, 20) + "..."
                            : value?.title
                        }
                      />
                      <Button
                        variant="contained"
                        endIcon={<MdAdd />}
                        size="medium"
                        sx={{
                          ".MuiButton-endIcon": {
                            margin: 0,
                          },
                        }}
                        onClick={(e) => {
                          props?.setValue(
                            "non_prerequisite_quiz",
                            props?.watch("non_prerequisite_quiz")?.map((val) => {
                              if (val?.id === value?.id) {
                                val["show"] = false;
                              }
                              return val;
                            }),
                            {shouldDirty: true}
                          );
                          props?.setValue(
                            "prerequisite_data",
                            [
                              ...props?.watch("prerequisite_data"),
                              {
                                prerequisite_quiz_id: value?.id,
                                min_percentage: 0,
                              },
                            ],
                            { shouldDirty: true }
                          );
                        }}
                      ></Button>
                    </ListItem>
                  );
                })}
            </List>
          </Card>

          {/* Prerequisites quiz  */}
          <Card
            sx={{
              marginX: 2,
              width: "350px",
            }}
          >
            <CardHeader
              title="Prerequisites quiz"
              subheader={`${
                props?.watch("prerequisite_data")?.length
              } quizzes. You can set a minimum % that a user has to score to attempt this quiz. By default it will be set to zero.`}
            />
            <Divider />
            <List
              dense
              component="div"
              role="list"
              sx={{
                width: 350,
                height: 230,
                overflow: "auto",
              }}
            >
              {props?.watch("prerequisite_data")?.length > 0 &&
                props?.watch("prerequisite_data")?.map((value, index) => {
                  const labelId = `transfer-list-all-item-${value?.title}-label`;
                  return (
                    <ListItem key={value?.prerequisite_quiz_id}>
                      <ListItemText
                        id={labelId}
                        primary={
                          props?.watch("non_prerequisite_quiz")?.filter(val => val?.id === value?.prerequisite_quiz_id)?.[0]?.title?.length > 20
                            ? props?.watch("non_prerequisite_quiz")?.filter(val => val?.id === value?.prerequisite_quiz_id)?.[0]?.title?.substring(0, 20) + "..."
                            : props?.watch("non_prerequisite_quiz")?.filter(val => val?.id === value?.prerequisite_quiz_id)?.[0]?.title
                        }
                      />
                      <CustomTextField
                        label="Min %"
                        variant="outlined"
                        size="small"
                        type="number"
                        sx={{
                          maxWidth: "30%",
                          marginX: 2,
                        }}
                        value={value?.min_percentage ?? 0}
                        onChange={(e) => {
                          props?.setValue(
                            `prerequisite_data.${index}.min_percentage`,
                            e?.target?.value,
                            { shouldDirty: true }
                          );
                        }}
                      />
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<FaMinus />}
                        size="large"
                        sx={{
                          ".MuiButton-endIcon": {
                            margin: 0,
                          },
                        }}
                        onClick={(e) => {
                          props?.setValue(
                            "non_prerequisite_quiz",
                            props?.watch("non_prerequisite_quiz")?.map((val) => {
                              if (val?.id === value?.prerequisite_quiz_id) {
                                val["show"] = true;
                              }
                              return val;
                            }),
                            {shouldDirty: true}
                          );
                          props?.setValue(
                            "prerequisite_data",
                            props
                              ?.watch("prerequisite_data")
                              ?.filter((val) => val?.prerequisite_quiz_id !== value?.prerequisite_quiz_id),
                            { shouldDirty: true }
                          );
                        }}
                      ></Button>
                    </ListItem>
                  );
                })}
            </List>
          </Card>
        </GridItem1>

        <GridItem1 xs={12} lg={12}>
          <Typography variant="h6">Login Options</Typography>
        </GridItem1>

        {/* If login is required for the quiz */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("enable_login_register") ?? false}
                onChange={(e) => {
                  props?.setValue("enable_login_register", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
                disabled={
                  props?.watch("mode") === "advance_mode" &&
                  props?.watch("advance_mode_type") !== "advance_panel"
                }
              />
            }
            label="Enable login/register"
          />
        </GridItem1>

        {/* Login position
          - At Start of Quiz
          - At Finish of Quiz
        */}
        <GridItem1 xs={12} lg={8}>
          <FormControl>
            <RadioGroup
              name="login"
              row
              onChange={(e) => {
                props?.setValue("login_register_type", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
            >
              <FormControlLabel
                control={<Radio />}
                label="At Start of Quiz"
                value="at_start_of_quiz"
                checked={
                  props?.watch("login_register_type") === "at_start_of_quiz"
                }
                disabled={!props?.watch("enable_login_register")}
              />
              <FormControlLabel
                control={<Radio />}
                label="At Finish of Quiz"
                value="at_finish_of_quiz"
                checked={
                  props?.watch("login_register_type") === "at_finish_of_quiz"
                }
                disabled={
                  !props?.watch("enable_login_register") ||
                  (props?.watch("mode") === "advance_mode" &&
                    props?.watch("advance_mode_type") !== "advance_panel")
                }
              />
            </RadioGroup>
          </FormControl>
        </GridItem1>

        {/* Per user allowed attempt to attent the quiz */}
        <GridItem1 xs={12} lg={4}>
          <CustomTextField
            label="Per User Allowed Attempt"
            variant="outlined"
            size="small"
            type="number"
            onChange={(e) => {
              props?.setValue("per_user_allowed_attempt", e?.target?.value, {
                shouldDirty: true,
              });
            }}
            value={props?.watch("per_user_allowed_attempt") ?? 0}
            disabled={!props?.watch("enable_login_register")}
          />
        </GridItem1>

        {/* Save Statistic */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("save_statistic") ?? false}
                onChange={(e) => {
                  props?.setValue("save_statistic", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
                disabled={
                  props?.watch("mode") === "advance_mode" &&
                  props?.watch("advance_mode_type") !== "advance_panel"
                }
              />
            }
            label="Save Statistics"
            disabled={!props?.watch("enable_login_register")}
          />
        </GridItem1>

        {/* Number of time statistic saved per user (0 => infinity) */}
        <GridItem1 xs={12} lg={4}>
          <CustomTextField
            label="Save statistic no. of times"
            variant="outlined"
            size="small"
            type="number"
            onChange={(e) => {
              props?.setValue(
                "save_statistic_number_of_times",
                e?.target?.value,
                { shouldDirty: true }
              );
            }}
            value={props?.watch("save_statistic_number_of_times") ?? 0}
            disabled={
              !props?.watch("enable_login_register") ||
              !props?.watch("save_statistic")
            }
          />
        </GridItem1>

        <GridItem1 xs={12} lg={12}>
          <Typography variant="h6">Advance Options</Typography>
        </GridItem1>

        {/* On screen calculator for complex calculation */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("on_screen_calculator") ?? false}
                onChange={(e) => {
                  props?.setValue("on_screen_calculator", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
              />
            }
            label="On Screen Calculator"
          />
        </GridItem1>

        {/* Used to generate quiz certificate */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("quiz_certificate") ?? false}
                onChange={(e) => {
                  props?.setValue("quiz_certificate", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
              />
            }
            label="Quiz Certificate"
          />
        </GridItem1>
        {/* Used to resume unfinshed quiz */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("resume_unfinished_quiz") ?? false}
                onChange={(e) => {
                  props?.setValue(
                    "resume_unfinished_quiz",
                    e?.target?.checked,
                    { shouldDirty: true }
                  );
                }}
              />
            }
            label="Resume Unfinished Quiz"
          />
        </GridItem1>

        {/* Used to set limited number of question in a quiz */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={
                  props?.watch("show_only_specific_number_of_questions") ??
                  false
                }
                onChange={(e) => {
                  props?.setValue(
                    "show_only_specific_number_of_questions",
                    e?.target?.checked,
                    { shouldDirty: true }
                  );
                }}
              />
            }
            label="Show Only Specific Number of Questions"
          />
        </GridItem1>

        {/* Number of question to set in quiz */}
        <GridItem1 xs={12} lg={4}>
          <CustomTextField
            fullWidth
            size="small"
            type="number"
            label="Specific Number of Questions"
            value={props?.watch("specific_number_of_questions") ?? 0}
            onChange={(e) => {
              props?.setValue(
                "specific_number_of_questions",
                e?.target?.value,
                { shouldDirty: true }
              );
            }}
            disabled={!props?.watch("show_only_specific_number_of_questions")}
          />
        </GridItem1>

        {/* Rate quiz at the end of quiz */}
        <GridItem1 xs={12} lg={3}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("rate_quiz") ?? false}
                onChange={(e) => {
                  props?.setValue("rate_quiz", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
              />
            }
            label="Rate Quiz"
          />
        </GridItem1>

        {/* Take feedback from user */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("quiz_feedback") ?? false}
                onChange={(e) => {
                  props?.setValue("quiz_feedback", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
              />
            }
            label="Quiz Feedback"
          />
        </GridItem1>

        {/* Used to set proctoring if used is clicking outside the quiz window */}
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props?.watch("proctoring") ?? false}
                onChange={(e) => {
                  props?.setValue("proctoring", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
              />
            }
            label="Proctoring"
          />
        </GridItem1>

        {/* Number of warning for proctoring allowed */}
        <GridItem1 xs={12} lg={4}>
          <CustomTextField
            fullWidth
            size="small"
            type="number"
            label="Max. Number of times Allowed (min 1)"
            value={props?.watch("proctoring_max_number_of_time_allowed") ?? 3}
            onChange={(e) => {
              props?.setValue(
                "proctoring_max_number_of_time_allowed",
                e?.target?.value,
                { shouldDirty: true }
              );
            }}
            disabled={!props?.watch("proctoring")}
          />
        </GridItem1>
      </Grid>
    </Box>
  );
};

export default General;
