import { Box, Button } from "@mui/material";
import React from "react";
import CustomButton from "../normal-quiz-component/CustomButton";

const ViewButtonSection = (props) => {
  const handleResetQuiz = () => {
    props?.reset();
  }

  const handleViewAnswer = () => {
    props?.setValue('view_answer', !props?.watch('view_answer'), {shouldDirty: true});
    if(props?.watch('questions')?.filter(d => d.selected).length === 0){
      props?.setValue('questions.0.selected', true, {shouldDirty: true});
    }
  }
  
  const handleViewLeaderBoard = () => {
    props?.setValue('view_leaderboard', !props?.watch('view_leaderboard'), {shouldDirty: true});
  }
  return (
    <Box
      sx={{
        display: "flex",
        marginY: 2,
        columnGap: 1,
      }}
    >
      {
        !props?.watch("hide_restart_button") &&
        <CustomButton onClick={handleResetQuiz}>Restart Quiz</CustomButton>
      }
      <CustomButton onClick={handleViewAnswer}>View Answer</CustomButton>
      <CustomButton onClick={handleViewLeaderBoard}>Leaderboard</CustomButton>
    </Box>
  );
};

export default ViewButtonSection;
