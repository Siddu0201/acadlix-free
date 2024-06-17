import { Container, useMediaQuery } from "@mui/material";
import React from "react";
import DescriptionSection from "./normal-quiz-section/DescriptionSection";
import ResultSection from "./normal-quiz-section/ResultSection";
import AverageResultSection from "./normal-quiz-section/AverageResultSection";
import SubjectResultSection from "./normal-quiz-section/SubjectResultSection";
import ResultTextSection from "./normal-quiz-section/ResultTextSection";
import LeaderboardSection from "./normal-quiz-section/LeaderboardSection";
import ViewButtonSection from "./normal-quiz-section/ViewButtonSection";
import QuestionOverviewSection from "./normal-quiz-section/QuestionOverviewSection";
import QuestionSection from "./normal-quiz-section/QuestionSection";
import { useTheme } from "@emotion/react";
import TimerSection from "./normal-quiz-section/TimerSection";
import FinishSection from "./normal-quiz-section/FinishSection";
import ViewAnswerSection from "./normal-quiz-section/ViewAnswerSection";

const NormalQuiz = (props) => {
  const colorCode = {
    button: "#13455b",
    timer: "#00f",
    answered: "#6ca54c",
    review: "#ffb800",
    answered_and_review: "#674787",
    correct: '#56AB2F',
    incorrect: '#FF6B6B',
    skipped: '#8f83f7',
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

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  console.log(acadlixOptions.user_id);

  return (
    <Container
      minWidth="80%"
      sx={{
        paddingX: {
          xs: 0,
          md: 2,
        },
      }}
    >
      {
        props?.watch('view_result') &&
        <>
          {
            !props?.watch('hide_result') &&
            <>
              <ResultSection colorCode={colorCode} isDesktop={isDesktop} {...props} />
              {/* <AverageResultSection
                colorCode={colorCode}
                isDesktop={isDesktop}
                {...props}
              /> */}
              {
                props?.watch("show_subject_wise_analysis") &&
                <SubjectResultSection
                  colorCode={colorCode}
                  isDesktop={isDesktop}
                  {...props}
                />
              }
              <ResultTextSection
                colorCode={colorCode}
                isDesktop={isDesktop}
                {...props}
              />
            </>
          }
          <ViewButtonSection
            colorCode={colorCode}
            isDesktop={isDesktop}
            {...props}
          />
          {
            props?.watch('view_leaderboard') &&
            <LeaderboardSection
              colorCode={colorCode}
              isDesktop={isDesktop}
              {...props}
            />
          }
          {
            props?.watch('view_answer') &&
            <ViewAnswerSection
              colorCode={colorCode}
              isDesktop={isDesktop}
              {...props}
            />
          }
        </>
      }
      {
        props?.watch('view_question') &&
        <>
          {
            props?.watch('quiz_time') > 0 &&
            <TimerSection 
              colorCode={colorCode}
              isDesktop={isDesktop}
              {...props} 
            />
          }

          {
            props?.watch("question_overview") &&
            <QuestionOverviewSection
              colorCode={colorCode}
              isDesktop={isDesktop}
              {...props}
            />
          }
          {
            props?.watch('questions')?.length > 0 &&
            props?.watch('questions')?.map((question, index) => (
              <QuestionSection 
                {...props}
                key={index}
                index={index}
                num={index + 1}
                colorCode={colorCode} 
                isDesktop={isDesktop} 
                question={question} 
                first={index === 0}
                last={props?.watch('questions')?.length - 1 === index}
              />
            ))
          }
          <FinishSection
            colorCode={colorCode}
            isDesktop={isDesktop}
            {...props}
          />
        </>
      }
    </Container>
  );
};

export default NormalQuiz;
