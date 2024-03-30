import { Box } from "@mui/material";
import React from "react";
import CustomButton from "./CustomButton";

const ViewButtonSection = () => {
  return (
    <Box sx={{
      display: "flex",
      marginTop: 4,
    }}>
      <CustomButton btname="Restart Test" />
      <CustomButton btname="View Answers" />
    </Box>
  );
};

export default ViewButtonSection;
