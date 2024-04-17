import { Box } from '@mui/material'
import React from 'react'
import QuizContent from './QuizContent';
import { useTheme } from '@emotion/react';
import { useMediaQuery} from '@mui/material'

const Quiz = (props) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Box>
      <QuizContent {...props} isDesktop={isDesktop} />
    </Box>
  )
}

export default Quiz
