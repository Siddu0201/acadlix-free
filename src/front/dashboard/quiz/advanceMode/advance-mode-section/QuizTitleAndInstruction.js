import { Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import { TiInfoLarge } from "react-icons/ti";

const QuizTitleAndInstruction = (props) => {
  return (
    <Box
      id="acadlix_quiz_title_and_instruction"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: props?.colorCode?.title_and_instruction_background,
        padding: "4px 6px",
      }}>
      <Box>
        <Typography sx={{
          color: props?.colorCode?.second_title_color,
          fontSize: "11px",
        }}>{props?.watch("title")}</Typography>
      </Box>
      <Box sx={{
        display: "flex",
        columnGap: 1,
      }}>
        <IconButton size='small' sx={{
          padding: 0,
          marginBottom: "0px !important",
          fontSize: "0.9rem",
          color: props?.colorCode?.info_icon,
          background: props?.colorCode?.info_icon_background,
          width: "14px",
          height: "13px",
          top: "2px",
        }}>
          <TiInfoLarge />
        </IconButton>
        <Typography sx={{
          color: props?.colorCode?.instruction_color,
          fontSize: "11px",
        }}>View Instruction</Typography>
      </Box>
    </Box>
  )
}

export default QuizTitleAndInstruction
