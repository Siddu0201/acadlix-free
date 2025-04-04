import { Box, Typography } from "@mui/material";
import React from "react";
import Latex from "react-latex-next";

const AdvanceResultText = (props) => {
  const findResultIndex = (result_array = [], percent = 0) => {
    let index = -1;
    let diff = 999999;

    for (let i = 0; i < result_array?.length; i++) {
      let v = Number(result_array?.[i]?.percent);

      if (percent >= v && percent - v < diff) {
        diff = percent - v;
        index = i;
      }
    }

    return index;
  };

  return (
    <Box
      sx={{
        marginY: 1,
      }}
    >
      <Typography component="div">
        {props?.watch("percent_based_result_text")
          ?
          <Latex>
            {props?.watch("result_text")?.[
              findResultIndex(props?.watch("result_text"), props?.percent)
            ]?.text}
          </Latex>
          :
          <Latex>
            {props?.watch("result_text")}
          </Latex>
        }
      </Typography>
    </Box>
  );
};

export default AdvanceResultText;
