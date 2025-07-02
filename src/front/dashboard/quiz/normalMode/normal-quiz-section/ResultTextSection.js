import { Box, Typography } from "@mui/material";
import React from "react";

import CustomLatex from "@acadlix/modules/latex/CustomLatex";

const ResultTextSection = (props) => {
  const getGradeText = (result_array = [], percent = 0) => {
    const sortedGrades = result_array.sort((a, b) => b.percent - a.percent);

    for (let i = 0; i < sortedGrades.length; i++) {
      if (percent >= sortedGrades[i].percent) {
        return (<CustomLatex>{sortedGrades[i].text}</CustomLatex>);
      }
    }
    return;
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
            getGradeText(props?.watch("result_text"), props?.getResult())
            :
            <CustomLatex>
              {props?.watch("result_text")}
            </CustomLatex>
        }
      </Typography>
    </Box>
  );
};

export default ResultTextSection;
