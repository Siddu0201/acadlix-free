import { Box } from "@mui/material";
import React from "react";
import CustomButton from "../normal-quiz-component/CustomButton";

const OptionButtonSection = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        marginY: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          columnGap: 1,
        }}
      >
        <CustomButton>Back</CustomButton>
        <CustomButton>Clear Response</CustomButton>
      </Box>
      <Box>
        <CustomButton>Next</CustomButton>
      </Box>
    </Box>
  );
};

export default OptionButtonSection;
