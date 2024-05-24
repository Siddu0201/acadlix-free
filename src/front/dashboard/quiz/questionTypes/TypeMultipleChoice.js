import { Box, Checkbox, FormControl, FormControlLabel, Typography } from "@mui/material";
import React from "react";

const TypeMultipleChoice = (props) => {
  const handleChange = (e) => {
    props?.setValue(`questions.${props?.index}.language`,
      props?.watch(`questions.${props?.index}.language`)?.map((lang) => {
        lang.answer_data[props?.type] = lang.answer_data[props?.type]?.map((answer , index) => {
          if(index == e.target.value && e.target.checked !== undefined){
            answer.isChecked = !answer.isChecked;
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
        {props?.answer_data?.[props?.type]?.length > 0 &&
          props?.answer_data?.[props?.type]?.map((data, index) => (
            <FormControlLabel
              key={index}
              checked={data?.isChecked}
              control={<Checkbox />}
              label={data?.option}
              onChange={handleChange}
              value={index}
            />
          ))}
      </FormControl>
    </Box>
  );
};

export default TypeMultipleChoice;
