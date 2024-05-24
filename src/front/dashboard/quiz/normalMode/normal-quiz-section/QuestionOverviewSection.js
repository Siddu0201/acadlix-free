import { Box, Button, Typography } from "@mui/material";
import React from "react";
import CustomButton from "../normal-quiz-component/CustomButton";

const QuestionOverviewSection = (props) => {
  const handleClick = (id) => {
    props?.setValue("finish", false, { shouldDirty: true });
    props?.setValue(
      "questions",
      props.watch("questions")?.map((question, index) => {
        if(question.selected){
          question.result.time = question.result.time + Math.round(((Date.now() - props?.watch("last"))/1000));
        }
        if (index === id) {
          question.selected = true;
        } else {
          question.selected = false;
        }
        return question;
      }),
      { shouldDirty: true }
    );
  };

  const handleQuizOverView = () => {
    props?.setValue(
      "questions",
      props.watch("questions")?.map((question, index) => {
        question.selected = false;
        return question;
      }),
      { shouldDirty: true }
    );
    props?.setValue("finish", true, { shouldDirty: true });
  };

  const handleReview = () => {
    props?.setValue(
      "questions",
      props.watch("questions")?.map((question, index) => {
        if (question.selected) {
          question.review = true;
        }
        return question;
      }),
      { shouldDirty: true }
    );
  };

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
        {props?.watch("questions")?.map((_, index) => (
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
            onClick={handleClick.bind(this, index)}
          >
            {++index}
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
        <CustomButton onClick={handleReview}>Review Question</CustomButton>
        <CustomButton onClick={handleQuizOverView}>Quiz Summary</CustomButton>
      </Box>
    </Box>
  );
};

export default QuestionOverviewSection;
