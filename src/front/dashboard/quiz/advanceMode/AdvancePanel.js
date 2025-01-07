import React from "react";
import QuizLogoAndTitle from "./advance-mode-section/QuizLogoAndTitle";
import QuizTitleAndInstruction from "./advance-mode-section/QuizTitleAndInstruction";
import { Box } from "@mui/material";
import QuizSidebar from "./advance-mode-section/QuizSidebar";
import QuizTimer from "./advance-mode-section/QuizTimer";
import QuizSubsection from "./advance-mode-section/QuizSubsection";
import QuizQuestionTypeAndMarks from "./advance-mode-section/QuizQuestionTypeAndMarks";
import QuizLanguage from "./advance-mode-section/QuizLanguage";
import QuizQuestionPanel from "./advance-mode-section/QuizQuestionPanel";
import PerQuestionQuizTimer from "./advance-mode-section/PerQuestionQuizTimer";
import SubjectWiseTiming from "./advance-mode-section/SubjectWiseTiming";

const AdvancePanel = (props) => {
  return (
    <Box sx={{
      height: acadlixOptions?.is_admin_bar_showing ? "calc(100vh - 32px)" : "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      <QuizLogoAndTitle {...props} />
      <QuizTitleAndInstruction {...props} />
      <QuizSidebar {...props} />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: 0,
          width: {
            xs: "100%",
            sm: props?.isOpen
              ? `calc(100% - ${props?.sidebarWidth}px)`
              : "100%",
          },
        }}
      >
        {/* <QuizSection {...props} /> */}
        {props?.watch("quiz_time") > 0 &&
          props?.watch("quiz_timing_type") === "full_quiz_time" && (
            <QuizTimer {...props} />
          )}
        {props?.watch("quiz_time") > 0 &&
          props?.watch("quiz_timing_type") === "per_question_time" &&
          props?.watch("subjects")?.length > 0 &&
          props?.watch("subjects")?.map((s, s_index) => (
            <React.Fragment key={s_index}>
              {props
                ?.watch("questions")
                ?.filter((q) => q?.subject_id === s?.subject_id)?.length > 0 &&
                props
                  ?.watch("questions")
                  ?.filter((q) => q?.subject_id === s?.subject_id)
                  ?.map((question, index, arr) => (
                    <React.Fragment key={question?.question_id}>
                      {question?.selected && (
                        <PerQuestionQuizTimer
                          {...props}
                          subject={s}
                          key={index}
                          s_index={s_index}
                          question={question}
                          first={index === 0}
                          last={arr?.length - 1 === index}
                          first_subject={s_index === 0}
                          last_subject={
                            props?.watch("subjects")?.length - 1 === s_index
                          }
                        />
                      )}
                    </React.Fragment>
                  ))}
            </React.Fragment>
          ))}
        {props?.watch("quiz_timing_type") === "subject_wise_time" &&
          props?.watch("subjects")?.length > 0 &&
          props
            ?.watch("subjects")
            ?.map((s, s_index) => (
              <React.Fragment key={s_index}>
                {s?.time > 0 && s?.selected && (
                  <SubjectWiseTiming
                    {...props}
                    subject={s}
                    time={
                      props
                        ?.watch("subject_times")
                        ?.filter((t) => t?.subject_id == s?.subject_id)?.[0]
                        ?.time
                    }
                    key={s_index}
                    s_index={s_index}
                    first_subject={s_index === 0}
                    last_subject={
                      props?.watch("subjects")?.length - 1 === s_index
                    }
                  />
                )}
              </React.Fragment>
            ))}
        <QuizSubsection {...props} />
        <QuizQuestionTypeAndMarks {...props} />
        {props?.watch("multi_language") && <QuizLanguage {...props} />}
        {props?.watch("subjects")?.length > 0 &&
          props?.watch("subjects")?.map((s, s_index) => (
            <Box
              key={s_index}
              sx={{
                flex: 1,
                height: 0,
                overflow: "auto",
                display: s?.selected ? "flex" : "none",
                flexDirection: "column",
              }}
            >
              {props
                ?.watch("questions")
                ?.filter((q) => q?.subject_id === s?.subject_id)?.length > 0 &&
                props
                  ?.watch("questions")
                  ?.filter((q) => q?.subject_id === s?.subject_id)
                  ?.map((question, index, arr) => (
                    <React.Fragment key={index}>
                      {question?.selected && (
                        <QuizQuestionPanel
                          {...props}
                          subject={s}
                          index={question?.index}
                          s_index={s_index}
                          num={index + 1}
                          question={question}
                          first={index === 0}
                          last={arr?.length - 1 === index}
                          first_subject={s_index === 0}
                          last_subject={
                            props?.watch("subjects")?.length - 1 === s_index
                          }
                        />
                      )}
                    </React.Fragment>
                  ))}
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default AdvancePanel;
