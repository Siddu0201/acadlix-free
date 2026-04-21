import CustomLatex from '@acadlix/modules/latex/CustomLatex'
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material'
import React from 'react'

const ValidateTrueFalse = ({
  answer_data
}) => {
  return (
    <FormControl
      sx={{
        width: '100%',
        py: 1,
      }}
    >
      <RadioGroup
        name="true-false-validation-group"

      >
        {answer_data?.map((data, index) => (
          <Box key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1,
              border: data?.isCorrect
                ? (theme) => `1px solid ${theme.palette.success.main}`
                : 'none',
              backgroundColor: data?.isCorrect
                ? (theme) => theme.palette.success.light
                : 'transparent',
              borderRadius: 1,
              paddingX: 2,
            }}
          >
            <FormControlLabel
              key={index}
              checked={data?.isCorrect}
              value={index}
              control={
                <Radio
                  disabled
                />}
              label={
                <Box>
                  <Typography component="div">
                    <CustomLatex>
                      {data?.option}
                    </CustomLatex>
                  </Typography>
                </Box>
              }
            />
          </Box>
        ))}
      </RadioGroup>
    </FormControl>
  )
}

export default ValidateTrueFalse