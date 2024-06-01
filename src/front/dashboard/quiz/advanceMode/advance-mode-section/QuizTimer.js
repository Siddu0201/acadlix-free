import React from 'react'
import { Box, Typography } from "@mui/material"

const QuizTimer = (props) => {
  return (
    <Box
      id="acadlix_quiz_timer"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: 1,
        backgroundColor: props?.colorCode?.timer_background,
      }}>
      <Box>
        <Typography variant="caption">Sections</Typography>
      </Box>
      <Box>
        <Typography variant='subtitle2'>Time Left: 29:58</Typography>
      </Box>
    </Box>
  )
}

export default QuizTimer
