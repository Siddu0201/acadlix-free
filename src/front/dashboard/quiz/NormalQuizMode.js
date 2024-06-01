import { Box } from '@mui/material'
import React from 'react'
import NormalQuiz from "./normalMode/NormalQuiz";

const NormalQuizMode = (props) => {
  return (
    <Box>
      <NormalQuiz {...props} />
    </Box>
  )
}

export default NormalQuizMode
