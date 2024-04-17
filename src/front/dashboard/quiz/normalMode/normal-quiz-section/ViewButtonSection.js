import { Box, Button } from "@mui/material";
import React from "react";
import CustomButton from "../normal-quiz-component/CustomButton";

const ViewButtonSection = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        marginY: 2,
        columnGap: 1,
      }}
    >
      <CustomButton>Restart Test</CustomButton>
      <CustomButton>View Answer</CustomButton>
      <CustomButton>Leaderboard</CustomButton>
    </Box>
  );
};

export default ViewButtonSection;
