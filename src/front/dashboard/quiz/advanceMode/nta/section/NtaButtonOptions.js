import { Box, Button } from "@mui/material";
import React from "react";
import { arrayRandomize, shuffleArrayBasedOnOrder } from "../../../../../../helpers/util";
import { __ } from "@wordpress/i18n";

const NtaButtonOptions = (props) => {
  const currentIndex = props
    ?.watch("questions")
    ?.findIndex((q) => q?.question_id === props?.question?.question_id);

  const handleSaveAndNext = () => {
    if (props?.question?.result?.solved_count) {
      props?.handleNext();
    } else {
      alert(__("Please choose an option.", "acadlix"));
    }
  };

  const handleClearResponse = () => {
    let sortingOrder = null;
    switch (props?.question?.answer_type) {
      case "singleChoice":
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
      },
      { shouldDirty: true }
    );
    props?.setValue(`questions.${currentIndex}.review`, false, {
      shouldDirty: true,
    });
  };

  const handleSaveAndReview = () => {
    if (props?.question?.result?.solved_count) {
      props?.setValue(`questions.${currentIndex}.review`, true, {
        shouldDirty: true,
      });
    } else {
      alert(__("Please choose an option.", "acadlix"));
    }
  };

  const handleReviewAndNext = () => {
    props?.setValue(`questions.${currentIndex}.review`, true, {
      shouldDirty: true,
    });
    props?.handleNext();
  }

  return (
    <Box
      sx={{
        display: "flex",
        paddingX: 4,
        paddingY: 3 / 2,
        borderTop: `1px solid ${props?.colorCode?.border_top}`,
      }}
    >
      {/* Save and next button  */}
      <Button
        variant="contained"
        onClick={handleSaveAndNext}
        sx={{
          margin: `4px!important`,
          letterSpacing: "1.28px",
          borderRadius: 0,
          fontSize: 13,
          fontWeight: 700,
          paddingX: 3,
          paddingY: 3 / 2,
          boxShadow: "none",
          border: `1px solid ${props?.colorCode?.save_next_button_border}`,
          backgroundColor: props?.colorCode?.save_next_button_background,
          color: props?.colorCode?.save_next_button_color,
          ":hover, :focus": {
            border: `1px solid ${props?.colorCode?.save_next_button_hover_border}`,
            backgroundColor:
              props?.colorCode?.save_next_button_hover_background,
            color: props?.colorCode?.save_next_button_color,
            boxShadow: "none",
          },
        }}
      >
        {__("SAVE & NEXT", "acadlix")}
      </Button>
      {/* Clear Button  */}
      <Button
        variant="outlined"
        size="small"
        onClick={handleClearResponse}
        sx={{
          marginY: `4px!important`,
          borderRadius: 0,
          fontSize: 13,
          fontWeight: 700,
          paddingX: 3,
          paddingY: 3 / 2,
          boxShadow: "none",
          border: `1px solid ${props?.colorCode?.clear_back_border}`,
          backgroundColor: props?.colorCode?.clear_back_background,
          color: props?.colorCode?.clear_back_color,
          ":hover, :focus": {
            border: `1px solid ${props?.colorCode?.clear_back_hover_border}`,
            backgroundColor: props?.colorCode?.clear_back_hover_background,
            color: props?.colorCode?.clear_back_color,
            boxShadow: "none",
          },
        }}
      >
        {__("CLEAR", "acadlix")}
      </Button>
      {/* Save and mark for review button  */}
      <Button
        variant="contained"
        onClick={handleSaveAndReview}
        sx={{
          margin: `4px!important`,
          letterSpacing: "1.28px",
          borderRadius: 0,
          fontSize: 13,
          fontWeight: 700,
          paddingX: 3,
          paddingY: 3 / 2,
          boxShadow: "none",
          border: `1px solid ${props?.colorCode?.save_review_button_border}`,
          backgroundColor: props?.colorCode?.save_review_button_background,
          color: props?.colorCode?.save_review_button_color,
          ":hover, :focus": {
            border: `1px solid ${props?.colorCode?.save_review_button_hover_border}`,
            backgroundColor:
              props?.colorCode?.save_review_button_hover_background,
            color: props?.colorCode?.save_review_button_color,
            boxShadow: "none",
          },
        }}
      >
        {__("SAVE & MARK FOR REVIEW", "acadlix")}
      </Button>
      {/* Mark for review and next button  */}
      <Button
        variant="contained"
        onClick={handleReviewAndNext}
        sx={{
          margin: `4px!important`,
          letterSpacing: "1.28px",
          borderRadius: 0,
          fontSize: 13,
          fontWeight: 700,
          paddingX: 3,
          paddingY: 3 / 2,
          boxShadow: "none",
          border: `1px solid ${props?.colorCode?.review_and_next_button_border}`,
          backgroundColor: props?.colorCode?.review_and_next_button_background,
          color: props?.colorCode?.review_and_next_button_color,
          ":hover, :focus": {
            border: `1px solid ${props?.colorCode?.review_and_next_button_hover_border}`,
            backgroundColor:
              props?.colorCode?.review_and_next_button_hover_background,
            color: props?.colorCode?.review_and_next_button_color,
            boxShadow: "none",
          },
        }}
      >
        {__("MARK FOR REVIEW & NEXT", "acadlix")}
      </Button>
    </Box>
  );
};

export default NtaButtonOptions;
