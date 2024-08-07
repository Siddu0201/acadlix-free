import React from 'react'
import { Box, Typography } from "@mui/material"

const QuizSidebarSection = (props) => {
  return (
    <Box sx={{
      paddingLeft: "10px",
      backgroundColor: props?.colorCode?.sidebar_section_background,
    }}
    id="acadlix_quiz_sidebar_section"
    >
      <Typography variant="body1" sx={{
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "31px",
        height: "31px",
        color: props?.colorCode?.sidebar_section_color,
      }}>
        {props?.watch("subjects")?.filter(s => s?.selected)?.[0]?.subject_name}
      </Typography>
    </Box>
  )
}

export default QuizSidebarSection
