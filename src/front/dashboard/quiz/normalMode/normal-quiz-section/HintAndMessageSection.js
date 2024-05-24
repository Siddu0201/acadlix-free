import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import React from "react";

const HintAndMessageSection = (props) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        border: `1px solid ${props?.colorCode?.hint_border}`,
        padding: 2,
        marginY: 2,
        backgroundColor: props?.colorCode?.hint_background,
        boxShadow: theme?.shadows[1],
      }}
    >
      <Box>
        <Box>
          <Typography>
            <b>Hint</b>
          </Typography>
        </Box>
        <Box>
          <Typography>{props?.lang?.hint_msg}</Typography>
        </Box>
      </Box>
      <Box>
        <Box>
          <Typography>
            <b>Correct</b>
          </Typography>
        </Box>
        <Box>
          <Typography>{props?.lang?.correct_msg}</Typography>
        </Box>
      </Box>
      <Box>
        <Box>
          <Typography>
            <b>Incorrect</b>
          </Typography>
        </Box>
        <Box>
          <Typography>{props?.lang?.incorrect_msg}</Typography>
        </Box>
      </Box>
      <Box>
        <Box>
          <Typography>
            <b>Unattempted</b>
          </Typography>
        </Box>
        <Box>
          <Typography>{props?.lang?.incorrect_msg}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HintAndMessageSection;
