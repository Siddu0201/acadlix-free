import { Box, Typography } from "@mui/material";
import React from "react";

const SubjectResultSection = () => {
  return (
    <Box>
      <Box>
        <Typography
          variant="h5"
          style={{ color: "#6451cd", fontWeight: "bold" }}
        >
          Not Categorized
        </Typography>
      </Box>
      <Typography
        component="strong"
        style={{ fontWeight: "bold", fontSize: "1rem" }}
      >
        You have attempted: 1
      </Typography>
      <br />
      <Typography
        component="strong"
        style={{ fontWeight: "bold", fontSize: "1rem" }}
      >
        Number of Correct Questions: 1 and scored{" "}
        <span style={{ color: "#64B335", fontWeight: "bold" }}>1.00</span>
      </Typography>
      <br />
      <Typography
        component="strong"
        style={{ fontWeight: "bold", fontSize: "1rem" }}
      >
        Number of Incorrect Questions:{" "}
        <span style={{ color: "red", fontWeight: "bold" }}>1</span> and Negative
        marks <span style={{ color: "red", fontWeight: "bold" }}>0.00 </span>
      </Typography>
    </Box>
  );
};

export default SubjectResultSection;
