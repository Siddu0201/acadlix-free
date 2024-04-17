import { Box, Typography } from "@mui/material";
import React from "react";
import TypeSingleChoice from "../../questionTypes/TypeSingleChoice"
import OptionButtonSection from "./OptionButtonSection";
import HintAndMessageSection from "./HintAndMessageSection";

const QuestionSection = (props) => {
  return (
    <Box>
      <Box>
        <Box sx={{
          marginY: "5px"
        }}>
          <Typography>
            Question <b>1</b> of <b>10</b>
          </Typography>
        </Box>
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          marginY: "5px",
        }}>
          <Box>
            <Typography>1. Question</Typography>
          </Box>
          <Box>
            <Typography><b>1 points</b></Typography>
          </Box>
        </Box>
        <Box sx={{
          marginY: "2px",
        }}>
          <Typography><b>Category: Geography</b></Typography>
        </Box>
        <TypeSingleChoice />
        <OptionButtonSection {...props} />
        <HintAndMessageSection {...props} />
      </Box>
    </Box>
  );
};

export default QuestionSection;
