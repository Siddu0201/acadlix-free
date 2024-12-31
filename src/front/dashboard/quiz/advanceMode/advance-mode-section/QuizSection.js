import React from 'react'
import { Box, IconButton } from "@mui/material"
import { FaCaretLeft, FaCaretRight } from "../../../../../helpers/icons";
import SectionButton from '../advance-mode-component/SectionButton';

const QuizSection = (props) => {
  return (
    <Box
      id="acadlix_quiz_section"
      sx={{
        paddingTop: 2,
        paddingBottom: 2,
        background: props?.colorCode?.section_background,
        display: "flex",
        gap: 1,
      }}>
      <Box>
        <IconButton size='small' disabled sx={{
          marginBottom: "0px !important",
        }}>
          <FaCaretLeft />
        </IconButton>
      </Box>
      <SectionButton active={true} {...props} />
      <SectionButton {...props} />
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

export default QuizSection
