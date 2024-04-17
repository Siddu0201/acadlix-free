import { Box, Typography } from "@mui/material";
import React from "react";

const ResultSection = (props) => {
  return (
    <Box sx={{
      marginY: 1
    }}>
      <Typography
        sx={{
          color: "#fa7419",
          fontWeight: "500",
          fontSize: 24,
        }}
      >
        Your have Completed "
        <Typography
          component="span"
          sx={{
            color: "#64B335",
            fontWeight: "500",
            fontSize: 24,
          }}
        >
          Geography
        </Typography>
        "
      </Typography>
      <Typography>1 of 1 questions answered correctly</Typography>
      <Typography>Your time: 20</Typography>
      <Typography>
        <b>Your Final Score is : 1.00</b>
      </Typography>
      <Typography>
        <b>You have attempted : 1</b>
      </Typography>
      <Typography
        sx={{
          fontWeight: "bold",
        }}
      >
        Number of Correct Questions :{" "}
        <Typography
          component="span"
          sx={{
            color: props?.colorCode?.correct_number,
            fontWeight: "bold",
          }}
        >
          1
        </Typography>{" "}
        {" "}and scored{" "}
        <Typography
          component="span"
          sx={{
            color: props?.colorCode?.correct_number,
            fontWeight: "bold",
          }}
        >
          1
        </Typography>
      </Typography>
      <Typography
        sx={{
          fontWeight: "bold",
        }}
      >
        Number of Incorrect Questions :{" "}
        <Typography
          component="span"
          sx={{
            color: props?.colorCode?.incorrect_number,
            fontWeight: "bold",
          }}
        >
          0
        </Typography>
         {" "}and Negative marks{" "}
        <Typography
          component="span"
          sx={{
            color: props?.colorCode?.incorrect_number,
            fontWeight: "bold",
          }}
        >
          0.00{" "}
        </Typography>
      </Typography>
    </Box>
  );
};

export default ResultSection;
