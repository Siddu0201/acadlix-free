import { Box, Chip } from "@mui/material";
import React from "react";
import { __ } from "@wordpress/i18n";

const QuestionStatusSection = (props) => {
  
  const getStatusChip = () => {
    const solved = props?.watch(`questions.${props?.index}.result.solved_count`);
    const correct = props?.watch(`questions.${props?.index}.result.correct_count`);
    const isEvaluated = props?.watch(`questions.${props?.index}.result.is_evaluated`);
    const answerType = props?.watch(`questions.${props?.index}.answer_type`);
    // Skipped
    if (!solved) {
      return {
        label: __('Skipped', 'acadlix'),
        color: 'default',
        className: 'acadlix-normal-quiz-question-status-skipped',
      };
    }

    // Assessment questions
    if (answerType === 'assessment') {
      if (!isEvaluated) {
        return {
          label: __('Pending', 'acadlix'),
          color: 'warning',
          className: 'acadlix-normal-quiz-question-status-pending',
        };
      }

      return {
        label: __('Evaluated', 'acadlix'),
        color: 'info',
        className: 'acadlix-normal-quiz-question-status-evaluated',
      };
    }

    // Non-assessment questions
    if (correct) {
      return {
        label: __('Correct', 'acadlix'),
        color: 'success',
        className: 'acadlix-normal-quiz-question-status-correct',
      };
    }

    return {
      label: __('Incorrect', 'acadlix'),
      color: 'error',
      className: 'acadlix-normal-quiz-question-status-incorrect',
    };
  };
  const statusChip = getStatusChip();
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
      <Chip
        label={statusChip.label}
        color={statusChip.color}
        className={statusChip.className}
      />
    </Box>
  );
};

export default QuestionStatusSection;
