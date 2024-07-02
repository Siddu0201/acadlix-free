import { Box, Button, Typography } from "@mui/material";
import React from "react";
import CustomButton from "../normal-quiz-component/CustomButton";
import { useTheme } from "@emotion/react";
import { ElevenMp } from "@mui/icons-material";

const QuestionOverviewSection = (props) => {
  const theme = useTheme();

  const handleClick = (id, event) => {
    event?.preventDefault();
    props?.setValue("finish", false, { shouldDirty: true });
    props?.setValue(
      "questions",
      props.watch("questions")?.map((question, index) => {
        switch (props?.watch("mode")) {
          case "normal":
            case "check_and_continue":
            if (question.selected) {
              question.result.time =
                question.result.time +
                Math.round((Date.now() - props?.watch("last")) / 1000);
            }
            if (index === id) {
              question.selected = true;
            } else {
              question.selected = false;
            }
            break;
          case "question_below_each_other":
            if (props?.watch("question_per_page") > 0) {
              let perPage = props?.watch("question_per_page");
              let question_number = id + 1;
              let page = Math.ceil(question_number / perPage);
              if (index >= (page - 1) * perPage && index < page * perPage) {
                question.selected = true;
              } else {
                question.selected = false;
              }
            }
            break;
          default:
        }
        return question;
      }),
      { shouldDirty: true }
    );
    props?.setValue("last", Date.now(), { shouldDirty: true });
    if (props?.watch("mode") === "question_below_each_other") {
      props?.scrollToQuestion(id);
    }
  };

  const handleQuizOverView = () => {
    props?.setValue(
      "questions",
      props.watch("questions")?.map((question, index) => {
        if (question.selected) {
          question.result.time =
            question.result.time +
            Math.round((Date.now() - props?.watch("last")) / 1000);
        }
        question.selected = false;
        return question;
      }),
      { shouldDirty: true }
    );
    props?.setValue("last", Date.now(), { shouldDirty: true });
    props?.setValue("finish", true, { shouldDirty: true });
  };

  const handleReview = () => {
    props?.setValue(
      "questions",
      props.watch("questions")?.map((question, index) => {
        if (question.selected) {
          question.review = !question?.review;
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
        {props?.watch("questions")?.map((d, index) => (
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
              border: `1px solid ${
                d?.selected &&
                props?.watch("mode") !== "question_below_each_other"
                  ? props?.colorCode?.overview_button_active_border
                  : props?.colorCode?.overview_button_border
              }`,
              boxShadow:
                d?.selected &&
                props?.watch("mode") !== "question_below_each_other"
                  ? theme.shadows[3]
                  : "none",
              backgroundColor:
                d?.review && d?.result?.solved_count
                  ? props?.colorCode?.answered_and_review
                  : d?.review
                  ? props?.colorCode?.review
                  : d?.result?.solved_count
                  ? props?.colorCode?.answered
                  : props?.colorCode?.overview_button_background,
              color:
                d?.review || d?.result?.solved_count
                  ? props?.colorCode?.overview_button_active_text
                  : props?.colorCode?.overview_button_text,
              ":hover": {
                backgroundColor:
                  d?.review && d?.result?.solved_count
                    ? props?.colorCode?.answered_and_review
                    : d?.review
                    ? props?.colorCode?.review
                    : d?.result?.solved_count
                    ? props?.colorCode?.answered
                    : props?.colorCode?.overview_button_background,
                color:
                  d?.review || d?.result?.solved_count
                    ? props?.colorCode?.overview_button_active_text
                    : props?.colorCode?.overview_button_text,
                border: `1px solid ${
                  d?.selected
                    ? props?.colorCode?.overview_button_active_border
                    : props?.colorCode?.overview_button_border
                }`,
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
            backgroundColor: props?.colorCode?.answered,
            marginRight: "5px",
            display: "inline-block",
          }}
        ></Box>
        <Typography>Answered</Typography>
        <Box
          sx={{
            marginTop: "5px",
            backgroundColor: props?.colorCode?.review,
            height: "15px",
            width: "15px",
            marginX: "5px",
            display: "inline-block",
          }}
        ></Box>
        <Typography>Review</Typography>
        <Box
          sx={{
            marginTop: "5px",
            backgroundColor: props?.colorCode?.answered_and_review,
            height: "15px",
            width: "15px",
            marginX: "5px",
            display: "inline-block",
          }}
        ></Box>
        <Typography>Review and answered</Typography>
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
        <CustomButton
          onClick={handleReview}
          sx={{
            display: props?.watch("finish") ? "none" : "",
          }}
        >
          Review Question
        </CustomButton>
        <CustomButton
          onClick={handleQuizOverView}
          sx={{
            display: props?.watch("finish") ? "none" : "",
          }}
        >
          Quiz Summary
        </CustomButton>
      </Box>
    </Box>
  );
};

export default QuestionOverviewSection;
