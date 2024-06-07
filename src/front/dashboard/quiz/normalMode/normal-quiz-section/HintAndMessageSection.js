import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import React from "react";

const HintAndMessageSection = (props) => {
  const theme = useTheme();
  return (
    <Box>
      <Box
        sx={{
          border: `1px solid ${props?.colorCode?.hint_border}`,
          padding: 2,
          marginY: 2,
          backgroundColor: props?.colorCode?.hint_background,
          boxShadow: theme?.shadows[1],
          display:
            props?.watch(`questions.${props?.index}.hint`) &&
            props?.watch(`questions.${props?.index}.language`).filter(d => d?.selected )?.[0]?.hint_msg
              ? ""
              : "none",
        }}
      >
        <Box>
          <Typography>
            <b>Hint</b>
          </Typography>
        </Box>
        <Box>
          <Typography>{props?.lang?.hint_msg}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          border: `1px solid ${props?.colorCode?.hint_border}`,
          padding: 2,
          marginY: 2,
          backgroundColor: props?.colorCode?.hint_background,
          boxShadow: theme?.shadows[1],
          display: props?.watch("view_answer") ? "" : "none",
        }}
      >
        <Box>
          <Typography>
            <b>Correct</b>
          </Typography>
        </Box>
        <Box>
          <Typography>{props?.lang?.correct_msg}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          border: `1px solid ${props?.colorCode?.hint_border}`,
          padding: 2,
          marginY: 2,
          backgroundColor: props?.colorCode?.hint_background,
          boxShadow: theme?.shadows[1],
          display: props?.watch("view_answer") ? "" : "none",
        }}
      >
        <Box>
          <Typography>
            <b>Incorrect</b>
          </Typography>
        </Box>
        <Box>
          <Typography>
            {props?.lang?.different_points_for_each_answer
              ? props?.lang?.incorrect_msg
              : props?.lang?.correct_msg}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HintAndMessageSection;
