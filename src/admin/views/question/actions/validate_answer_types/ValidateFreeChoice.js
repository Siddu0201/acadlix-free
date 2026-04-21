import React from 'react'
import CustomLatex from '@acadlix/modules/latex/CustomLatex'
import { Box, Typography } from '@mui/material'

const ValidateFreeChoice = ({
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
          {answer_data?.correctOption?.join('<br/>')}
        </CustomLatex>
      </Typography>
    </Box>
  )
}

export default ValidateFreeChoice