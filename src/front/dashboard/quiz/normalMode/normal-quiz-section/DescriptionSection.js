import { Box, Button, Typography } from "@mui/material";
import React from "react";
import TimerSection from "./TimerSection";
import CustomButton from "../normal-quiz-component/CustomButton";

const DescriptionSection = (props) => {
  return (
    <Box>
      <Typography
        variant="h1"
        sx={{
          fontSize: "2rem",
          fontWeight: "550", // Adjust the font weight to match your original styling
          marginBottom: "1.5rem",
        }}
      >
        Quiz Title
      </Typography>

      <TimerSection time={10 * 1000} {...props} />

      <Typography variant="body1" sx={{ marginY: "9px" }}>
        This is the description of the quiz
      </Typography>
      <CustomButton>Start Quiz</CustomButton>
    </Box>
  );
};

export default DescriptionSection;
