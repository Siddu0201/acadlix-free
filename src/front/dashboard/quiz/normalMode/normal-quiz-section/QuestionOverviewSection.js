import { Box, Button, Typography } from "@mui/material";
import React from "react";
import CustomButton from "../normal-quiz-component/CustomButton";

const QuestionOverviewSection = (props) => {
  let arr = [
    ...Array(100)
      .keys()
      .map((i) => ++i),
  ];

  return (
    <Box
      sx={{
        border: `1px solid ${props?.colorCode?.overview_border}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          overflowY: "scroll",
          maxHeight: "105px",
          padding: {
            xs: "3px 0px",
            sm: "5px 5px",
          },
          borderBottom: `1px solid ${props?.colorCode?.overview_border}`,
          backgroundColor: props?.colorCode?.overview_background,
        }}
      >
        {arr.map((ar, index) => (
          <Button
            key={index}
            variant="outlined"
            sx={{
              minWidth: {
                xs: "31px",
                sm: "32px",
              },
              padding: "3px 3px",
              margin: "3px",
              border: `1px solid ${props?.colorCode?.overview_button_border}`,
              backgroundColor: props?.colorCode?.overview_button_background,
              color: props?.colorCode?.overview_button_text,
              ":hover": {
                backgroundColor: props?.colorCode?.overview_button_background,
                border: `1px solid ${props?.colorCode?.overview_button_border}`,
              },
            }}
          >
            {ar}
          </Button>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          padding: {
            xs: "3px 3px",
            sm: "5px 8px",
          },
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: {
            xs: "3px 3px",
            sm: "5px 8px",
          },
        }}
      >
        <CustomButton>Review Question</CustomButton>
        <CustomButton>Quiz Summary</CustomButton>
      </Box>
    </Box>
  );
};

export default QuestionOverviewSection;
