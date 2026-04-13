import React from 'react'
import { Box, Typography } from '@mui/material'

const ValidateAssessment = ({
  answer_data
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        py: 1,
      }}
    >
      <Typography component="span">
        {answer_data?.referenceAnswer}
      </Typography>
    </Box>
  )
}

export default ValidateAssessment