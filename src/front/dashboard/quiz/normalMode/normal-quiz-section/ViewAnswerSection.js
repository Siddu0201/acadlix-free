import { useTheme } from "@emotion/react";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import QuestionSubjectAndPointSection from "./QuestionSubjectAndPointSection";
import TypeSingleChoice from "../../questionTypes/TypeSingleChoice";
import TypeMultipleChoice from "../../questionTypes/TypeMultipleChoice";
import TypeTrueFalse from "../../questionTypes/TypeTrueFalse";
import TypeSortingChoice from "../../questionTypes/TypeSortingChoice";
import TypeMatrixSortingChoice from "../../questionTypes/TypeMatrixSortingChoice";
import TypeFill from "../../questionTypes/TypeFill";
import TypeNumerical from "../../questionTypes/TypeNumerical";
import TypeRange from "../../questionTypes/TypeRange";
import CustomButton from "../normal-quiz-component/CustomButton";

const ViewAnswerSection = (props) => {
  const theme = useTheme();

  const handleClick = (id) => {
    props?.setValue(
      "questions",
      props.watch("questions")?.map((question, index) => {
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
  
  return (
    <Box>
      {/* Question OverView */}
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
                  d?.selected
                    ? props?.colorCode?.overview_button_active_border
                    : props?.colorCode?.overview_button_border
                }`,
                boxShadow: d?.selected ? theme.shadows[3] : "none",
                backgroundColor:
                  d?.result?.correct_count && d?.result?.solved_count
                    ? props?.colorCode?.correct
                    : d?.result?.incorrect_count && d?.result?.solved_count
                    ? props?.colorCode?.incorrect
                    : props?.colorCode?.skipped,
                color: props?.colorCode?.overview_button_active_text,
                ":hover": {
                  backgroundColor:
                    d?.result?.correct_count && d?.result?.solved_count
                      ? props?.colorCode?.correct
                      : d?.result?.incorrect_count && d?.result?.solved_count
                      ? props?.colorCode?.incorrect
                      : props?.colorCode?.skipped,
                  color: props?.colorCode?.overview_button_active_text,
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
              backgroundColor: props?.colorCode?.correct,
              marginRight: "5px",
              display: "inline-block",
            }}
          ></Box>
          <Typography>Correct</Typography>
          <Box
            sx={{
              marginTop: "5px",
              backgroundColor: props?.colorCode?.incorrect,
              height: "15px",
              width: "15px",
              marginX: "5px",
              display: "inline-block",
            }}
          ></Box>
          <Typography>Incorrect</Typography>
          <Box
            sx={{
              marginTop: "5px",
              backgroundColor: props?.colorCode?.skipped,
              height: "15px",
              width: "15px",
              marginX: "5px",
              display: "inline-block",
            }}
          ></Box>
          <Typography>Skippeds</Typography>
        </Box>
      </Box>

      {props?.watch("questions")?.length > 0 &&
        props
          ?.watch("questions")
          ?.map((question, index) => (
            <ViewQuestionSection
              {...props}
              key={index}
              index={index}
              num={index + 1}
              question={question}
              first={index === 0}
              last={props?.watch("questions")?.length - 1 === index}
            />
          ))}
    </Box>
  );
};

const ViewQuestionSection = (props) => {
  const theme = useTheme();
  const answerType = (data = {}, lang_index = 0) => {
    switch (props?.question?.answer_type) {
      case "singleChoice":
        return (
          <TypeSingleChoice
            type="singleChoice"
            lang_index={lang_index}
            index={props?.index}
            {...props}
            {...data}
          />
        );
      case "multipleChoice":
        return (
          <TypeMultipleChoice
            type="multipleChoice"
            lang_index={lang_index}
            index={props?.index}
            {...props}
            {...data}
          />
        );
      case "trueFalse":
        return (
          <TypeTrueFalse
            type="trueFalse"
            lang_index={lang_index}
            index={props?.index}
            {...props}
            {...data}
          />
        );
      case "sortingChoice":
        return (
          <TypeSortingChoice
            type="sortingChoice"
            lang_index={lang_index}
            index={props?.index}
            {...props}
            {...data}
          />
        );
      case "matrixSortingChoice":
        return (
          <TypeMatrixSortingChoice
            type="matrixSortingChoice"
            lang_index={lang_index}
            index={props?.index}
            {...props}
            {...data}
          />
        );
      case "fillInTheBlank":
        return (
          <TypeFill
            type="fillInTheBlank"
            lang_index={lang_index}
            index={props?.index}
            {...props}
            {...data}
          />
        );
      case "numerical":
        return (
          <TypeNumerical
            type="numerical"
            lang_index={lang_index}
            index={props?.index}
            {...props}
            {...data}
          />
        );
      case "rangeType":
        return (
          <TypeRange
            type="rangeType"
            lang_index={lang_index}
            index={props?.index}
            {...props}
            {...data}
          />
        );
      default:
        return (
          <TypeSingleChoice
            type="singleChoice"
            lang_index={lang_index}
            index={props?.index}
            {...props}
            {...data}
          />
        );
    }
  };

  const handleNextClick = () => {
    props?.setValue(
      "questions",
      props.watch("questions")?.map((question, index) => {
        if (index === props?.num) {
          question.selected = true;
        } else {
          question.selected = false;
        }
        return question;
      }),
      { shouldDirty: true }
    );
  };

  const handleBackClick = () => {
    props?.setValue(
      "questions",
      props.watch("questions")?.map((question, index) => {
        if (index === props?.index - 1) {
          question.selected = true;
        } else {
          question.selected = false;
        }
        return question;
      }),
      { shouldDirty: true }
    );
  };

  return (
    <Box
      sx={{
        display: props?.question?.selected ? "" : "none",
      }}
    >
      <Box>
        <QuestionSubjectAndPointSection {...props} />

        {props?.question?.language?.length > 0 &&
          props?.question?.language?.map((lang, lang_index) => (
            <React.Fragment key={lang_index}>
              {answerType(lang, lang_index)}
            </React.Fragment>
          ))}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginY: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              columnGap: 1,
            }}
          >
            <CustomButton
              onClick={handleBackClick}
              sx={{
                display: props?.first ? "none" : "",
              }}
            >
              Back
            </CustomButton>
          </Box>
          <Box
            sx={{
              display: props?.last ? "none" : "flex",
              columnGap: 1,
            }}
          >
            <CustomButton onClick={handleNextClick}>Next</CustomButton>
          </Box>
        </Box>
        {props?.question?.language?.length > 0 &&
          props?.question?.language?.map((lang, index) => (
            <Box>
              {props?.question?.result?.solved_count ? (
                props?.question?.result?.correct_count ? (
                  <Box
                    sx={{
                      border: `1px solid ${props?.colorCode?.hint_border}`,
                      padding: 2,
                      marginY: 2,
                      backgroundColor: props?.colorCode?.hint_background,
                      boxShadow: theme?.shadows[1],
                      display: lang?.correct_msg?.length > 0 ? "" : "none",
                    }}
                  >
                    <Box>
                      <Typography>
                        <b>Correct</b>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography>{lang?.correct_msg}</Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      border: `1px solid ${props?.colorCode?.hint_border}`,
                      padding: 2,
                      marginY: 2,
                      backgroundColor: props?.colorCode?.hint_background,
                      boxShadow: theme?.shadows[1],
                      display: lang?.different_points_for_each_answer
                        ? lang?.incorrect_msg?.length > 0
                          ? ""
                          : "none"
                        : lang?.correct_msg?.length > 0
                        ? ""
                        : "none",
                    }}
                  >
                    <Box>
                      <Typography>
                        <b>Incorrect</b>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography>
                        {lang?.different_points_for_each_answer
                          ? lang?.incorrect_msg
                          : lang?.correct_msg}
                      </Typography>
                    </Box>
                  </Box>
                )
              ) : (
                <Box
                  sx={{
                    border: `1px solid ${props?.colorCode?.hint_border}`,
                    padding: 2,
                    marginY: 2,
                    backgroundColor: props?.colorCode?.hint_background,
                    boxShadow: theme?.shadows[1],
                    display: lang?.different_points_for_each_answer
                      ? lang?.incorrect_msg?.length > 0
                        ? ""
                        : "none"
                      : lang?.correct_msg?.length > 0
                      ? ""
                      : "none",
                  }}
                >
                  <Box>
                    <Typography>
                      <b>Skipped</b>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography>
                      {lang?.different_points_for_each_answer
                        ? lang?.incorrect_msg
                        : lang?.correct_msg}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default ViewAnswerSection;
