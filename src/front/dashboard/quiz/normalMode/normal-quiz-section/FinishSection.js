import { Box } from '@mui/material'
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
