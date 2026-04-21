import React from 'react'
import { Box, Typography } from '@mui/material'

const ValidateNumerical = ({
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
          {answer_data?.option}
      </Typography>
    </Box>
  )
}

export default ValidateNumerical