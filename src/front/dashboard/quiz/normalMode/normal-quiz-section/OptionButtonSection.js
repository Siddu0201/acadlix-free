import { Box } from "@mui/material";
import React from "react";
import CustomButton from "../normal-quiz-component/CustomButton";
import { arrayRandomize } from "../../../../../helpers/util";

const OptionButtonSection = (props) => {
  const handleClearResponse = () => {
    switch (props?.question?.answer_type) {
      case "singleChoice":
        props?.setValue(
          `questions.${props?.index}.language`,
          props?.watch(`questions.${props?.index}.language`)?.map((lang) => {
            lang.answer_data[props?.question?.answer_type] = lang.answer_data[
              props?.question?.answer_type
            ]?.map((answer, index) => {
              answer.isChecked = false;
              return answer;
            });
            return lang;
          }),
          { shouldDirty: true }
        );
        break;
      case "multipleChoice":
        props?.setValue(
          `questions.${props?.index}.language`,
          props?.watch(`questions.${props?.index}.language`)?.map((lang) => {
            lang.answer_data[props?.question?.answer_type] = lang.answer_data[
              props?.question?.answer_type
            ]?.map((answer, index) => {
              answer.isChecked = false;
              return answer;
            });
            return lang;
          }),
          { shouldDirty: true }
        );
        break;
      case "trueFalse":
        props?.setValue(
          `questions.${props?.index}.language`,
          props?.watch(`questions.${props?.index}.language`)?.map((lang) => {
            lang.answer_data[props?.question?.answer_type] = lang.answer_data[
              props?.question?.answer_type
            ]?.map((answer, index) => {
              answer.isChecked = false;
              return answer;
            });
            return lang;
          }),
          { shouldDirty: true }
        );
        break;
      case "sortingChoice":
        props?.setValue(
          `questions.${props?.index}.language`,
          props?.watch(`questions.${props?.index}.language`)?.map((lang) => {
            lang.answer_data[props?.question?.answer_type] = arrayRandomize(
              lang.answer_data[props?.question?.answer_type]
            );
            return lang;
          }),
          { shouldDirty: true }
        );
        break;
      case "matrixSortingChoice":
        break;
      case "fillInTheBlank":
        props?.setValue(
          `questions.${props?.index}.language`,
          props?.watch(`questions.${props?.index}.language`)?.map((lang) => {
            lang.answer_data[props?.question?.answer_type].correctOption =
              lang.answer_data[props?.question?.answer_type].correctOption.map(
                (correct) => {
                  correct.yourAnswer = "";
                  return correct;
                }
              );
            return lang;
          }),
          { shouldDirty: true }
        );
        break;
      case "numerical":
        props?.setValue(
          `questions.${props?.index}.language`,
          props?.watch(`questions.${props?.index}.language`)?.map((lang) => {
            lang.answer_data[props?.question?.answer_type].yourAnswer = "";
            return lang;
          }),
          { shouldDirty: true }
        );
        break;
      case "rangeType":
        props?.setValue(
          `questions.${props?.index}.language`,
          props?.watch(`questions.${props?.index}.language`)?.map((lang) => {
            lang.answer_data[props?.question?.answer_type].yourAnswer = "";
            return lang;
          }),
          { shouldDirty: true }
        );
        break;
      default:
    }
    props?.setValue(
      `questions.${props?.index}.result`,
      {
        ...props?.watch(`questions.${props?.index}.result`),
        correct_count: 0,
        incorrect_count: 0,
        solved_count: 0,
        answer_data: "",
      },
      { shouldDirty: true }
    );
  };

  const handleNextClick = () => {
    if (props?.last) {
      props?.setValue("finish", true, { shouldDirty: true });
    }
    props?.setValue(
      "questions",
      props.watch("questions")?.map((question, index) => {
        if (question.selected) {
          question.result.time =
            question.result.time +
            Math.round((Date.now() - props?.watch("last")) / 1000);
        }
        if (index === props?.num) {
          question.selected = true;
        } else {
          question.selected = false;
        }
        return question;
      }),
      { shouldDirty: true }
    );
    props?.setValue("last", Date.now(), { shouldDirty: true });
  };

  const handleBackClick = () => {
    props?.setValue(
      "questions",
      props.watch("questions")?.map((question, index) => {
        if (question.selected) {
          question.result.time =
            question.result.time +
            Math.round((Date.now() - props?.watch("last")) / 1000);
        }
        if (index === props?.index - 1) {
          question.selected = true;
        } else {
          question.selected = false;
        }
        return question;
      }),
      { shouldDirty: true }
    );
    props?.setValue("last", Date.now(), { shouldDirty: true });
  };

  const handleHintClick = () => {
    props?.setValue(
      `questions.${props?.index}.hint`,
      !props?.watch(`questions.${props?.index}.hint`),
      { shouldDirty: true }
    );
    props?.setValue(
      `questions.${props?.index}.result`,
      {
        ...props?.watch(`questions.${props?.index}.result`),
        hint_count: 1,
      },
      { shouldDirty: true }
    );
  };

  const handleCheckClick = () => {
    props?.setValue(
      `questions.${props?.index}.check`,
      !props?.watch(`questions.${props?.index}.check`),
      { shouldDirty: true }
    );
  };

  return (
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
        {props?.watch("enable_back_button") && (
          <CustomButton
            onClick={handleBackClick}
            sx={{
              display: props?.first ? "none" : "",
            }}
          >
            Back
          </CustomButton>
        )}
        {props?.watch("show_clear_response_button") && (
          <CustomButton onClick={handleClearResponse}>
            Clear Response
          </CustomButton>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          columnGap: 1,
        }}
      >
        <CustomButton onClick={handleHintClick}>Hint</CustomButton>
        {props?.watch("enable_check_button") &&
          !props?.watch(`questions.${props?.index}.check`) && (
            <CustomButton onClick={handleCheckClick}>Check</CustomButton>
          )}
        <CustomButton onClick={handleNextClick}>Next</CustomButton>
      </Box>
    </Box>
  );
};

export default OptionButtonSection;
