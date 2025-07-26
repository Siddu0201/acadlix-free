import { Box } from "@mui/material";
import React from "react";

import HintSection from "../normal-quiz-components/HintSection";
import CorrectMsgSection from "../normal-quiz-components/CorrectMsgSection";
import IncorrectMsgSection from "../normal-quiz-components/IncorrectMsgSection";

const HintAndMessageSection = (props) => {
  return (
    <Box sx={{
      display: props?.lang?.selected ? "" : "none",
    }}>
      <HintSection
        lang={props?.lang}
        question={props?.question}
      />
      {props?.question?.check ? (
        props?.question?.result?.correct_count ? (
          <CorrectMsgSection
            lang={props?.lang}
            question={props?.question}
          />
        ) : (
          <IncorrectMsgSection
            lang={props?.lang}
            question={props?.question}
          />
        )
      ) : (
        <></>
      )}
    </Box>
  );
};

export default HintAndMessageSection;
