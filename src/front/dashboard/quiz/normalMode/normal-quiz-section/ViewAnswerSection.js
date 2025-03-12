import { Box, Button, Divider, Typography, useTheme } from "@mui/material";
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
import QuestionStatusSection from "./QuestionStatusSection";
import LanguageSection from "./LanguageSection";
import { __ } from "@wordpress/i18n";
import TypeFreeChoice from "../../questionTypes/TypeFreeChoice";

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
        id={`result_question_overview_${props?.watch("id")}`}
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
                border: `1px solid ${d?.selected
                  ? props?.colorCode?.overview_button_active_border
                  : props?.colorCode?.overview_button_border
                  }`,
                boxShadow: d?.selected ? theme.shadows[3] : "none",
                backgroundColor:
                  d?.result?.correct_count && d?.result?.solved_count
                    ? (theme) => theme?.palette?.success?.main
                    : d?.result?.incorrect_count && d?.result?.solved_count
                      ? (theme) => theme?.palette?.error?.main
                      : (theme) => theme?.palette?.grey[300],
                color: props?.colorCode?.overview_button_active_text,
                ":hover, :focus": {
                  backgroundColor:
                    d?.result?.correct_count && d?.result?.solved_count
                      ? (theme) => theme?.palette?.success?.main
                      : d?.result?.incorrect_count && d?.result?.solved_count
                        ? (theme) => theme?.palette?.error?.main
                        : (theme) => theme?.palette?.grey[300],
                  color: props?.colorCode?.overview_button_active_text,
                  border: `1px solid ${d?.selected
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
              backgroundColor: (theme) => theme?.palette?.success?.main,
              marginRight: "5px",
              display: "inline-block",
            }}
          ></Box>
          <Typography>{__("Correct", "acadlix")}</Typography>
          <Box
            sx={{
              marginTop: "5px",
              backgroundColor: (theme) => theme?.palette?.error?.main,
              height: "15px",
              width: "15px",
              marginX: "5px",
              display: "inline-block",
            }}
          ></Box>
          <Typography>{__("Incorrect", "acadlix")}</Typography>
          <Box
            sx={{
              marginTop: "5px",
              backgroundColor: (theme) => theme?.palette?.grey[300],
              height: "15px",
              width: "15px",
              marginX: "5px",
              display: "inline-block",
            }}
          ></Box>
          <Typography>{__("Skipped", "acadlix")}</Typography>
        </Box>
      </Box>

      {props?.watch("questions")?.length > 0 &&
        props
          ?.watch("questions")
          ?.map((question, index) => (
            <React.Fragment key={index}>
              {question?.selected && (
                <ViewQuestionSection
                  {...props}
                  key={index}
                  index={index}
                  num={index + 1}
                  question={question}
                  first={index === 0}
                  last={props?.watch("questions")?.length - 1 === index}
                />
              )}
            </React.Fragment>
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
      case "freeChoice":
        return (
          <TypeFreeChoice
            type="freeChoice"
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
      })
    );
    props?.scrollToQuestion(props?.num);
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
      })
    );
    props?.scrollToQuestion(props?.index - 1);
  };

  return (
    <Box
      sx={{
        // display: props?.question?.selected ? "" : "none",
      }}
      id={`acadlix_question_${props?.watch("id")}_${props?.index}`}
      ref={(elem) => (props.questionRef.current[props.index] = elem)}
    >
      <Box>
        {props?.watch("multi_language") && <LanguageSection {...props} />}
        <QuestionSubjectAndPointSection {...props} />

        {props?.question?.language?.length > 0 &&
          props?.question?.language?.map((lang, lang_index) => (
            <React.Fragment key={lang_index}>
              <Box
                sx={{
                  display: lang?.selected ? "block" : "none",
                }}
              >
                {props?.question?.paragraph_enabled &&
                  props?.question?.paragraph_id !== null && (
                    <Box>
                      <Typography component="div">{lang?.paragraph}</Typography>
                      <Divider />
                    </Box>
                  )}
                <Typography component="div">{lang?.question}</Typography>
                {answerType(lang, lang_index)}
              </Box>
            </React.Fragment>
          ))}
        <QuestionStatusSection {...props} />
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
              {__("Back", "acadlix")}
            </CustomButton>
          </Box>
          <Box
            sx={{
              display: props?.last ? "none" : "flex",
              columnGap: 1,
            }}
          >
            <CustomButton onClick={handleNextClick}>{__("Next", "acadlix")}</CustomButton>
          </Box>
        </Box>
        {props?.question?.language?.length > 0 &&
          props?.question?.language?.map((lang, index) => (
            <Box key={index} sx={{
              display: lang?.selected ? "" : "none"
            }}>
              {props?.question?.result?.solved_count ? (
                props?.question?.result?.correct_count ? (
                  <Box
                    sx={{
                      border: (theme) =>
                        `1px solid ${theme?.palette?.grey[300]}`,
                      padding: 2,
                      marginY: 2,
                      borderRadius: 1,
                      backgroundColor: "transparent",
                      boxShadow: theme?.shadows[1],
                      display: lang?.correct_msg?.length > 0 ? "" : "none",
                    }}
                  >
                    <Box>
                      <Typography>
                        <b>{__("Explanation", "acadlix")}</b>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography component="div">
                        {lang?.correct_msg}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      border: (theme) =>
                        `1px solid ${theme?.palette?.grey[300]}`,
                      padding: 2,
                      marginY: 2,
                      borderRadius: 1,
                      backgroundColor: "transparent",
                      boxShadow: theme?.shadows[1],
                      display: props?.question?.different_incorrect_msg
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
                        <b>{__("Explanation", "acadlix")}</b>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography component="div">
                        {props?.question?.different_incorrect_msg
                          ? lang?.incorrect_msg
                          : lang?.correct_msg}
                      </Typography>
                    </Box>
                  </Box>
                )
              ) : (
                <Box
                  sx={{
                    border: (theme) => `1px solid ${theme?.palette?.grey[300]}`,
                    padding: 2,
                    marginY: 2,
                    borderRadius: 1,
                    backgroundColor: "transparent",
                    boxShadow: theme?.shadows[1],
                    display: props?.question?.different_incorrect_msg
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
                      <b>{__("Explanation", "acadlix")}</b>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography component="div">
                      {props?.question?.different_incorrect_msg
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
