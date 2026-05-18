import { Box } from "@mui/material";
import React from "react";
import CustomButton from "@acadlix/components/CustomButton";
import { __ } from "@wordpress/i18n";
import UserAuth from "@acadlix/modules/user-auth/UserAuth";
import { deleteCookie } from "@acadlix/helpers/cookie";

const ViewButtonSection = (props) => {
  const handleResetQuiz = () => {
    // props?.reset();
    window?.location?.reload();
  }

  const handleUserLoginAtAnswerSheet = (data) => {
    if (data?.user) {
      props?.setValue("user_id", Number(data?.user?.ID), {
        shouldDirty: true,
      });
      props?.setValue("name", data?.user?.display_name, {
        shouldDirty: true,
      });
      props?.setValue("email", data?.user?.user_email, {
        shouldDirty: true,
      });
      props?.setValue("user_token", "", {
        shouldDirty: true,
      });
      deleteCookie(props?.userToken);
      props?.setValue("login_modal_at_answer_sheet", false);
      viewAnswerSheet();
    }
  }

  const viewAnswerSheet = () => {
    props?.setValue('view_answer', !props?.watch('view_answer'), { shouldDirty: true });
    if (props?.watch('questions')?.filter(d => d.selected).length === 0) {
      props?.setValue('questions.0.selected', true, { shouldDirty: true });
    }
    props?.setValue('questions',
      props?.watch("questions")?.map(ques => {
        ques.check = true;
        return ques;
      })
    );
  }

  const handleViewAnswer = () => {
    if (
      props?.watch("enable_login_register") &&
      props?.watch("user_id") == 0 &&
      props?.watch("required_login_to") === "view_answer_sheet"
    ) {
      props?.setValue("login_modal_at_answer_sheet", true, { shouldDirty: true });
      return;
    }
    viewAnswerSheet();

  }

  const handleViewLeaderBoard = () => {
    props?.setValue('view_leaderboard', !props?.watch('view_leaderboard'), { shouldDirty: true });
  }
  return (
    <Box
      sx={{
        display: "flex",
        marginY: 2,
        columnGap: 1,
      }}
    >
      <UserAuth
        login_modal={props?.watch("login_modal_at_answer_sheet")}
        users_can_register={Boolean(Number(acadlixOptions?.users_can_register))}
        ajax_url={acadlixOptions?.ajax_url}
        nonce={acadlixOptions?.nonces?.auth || ""}
        handleClose={() => props?.setValue("login_modal_at_answer_sheet", false)}
        onSuccessLogin={handleUserLoginAtAnswerSheet}
        onSuccessRegister={handleUserLoginAtAnswerSheet}
      />
      {
        !props?.watch("hide_restart_button") &&
        <CustomButton
          onClick={handleResetQuiz}
          className="acadlix-normal-quiz-restart-button"
        >{__("Restart Quiz", "acadlix")}</CustomButton>
      }
      {
        !props?.watch("hide_answer_sheet") &&
        <CustomButton
          onClick={handleViewAnswer}
          className="acadlix-normal-quiz-view-answer-button"
        >{__("View Answer", "acadlix")}</CustomButton>
      }
      {
        props?.watch("leaderboard") && props?.watch("display_leaderboard_in_quiz_result") === "in_the_button" &&
        <CustomButton
          onClick={handleViewLeaderBoard}
          className="acadlix-normal-quiz-view-leaderboard-button"
        >{__("Leaderboard", "acadlix")}</CustomButton>
      }
    </Box>
  );
};

export default ViewButtonSection;
