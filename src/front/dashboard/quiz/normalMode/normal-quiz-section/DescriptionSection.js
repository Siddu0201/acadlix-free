import { Alert, Box, Typography } from "@mui/material";
import React from "react";
import CustomButton from "../normal-quiz-component/CustomButton";
import { PostCheckPrerequisite } from "../../../../../requests/front/FrontQuizRequest";
import parse from "html-react-parser";
import LoginModel from "./LoginModel";
import dateFormat from "dateformat";

const DescriptionSection = (props) => {
  const current_date = new Date();
  const ExpireDate = () => <Alert severity="error">Quiz has expired</Alert>;

  if (
    props?.watch("set_start_date") &&
    current_date < props?.watch("start_date")
  ) {
    return <NotStarted {...props} />;
  }

  if (props?.watch("set_end_date") && current_date > props?.watch("end_date")) {
    return <ExpireDate />;
  }

  const rand = function () {
    return Math.random().toString(36).substring(2); // remove `0.`
  };

  const createQueryUrl = (baseUrl, params) => {
    const url = new URL(baseUrl);

    // Append query parameters
    Object.keys(params).forEach((key) => {
      url.searchParams.append(key, params[key]);
    });

    return url.toString();
  };

  const handleStart = () => {
    props?.setValue("prerequisite_error_msg", "", { shouldDirty: true });
    if (props?.watch("mode") === "advance_mode") {
      const token = rand() + rand();
      localStorage?.setItem("acadlix_advance_quiz_token", token);
      let advance_quiz_url = acadlixOptions?.advance_quiz_url;
      if (
        props?.order_item_id &&
        props?.course_section_content_id &&
        props?.user_id
      ) {
        let queryParams = {
          course_section_content_id: props?.course_section_content_id,
          section_index: props?.section_index,
          content_index: props?.content_index,
        };
        advance_quiz_url = createQueryUrl(advance_quiz_url, queryParams);
      }
      const link = `${advance_quiz_url}#/advance-quiz/${props?.watch(
        "id"
      )}/${token}`;

      window.handleComplete = props?.handleComplete;
      window.open(
        link,
        "_blank",
        `scrollbars=yes,resizable=yes,top=0,left=0,fullscreen=yes,width=${screen.width},height=${screen.height}`
      );
    } else {
      if(document.getElementById(`acadlix_front_quiz_title_${props?.watch("id")}`)){
        document.getElementById(`acadlix_front_quiz_title_${props?.watch("id")}`).style.display = "none";
      }
      if(document.getElementById(`acadlix_front_quiz_description_${props?.watch("id")}`)){
        document.getElementById(`acadlix_front_quiz_description_${props?.watch("id")}`).style.display = "none";
      }
      props?.setValue("start", true, { shouldDirty: true });
      props?.setValue("view_question", true, { shouldDirty: true });
      props?.setValue("last", Date.now(), { shouldDirty: true });
      props?.setValue("now", Date.now(), { shouldDirty: true });
    }
  };

  const checkPrerequisite = PostCheckPrerequisite(props?.watch("id"));

  // Tue Jul 02, 2024 7:00:00 PM IST
  // console.log(props?.watch("start_date"));
  // console.log(dateFormat(props?.watch("start_date"), "ddd, mmm dd, yyyy hh:MM:ss TT Z"));

  const handleStartWithPrerequisite = () => {
    if (props?.watch("user_id") > 0) {
      checkPrerequisite.mutate(
        { user_id: props?.watch("user_id") },
        {
          onSuccess: (data) => {
            if (
              data?.data?.prerequisite?.length > 0 ||
              data?.data?.user_allowed_attempt_error
            ) {
              let msg = "";
              data?.data?.prerequisite?.forEach((d, index) => {
                msg += `<b>${d?.title} (with min ${d?.min_percentage}%)</b>`;
                if (index + 1 !== data?.data?.length) {
                  msg += ", ";
                }
              });
              if (data?.data?.prerequisite?.length > 0) {
                props?.setValue(
                  "prerequisite_error_msg",
                  `You must finish ${msg} to proceed.`,
                  { shouldDirty: true }
                );
              }

              if (data?.data?.user_allowed_attempt_error) {
                props?.setValue(
                  "user_allowed_attempt_error",
                  data?.data?.user_allowed_attempt_error,
                  { shouldDirty: true }
                );
              }
            } else {
              handleStart();
            }
          },
        }
      );
    } else {
      props?.setValue(
        "prerequisite_error_msg",
        "Please login to start the test.",
        { shouldDirty: true }
      );
    }
  };

  return (
    <Box>
      {!props?.watch("hide_quiz_title") && !props?.hide_title && (
        <Typography
          variant="h1"
          sx={{
            fontSize: "2rem",
            fontWeight: "550", // Adjust the font weight to match your original styling
            marginBottom: "1.5rem",
          }}
        >
          {props?.watch("title")}
        </Typography>
      )}

      {
        !props?.hide_description &&
        <Typography
          variant="body1"
          sx={{ marginY: "9px !important" }}
          component="div"
        >
          {props?.watch("description")}
        </Typography>
      }
      <CustomButton
        onClick={() => {
          if (
            props?.watch("enable_login_register") &&
            props?.watch("login_register_type") == "at_start_of_quiz" &&
            props?.watch("user_id") == 0
          ) {
            props?.setValue("login_model", true, { shouldDirty: true });
          } else {
            if (
              props?.watch("prerequisite") ||
              props?.watch("per_user_allowed_attempt") > 0
            ) {
              handleStartWithPrerequisite();
            } else {
              handleStart();
            }
          }
        }}
        disabled={checkPrerequisite?.isPending}
      >
        {checkPrerequisite?.isPending ? "Loading..." : "Start Quiz"}
      </CustomButton>
      <LoginModel
        {...props}
        handleStart={handleStart}
        handleStartWithPrerequisite={handleStartWithPrerequisite}
      />
      {props?.watch("prerequisite_error_msg") && (
        <Box
          sx={{
            marginY: 2,
          }}
        >
          <Alert severity="error">
            {parse(props?.watch("prerequisite_error_msg"))}
          </Alert>
        </Box>
      )}
      {props?.watch("user_allowed_attempt_error") && (
        <Box
          sx={{
            marginY: 2,
          }}
        >
          <Alert severity="error">
            {props?.watch("user_allowed_attempt_error")}
          </Alert>
        </Box>
      )}
    </Box>
  );
};

const NotStarted = (props) => {
  return (
    <Alert severity="error">{`Quiz will start on ${props?.watch(
      "start_date"
    )} `}</Alert>
  );
};

export default DescriptionSection;
