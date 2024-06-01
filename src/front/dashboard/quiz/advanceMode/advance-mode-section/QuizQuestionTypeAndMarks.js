import React from 'react'
import { Box, Typography } from "@mui/material"

const QuizQuestionTypeAndMarks = (props) => {
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
          Question Type :Multiple Choice Question
        </Typography>
      </Box>
    </Box>
  )
}

export default QuizQuestionTypeAndMarks
