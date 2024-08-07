import React from 'react'
import { Box, Typography } from "@mui/material"
import User from "../../../../../images/NewCandidateImage.jpg"

const QuizSidebarUser = (props) => {
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    let total = 0;
    total += document.getElementById("acadlix_quiz_section")?.clientHeight ?? 0;
    total += document.getElementById("acadlix_quiz_timer")?.clientHeight ?? 0;
    total += document.getElementById("acadlix_quiz_subsection")?.clientHeight ?? 0;
    setHeight(total);
  });
  
  return (
    <Box sx={{
      display: "flex",
      backgroundColor: props?.colorCode?.user_background,
      height: height,
    }}
      id="acadlix_quiz_sidebar_user"
    >
      <Box sx={{
        margin: 2
      }}>
        <img 
          src={User}
          alt="fsdf" 
          style={{
            height: "100%",
            width: "100%",
            background: props?.colorCode?.user_image_background,
            border: `1px solid ${props?.colorCode?.user_image_border}`
          }}
        />
      </Box>
      <Box sx={{
        margin: 2
      }}>
        <Typography variant="body1">
          {props?.watch("name")}
        </Typography>
      </Box>
    </Box>
  )
}

export default QuizSidebarUser
