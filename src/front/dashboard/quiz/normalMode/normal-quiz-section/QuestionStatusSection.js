import { Box, Chip } from "@mui/material";
import React from "react";
import { __ } from "@wordpress/i18n";

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
      className="acadlix-normal-quiz-question-status-section"
    >
      {props?.watch(`questions.${props?.index}.result.solved_count`) ? (
        props?.watch(`questions.${props?.index}.result.correct_count`) ? (
          <Chip
            label={__('Correct', 'acadlix')}
            color="success"
            className="acadlix-normal-quiz-question-status-correct"
          />
        ) : (
          <Chip
            label={__('Incorrect', 'acadlix')}
            color="error"
            className="acadlix-normal-quiz-question-status-incorrect"
          />
        )
      ) : (
        <Chip
          label={__('Skipped', 'acadlix')}
          color="grey"
          className="acadlix-normal-quiz-question-status-skipped"
        />
      )}
    </Box>
  );
};

export default QuestionStatusSection;
