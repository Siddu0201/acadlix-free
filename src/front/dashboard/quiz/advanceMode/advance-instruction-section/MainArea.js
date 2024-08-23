import React from "react";
import Box from "@mui/material/Box";
import InstructionLanguage from "./InstructionLanguage";

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
        {props?.instruction}
      </Box>
    </Box>
  );
};

export default MainArea;
