import { Box, Typography } from "@mui/material";
import React from "react";
import TypeSingleChoice from "../../quiz/question-types/TypeSingleChoice";

const QuestionSection = () => {
  return (
    <Box>
      <Box>
        <TypeSingleChoice />
      </Box>
    </Box>
  );
};

export default QuestionSection;
