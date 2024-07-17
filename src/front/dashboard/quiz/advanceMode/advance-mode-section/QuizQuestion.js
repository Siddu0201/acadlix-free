import { Box } from "@mui/material";
import React from "react";
import TypeSingleChoice from "../../questionTypes/TypeSingleChoice";

const QuizQuestion = (props) => {
  return (
    <Box
      id="acadlix_quiz_question"
      sx={{
        backgroundColor: props?.colorCode?.question_background,
      }}
    >
      <Box
        sx={{
          padding: 1,
          paddingX: 3,
        }}
      >
      </Box>
    </Box>
  );
};

export default QuizQuestion;
