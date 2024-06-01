import React from 'react'
import { Box, IconButton, Button } from "@mui/material"
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa'
import { TiInfoLarge } from 'react-icons/ti'
import SubsectionButton from '../advance-mode-component/SubsectionButton'

const QuizSubsection = (props) => {
  return (
    <Box
      id="acadlix_quiz_subsection"
      sx={{
        display: "flex",
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: props?.colorCode?.subsection_border,
        backgroundColor: props?.colorCode?.subsection_background
      }}>
      <Box>
        <IconButton size='small' disabled sx={{
          marginBottom: "0px !important",
        }}>
          <FaCaretLeft />
        </IconButton>
      </Box>
      <SubsectionButton active={true} {...props} />
      <SubsectionButton {...props} />
      <Box sx={{
        marginLeft: "auto"
      }}>
        <IconButton size='small' disabled sx={{
          marginBottom: "0px !important",
        }}>
          <FaCaretRight />
        </IconButton>
      </Box>
    </Box>
  )
}

export default QuizSubsection
