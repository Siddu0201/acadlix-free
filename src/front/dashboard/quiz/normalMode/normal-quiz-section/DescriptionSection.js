import { Alert, Box, Typography } from "@mui/material";
import React from "react";
import CustomButton from "../normal-quiz-component/CustomButton";
import { PostCheckQuizById } from "../../../../../requests/front/FrontQuizRequest";
import parse from "html-react-parser";
import UserAuth from "../../../../../modules/user-auth/UserAuth";
import { deleteCookie, getCookie, setCookie } from "../../../../../helpers/cookie";
import toast from "react-hot-toast";

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
      return;
    }

    if (document.getElementsByClassName("acadlix-front-quiz-title")[props?.elm_index]) {
      document.getElementsByClassName("acadlix-front-quiz-title")[props?.elm_index].style.display = "none";
    }
    if (document.getElementsByClassName("acadlix-front-quiz-description")[props?.elm_index]) {
      document.getElementsByClassName("acadlix-front-quiz-description")[props?.elm_index].style.display = "none";
    }
    props?.handleQuizAttempt();
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
        if(data?.data?.errors){
          console.log(data?.data?.errors);
          props?.setValue("quiz_error", data?.data?.errors, {shouldDirty: true});
          return;
        }
        handleStart();
      },
      onError: (data) => {
        toast.error("Oops! Something went wrong.");
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
      props?.watch("prerequisite") ||
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
        onClick={handleQuizStart}
        disabled={checkQuiz?.isPending}
      >
        {checkQuiz?.isPending ? "Loading..." : "Start Quiz"}
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
        >
          <Alert severity="error" sx={{
            alignItems: "center",
          }}>
            {parse(props?.watch("quiz_error"))}
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default DescriptionSection;
