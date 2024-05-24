import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material'
import React from 'react'

const TypeTrueFalse = (props) => {
  const handleChange = (e) => {
    props?.setValue(`questions.${props?.index}.language`,
      props?.watch(`questions.${props?.index}.language`)?.map((lang) => {
        lang.answer_data[props?.type] = lang.answer_data[props?.type]?.map((answer , index) => {
          if(index == e.target.value){
            answer.isChecked = true;
          }else{
            answer.isChecked = false;
          }
          return answer;
        })
        return lang;
      }),
        {shouldDirty: true}
    );

    let data = props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}`);
    props?.setValue(
      `questions.${props?.index}.result`,
      {
        ...props?.watch(`questions.${props?.index}.result`),
        correct_count: data?.filter(d => d.isChecked === d.isCorrect).length === data.length ? 1 : 0,
        incorrect_count: data?.filter(d => d.isChecked === d.isCorrect).length === data.length ? 0 : 1,
        solved_count: data?.filter(d => d.isChecked).length > 0 ? 1 : 0,
        answer_data: data?.filter(d => d.isChecked).length > 0 ? data : "",
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

      <FormControl>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          onChange={handleChange}
        >
          {
            props?.answer_data?.[props?.type]?.length > 0 &&
            props?.answer_data?.[props?.type]?.map((data, index) => (
              <FormControlLabel
                key={index}
                checked={data?.isChecked}
                control={
                  <Radio
                  />
                }
                value={index}
                label={data?.option}
              />
            ))
          }
        </RadioGroup>
      </FormControl>
    </Box>
  )
}

export default TypeTrueFalse
