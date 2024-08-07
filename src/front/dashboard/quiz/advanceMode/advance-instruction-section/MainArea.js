import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

const MainArea = (props) => {
  return (
    <Box
      sx={{
        padding: 4,
        overflowY: "scroll",
        maxHeight: `calc(100% - ${props?.remainingHeight}px)`,
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          paddingY: 2,
        }}
      >
        <Typography>Please read the instructions carefully</Typography>
      </Box>

      <Box>
        <Typography>
          {props?.instruction}
        </Typography>
      </Box>
    </Box>
  );
};

export default MainArea;
