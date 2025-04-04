import { Box, Typography } from "@mui/material";
import React from "react";
import Latex from "react-latex-next";

const ResultTextSection = (props) => {
  const getGradeText = (result_array = [], percent = 0) => {
    const sortedGrades = result_array.sort((a, b) => b.percent - a.percent);

    for (let i = 0; i < sortedGrades.length; i++) {
      if (percent >= sortedGrades[i].percent) {
        return (<Latex>{sortedGrades[i].text}</Latex>);
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
            getGradeText(props?.watch("result_text"), props?.percent)
            :
            <Latex>
              {props?.watch("result_text")}
            </Latex>
        }
      </Typography>
    </Box>
  );
};

export default ResultTextSection;
