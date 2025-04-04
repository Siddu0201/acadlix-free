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
import Latex from 'react-latex-next';
import CustomLatex from "../../../../../modules/latex/CustomLatex";

const QuestionSection = (props) => {
  const answerType = (data = {}, lang_index = 0) => {
    switch (props?.question?.answer_type) {
      case "singleChoice":
        return (
          <TypeSingleChoice
            key={props?.index}
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
        )
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
    >
      <Box>
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
                  <Box>
                    <Typography component="div">
                      <CustomLatex>
                        {lang?.paragraph}
                      </CustomLatex>
                    </Typography>
                    <Divider />
                  </Box>
                }
                <Typography component="div">
                  <CustomLatex>
                      {lang?.question}
                  </CustomLatex>
                </Typography>
                {answerType(lang, lang_index)}
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
    </Box>
  );
};

export default QuestionSection;
