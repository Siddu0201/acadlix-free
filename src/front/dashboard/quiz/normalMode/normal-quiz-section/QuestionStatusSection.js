import { Box, Chip } from "@mui/material";
import React from "react";

const QuestionStatusSection = (props) => {
  return (
    <Box
      sx={{
        display:
          props?.watch("view_answer") ||
          props?.watch(`questions.${props?.index}.check`)
            ? ""
            : "none",
      }}
    >
      {props?.watch(`questions.${props?.index}.result.solved_count`) ? (
        props?.watch(`questions.${props?.index}.result.correct_count`) ? (
          <Chip label="Correct" color="success" />
        ) : (
          <Chip label="Incorrect" color="error" />
        )
      ) : (
        <Chip label="Skipped" color="grey" />
      )}
    </Box>
  );
};

export default QuestionStatusSection;
