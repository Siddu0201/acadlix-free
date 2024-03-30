import { Box, Typography } from "@mui/material";
import React from "react";

const ResultSection = () => {
  return (
    <Box>
      <Typography variant="h5" style={{ color: "#fa7419", fontWeight: "500" }}>
        <span style={{ color: "#fa7419" }}>Your results are here!! for </span>
        <span style={{ color: "#64B335" }}>Geography</span>
      </Typography>
      <Typography
        style={{ fontSize: "1rem", marginBottom: "10px", marginTop: "10px" }}
      >
        <span style={{ fontWeight: "bold" }}>
          1 of 1 questions answered correctly
        </span>
        <br />
        Your time: 20
      </Typography>
      <Typography
        component="strong"
        style={{ fontWeight: "bold", fontSize: "1rem" }}
      >
        Your Final Score is : 1.00
      </Typography>
      <br />
      <Typography
        component="strong"
        style={{ fontWeight: "bold", fontSize: "1rem" }}
      >
        You have attempted : 1
      </Typography>
      <br />
      <Typography
        component="strong"
        style={{ fontWeight: "bold", fontSize: "1rem" }}
      >
        Number of Correct Questions :{" "}
        <span style={{ color: "#64B335", fontWeight: "bold" }}>1</span> and
        scored <span style={{ color: "#64B335", fontWeight: "bold" }}>1</span>
      </Typography>
      <br />
      <Typography
        component="strong"
        style={{ fontWeight: "bold", fontSize: "1rem" }}
      >
        Number of Incorrect Questions :{" "}
        <span style={{ color: "red", fontWeight: "bold" }}>0</span> and Negative
        marks <span style={{ color: "red", fontWeight: "bold" }}>0.00 </span>
      </Typography>
    </Box>
  );
};

export default ResultSection;
