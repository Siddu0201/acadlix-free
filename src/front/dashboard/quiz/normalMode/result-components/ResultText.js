import { Box, Typography } from "@mui/material";
import React from 'react'
import CustomLatex from "@acadlix/modules/latex/CustomLatex";

const PercentBasedText = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import("@acadlix/pro/front/dashboard/quiz/result-components/PercentBasedText") :
    Promise.resolve({ default: () => null })
)

const ResultText = (props) => {
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
            <React.Suspense fallback={null}>
              <PercentBasedText
                result_text={props?.watch("result_text")}
                result={props?.getResult()}
              />
            </React.Suspense>
            :
            <CustomLatex>
              {props?.watch("result_text")}
            </CustomLatex>
        }
      </Typography>
    </Box>
  )
}

export default ResultText