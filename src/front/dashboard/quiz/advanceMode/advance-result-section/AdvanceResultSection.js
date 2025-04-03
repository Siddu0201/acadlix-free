import React from "react";
import AdvanceResult from "./AdvanceResult";
import AdvanceSubjectResultSection from "./AdvanceSubjectResultSection";
import AdvanceLeaderboardSection from "./AdvanceLeaderboardSection";
import AdvanceViewButtonSection from "./AdvanceViewButtonSection";
import { Box, Button } from "@mui/material";
import AdvanceViewAnswerSection from "./AdvanceViewAnswerSection";
import { __ } from "@wordpress/i18n";
import AiResultFeedback from "../../ai/AiResultFeedback";

const AdvanceResultSection = (props) => {
  return (
    <Box
      sx={{
        width: {
          lg: "1100px",
          md: "900px",
          sm: "750px",
          xs: "100%",
        },
        marginX: "auto",
        marginY: 4,
        paddingX: {
          sm: 0,
          xs: 2,
        },
      }}
    >
      <Button
        variant="contained"
        color="error"
        onClick={() => {
          window.close()
        }}
      >
        {__('Close', 'acadlix')}
      </Button>
      {!props?.watch("hide_result") && (
        <>
          <AdvanceResult {...props} />
          {props?.watch("show_subject_wise_analysis") && (
            <AdvanceSubjectResultSection {...props} />
          )}
        </>
      )}
      {props?.watch("leaderboard") &&
        props?.watch("display_leaderboard_in_quiz_result") ===
        "below_the_result" && <AdvanceLeaderboardSection {...props} />}
      
      {
        props?.watch("result_feedback_by_ai") &&
        <AiResultFeedback 
          isPending={props?.isPendingResultFeedback}
          response={props?.watch("result_ai_response")}
        />
      }

      <AdvanceViewButtonSection {...props} />

      {props?.watch("leaderboard") &&
        props?.watch("view_leaderboard") &&
        props?.watch("display_leaderboard_in_quiz_result") ===
        "in_the_button" && <AdvanceLeaderboardSection {...props} />}

      {props?.watch("view_answer") && <AdvanceViewAnswerSection {...props} />}
    </Box>
  );
};

export default AdvanceResultSection;
