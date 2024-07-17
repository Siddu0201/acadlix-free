import { Box, Typography } from "@mui/material";
import React from "react";

const ResultTextSection = (props) => {
  const findResultIndex = (result_array = [], percent = 0) => {
    let index = -1;
    let diff = 999999;

    for(let i = 0; i < result_array?.length; i++){
      let v = Number(result_array?.[i]?.percent);

      if ((percent >= v) && ((percent - v) < diff)) {
          diff = percent - v;
          index = i;
      }
    }

    return index;
  }

  return (
    <Box
      sx={{
        marginY: 1,
      }}
    >
      <Typography component="div">
        {
          props?.watch("percent_based_result_text")
          ?
          props?.watch("result_text")?.[findResultIndex(props?.watch("result_text"), props?.percent)]?.text
          :
          props?.watch("result_text")
        }
        </Typography>
    </Box>
  );
};

export default ResultTextSection;
