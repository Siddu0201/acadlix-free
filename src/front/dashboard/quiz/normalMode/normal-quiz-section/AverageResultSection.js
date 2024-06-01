import { Box, Typography } from "@mui/material";
import React from "react";

const AverageResultSection = () => {
  return (
    <Box
      sx={{
        border: "1px solid black",
        width: "35%",
        marginX: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          marginX: 2,
          marginY: 3,
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            paddingX: 3,
          }}
        >
          Average Score:
        </Typography>
        <Typography>0%</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          marginX: 2,
          marginY: 3,
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            paddingX: 3,
          }}
        >
          Your Score:
        </Typography>
        <Typography>50%</Typography>
      </Box>
    </Box>
  );
};

export default AverageResultSection;
