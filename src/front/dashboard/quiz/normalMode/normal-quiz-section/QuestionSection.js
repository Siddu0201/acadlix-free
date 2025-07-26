import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import TypeSingleChoice from "../../questionTypes/TypeSingleChoice";
import OptionButtonSection from "./OptionButtonSection";
import HintAndMessageSection from "./HintAndMessageSection";
import TypeMultipleChoice from "../../questionTypes/TypeMultipleChoice";
import TypeTrueFalse from "../../questionTypes/TypeTrueFalse";
import TypeSortingChoice from "../../questionTypes/TypeSortingChoice";
import TypeMatrixSortingChoice from "../../questionTypes/TypeMatrixSortingChoice";
import TypeFill from "../../questionTypes/TypeFill";
import TypeNumerical from "../../questionTypes/TypeNumerical";
import TypeRange from "../../questionTypes/TypeRange";
import QuestionSubjectAndPointSection from "./QuestionSubjectAndPointSection";
import QuestionStatusSection from "./QuestionStatusSection";
import LanguageSection from "./LanguageSection";
import TypeFreeChoice from "../../questionTypes/TypeFreeChoice";
import CustomLatex from "@acadlix/modules/latex/CustomLatex";
import QuestionText from "../normal-quiz-components/QuestionText";
import ParagraphText from "../normal-quiz-components/ParagraphText";

const QuestionSection = (props) => {
  const isDisabled = () => {
    if (props?.watch("view_answer") || props?.watch(`questions.${props?.index}.check`)) {
      return true;
    }
    return false;
  }

  const answerType = (data = {}, lang_index = 0) => {
    switch (props?.question?.answer_type) {
      case "singleChoice":
        return (
          <TypeSingleChoice
            key={props?.index}
            type="singleChoice"
            lang_index={lang_index}
            index={props?.index}
            isDisabled={isDisabled()}
            {...props}
            {...data}
          />
        );
      case "multipleChoice":
        return (
          <TypeMultipleChoice
            key={props?.index}
            type="multipleChoice"
            lang_index={lang_index}
            index={props?.index}
            isDisabled={isDisabled()}
            {...props}
            {...data}
          />
        );
      case "trueFalse":
        return (
          <TypeTrueFalse
            key={props?.index}
            type="trueFalse"
            lang_index={lang_index}
            index={props?.index}
            isDisabled={isDisabled()}
            {...props}
            {...data}
          />
        );
      case "freeChoice":
        return (
          <TypeFreeChoice
            key={props?.index}
            type="freeChoice"
            lang_index={lang_index}
            index={props?.index}
            isDisabled={isDisabled()}
            {...props}
            {...data}
          />
        )
      case "sortingChoice":
        return (
          <TypeSortingChoice
            key={props?.index}
            type="sortingChoice"
            lang_index={lang_index}
            index={props?.index}
            isDisabled={isDisabled()}
            {...props}
            {...data}
          />
        );
      case "matrixSortingChoice":
        return (
          <TypeMatrixSortingChoice
            key={props?.index}
            type="matrixSortingChoice"
            lang_index={lang_index}
            index={props?.index}
            isDisabled={isDisabled()}
            {...props}
            {...data}
          />
        );
      case "fillInTheBlank":
        return (
          <TypeFill
            key={props?.index}
            type="fillInTheBlank"
            lang_index={lang_index}
            index={props?.index}
            isDisabled={isDisabled()}
            {...props}
            {...data}
          />
        );
      case "numerical":
        return (
          <TypeNumerical
            key={props?.index}
            type="numerical"
            lang_index={lang_index}
            index={props?.index}
            isDisabled={isDisabled()}
            {...props}
            {...data}
          />
        );
      case "rangeType":
        return (
          <TypeRange
            key={props?.index}
            type="rangeType"
            lang_index={lang_index}
            index={props?.index}
            isDisabled={isDisabled()}
            {...props}
            {...data}
          />
        );
      default:
        return (
          <TypeSingleChoice
            key={props?.index}
            type="singleChoice"
            lang_index={lang_index}
            index={props?.index}
            isDisabled={isDisabled()}
            {...props}
            {...data}
          />
        );
    }
  };

  const questionBelowSx = {
    boxShadow: (theme) => theme?.shadows[2],
    paddingX: 2,
    paddingY: 3,
    marginTop: 3,
    borderRadius: "6px",
  }

  return (
    <Box
      sx={{
        // display: props?.question?.selected ? "" : "none",
        ...(props?.watch("mode") === "question_below_each_other" && questionBelowSx),
      }}
      id={`acadlix_question_${props?.watch("id")}_${props?.index}`}
      ref={(elem) => (props.questionRef.current[props.index] = elem)}
      className="acadlix-normal-quiz-question-list-item"
    >
      {props?.watch("multi_language") && <LanguageSection {...props} />}
      <QuestionSubjectAndPointSection {...props} />

      {props?.question?.language?.length > 0 &&
        props?.question?.language?.map((lang, lang_index) => (
          <React.Fragment key={lang_index}>
            <Box sx={{
              display: lang?.selected ? "block" : "none",
            }}>
              {
                props?.question?.paragraph_enabled && props?.question?.paragraph_id !== null &&
                <ParagraphText
                  lang={lang}
                />
              }
              <QuestionText
                lang={lang}
              />
              <Box className="acadlix-normal-quiz-question-answer-container">
                {answerType(lang, lang_index)}
              </Box>
            </Box>
          </React.Fragment>
        ))
      }
      <QuestionStatusSection {...props} />
      <OptionButtonSection {...props} />
      {props?.question?.language?.length > 0 &&
        props?.question?.language?.map((lang, index) => (
          <HintAndMessageSection {...props} key={index} lang={lang} />
        ))}
    </Box>
  );
};

export default QuestionSection;
