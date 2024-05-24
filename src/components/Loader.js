import { Box, CircularProgress } from "@mui/material";
import React from "react";

const Loader = (props) => {
  return (
    <Box
      {...props}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
      }}
    >
      <CircularProgress size={50} />
    </Box>
  );
};

export default Loader;
