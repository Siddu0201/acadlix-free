import { Box } from '@mui/material'
import React from 'react'
import CustomButton from '../normal-quiz-component/CustomButton'

const FinishSection = (props) => {
  const handleFinishQuiz = () => {
    props?.countdownApi && props?.countdownApi?.stop();
    props?.watch("progress", 0, {shouldDirty: true});
    props?.setValue('view_question', false, {shouldDirty: true});
    props?.setValue('finish', false, {shouldDirty: true});
    props?.setValue('result', true, {shouldDirty: true});
  }  
  return (
    <Box sx={{
        display: props?.watch('finish') ? '' : "none",
        marginY: 2,
    }}>
      <CustomButton
        onClick={handleFinishQuiz}
      >Finish Quiz</CustomButton>
    </Box>
  )
}

export default FinishSection
