import { Box, Typography } from "@mui/material";
import React from "react";
import { __ } from "@wordpress/i18n";

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
          component="div"
          sx={{
            fontWeight: "bold",
            paddingX: 3,
          }}
        >
          {__("Average Score:", "acadlix")}
        </Typography>
        <Typography component="div">0%</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          marginX: 2,
          marginY: 3,
        }}
      >
        <Typography
          component="div"
          sx={{
            fontWeight: "bold",
            paddingX: 3,
          }}
        >
          {__("Your Score:", "acadlix")}
        </Typography>
        <Typography component="div">50%</Typography>
      </Box>
    </Box>
  );
};

export default AverageResultSection;
