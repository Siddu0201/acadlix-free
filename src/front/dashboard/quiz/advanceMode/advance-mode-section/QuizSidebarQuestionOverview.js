import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import NotVisited from "../answer-type-buttons/NotVisited";
import NotAnswered from "../answer-type-buttons/NotAnswered";
import Answered from "../answer-type-buttons/Answered";
import Marked from "../answer-type-buttons/Marked";
import MarkedAndAnswered from "../answer-type-buttons/MarkedAndAnswered";

const QuizSidebarQuestionOverview = (props) => {
  const idList = [
    `acadlix_quiz_sidebar_status_types_${props?.s_index}`,
    "acadlix_quiz_sidebar_section",
    `acadlix_quiz_choose_question_${props?.s_index}`,
  ];

  const [height, setHeight] = React.useState(0);

  React.useLayoutEffect(() => {
    let total = 0;
    idList.forEach((a, i) => {
      total += document.getElementById(a)?.clientHeight ?? 0;
    });
    setHeight(() => total);
  });

  const handleClick = (id, event) => {
    props?.setValue(
      "questions",
      props.watch("questions")?.map((question, index) => {
        if (question.selected) {
          question.result.time =
            question.result.time +
            Math.round((Date.now() - props?.watch("last")) / 1000);
        }
        if (question?.question_id === id) {
          question.visit = true;
          question.selected = true;
        } else {
          question.selected = false;
        }
        return question;
      })
    );

    props?.setValue("last", Date.now(), { shouldDirty: true });
  };

  const getAnswerPallete = (question, i) => {
    if (question?.result?.solved_count && question?.review) {
      return (
        <MarkedAndAnswered
          {...props}
          index={question?.question_id}
          question={question}
          large={true}
          parentBackground={props?.colorCode?.sidebar_overview_background}
          handleClick={handleClick}
        >
          {i + 1}
        </MarkedAndAnswered>
      );
    } else if (!question?.result?.solved_count && question?.review) {
      return (
        <Marked
          {...props}
          index={question?.question_id}
          question={question}
          large={true}
          parentBackground={props?.colorCode?.sidebar_overview_background}
          handleClick={handleClick}
        >
          {i + 1}
        </Marked>
      );
    } else if (question?.result?.solved_count && !question?.review) {
      return (
        <Answered
          {...props}
          index={question?.question_id}
          question={question}
          large={true}
          parentBackground={props?.colorCode?.sidebar_overview_background}
          handleClick={handleClick}
        >
          {i + 1}
        </Answered>
      );
    } else if (question?.visit && !question?.result?.solved_count) {
      return (
        <NotAnswered
          {...props}
          index={question?.question_id}
          question={question}
          large={true}
          parentBackground={props?.colorCode?.sidebar_overview_background}
          handleClick={handleClick}
        >
          {i + 1}
        </NotAnswered>
      );
    } else if (!question?.visit) {
      return (
        <NotVisited
          {...props}
          index={question?.question_id}
          question={question}
          large={true}
          parentBackground={props?.colorCode?.sidebar_overview_background}
          handleClick={handleClick}
        >
          {i + 1}
        </NotVisited>
      );
    }
  };
  return (
    <Box
      sx={{
        backgroundColor: props?.colorCode?.sidebar_overview_background,
        display: props?.selected ? "" : "none",
      }}
      id="acadlix_quiz_sidebar_question_overview"
    >
      <Box>
        <Typography
          sx={{
            fontSize: "12px",
            padding: "0px 8px 0px 10px",
            height: "26px",
            lineHeight: "26px",
          }}
          id={`acadlix_quiz_choose_question_${props?.s_index}`}
        >
          <b>Choose a Question</b>
        </Typography>
      </Box>
      <Box
        sx={{
          position: "relative",
          overflowY: "scroll",
          overflowX: "hidden",
          right: "-17px",
          left: "0",
          padding: "5px",
          display: "grid",
          gridTemplateColumns: "auto auto auto auto",
          gridTemplateRows: "53px",
          height: `calc(100% - ${height}px)`,
        }}
      >
        {props
          ?.watch("questions")
          ?.filter((q) => q?.subject_id === props?.subject_id)?.length > 0 &&
          props
            ?.watch("questions")
            ?.filter((q) => q?.subject_id === props?.subject_id)
            .map((a, i) => (
              <Box
                key={i}
                sx={{
                  margin: "0px 5px 10px 0px",
                  cursor: "pointer",
                }}
              >
                {getAnswerPallete(a, i)}
              </Box>
            ))}
        {/* <Box sx={{
          margin: "0px 5px 10px 0px",
        }}>
          <NotVisited {...props} large={true}>1</NotVisited>
        </Box> */}
        {/* <Box sx={{
          margin: "0px 5px 10px 0px",
        }}>
          <NotAnswered {...props} large={true}>2</NotAnswered>
        </Box>
        <Box sx={{
          margin: "0px 5px 10px 0px",
        }}>
          <Answered {...props} large={true}>3</Answered>
        </Box>
        <Box sx={{
          margin: "0px 5px 10px 0px",
        }}>
          <Marked {...props} large={true}>4</Marked>
        </Box>
        <Box sx={{
          margin: "0px 5px 10px 0px",
        }}>
          <MarkedAndAnswered {...props} large={true}>5</MarkedAndAnswered>
        </Box> */}
      </Box>
    </Box>
  );
};

export default QuizSidebarQuestionOverview;
