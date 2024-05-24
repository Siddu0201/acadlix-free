import { Box, Typography } from "@mui/material";
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

const QuestionSection = (props) => {
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
    <Box sx={{
      display: props?.question?.selected ? "" : "none",
    }}>
      <Box>
        <Box
          sx={{
            marginY: "5px",
          }}
        >
          <Typography>
            Question <b>{props?.num}</b> of{" "}
            <b>{props?.watch("questions")?.length}</b>
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginY: "5px",
          }}
        >
          <Box>
            <Typography>{props?.num}. Question</Typography>
          </Box>
          <Box>
            <Typography>
              <b>{props?.question?.points} points</b>
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            marginY: "2px",
          }}
        >
          <Typography>
            <b>Category: {props?.watch("category")}</b>
          </Typography>
        </Box>
        {props?.question?.language?.length > 0 &&
          props?.question?.language?.map((lang, lang_index) => (
            <React.Fragment key={lang_index}>
              {answerType(lang, lang_index)}
            </React.Fragment>
          ))}
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
