import { Box, Typography } from '@mui/material'
import React from 'react'
import CustomTextField from '../../../../components/CustomTextField'

const TypeNumerical = (props) => {
  const handleChange = (e) => {
    props?.setValue(`questions.${props?.index}.language`,
      props?.watch(`questions.${props?.index}.language`)?.map((lang) => {
        lang.answer_data[props?.type].yourAnswer = e.target.value;
        return lang;
      }),
        {shouldDirty: true}
    );

    let data = props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}`);
    props?.setValue(
      `questions.${props?.index}.result`,
      {
        ...props?.watch(`questions.${props?.index}.result`),
        correct_count: data?.yourAnswer === data?.option ? 1 : 0,
        incorrect_count: data?.yourAnswer === data?.option ? 0 : 1,
        solved_count: data?.yourAnswer ? 1 :  0,
        answer_data: data?.yourAnswer ? data : "",
      }
      ,
      {shouldDirty: true}
    );
  }
  
  return (
    <Box sx={{
      display: props?.selected ? "block" : "none"
    }}>
      <Typography>
        {props?.question}
        <br />
      </Typography>

      <CustomTextField
        type='number'
        label="Type your answer"
        size="small"
        inputProps={{
          step: 0.01
        }}
        sx={{
          marginY: 2,
        }}
        onChange={handleChange}
        value={props?.answer_data?.[props?.type]?.yourAnswer}
      />
    </Box>
  )
}

export default TypeNumerical
