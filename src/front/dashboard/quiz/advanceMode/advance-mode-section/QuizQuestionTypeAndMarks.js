import React from 'react'
import { Box, Typography } from "@mui/material"

const QuizQuestionTypeAndMarks = (props) => {
  const selectedQuestion = props?.watch("questions")?.filter(q => q?.selected)?.[0];
  const answerType = () => {
    switch (selectedQuestion?.answer_type) {
      case "singleChoice":
        return "Single Choice Question";
      case "multipleChoice":
        return "Multiple Choice Question";
      case "trueFalse":
        return "True False";
      case "sortingChoice":
        return "Sorting Choice Question";
      case "matrixSortingChoice":
        return "Matrix Sorting Choice Question";
      case "fillInTheBlank":
        return "Fill in the blank";
      case "numerical":
        return "Numerical";
      case "rangeType":
        return "Range Type Question";
      default:
        return "Single Choice Question";
    }
  };
  return (
    <Box
      id="acadlix_quiz_question_type_and_marks"
      sx={{
        display: "flex",
        padding: 1,
        backgroundColor: props?.colorCode?.question_type_background,
      }}>
      <Box>
        <Typography variant="subtitle2" sx={{
          fontSize: 12,
        }}>
          Question Type: {answerType()} 
        </Typography>
      </Box>
    </Box>
  )
}

export default QuizQuestionTypeAndMarks
