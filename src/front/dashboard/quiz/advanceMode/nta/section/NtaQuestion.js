import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { FaArrowCircleDown, FaArrowCircleUp } from "../../../../../../helpers/icons";
import TypeSingleChoice from "../../../questionTypes/TypeSingleChoice";
import TypeMultipleChoice from "../../../questionTypes/TypeMultipleChoice";
import TypeTrueFalse from "../../../questionTypes/TypeTrueFalse";
import TypeSortingChoice from "../../../questionTypes/TypeSortingChoice";
import TypeMatrixSortingChoice from "../../../questionTypes/TypeMatrixSortingChoice";
import TypeFill from "../../../questionTypes/TypeFill";
import TypeNumerical from "../../../questionTypes/TypeNumerical";
import TypeRange from "../../../questionTypes/TypeRange";
import { __ } from "@wordpress/i18n";

const NtaQuestion = (props) => {
  const answerType = (data = {}, lang_index = 0) => {
    switch (props?.question?.answer_type) {
      case "singleChoice":
        return (
          <TypeSingleChoice
            type="singleChoice"
            lang_index={lang_index}
            index={props?.index}
            nta={true}
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
            nta={true}
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

  const moveDown = () => {
    const targetSection = document.getElementById(
      `acadlix_nta_question_${props?.index}`
    );

    // Scroll to the bottom of the section
    targetSection.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const moveUp = () => {
    const targetSection = document.getElementById(
      `acadlix_nta_question_${props?.index}`
    );

    // Scroll to the bottom of the section
    targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Box
      id={`acadlix_nta_question_${props?.index}`}
      sx={{
        paddingY: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          borderBottom: `1px solid ${props?.colorCode?.border_top_bottom}`,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
          }}
        >
          {__('Question', 'acadlix')} {props?.num}.
        </Typography>
        <FaArrowCircleDown
          onClick={moveDown}
          style={{
            cursor: "pointer",
            color: props?.colorCode?.icon_color,
            height: 28,
            width: 28,
          }}
        />
      </Box>
      <Box>
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
                      <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                          borderRight: `1px solid grey`,
                          paddingRight: 1,
                        }}
                      >
                        <Typography component="div">
                          {lang?.paragraph}
                        </Typography>
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
      <Box
        sx={{
          borderTop: `1px solid ${props?.colorCode?.border_top_bottom}`,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <FaArrowCircleUp
          onClick={moveUp}
          style={{
            cursor: "pointer",
            color: props?.colorCode?.icon_color,
            height: 28,
            width: 28,
          }}
        />
      </Box>
    </Box>
  );
};

export default NtaQuestion;
