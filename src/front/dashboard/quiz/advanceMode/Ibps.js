import React from "react";
import QuizLogoAndTitle from "./advance-mode-section/QuizLogoAndTitle";
import QuizTitleAndInstruction from "./advance-mode-section/QuizTitleAndInstruction";
import { Box } from "@mui/material";
import QuizSidebar from "./advance-mode-section/QuizSidebar";
import QuizSection from "./advance-mode-section/QuizSection";
import QuizTimer from "./advance-mode-section/QuizTimer";
import QuizSubsection from "./advance-mode-section/QuizSubsection";
import QuizQuestionTypeAndMarks from "./advance-mode-section/QuizQuestionTypeAndMarks";
import QuizLanguage from "./advance-mode-section/QuizLanguage";
import QuizButtonOptions from "./advance-mode-section/QuizButtonOptions";
import QuizQuestionPanel from "./advance-mode-section/QuizQuestionPanel";

const Ibps = (props) => {
  console.log(props?.watch());
  return (
    <Box>
      <QuizLogoAndTitle {...props} />
      <QuizTitleAndInstruction {...props} />
      <QuizSidebar {...props} />
      <Box
        sx={{
          width: {
            xs: "100%",
            sm: props?.isOpen ? `calc(100% - ${props?.sidebarWidth}px)` : "100%",
          },
        }}
      >
        {/* <QuizSection {...props} /> */}
        <QuizTimer {...props} />
        <QuizSubsection {...props} />
        <QuizQuestionTypeAndMarks {...props} />
        <QuizLanguage {...props} />
        <QuizQuestionPanel {...props} />
        <QuizButtonOptions {...props} />
      </Box>
    </Box>
  );
};

export default Ibps;
