import React from 'react'
import { Box, Typography } from "@mui/material"
import { __ } from "@wordpress/i18n"

const QuizQuestionTypeAndMarks = (props) => {
  const selectedQuestion = props?.watch("questions")?.filter(q => q?.selected)?.[0];
  const answerType = () => {
    switch (selectedQuestion?.answer_type) {
      case "singleChoice":
        return __("Single Choice Question", "acadlix");
      case "multipleChoice":
        return __("Multiple Choice Question", "acadlix");
      case "trueFalse":
        return __("True False", "acadlix");
      case "sortingChoice":
        return __("Sorting Choice Question", "acadlix");
      case "matrixSortingChoice":
      case "numerical":
        return __("Numerical", "acadlix");
      case "rangeType":
        return __("Range Type Question", "acadlix");
      default:
        return __("Single Choice Question", "acadlix");
    }
  };
  return (
    <Box
      id="acadlix_quiz_question_type_and_marks"
      sx={{
        flex: 0,
        display: "flex",
        padding: 1,
        backgroundColor: props?.colorCode?.question_type_background,
        justifyContent: "space-between",
        alignItems: "center"
      }}>
      <Box>
        <Typography variant="subtitle2" sx={{
          fontSize: 12,
        }}>
          {__("Question Type:", "acadlix")} {answerType()}
        </Typography>
      </Box>
      {
        props?.watch("show_marks") &&
        <Box sx={{
          display: "flex",
          gap: 2
        }}>
          <Box sx={{
            backgroundColor: props?.colorCode?.correct,
            borderRadius: (theme) => theme?.shape,
            paddingX: 2,
            paddingY: 1 / 2,
            color: props?.colorCode?.points_color
          }}><Typography variant="subtitle2">
              +{selectedQuestion?.points}
            </Typography></Box>
          <Box sx={{
            backgroundColor: props?.colorCode?.incorrect,
            borderRadius: (theme) => theme?.shape,
            paddingX: 2,
            paddingY: 1 / 2,
            color: props?.colorCode?.negative_points_color
          }}><Typography variant="subtitle2">
              -{selectedQuestion?.negative_points}
            </Typography></Box>
        </Box>
      }
    </Box>
  )
}

export default QuizQuestionTypeAndMarks
