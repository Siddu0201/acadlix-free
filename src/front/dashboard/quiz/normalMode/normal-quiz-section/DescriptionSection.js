import { Alert, Box, Typography } from "@mui/material";
import React from "react";
import { PostCheckQuizById } from "@acadlix/requests/front/FrontQuizRequest";
import UserAuth from "@acadlix/modules/user-auth/UserAuth";
import { deleteCookie, getCookie, setCookie } from "@acadlix/helpers/cookie";
import toast from "react-hot-toast";
import { __ } from "@wordpress/i18n";

import { RawHTML } from "@wordpress/element";
import CustomLatex from "@acadlix/modules/latex/CustomLatex";
import CustomButton from "@acadlix/components/CustomButton";
import { redirect } from "react-router-dom";

const DescriptionSection = (props) => {
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
    props?.setValue("quiz_error", "", { shouldDirty: true });
    props?.handleQuizAttempt();
    if (props?.watch("mode") === "advance_mode") {
      const token = rand() + rand();
      localStorage?.setItem("acadlix_advance_quiz_token", token);
      let advance_quiz_url = acadlixOptions?.advance_quiz_url;
      let queryParams = {
        redirect_url: window.location.href,
      };
      if (
        props?.order_item_id &&
        props?.course_section_content_id &&
        props?.user_id
      ) {
        queryParams.course_section_content_id = props?.course_section_content_id;
        queryParams.section_index = props?.section_index;
        queryParams.content_index = props?.content_index;
        queryParams.quiz_attempt_type = props?.quiz_attempt_type ?? "shortcode";
        if (props?.course_statistic_id) {
          queryParams.course_statistic_id = props?.course_statistic_id ?? 0;
        }
        advance_quiz_url = createQueryUrl(advance_quiz_url, queryParams);
      }
      const link = `${advance_quiz_url}#/advance-quiz/${props?.watch(
        "id"
      )}/${token}`;

      // window.handleComplete = props?.handleComplete;
      window.open(
        link,
        "_blank",
        `scrollbars=yes,resizable=yes,top=0,left=0,fullscreen=yes,width=${screen.width},height=${screen.height}`
      );
      return;
    }

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
  };

  const checkQuiz = PostCheckQuizById(props?.watch("id"));

  const handleCheckQuiz = () => {
    if (props?.watch("user_id") === 0) {
      const tokenExpiry = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      const userTokenValue = getCookie(props?.userToken) || `${props?.userToken}_${tokenExpiry}`;
      setCookie(props?.userToken, userTokenValue, tokenExpiry);
      props?.setValue("user_token", getCookie(props?.userToken), { shouldDirty: true });
    }
    const data = {
      user_id: props?.watch("user_id"),
      user_token: props?.watch("user_token"),
    };

    checkQuiz.mutate(data, {
      onSuccess: (data) => {
        if (data?.data?.errors) {
          props?.setValue("quiz_error", data?.data?.errors, { shouldDirty: true });
          return;
        }
        handleStart();
      },
      onError: (data) => {
        toast.error(__("Oops! Something went wrong.", "acadlix"));
      }
    })
  };

  const handleQuizStart = () => {
    if (
      props?.watch("enable_login_register") &&
      props?.watch("user_id") == 0
    ) {
      props?.setValue("login_modal", true, { shouldDirty: true });
      return;
    }

    if (
      props?.watch("enable_prerequisite") ||
      props?.watch("per_user_allowed_attempt") > 0
    ) {
      handleCheckQuiz();
      return;
    }

    handleStart();
  }

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
      props?.setValue("user_token", "", {
        shouldDirty: true,
      });
      deleteCookie(props?.userToken);
      handleQuizStart();
    }
  }

  return (
    <Box>
      {!(props?.watch("hide_quiz_title") || props?.hide_title) && (
        <Typography
          variant="h1"
          sx={{
            marginBottom: "1.5rem",
          }}
          className="acadlix-quiz-title"
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
          className="acadlix-quiz-description"
        >
          <CustomLatex>
            {props?.watch("description")}
          </CustomLatex>
        </Typography>
      }
      <CustomButton
        onClick={handleQuizStart}
        disabled={checkQuiz?.isPending}
        className="acadlix-start-quiz-button"
      >
        {checkQuiz?.isPending ? __("Loading...", "acadlix") : __("Start Quiz", "acadlix")}
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
      {props?.watch("quiz_error") && (
        <Box
          sx={{
            marginY: 2,
          }}
          className="acadlix-quiz-error"
        >
          <Alert severity="error" sx={{
            alignItems: "center",
          }}>
            <RawHTML>
              {props?.watch("quiz_error")}
            </RawHTML>
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default DescriptionSection;
