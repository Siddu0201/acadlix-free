import { Box, Button, Typography, useTheme } from "@mui/material";
import React from "react";
import CustomButton from "@acadlix/components/CustomButton";
import { __ } from "@wordpress/i18n";

const QuestionOverviewSection = (props) => {
  const theme = useTheme();

  const handleClick = (id, event) => {
    event?.preventDefault();
    let perPage = props?.watch("question_per_page");
    let question_number = id + 1;
    let page = Math.ceil(question_number / perPage);
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
            if (perPage > 0) {
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
      })
    );

    props?.setValue("last", Date.now(), { shouldDirty: true });
    if (props?.watch("mode") === "question_below_each_other") {
      props?.setValue("pagination_page", page, { shouldDirty: true });
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
      })
    );
    props?.setValue("last", Date.now(), { shouldDirty: true });
    props?.setValue("finish", true, { shouldDirty: true });
  };

  return (
    <Box
      sx={{
        border: `1px solid ${props?.colorCode?.overview_border}`,
        borderRadius: 1,
        boxShadow: (theme) => theme?.shadows[2],
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          overflowY: "scroll",
          maxHeight: "105px",
          padding: {
            xs: "3px",
            sm: "5px",
          },
          borderBottom: `1px solid ${props?.colorCode?.overview_border}`,
          boxShadow: (theme) => theme?.shadows[1],
          backgroundColor: "transparent",
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
              border: `1px solid ${d?.selected &&
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
              ":hover, :focus": {
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
                border: `1px solid ${d?.selected
                    ? props?.colorCode?.overview_button_active_border
                    : props?.colorCode?.overview_button_border
                  }`,
              },
            }}
            onClick={handleClick.bind(this, index)}
            className="acadlix-normal-quiz-question-overview-button"
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
        <Typography
          className="acadlix-normal-quiz-question-overview-label-text"
        >
          {__("Answered", "acadlix")}
        </Typography>
        {props?.watch("show_review_button") && (
          <>
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
            <Typography className="acadlix-normal-quiz-question-overview-label-text">
              {__("Review", "acadlix")}
            </Typography>
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
            <Typography
              className="acadlix-normal-quiz-question-overview-label-text"
            >
              {__("Review and answered", "acadlix")}
            </Typography>
          </>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          padding: {
            xs: "3px 3px",
            sm: "5px 8px",
          },
        }}
      >
        <CustomButton
          onClick={handleQuizOverView}
          sx={{
            display: props?.watch("finish") ? "none" : "",
          }}
          className="acadlix-normal-quiz-button-quiz-summary"
        >
          {__("Quiz Summary", "acadlix")}
        </CustomButton>
      </Box>
    </Box>
  );
};

export default QuestionOverviewSection;
