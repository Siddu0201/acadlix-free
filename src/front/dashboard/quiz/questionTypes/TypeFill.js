import { Box, Typography } from "@mui/material";
import React from "react";
import CustomTextField from "../../../../components/CustomTextField";

const TypeFill = (props) => {
  let rxp = /{([^}]+)}/g;
  let currmatch,
    found = [], i = 0;
  while ((currmatch = rxp.exec(props?.answer_data?.[props?.type]?.option))) {
    found.push(currmatch[1]);
  }

  const handleChange = (index, e) => {
    props?.setValue(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.correctOption.${index}.yourAnswer`,
      e.target.value.trim(),
      {shouldDirty: true}
    );

    let data = props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.correctOption`);
    props?.setValue(
      `questions.${props?.index}.result`,
      {
        ...props?.watch(`questions.${props?.index}.result`),
        correct_count: data?.filter((d) => d.option.includes(d.yourAnswer)).length === data.length ? 1 : 0,
        incorrect_count: data?.filter((d) => d.option.includes(d.yourAnswer)).length === data.length ? 0 : 1,
        solved_count: data?.filter((d) => d.yourAnswer).length ? 1 : 0,
        answer_data: data?.filter((d) => d.yourAnswer).length ? data : "",
      }
      ,
      {shouldDirty: true}
    );
  }

  return (
    <Box
      sx={{
        display: props?.selected ? "block" : "none",
      }}
    >
      <Typography>
        {props?.question}
        <br />
      </Typography>
      <Box sx={{
        marginY: 2,
      }}>
        {props?.answer_data?.[props?.type]?.option?.split(rxp)?.map((data) => {
          if (found?.includes(data)) {
            return (
              <CustomTextField
                variant="standard"
                size="small"
                sx={{
                  '.MuiInputBase-inputSizeSmall':{
                    padding: '0px 3px'
                  },
                }}
                value={props?.answer_data?.[props?.type]?.correctOption?.[i].yourAnswer}
                onChange={handleChange.bind(this, i++)}
              />
            );
          }
          return data;
        })}
      </Box>
    </Box>
  );
};

export default TypeFill;
