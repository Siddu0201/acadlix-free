import React from "react";
import Box from "@mui/material/Box";
import InstructionLanguage from "./InstructionLanguage";

import CustomLatex from "../../../../../modules/latex/CustomLatex";

const MainArea = (props) => {
  return (
    <Box
      sx={{
        backgroundColor: props?.colorCode?.background,
        display: props?.language?.selected ? "" : "none",
        padding: 4,
        overflowY: "auto",
        height: `calc(100% - ${props?.remainingHeight}px)`,
      }}
    >
      <Box>
        <InstructionLanguage {...props} />
      </Box>
      <Box>
        <CustomLatex>
          {props?.instruction}
        </CustomLatex>
      </Box>
    </Box>
  );
};

export default MainArea;
