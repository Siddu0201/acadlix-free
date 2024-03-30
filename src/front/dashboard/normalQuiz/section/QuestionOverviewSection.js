import { Box, Button, Typography } from "@mui/material";
import React from "react";

const QuestionOverviewSection = () => {
  let arr = [...Array(100).keys()];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          overflowY: "scroll",
          maxHeight: "105px",
          padding: {
            xs: "5px",
            sm: "10px",
          }
        }}
      >
        {arr.map((ar, index) => (
          <Button key={index} variant="outlined" sx={{
            minWidth: {
              xs: "31px",
              sm: "33px",
            },
            padding: "3px 3px",
            margin: "3px",
          }}>
            {ar}
          </Button>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          padding: {
            xs: "5px",
            sm: "10px",
          }
        }}
      >
        <Box
          sx={{
            marginTop: "5px",
            height: "15px",
            width: "15px",
            backgroundColor: "#64B335",
            marginRight: "5px",
            display: "inline-block",
          }}
        ></Box>
        <Typography>Answered</Typography>
        <Box
          sx={{
            marginTop: "5px",
            backgroundColor: "#FFB800",
            height: "15px",
            width: "15px",
            marginX: "5px", 
            display: "inline-block",
          }}
        ></Box>
        <Typography>Review</Typography>
      </Box>
    </Box>
  );
};

export default QuestionOverviewSection;
