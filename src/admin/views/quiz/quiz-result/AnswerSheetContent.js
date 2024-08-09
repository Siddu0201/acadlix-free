import React from "react";
import { useForm } from "react-hook-form";
import parse from "html-react-parser";
import { Box, Button, Typography, useTheme } from "@mui/material";
import TypeSingleChoice from "../../../../front/dashboard/quiz/questionTypes/TypeSingleChoice";
import TypeMultipleChoice from "../../../../front/dashboard/quiz/questionTypes/TypeMultipleChoice";
import TypeTrueFalse from "../../../../front/dashboard/quiz/questionTypes/TypeTrueFalse";
import TypeSortingChoice from "../../../../front/dashboard/quiz/questionTypes/TypeSortingChoice";
import TypeMatrixSortingChoice from "../../../../front/dashboard/quiz/questionTypes/TypeMatrixSortingChoice";
import TypeFill from "../../../../front/dashboard/quiz/questionTypes/TypeFill";
import TypeNumerical from "../../../../front/dashboard/quiz/questionTypes/TypeNumerical";
import TypeRange from "../../../../front/dashboard/quiz/questionTypes/TypeRange";
import QuestionSubjectAndPointSection from "../../../../front/dashboard/quiz/normalMode/normal-quiz-section/QuestionSubjectAndPointSection";
import QuestionStatusSection from "../../../../front/dashboard/quiz/normalMode/normal-quiz-section/QuestionStatusSection";

const AnswerSheetContent = (props) => {
  const theme = useTheme();
  const methods = useForm({
    defaultValues: {
      show_marks: true,
      show_per_question_time: true,
      display_subject: true,
      view_answer: true,
      questions: props?.statistic?.map((stat) => {
        return {
          selected: true,
          check : true,
          question_id: stat?.question_id,
          subject_name:
            stat?.question?.subject?.subject_name ?? "Uncategorized",
          online: stat?.question?.online,
          sort: stat?.question?.sort,
          title: stat?.question?.title,
          points: stat?.question?.points,
          negative_points: stat?.question?.negative_points,
          different_points_for_each_answer: Boolean(
            Number(stat?.question?.different_points_for_each_answer)
          ),
          different_incorrect_msg: Boolean(
            Number(stat?.question?.different_incorrect_msg)
          ),
          hint_enabled: Boolean(Number(stat?.question?.hint_enabled)),
          answer_type: stat?.question?.answer_type,
          result: {
            correct_count: stat?.correct_count,
            incorrect_count: stat?.incorrect_count,
            solved_count: stat?.solved_count,
            hint_count: stat?.hint_count,
            time: stat?.question_time,
            answer_data: stat?.answer_data,
          },
          language:
            stat?.question?.question_languages?.map((lang) => {
              return {
                language_id: lang?.language_id,
                language_name: lang?.language?.language_name,
                default: Boolean(Number(lang?.default)),
                selected: Boolean(Number(lang?.default)),
                question: parse(lang?.question),
                correct_msg: parse(lang?.correct_msg),
                incorrect_msg: parse(lang?.incorrect_msg),
                hint_msg: parse(lang?.hint_msg),
                answer_data: {
                  singleChoice:
                    stat?.question?.answer_type === "singleChoice" && JSON.parse(stat?.answer_data)
                      ? JSON.parse(stat?.answer_data)
                      : JSON.parse(lang?.answer_data)?.singleChoice,
                  multipleChoice:
                    stat?.question?.answer_type === "multipleChoice" && JSON.parse(stat?.answer_data)
                      ? JSON.parse(stat?.answer_data)
                      : JSON.parse(lang?.answer_data)?.multipleChoice,
                  trueFalse:
                    stat?.question?.answer_type === "trueFalse" && JSON.parse(stat?.answer_data)
                      ? JSON.parse(stat?.answer_data)
                      : JSON.parse(lang?.answer_data)?.trueFalse,
                  sortingChoice:
                    stat?.question?.answer_type === "sortingChoice" && JSON.parse(stat?.answer_data)
                      ? JSON.parse(stat?.answer_data)
                      : JSON.parse(lang?.answer_data)?.sortingChoice,
                  matrixSortingChoice:
                    stat?.question?.answer_type === "matrixSortingChoice" && JSON.parse(stat?.answer_data)
                      ? JSON.parse(stat?.answer_data)
                      : JSON.parse(lang?.answer_data)?.matrixSortingChoice,
                  fillInTheBlank:
                    stat?.question?.answer_type === "fillInTheBlank" && JSON.parse(stat?.answer_data)
                      ? JSON.parse(stat?.answer_data)
                      : JSON.parse(lang?.answer_data)?.fillInTheBlank,
                  numerical:
                    stat?.question?.answer_type === "numerical" && JSON.parse(stat?.answer_data)
                      ? JSON.parse(stat?.answer_data)
                      : JSON.parse(lang?.answer_data)?.numerical,
                  rangeType:
                    stat?.question?.answer_type === "rangeType" && JSON.parse(stat?.answer_data)
                      ? JSON.parse(stat?.answer_data)
                      : JSON.parse(lang?.answer_data)?.rangeType,
                },
              };
            }) ?? [],
        };
      }),
    },
  });

  let questionRef = React.useRef([]);

  const handleClick = (id) => {
    const elm = document.getElementById(`acadlix_question_${id}`);
    if(elm){
      elm?.scrollIntoView({behavior: "smooth"});
    }
  };

  return (
    <Box>
      {/* Question OverView */}
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
          {methods?.watch("questions")?.map((d, index) => (
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
              backgroundColor: (theme) => theme?.palette?.success?.main,
              marginRight: "5px",
              display: "inline-block",
            }}
          ></Box>
          <Typography>Correct</Typography>
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
          <Typography>Incorrect</Typography>
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
          <Typography>Skippeds</Typography>
        </Box>
      </Box>

      {methods?.watch("questions")?.length > 0 &&
        methods?.watch("questions")
          ?.map((question, index) => (
            <ViewQuestionSection
              {...props}
              {...methods}
              key={index}
              index={index}
              num={index + 1}
              question={question}
              first={index === 0}
              questionRef={questionRef}
              last={methods?.watch("questions")?.length - 1 === index}
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

  return (
    <Box
      sx={{
        display: props?.question?.selected ? "" : "none",
        marginBottom: 5,
      }}
      id={`acadlix_question_${props?.index}`}
      ref={(elem) => (props.questionRef.current[props.index] = elem)}
    >
      <Box>
        <QuestionSubjectAndPointSection {...props} />

        {props?.question?.language?.length > 0 &&
          props?.question?.language?.map((lang, lang_index) => (
            <React.Fragment key={lang_index}>
              <Box
                sx={{
                  display: props?.question?.selected ? "block" : "none",
                }}
              >
                <Typography component="div">{lang?.question}</Typography>
                {answerType(lang, lang_index)}
              </Box>
            </React.Fragment>
          ))}
        <QuestionStatusSection {...props} />
        {props?.question?.language?.length > 0 &&
          props?.question?.language?.map((lang, index) => (
            <Box key={index}>
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
                        <b>Explanation</b>
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
                        <b>Explanation</b>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography component="div">
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
                    border: (theme) => `1px solid ${theme?.palette?.grey[300]}`,
                    padding: 2,
                    marginY: 2,
                    borderRadius: 1,
                    backgroundColor: "transparent",
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
                      <b>Explanation</b>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography component="div">
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

export default AnswerSheetContent;
