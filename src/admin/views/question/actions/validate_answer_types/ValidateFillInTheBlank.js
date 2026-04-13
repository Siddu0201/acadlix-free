import CustomLatex from '@acadlix/modules/latex/CustomLatex'
import { Box, Typography } from '@mui/material'
import React from 'react'

const ValidateFillInTheBlank = ({
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
        <CustomLatex>
          {answer_data?.option}
        </CustomLatex>
      </Typography>
    </Box>
  )
}

export default ValidateFillInTheBlank