import { Box, Typography } from '@mui/material'
import React from 'react'

const QuizLogoAndTitle = (props) => {
  return (
    <Box
      id="acadlix_quiz_logo_and_title"
      sx={{
        flex: 0,
        display: "grid",
        gridTemplateColumns: "auto auto",
        padding: 2,
        backgroundColor: props?.colorCode?.logo_and_title_background,
      }}>
      <Box>
        <img 
          src={props?.watch("logo")} 
          alt="" 
          style={{
            maxHeight: "25px",
          }}
        />
      </Box>
      <Box>
        <Typography sx={{
          color: props?.colorCode?.top_title_color,
          fontWeight: 700,
          fontSize: "1.15rem",
        }}>{props?.watch("title")}</Typography>
      </Box>
    </Box>
  )
}

export default QuizLogoAndTitle
