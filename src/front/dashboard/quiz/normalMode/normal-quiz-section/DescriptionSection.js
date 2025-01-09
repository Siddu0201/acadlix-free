import { Alert, Box, Typography } from "@mui/material";
import React from "react";
import CustomButton from "../normal-quiz-component/CustomButton";
import { PostCheckPrerequisite } from "../../../../../requests/front/FrontQuizRequest";
import parse from "html-react-parser";
import { dateI18n, format } from "@wordpress/date"
import { strtotime } from "../../../../../helpers/util";
import UserAuth from "../../../../../modules/user-auth/UserAuth";

const DescriptionSection = (props) => {
  const current_date = strtotime(dateI18n(acadlixOptions?.date_time_format));
  const start_date = format(acadlixOptions?.date_time_format, props?.watch("start_date"));
  const end_date = format(acadlixOptions?.date_time_format, props?.watch("end_date"));

  const ExpireDate = () => <Alert severity="error">Quiz has expired</Alert>;

  if (
    props?.watch("set_start_date") &&
    current_date < strtotime(start_date)
  ) {
    return <NotStarted {...props} start_date={start_date} />;
  }

  if (props?.watch("set_end_date") && current_date > strtotime(end_date)) {
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
      if (document.getElementsByClassName("acadlix-front-quiz-title")[props?.elm_index]) {
        document.getElementsByClassName("acadlix-front-quiz-title")[props?.elm_index].style.display = "none";
      }
      if (document.getElementsByClassName("acadlix-front-quiz-description")[props?.elm_index]) {
        document.getElementsByClassName("acadlix-front-quiz-description")[props?.elm_index].style.display = "none";
      }
      props?.setValue("start", true, { shouldDirty: true });
      props?.setValue("view_question", true, { shouldDirty: true });
      props?.setValue("last", Date.now(), { shouldDirty: true });
      props?.setValue("now", Date.now(), { shouldDirty: true });
    }
  };

  const checkPrerequisite = PostCheckPrerequisite(props?.watch("id"));

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

  const handleUserLogin = (data) => {
    if (data?.user?.data) {
      props?.setValue("user_id", Number(data?.user?.data?.ID), {
        shouldDirty: true,
      });
      props?.setValue("name", data?.user?.data?.display_name, {
        shouldDirty: true,
      });
      props?.setValue("email", data?.user?.data?.user_email, {
        shouldDirty: true,
      });
      props?.setValue("login_modal", false, { shouldDirty: true });
      if (props?.watch("prerequisite") || props?.watch("per_user_allowed_attempt") > 0) {
        handleStartWithPrerequisite();
      } else {
        handleStart();
      }
    }
  }

  return (
    <Box>
      {!(props?.watch("hide_quiz_title") || props?.hide_title) && (
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
            props?.setValue("login_modal", true, { shouldDirty: true });
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
      <UserAuth
        login_modal={props?.watch("login_modal")}
        users_can_register={Boolean(Number(acadlixOptions?.users_can_register))}
        ajax_url={acadlixOptions?.ajax_url}
        nonce={acadlixOptions?.nonce}
        handleClose={() => props?.setValue("login_modal", false)}
        onSuccessLogin={handleUserLogin}
        onSuccessRegister={handleUserLogin}
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
    <Alert severity="error">{`Quiz will start on ${props?.start_date} ${acadlixOptions?.timezone_string} `}</Alert>
  );
};

export default DescriptionSection;
