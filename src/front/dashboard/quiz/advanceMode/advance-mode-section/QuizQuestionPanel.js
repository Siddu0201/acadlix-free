import { Box } from "@mui/material";
import React from "react";
import QuizQuestionNumber from "./QuizQuestionNumber";
import QuizQuestion from "./QuizQuestion";
import QuizButtonOptions from "./QuizButtonOptions";

const QuizQuestionPanel = (props) => {
  const idList = [
    "acadlix_quiz_logo_and_title",
    "acadlix_quiz_title_and_instruction",
    "acadlix_quiz_section",
    "acadlix_quiz_timer",
    `acadlix_quiz_per_question_timer_${props?.question?.question_id}`,
    `acadlix_quiz_subject_wise_timer_${props?.subject?.subject_id}`,
    "acadlix_quiz_subsection",
    "acadlix_quiz_question_type_and_marks",
    "acadlix_quiz_language",
    `acadlix_quiz_button_options_${props?.question?.question_id}`,
  ];
  const [remainingHeight, setRemainingHeight] = React.useState(0);
  React.useEffect(() => {
      let total = 3;
      idList.forEach((a, i) => {
        total += document.getElementById(a)?.clientHeight ?? 0;
      });
      if (acadlixOptions?.is_admin_bar_showing) {
        // total += props?.isDesktop ? 32 : 46;
      }
      setRemainingHeight(total);
  },[props?.question?.selected]);

  React.useEffect(() => {
    const disableScroll = (e) => {
      e.preventDefault();
    };

    window.addEventListener('wheel', disableScroll, { passive: false });

    return () => {
      window.removeEventListener('wheel', disableScroll);
    };
  }, []);

  return (
    <Box
      sx={{
        display: props?.question?.selected ? " " : "none",
      }}
    >
      <Box
        sx={{
          margin: "1px",
          border: `1px solid ${props?.colorCode?.question_border}`,
          height: `calc(100% - ${remainingHeight}px)`,
          overflowY: "scroll",
          background: props?.colorCode?.question_background,
        }}
      >
        <QuizQuestionNumber {...props} />
        <QuizQuestion {...props} />
      </Box>
      <QuizButtonOptions {...props} />
    </Box>
  );
};

export default QuizQuestionPanel;
