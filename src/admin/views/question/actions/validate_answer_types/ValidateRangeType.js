import React from 'react'
import { Box, Typography } from '@mui/material'

const ValidateRangeType = ({
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
          {answer_data?.from}  to  {answer_data?.to}
      </Typography>
    </Box>
  )
}

export default ValidateRangeType