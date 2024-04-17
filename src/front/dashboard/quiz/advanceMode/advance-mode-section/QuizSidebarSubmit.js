import React from 'react'
import { Box, Button } from "@mui/material"

const QuizSidebarSubmit = (props) => {
  return (
    <Box sx={{
      position: "fixed",
      bottom: 0,
      right: 0,
      zIndex: 1100,
      width: props?.sidebarWidth,
      display: "flex",
      justifyContent: "center",
      paddingY: 1,
      margin: "1px",
      backgroundColor: props?.colorCode?.submit_background,
    }}
    id="acadlix_quiz_sidebar_submit"
    >
      <Button 
        variant="contained" 
        // disabled
        sx={{
        margin: `4px!important`,
        borderRadius: 0,
        fontSize: 13,
        fontWeight: 400,
        paddingX: "18px",
        boxShadow: "none",
        border: `1px solid ${props?.colorCode?.submit_button_border}`,
        backgroundColor: props?.colorCode?.submit_button_background,
        color: props?.colorCode?.submit_button_color,
        ':hover': {
          border: `1px solid ${props?.colorCode?.submit_button_hover_border}`,
          backgroundColor: props?.colorCode?.submit_button_background,
          color: props?.colorCode?.submit_button_color,
          boxShadow: "none",
        },
        '&.Mui-disabled':{
          border: `1px solid ${props?.colorCode?.submit_button_disabled_background}`,
          backgroundColor: props?.colorCode?.submit_button_disabled_background,
          color: props?.colorCode?.submit_button_color,
        }
      }}>
        Submit
      </Button>
    </Box>
  )
}

export default QuizSidebarSubmit
