import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import { TiInfoLarge } from "react-icons/ti";
import InstructionModel from "./model/InstructionModel";

const QuizTitleAndInstruction = (props) => {
  const [showInstruction, setShowInstruction] = React.useState(false);
  return (
    <Box
      id="acadlix_quiz_title_and_instruction"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: props?.colorCode?.title_and_instruction_background,
        padding: "4px 6px",
      }}
    >
      <InstructionModel
        {...props}
        open={showInstruction}
        handleClose={() => setShowInstruction(false)}
      />
      <Box>
        <Typography
          sx={{
            color: props?.colorCode?.second_title_color,
            fontSize: "11px",
          }}
        >
          {props?.watch("title")}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          columnGap: 1,
          cursor: "pointer",
        }}
        onClick={(e) => setShowInstruction(true)}
      >
        <Tooltip arrow title="Read Instruction">
          <IconButton
            size="small"
            sx={{
              padding: 0,
              marginBottom: "0px !important",
              fontSize: "0.9rem",
              color: props?.colorCode?.info_icon,
              background: props?.colorCode?.info_icon_background,
              width: "14px",
              height: "13px",
              top: "2px",
              ":hover, :focus": {
                color: props?.colorCode?.info_icon,
                background: props?.colorCode?.info_icon_background,
              },
            }}
          >
            <TiInfoLarge />
          </IconButton>
        </Tooltip>
        <Typography
          sx={{
            color: props?.colorCode?.instruction_color,
            fontSize: "11px",
          }}
        >
          View Instruction
        </Typography>
      </Box>
    </Box>
  );
};

export default QuizTitleAndInstruction;
