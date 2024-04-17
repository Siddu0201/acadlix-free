import React from 'react'
import {Box, Typography} from  "@mui/material";

const QuizQuestionNumber = (props) => {
  return (
    <Box 
    id="acadlix_quiz_question_number"
    sx={{
      padding: "2px 4px",
      backgroundColor: props?.colorCode?.question_number_background,
      borderBottom: `1px solid ${props?.colorCode?.quesiton_number_border_bottom}`
    }}>
      <Box>
        <Typography variant="subtitle2">
          Question No. 1
        </Typography>
      </Box>
    </Box>
  )
}

export default QuizQuestionNumber
