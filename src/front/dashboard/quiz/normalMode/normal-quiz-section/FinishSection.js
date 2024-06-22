import { Alert, Box } from '@mui/material'
import React from 'react'
import CustomButton from '../normal-quiz-component/CustomButton'

const FinishSection = (props) => {
  const handleFinishQuiz = () => {
    props?.countdownApi && props?.countdownApi?.stop();
    props?.setValue('view_question', false, {shouldDirty: true});
    props?.setValue('finish', false, {shouldDirty: true});
    props?.setValue('view_result', true, {shouldDirty: true});
    props?.saveResult();
  }  

  const solved_count = props?.watch('questions').filter(d => d?.result?.solved_count)?.length;
  const total = props?.watch("questions").length;

  return (
    <Box sx={{
        display: props?.watch('finish') ? '' : "none",
        marginY: 2,
    }}>
      {
        props?.watch("force_user_to_answer_each_question") && solved_count !== total &&
        <Alert severity='error' sx={{ marginY: 2}}>You can finish this quiz when you answer all questions</Alert>
      }
      <CustomButton
        disabled={props?.watch("force_user_to_answer_each_question") && solved_count !== total}
        onClick={handleFinishQuiz}
      >Finish Quiz</CustomButton>
    </Box>
  )
}

export default FinishSection
