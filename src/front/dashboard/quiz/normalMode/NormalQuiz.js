import { Container, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import ResultSection from "./normal-quiz-section/ResultSection";
import SubjectResultSection from "./normal-quiz-section/SubjectResultSection";
import LeaderboardSection from "./normal-quiz-section/LeaderboardSection";
import ViewButtonSection from "./normal-quiz-section/ViewButtonSection";
import QuestionOverviewSection from "./normal-quiz-section/QuestionOverviewSection";
import QuestionSection from "./normal-quiz-section/QuestionSection";
import TimerSection from "./normal-quiz-section/TimerSection";
import FinishSection from "./normal-quiz-section/FinishSection";
import ViewAnswerSection from "./normal-quiz-section/ViewAnswerSection";
import PerQuestionTimerSection from "./normal-quiz-section/PerQuestionTimerSection";
import QuestionPaginationSection from "./normal-quiz-section/QuestionPaginationSection";

const NormalQuiz = (props) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const colorCode = {
    button: "#13455b",
    timer: "#00f",
    answered: "#6ca54c",
    review: "#ffb800",
    answered_and_review: "#674787",
    correct: theme?.palette?.success?.main,
    incorrect: theme?.palette?.error?.main,
    skipped: theme?.palette?.grey[300],
    radio: "#0075ff",
    incorrect_number: "#f00",
    correct_number: "#6ca54c",
    overview_border: "#C3D1A3",
    overview_background: "#f8faf5",
    overview_button_border: "#CFCFCF",
    overview_button_background: "#fff",
    overview_button_text: "black",
    overview_button_active_text: "white",
    overview_button_active_border: "#7DB1D3",
    option_background: "#f8faf5",
    option_border: "#C3D1A3",
    hint_background: "#f8faf5",
    hint_border: "#C3D1A3",
    category_title: "#6451cd",
    leaderboard_header: "#9bbb59",
    leaderborad_text_background: "#f5faea",
  };

  let questionRef = React.useRef([]);

  const scrollToQuestion = (id) => {
    if (
      document?.getElementById(`result_question_overview_${props?.watch("id")}`)
    ) {
      setTimeout(() => {
        document
          ?.getElementById(`result_question_overview_${props?.watch("id")}`)
          .scrollIntoView({
            behavior: "smooth", // 'smooth' makes it animate smoothly
          });
      }, 10);
    } else {
      if (questionRef?.current?.[id]) {
        setTimeout(() => {
          questionRef?.current?.[id].scrollIntoView({
            behavior: "smooth", // 'smooth' makes it animate smoothly
          });
        }, 10);
      }
    }
  };

  return (
    <Container
      sx={{
        paddingX: {
          xs: 0,
          md: 2,
        },
        minWidth: "80%",
      }}
    >
      {props?.watch("view_result") && (
        <>
          {!props?.watch("hide_result") && (
            <>
              <ResultSection
                colorCode={colorCode}
                isDesktop={isDesktop}
                {...props}
              />
              {/* <AverageResultSection
                colorCode={colorCode}
                isDesktop={isDesktop}
                {...props}
              /> */}
              {props?.watch("show_subject_wise_analysis") && (
                <SubjectResultSection
                  colorCode={colorCode}
                  isDesktop={isDesktop}
                  {...props}
                />
              )}
            </>
          )}
          {props?.watch("leaderboard") &&
            props?.watch("display_leaderboard_in_quiz_result") ===
            "below_the_result" && (
              <LeaderboardSection
                colorCode={colorCode}
                isDesktop={isDesktop}
                {...props}
              />
            )}

          <ViewButtonSection
            colorCode={colorCode}
            isDesktop={isDesktop}
            {...props}
          />
          {props?.watch("leaderboard") &&
            props?.watch("view_leaderboard") &&
            props?.watch("display_leaderboard_in_quiz_result") ===
            "in_the_button" && (
              <LeaderboardSection
                colorCode={colorCode}
                isDesktop={isDesktop}
                {...props}
              />
            )}
          {props?.watch("view_answer") && (
            <ViewAnswerSection
              colorCode={colorCode}
              isDesktop={isDesktop}
              questionRef={questionRef}
              scrollToQuestion={scrollToQuestion}
              isDisabled={true}
              {...props}
            />
          )}
        </>
      )}
      {props?.watch("view_question") && (
        <>
          {props?.watch("quiz_time") > 0 &&
            props?.watch("quiz_timing_type") === "full_quiz_time" && (
              <TimerSection
                colorCode={colorCode}
                isDesktop={isDesktop}
                {...props}
              />
            )}
          {props?.watch("quiz_time") > 0 &&
            props?.watch("quiz_timing_type") === "per_question_time" &&
            props?.watch("questions")?.length > 0 &&
            props
              ?.watch("questions")
              ?.map((question, index) => (
                <PerQuestionTimerSection
                  {...props}
                  key={index}
                  index={index}
                  colorCode={colorCode}
                  isDesktop={isDesktop}
                  question={question}
                  first={index === 0}
                  last={props?.watch("questions")?.length - 1 === index}
                />
              ))}

          {props?.watch("question_overview") && (
            <QuestionOverviewSection
              colorCode={colorCode}
              isDesktop={isDesktop}
              scrollToQuestion={scrollToQuestion}
              {...props}
            />
          )}
          {props?.watch("questions")?.length > 0 &&
            props
              ?.watch("questions")
              ?.map((question, index) => (
                <React.Fragment key={index}>
                  {question?.selected &&
                    <QuestionSection
                      {...props}
                      // key={index}
                      index={index}
                      num={index + 1}
                      colorCode={colorCode}
                      isDesktop={isDesktop}
                      question={question}
                      first={index === 0}
                      last={props?.watch("questions")?.length - 1 === index}
                      questionRef={questionRef}
                    />}
                </React.Fragment>
              ))}

          {props?.watch("questions")?.length > 0 &&
            props?.watch("mode") === "question_below_each_other" &&
            props?.watch("question_per_page") > 0 &&
            !props?.watch("finish") && (
              <QuestionPaginationSection
                {...props}
                scrollToQuestion={scrollToQuestion}
              />
            )}
          <FinishSection
            colorCode={colorCode}
            isDesktop={isDesktop}
            {...props}
          />
        </>
      )}
    </Container>
  );
};

export default NormalQuiz;
