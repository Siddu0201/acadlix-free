import { Box, Typography } from "@mui/material";
import React from "react";

const SubjectResultSection = (props) => {
  return (
    <Box sx={{
      marginY: 1
    }}>
      <Typography
        sx={{
          color: props?.colorCode?.category_title,
          fontWeight: "bold",
          fontSize: 24,
        }}
      >
        Not Categorized
      </Typography>
      <Typography>
        <b>You have attempted: 1</b>
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
        and scored{" "}
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
        </Typography>{" "}
        and Negative marks{" "}
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

export default SubjectResultSection;
