import React from "react";
import Box from "@mui/material/Box";
import InstructionLanguage from "./InstructionLanguage";
import Latex from "react-latex-next";

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
        <Latex>
          {props?.instruction}
        </Latex>
      </Box>
    </Box>
  );
};

export default MainArea;
