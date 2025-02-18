import React from 'react'
import CustomButton from '../../normalMode/normal-quiz-component/CustomButton';
import { Box } from '@mui/material';
import { __ } from '@wordpress/i18n';

const AdvanceViewButtonSection = (props) => {
  const handleResetQuiz = () => {
    // props?.reset();
    window?.location?.reload();
  }

  const handleViewAnswer = () => {
    props?.setValue('view_answer', !props?.watch('view_answer'), {shouldDirty: true});
    if(props?.watch('questions')?.filter(d => d.selected).length === 0){
      props?.setValue('questions.0.selected', true, {shouldDirty: true});
    }
    props?.setValue('questions',
      props?.watch("questions")?.map(ques => {
        ques.check = true;
        return ques;
      })
    );
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
        <CustomButton onClick={handleResetQuiz}>{__("Restart Quiz", "acadlix")}</CustomButton>
      }
      {
        !props?.watch("hide_answer_sheet") &&
        <CustomButton onClick={handleViewAnswer}>{__("View Answer", "acadlix")}</CustomButton>
      }
      {
        props?.watch("leaderboard") && props?.watch("display_leaderboard_in_quiz_result") === "in_the_button" &&
        <CustomButton onClick={handleViewLeaderBoard}>{__("Leaderboard", "acadlix")}</CustomButton>
      }
    </Box>
  )
}

export default AdvanceViewButtonSection
