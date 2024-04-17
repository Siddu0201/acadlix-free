import { Box, Typography } from '@mui/material'
import React from 'react'

const QuizLogoAndTitle = (props) => {
  return (
    <Box
      id="acadlix_quiz_logo_and_title"
      sx={{
        display: "grid",
        gridTemplateColumns: "auto auto",
        padding: 2,
        backgroundColor: props?.colorCode?.logo_and_title_background,
      }}>
      <Box>
        <Typography>Logo</Typography>
      </Box>
      <Box>
        <Typography sx={{
          color: props?.colorCode?.top_title_color,
          fontWeight: 700,
          fontSize: "1.15rem",
        }}>New IBPS Text</Typography>
      </Box>
    </Box>
  )
}

export default QuizLogoAndTitle
