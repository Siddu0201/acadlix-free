import { Box, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import TypeMultipleChoice from "../../questionTypes/TypeMultipleChoice";
import TypeSingleChoice from "../../questionTypes/TypeSingleChoice";
import TypeTrueFalse from "../../questionTypes/TypeTrueFalse";
import TypeSortingChoice from "../../questionTypes/TypeSortingChoice";
import TypeMatrixSortingChoice from "../../questionTypes/TypeMatrixSortingChoice";
import TypeFill from "../../questionTypes/TypeFill";
import TypeNumerical from "../../questionTypes/TypeNumerical";
import TypeRange from "../../questionTypes/TypeRange";

const QuizQuestion = (props) => {
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
      id="acadlix_quiz_question"
      sx={{
        backgroundColor: props?.colorCode?.question_background,
      }}
    >
      {props?.question?.language?.length > 0 &&
        props?.question?.language?.map((lang, lang_index) => (
          <React.Fragment key={lang_index}>
            {lang?.selected && (
              <Grid
                container
                sx={{
                  padding: 1,
                  paddingX: 2,
                }}
              >
                {props?.question?.paragraph_enabled &&
                  props?.question?.paragraph_id !== null && (
                    <Grid item xs={12} md={6} sx={{
                      borderRight: `1px solid grey`,
                      paddingRight: 1,
                    }}>
                      <Typography component="div">{lang?.paragraph}</Typography>
                    </Grid>
                  )}
                <Grid
                  item
                  xs={12}
                  md={
                    props?.question?.paragraph_enabled &&
                    props?.question?.paragraph_id !== null
                      ? 6
                      : 12
                  }
                >
                  <Typography
                    component="div"
                    sx={{
                      paddingX: 2,
                    }}
                  >
                    {lang?.question}
                  </Typography>
                  {answerType(lang, lang_index)}
                </Grid>
              </Grid>
            )}
          </React.Fragment>
        ))}
    </Box>
  );
};

export default QuizQuestion;
