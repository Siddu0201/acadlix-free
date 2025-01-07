import { AppBar, Box, Button, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import {
  arrayRandomize,
  shuffleArrayBasedOnOrder,
} from "../../../../../helpers/util";
import LastQuestionModel from "./model/LastQuestionModel";

const QuizButtonOptions = (props) => {
  const them = useTheme();
  const isMobile = useMediaQuery(them.breakpoints.down("md"));
  const currentIndex = props
    ?.watch("questions")
    ?.findIndex((q) => q?.question_id === props?.question?.question_id);

  const handleReviewAndNext = () => {
    props?.setValue(`questions.${currentIndex}.review`, true, {
      shouldDirty: true,
    });
    handleNextClick();
  };

  const handleClearResponse = () => {
    switch (props?.question?.answer_type) {
      case "singleChoice":
        props?.setValue(
          `questions.${currentIndex}.language`,
          props?.watch(`questions.${currentIndex}.language`)?.map((lang) => {
            lang.answer_data[props?.question?.answer_type] = lang.answer_data[
              props?.question?.answer_type
            ]?.map((answer, index) => {
              answer.isChecked = false;
              return answer;
            });
            return lang;
          })
        );
        break;
      case "multipleChoice":
        props?.setValue(
          `questions.${currentIndex}.language`,
          props?.watch(`questions.${currentIndex}.language`)?.map((lang) => {
            lang.answer_data[props?.question?.answer_type] = lang.answer_data[
              props?.question?.answer_type
            ]?.map((answer, index) => {
              answer.isChecked = false;
              return answer;
            });
            return lang;
          })
        );
        break;
      case "trueFalse":
        props?.setValue(
          `questions.${currentIndex}.language`,
          props?.watch(`questions.${currentIndex}.language`)?.map((lang) => {
            lang.answer_data[props?.question?.answer_type] = lang.answer_data[
              props?.question?.answer_type
            ]?.map((answer, index) => {
              answer.isChecked = false;
              return answer;
            });
            return lang;
          })
        );
        break;
      case "sortingChoice":
        const length = props?.watch(
          `questions.${currentIndex}.language.0.answer_data.sortingChoice`
        )?.length;
        const initialIndexArray = Array.from({ length }, (_, index) => index);
        const newIndex = arrayRandomize(initialIndexArray);
        props?.setValue(
          `questions.${currentIndex}.language`,
          props?.watch(`questions.${currentIndex}.language`)?.map((lang) => {
            lang.answer_data[props?.question?.answer_type] =
              shuffleArrayBasedOnOrder(
                lang?.answer_data?.[props?.question?.answer_type],
                newIndex
              );
            return lang;
          })
        );
        break;
      case "matrixSortingChoice":
        break;
      case "fillInTheBlank":
        props?.setValue(
          `questions.${currentIndex}.language`,
          props?.watch(`questions.${currentIndex}.language`)?.map((lang) => {
            lang.answer_data[props?.question?.answer_type].correctOption =
              lang.answer_data[props?.question?.answer_type].correctOption.map(
                (correct) => {
                  correct.yourAnswer = "";
                  return correct;
                }
              );
            return lang;
          })
        );
        break;
      case "numerical":
        props?.setValue(
          `questions.${currentIndex}.language`,
          props?.watch(`questions.${currentIndex}.language`)?.map((lang) => {
            lang.answer_data[props?.question?.answer_type].yourAnswer = "";
            return lang;
          })
        );
        break;
      case "rangeType":
        props?.setValue(
          `questions.${currentIndex}.language`,
          props?.watch(`questions.${currentIndex}.language`)?.map((lang) => {
            lang.answer_data[props?.question?.answer_type].yourAnswer = "";
            return lang;
          })
        );
        break;
      default:
    }
    props?.setValue(
      `questions.${currentIndex}.result`,
      {
        ...props?.watch(`questions.${currentIndex}.result`),
        correct_count: 0,
        incorrect_count: 0,
        solved_count: 0,
        answer_data: "",
      },
      { shouldDirty: true }
    );
    props?.setValue(`questions.${currentIndex}.review`, false, {
      shouldDirty: true,
    });
  };

  const [lastModel, setLastModel] = React.useState(false);

  const handleNextClick = () => {
    if (props?.last) {
      if (props?.watch("quiz_timing_type") === "subject_wise_time") {
        setLastModel(true);
      } else {
        if (props?.last_subject) {
          setLastModel(true);
        } else {
          props?.setValue(
            "subjects",
            props?.watch("subjects")?.map((s, s_index) => {
              if (s_index === props?.s_index + 1) {
                s.selected = true;
              } else {
                s.selected = false;
              }
              return s;
            })
          );
          let i = 0;
          const subject_id = props
            ?.watch("subjects")
            ?.filter((s, i) => i === props?.s_index + 1)?.[0]?.subject_id;
          props?.setValue(
            "questions",
            props?.watch("questions")?.map((q) => {
              if (q.selected) {
                q.result.time =
                  q.result.time +
                  Math.round((Date.now() - props?.watch("last")) / 1000);
              }
              if (q?.subject_id === subject_id) {
                if (i === 0) {
                  q.selected = true;
                  q.visit = true;
                  i++;
                } else {
                  q.selected = false;
                }
              } else {
                q.selected = false;
              }
              return q;
            })
          );
          props?.setValue("last", Date.now(), { shouldDirty: true });
        }
      }
    } else {
      props?.setValue(
        "questions",
        props.watch("questions")?.map((question, index) => {
          if (question.selected) {
            question.result.time =
              question.result.time +
              Math.round((Date.now() - props?.watch("last")) / 1000);
          }
          if (index === currentIndex + 1) {
            question.selected = true;
            question.visit = true;
          } else {
            question.selected = false;
          }
          return question;
        })
      );
      props?.setValue("last", Date.now(), { shouldDirty: true });
    }
  };

  const handleBackClick = () => {
    if (props?.first) {
      props?.setValue(
        "subjects",
        props?.watch("subjects")?.map((s, s_index) => {
          if (s_index === props?.s_index - 1) {
            s.selected = true;
          } else {
            s.selected = false;
          }
          return s;
        })
      );
    }
    props?.setValue(
      "questions",
      props.watch("questions")?.map((question, index) => {
        if (question.selected) {
          question.result.time =
            question.result.time +
            Math.round((Date.now() - props?.watch("last")) / 1000);
        }
        if (index === currentIndex - 1) {
          question.selected = true;
        } else {
          question.selected = false;
        }
        return question;
      })
    );
    props?.setValue("last", Date.now(), { shouldDirty: true });
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        flex: 0,
        // top: "auto",
        bottom: 0,
        left: 0,
        right: "auto",
        backgroundColor: props?.colorCode?.button_option_background,
        // width: props?.isOpen ? `calc(100% - ${props?.sidebarWidth}px)` : "100%",
        width: "100%",
        border: `1px solid ${props?.colorCode?.button_option_border}`,
        // margin: "1px",
      }}
      id={`acadlix_quiz_button_options_${props?.question?.question_id}`}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: "100% !important",
          paddingY: 1,
          paddingX: {
            xs: "0.20rem !important",
            md: "0.10rem !important",
          },
        }}
      >
        {props?.watch("quiz_timing_type") === "subject_wise_time"
          ? props?.last && (
            <LastQuestionModel
              {...props}
              lastModel={lastModel}
              setLastModel={setLastModel}
              message="You have reached to the last question of this section. Please wait
            till the time allotted for this section is over or submit the
            section."
            />
          )
          : props?.last_subject && (
            <LastQuestionModel
              {...props}
              lastModel={lastModel}
              setLastModel={setLastModel}
              message="You have reached to the last question. Please wait
            till the time allotted for this section is over or submit test."
            />
          )}
        <Box>
          {
            props?.watch("show_review_button") &&
            <Button
              size={props?.isDesktop ? "medium" : "small"}
              variant="contained"
              color="primary"
              onClick={handleReviewAndNext}
              sx={{
                margin: `4px!important`,
                borderRadius: 0,
                fontSize: 13,
                fontWeight: 400,
                paddingX: {
                  xs: "6px",
                  md: "18px",
                },
                boxShadow: "none",
                border: `1px solid ${props?.colorCode?.mark_for_review_and_next_border}`,
                backgroundColor:
                  props?.colorCode?.mark_for_review_and_next_background,
                color: `${props?.colorCode?.mark_for_review_and_next_color} !important`,
                ":hover": {
                  border: `1px solid ${props?.colorCode?.mark_for_review_and_next_hover_border}`,
                  backgroundColor:
                    props?.colorCode?.mark_for_review_and_next_hover_background,
                  color: `${props?.colorCode?.mark_for_review_and_next_hover_color} !important`,
                  boxShadow: "none",
                },
              }}
            >
              {
                isMobile ?
                  'Review & Next' :
                  'Mark for Review & Next'
              }
            </Button>
          }
          <Button
            size={props?.isDesktop ? "medium" : "small"}
            variant="contained"
            color="primary"
            onClick={handleClearResponse}
            sx={{
              margin: `4px!important`,
              borderRadius: 0,
              fontSize: 13,
              fontWeight: 400,
              paddingX: {
                xs: "6px",
                md: "18px",
              },
              boxShadow: "none",
              border: `1px solid ${props?.colorCode?.clear_response_border}`,
              backgroundColor: props?.colorCode?.clear_response_background,
              color: `${props?.colorCode?.clear_response_color} !important`,
              ":hover": {
                border: `1px solid ${props?.colorCode?.clear_response_hover_border}`,
                backgroundColor:
                  props?.colorCode?.clear_response_hover_background,
                color: `${props?.colorCode?.clear_response_hover_color} !important`,
                boxShadow: "none",
              },
              ":focus": {
                boxShadow: "none",
                border: `1px solid ${props?.colorCode?.clear_response_border}`,
                backgroundColor: props?.colorCode?.clear_response_background,
                color: `${props?.colorCode?.clear_response_color} !important`,
              }
            }}
          >
            {
              isMobile ?
                'Clear' :
                'Clear Response'
            }
          </Button>
        </Box>
        <Box>
          <Button
            size={props?.isDesktop ? "medium" : "small"}
            variant="contained"
            color="primary"
            onClick={handleBackClick}
            disabled={props?.watch("quiz_timing_type") === "subject_wise_time" ? props?.first : props?.first && props?.first_subject}
            sx={{
              margin: `4px!important`,
              borderRadius: 0,
              fontSize: 13,
              fontWeight: 400,
              paddingX: {
                xs: "6px",
                md: "18px",
              },
              boxShadow: "none",
              border: `1px solid ${props?.colorCode?.previous_response_border}`,
              backgroundColor: props?.colorCode?.previous_response_background,
              color: `${props?.colorCode?.previous_response_color} !important`,
              ":hover, :focus": {
                border: `1px solid ${props?.colorCode?.previous_response_hover_border}`,
                backgroundColor:
                  props?.colorCode?.previous_response_hover_background,
                color: `${props?.colorCode?.previous_response_hover_color} !important`,
                boxShadow: "none",
              },
            }}
          >
            Previous
          </Button>
          <Button
            size={props?.isDesktop ? "medium" : "small"}
            variant="contained"
            color="primary"
            onClick={handleNextClick}
            sx={{
              margin: `4px!important`,
              borderRadius: 0,
              fontSize: 13,
              fontWeight: 400,
              paddingX: {
                xs: "6px",
                md: "18px",
              },
              boxShadow: "none",
              border: `1px solid ${props?.colorCode?.save_and_next_border}`,
              backgroundColor: props?.colorCode?.save_and_next_background,
              color: `${props?.colorCode?.save_and_next_color} !important`,
              ":hover, :focus": {
                border: `1px solid ${props?.colorCode?.save_and_next_hover_border}`,
                backgroundColor: props?.colorCode?.save_and_next_background,
                color: `${props?.colorCode?.save_and_next_color} !important`,
                boxShadow: "none",
              },
            }}
          >
            Save & Next
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default QuizButtonOptions;
