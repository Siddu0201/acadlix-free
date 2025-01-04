import { Box } from "@mui/material";
import React from "react";
import QuizQuestionNumber from "./QuizQuestionNumber";
import QuizQuestion from "./QuizQuestion";
import QuizButtonOptions from "./QuizButtonOptions";
import toast from "react-hot-toast";
import DisableScroll from "../advance-mode-component/DisableScroll";

const QuizQuestionPanel = (props) => {
  // const idList = [
  //   "acadlix_quiz_logo_and_title",
  //   "acadlix_quiz_title_and_instruction",
  //   "acadlix_quiz_section",
  //   "acadlix_quiz_timer",
  //   `acadlix_quiz_per_question_timer_${props?.question?.question_id}`,
  //   `acadlix_quiz_subject_wise_timer_${props?.subject?.subject_id}`,
  //   "acadlix_quiz_subsection",
  //   "acadlix_quiz_question_type_and_marks",
  //   "acadlix_quiz_language",
  //   `acadlix_quiz_button_options_${props?.question?.question_id}`,
  // ];
  // const [remainingHeight, setRemainingHeight] = React.useState(0);
  // React.useEffect(() => {
  //   let total = 3;
  //   idList.forEach((a, i) => {
  //     total += document.getElementById(a)?.clientHeight ?? 0;
  //   });
  //   if (acadlixOptions?.is_admin_bar_showing) {
  //     // total += props?.isDesktop ? 32 : 46;
  //   }
  //   setRemainingHeight(total);
  // }, [props?.question?.selected]);


  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: 0,
        // display: props?.question?.selected ? " " : "none",
      }}
    >
      {/* Disable scroll bar for ibps  */}
      <DisableScroll {...props} />
      <Box
        sx={{
          flex: 1,
          border: `1px solid ${props?.colorCode?.question_border}`,
          // height: `calc(100% - ${remainingHeight}px)`,
          overflowY: "auto",
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
