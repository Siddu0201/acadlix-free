import { Box, Button, Typography, useTheme } from "@mui/material";
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
import TypeFreeChoice from "../../questionTypes/TypeFreeChoice";
import TypeAssessment from "../../questionTypes/TypeAssessment";
import CustomButton from "@acadlix/components/CustomButton";
// import QuestionStatusSection from "./QuestionStatusSection";
import LanguageSection from "./LanguageSection";
import { __ } from "@wordpress/i18n";

import IncorrectMsgSection from "../normal-quiz-components/IncorrectMsgSection";
import CorrectMsgSection from "../normal-quiz-components/CorrectMsgSection";
import ParagraphText from "../normal-quiz-components/ParagraphText";
import QuestionText from "../normal-quiz-components/QuestionText";

const QuestionStatusSection = React.lazy(() =>
  import(
    /* webpackChunkName: "admin_quiz_front_dashboard_quiz_result_section_question_status_section" */
    "./QuestionStatusSection")
);

const ViewAnswerSection = (props) => {
  const theme = useTheme();

  const getQuestionColor = (d) => {
    const solved = d?.result?.solved_count;
    const correct = d?.result?.correct_count;
    const incorrect = d?.result?.incorrect_count;
    const isEvaluated = d?.result?.is_evaluated;
    const answerType = d?.answer_type;
    // Skipped
    if (!solved) {
      return theme.palette.grey[300];
    }

    // Assessment questions
    if (answerType === 'assessment') {
      if (!isEvaluated) {
        return theme.palette.warning.main;
      }

      return theme.palette.info.main;
    }

    // Non-assessment questions
    if (correct) {
      return theme.palette.success.main;
    }

    if (incorrect) {
      return theme.palette.error.main;
    }

    return theme.palette.grey[300];
  };


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
                backgroundColor: getQuestionColor(d),
                color: props?.colorCode?.overview_button_active_text,
                ":hover, :focus": {
                  backgroundColor: getQuestionColor(d),
                  color: props?.colorCode?.overview_button_active_text,
                  border: `1px solid ${d?.selected
                    ? props?.colorCode?.overview_button_active_border
                    : props?.colorCode?.overview_button_border
                    }`,
                },
              }}
              onClick={handleClick.bind(this, index)}
              className="acadlix-normal-quiz-question-overview-answersheet-button acadlix-btn"
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
          <Typography
            className="acadlix-normal-quiz-question-overview-label-text"
            component="span"
          >
            {__("Correct", "acadlix")}
          </Typography>
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
          <Typography
            className="acadlix-normal-quiz-question-overview-label-text"
            component="span"
          >
            {__("Incorrect", "acadlix")}
          </Typography>
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
          <Typography
            className="acadlix-normal-quiz-question-overview-label-text"
            component="span"
          >
            {__("Skipped", "acadlix")}
          </Typography>
          {
            props?.hasEvaluatedQuestions && (
              <>
                <Box
                  sx={{
                    marginTop: "5px",
                    backgroundColor: (theme) => theme?.palette?.warning?.main,
                    height: "15px",
                    width: "15px",
                    marginX: "5px",
                    display: "inline-block",
                  }}
                ></Box>
                <Typography
                  className="acadlix-normal-quiz-question-overview-label-text"
                  component="span"
                >
                  {__("Pending", "acadlix")}
                </Typography>
                <Box
                  sx={{
                    marginTop: "5px",
                    backgroundColor: (theme) => theme?.palette?.info?.main,
                    height: "15px",
                    width: "15px",
                    marginX: "5px",
                    display: "inline-block",
                  }}
                ></Box>
                <Typography
                  className="acadlix-normal-quiz-question-overview-label-text"
                  component="span"
                >
                  {__("Evaluated", "acadlix")}
                </Typography>
              </>
            )
          }
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
  const answerType = (data = {}, lang_index = 0) => {
    switch (props?.question?.answer_type) {
      case "singleChoice":
        return (
          <TypeSingleChoice
            type="singleChoice"
            lang_index={lang_index}
            index={props?.index}
            isDisabled={true}
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
            isDisabled={true}
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
            isDisabled={true}
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
            isDisabled={true}
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
            isDisabled={true}
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
            isDisabled={true}
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
            isDisabled={true}
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
            isDisabled={true}
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
            isDisabled={true}
            {...props}
            {...data}
          />
        );
      case "assessment":
        return (
          <TypeAssessment
            type="assessment"
            lang_index={lang_index}
            index={props?.index}
            isDisabled={true}
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
            isDisabled={true}
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
      className="acadlix-normal-quiz-question-list-item"
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
                    <ParagraphText lang={lang} />
                  )}
                <QuestionText lang={lang} />
                <Box className="acadlix-normal-quiz-question-answer-container">
                  {answerType(lang, lang_index)}
                </Box>
              </Box>
            </React.Fragment>
          ))}

        <React.Suspense fallback={null}>
          <QuestionStatusSection {...props} />
        </React.Suspense>
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
                  <CorrectMsgSection
                    lang={lang}
                    question={props?.question}
                  />
                ) : (
                  <IncorrectMsgSection
                    lang={lang}
                    question={props?.question}
                  />
                )
              ) : (
                <IncorrectMsgSection
                  lang={lang}
                  question={props?.question}
                />
              )}
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default ViewAnswerSection;
