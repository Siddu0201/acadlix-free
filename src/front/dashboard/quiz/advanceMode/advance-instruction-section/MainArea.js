import React from "react";
import Box from "@mui/material/Box";

const MainArea = (props) => {
  return (
    <Box
      sx={{
        display: props?.language?.selected ? "" : "none",
        padding: 4,
        overflowY: "auto",
        height: `calc(100% - ${props?.remainingHeight}px)`,
      }}
    >
      {props?.instruction}
    </Box>
  );
};

export default MainArea;
