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
          <Typography>Hint message</Typography>
        </Box>
      </Box>
      <Box>
        <Box>
          <Typography>
            <b>Correct</b>
          </Typography>
        </Box>
        <Box>
          <Typography>Correct message</Typography>
        </Box>
      </Box>
      <Box>
        <Box>
          <Typography>
            <b>Incorrect</b>
          </Typography>
        </Box>
        <Box>
          <Typography>Incorrect message</Typography>
        </Box>
      </Box>
      <Box>
        <Box>
          <Typography>
            <b>Unattempted</b>
          </Typography>
        </Box>
        <Box>
          <Typography>Unattempted also contain incorrect message</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HintAndMessageSection;
