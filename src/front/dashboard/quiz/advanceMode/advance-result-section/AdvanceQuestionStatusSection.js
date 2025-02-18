import React from "react";
import { Box, Chip } from "@mui/material";
import { __ } from "@wordpress/i18n";

const AdvanceQuestionStatusSection = (props) => {
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
          <Chip label={__("Correct", "acadlix")} color="success" />
        ) : (
          <Chip label={__("Incorrect", "acadlix")} color="error" />
        )
      ) : (
        <Chip label={__("Skipped", "acadlix")} color="grey" />
      )}
    </Box>
  );
};

export default AdvanceQuestionStatusSection;
