import { Box } from "@mui/material";
import React from "react";
import NtaMarkedAndAnswered from "../type-button/NtaMarkedAndAnswered";
import NtaMarked from "../type-button/NtaMarked";
import NtaAnswered from "../type-button/NtaAnswered";
import NtaNotAnswered from "../type-button/NtaNotAnswered";
import NtaNotVisited from "../type-button/NtaNotVisited";

const NtaSidebarQuestionOverview = (props) => {
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
        <NtaMarkedAndAnswered
          {...props}
          index={question?.question_id}
          question={question}
          parentBackground={props?.colorCode?.sidebar_overview_background}
          handleClick={handleClick}
        >
          {i + 1}
        </NtaMarkedAndAnswered>
      );
    } else if (!question?.result?.solved_count && question?.review) {
      return (
        <NtaMarked
          {...props}
          index={question?.question_id}
          question={question}
          parentBackground={props?.colorCode?.sidebar_overview_background}
          handleClick={handleClick}
        >
          {i + 1}
        </NtaMarked>
      );
    } else if (question?.result?.solved_count && !question?.review) {
      return (
        <NtaAnswered
          {...props}
          index={question?.question_id}
          question={question}
          parentBackground={props?.colorCode?.sidebar_overview_background}
          handleClick={handleClick}
        >
          {i + 1}
        </NtaAnswered>
      );
    } else if (question?.visit && !question?.result?.solved_count) {
      return (
        <NtaNotAnswered
          {...props}
          index={question?.question_id}
          question={question}
          parentBackground={props?.colorCode?.sidebar_overview_background}
          handleClick={handleClick}
        >
          {i + 1}
        </NtaNotAnswered>
      );
    } else if (!question?.visit) {
      return (
        <NtaNotVisited
          {...props}
          index={question?.question_id}
          question={question}
          parentBackground={props?.colorCode?.sidebar_overview_background}
          handleClick={handleClick}
        >
          {i + 1}
        </NtaNotVisited>
      );
    }
  };
  return (
    <Box
      sx={{
        display: props?.selected ? "" : "none",
      }}
      id="acadlix_quiz_sidebar_question_overview"
    >
      <Box
        sx={{
          position: "relative",
          overflowY: "scroll",
          overflowX: "hidden",
          right: "-17px",
          left: "0",
          paddingX: 3,
          paddingTop: 2,
          display: "grid",
          gridTemplateColumns: "auto auto auto auto auto auto auto",
          gridTemplateRows: "30px",
          height: `300px`,
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
      </Box>
    </Box>
  );
};

export default NtaSidebarQuestionOverview;
