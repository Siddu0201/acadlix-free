import React from "react";
import { Box, Typography } from "@mui/material";

const SkyBlueBox = ({ data }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#bce8f5",
        height: 40,
        paddingLeft: 2,
      }}
      id="acadlix_instruction_skybluebox"
    >
      <Typography variant="h6" color="grey">
        {data}
      </Typography>
    </Box>
  );
};

export default SkyBlueBox;
