import { Box } from "@mui/material";
import React from "react";
import CustomButton from "@acadlix/components/CustomButton";
import { arrayRandomize, shuffleArrayBasedOnOrder } from "@acadlix/helpers/util";
import { __ } from "@wordpress/i18n";

const OptionButtonSection = (props) => {
  const currentIndex = props?.index;
  const handleClearResponse = () => {
    let sortingOrder = null;
    switch (props?.question?.answer_type) {
      case "singleChoice":
      case "multipleChoice":
      case "multipleChoice":
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
        sortingOrder = newIndex;
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
        let shuffle_order = arrayRandomize(props?.watch(
          `questions.${currentIndex}.language`
        )?.find((lang) => lang?.default)
          ?.answer_data[props?.question?.answer_type]
          ?.map((d) => String(d?.correctPosition)) ?? []
        );
        props?.setValue(
          `questions.${currentIndex}.shuffle_order`,
          shuffle_order
        );
        props?.setValue(
          `questions.${currentIndex}.language`,
          props?.watch(`questions.${currentIndex}.language`)?.map((lang) => {
            lang.answer_data[props?.question?.answer_type] = lang.answer_data[props?.question?.answer_type]?.map(
              (d) => ({ ...d, yourPosition: null })
            );
            return lang;
          })
        )
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
        answer_data: sortingOrder ?? null,
        attempted_at: null,
      },
      { shouldDirty: true }
    );
    props?.setValue(`questions.${currentIndex}.review`, false, {
      shouldDirty: true,
    });
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
      })
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
      })
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
        {props?.watch("mode") === "normal" &&
          props?.watch("enable_back_button") && (
            <CustomButton
              onClick={handleBackClick}
              sx={{
                display: props?.first ? "none" : "",
              }}
            >
              {__("Back", "acadlix")}
            </CustomButton>
          )}
        {props?.watch("mode") === "check_and_continue" &&
          props?.watch("skip_question") && (
            <CustomButton
              onClick={handleNextClick}
              sx={{
                display: props?.question?.check ? "none" : "",
              }}
            >
              {__("Skip", "acadlix")}
            </CustomButton>
          )}
        {props?.watch("show_clear_response_button") && (
          <CustomButton
            onClick={handleClearResponse}
            sx={{
              display: props?.question?.check ? "none" : "",
            }}
          >
            {__("Clear Response", "acadlix")}
          </CustomButton>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          columnGap: 1,
        }}
      >
        {props?.watch(`questions.${props?.index}.hint_enabled`) &&
          props
            ?.watch(`questions.${props?.index}.language`)
            .filter((d) => d?.selected)?.[0]?.hint_msg?.length > 0 && (
            <CustomButton onClick={handleHintClick}>{__("Hint", "acadlix")}</CustomButton>
          )}

        {/* check for normal mode */}
        {["normal", "question_below_each_other"]?.includes(props?.watch("mode")) &&
          props?.watch("enable_check_button") &&
          !props?.question?.check && (
            <CustomButton onClick={handleCheckClick}>{__("Check", "acadlix")}</CustomButton>
          )}

        {/* check for check and continue mode  */}
        {props?.watch("mode") === "check_and_continue" &&
          !props?.question?.check && (
            <CustomButton
              onClick={handleCheckClick}
              sx={{
                display:
                  props?.watch("enable_check_on_option_selected") &&
                    !props?.question?.result?.solved_count
                    ? "none"
                    : "",
              }}
            >
              {__("Check", "acadlix")}
            </CustomButton>
          )}

        {["normal", "check_and_continue"]?.includes(props?.watch("mode")) && (
          <CustomButton
            onClick={handleNextClick}
            sx={{
              display:
                props?.watch("mode") === "check_and_continue" &&
                  !props?.question?.check
                  ? "none"
                  : "",
            }}
          >
            {props?.last ? __("Quiz Summary", "acadlix") : __("Next", "acadlix")}
          </CustomButton>
        )}

        {["question_below_each_other"]?.includes(props?.watch("mode")) &&
          props?.last && (
            <CustomButton
              onClick={handleNextClick}
            >
              {__("Quiz Summary", "acadlix")}
            </CustomButton>
          )}
      </Box>
    </Box>
  );
};

export default OptionButtonSection;
