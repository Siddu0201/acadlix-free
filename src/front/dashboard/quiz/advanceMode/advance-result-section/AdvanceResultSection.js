import React from "react";
import AdvanceResult from "./AdvanceResult";
import AdvanceSubjectResultSection from "./AdvanceSubjectResultSection";
import AdvanceLeaderboardSection from "./AdvanceLeaderboardSection";
import AdvanceViewButtonSection from "./AdvanceViewButtonSection";
import { Box } from "@mui/material";
import AdvanceViewAnswerSection from "./AdvanceViewAnswerSection";

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
        marginY: 1,
        paddingX: {
          sm: "auto",
          xs: 2,
        },
      }}
    >
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
