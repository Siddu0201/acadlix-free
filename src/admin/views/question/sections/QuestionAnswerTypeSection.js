import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";

const QuestionAnswerTypeSection = (props) => {
  const handleTypeChange = (e) => {
    let answerData = {};
    switch (e?.target?.value) {
      case "singleChoice":
        answerData = {
          singleChoice: [
            {
              option: "",
              points: 0,
              negative_points: 0,
              isCorrect: false,
              isChecked: false,
            }
          ]
        };
        break;
      case "multipleChoice":
        answerData = {
          multipleChoice: [
            {
              option: "",
              points: 0,
              negative_points: 0,
              isCorrect: false,
              isChecked: false,
            }
          ]
        };
        break;
      case "trueFalse":
        answerData = {
          trueFalse: [
            { option: "True", isCorrect: false, isChecked: false},
            { option: "False", isCorrect: false, isChecked: false},
          ]
        };
        break;
      case "sortingChoice":
        answerData = {
          sortingChoice: [
            {
              option: "",
              position: 0,
            }
          ]
        };
        break;
      case "matrixSortingChoice":
        answerData = {
          matrixSortingChoice: [
            {
              option: "",
              position: 0,
              sortString: "",
            }
          ]
        };
        break;
      case "fillInTheBlank":
        answerData = {
          fillInTheBlank: [
            {
              option: "",
              caseSensitive: false,
              correctOption: [],
              yourAnswer: [],
            }
          ]
        };
        break;
      case "numerical":
        answerData = {
          numerical: [
            {
              option: "",
              yourAnswer: "",
            }
          ]
        };
        break;
      case "rangeType":
        answerData = {
          rangeType: {
            from: "",
            to: "",
            yourAnswer: "",
          }
        };
        break;
      case "paragraph":
        answerData = {
          paragraph: []
        };
        break;
      default:
        answerData = {};
        break;
    }
    props?.setValue("answer_type", e.target.value, {shouldDirty: true});
    props?.watch("language")?.forEach((_, index) => {
      props?.setValue(`language.${index}.answer_data`, answerData, {shouldDirty: true});
    })
  }
  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <CardHeader
          title="Answer Type"
          titleTypographyProps={{
            sx: {
              fontWeight: 500,
              color: "black",
            },
          }}
        />
        <CardContent>
          <RadioGroup
            row
            value={props?.watch("answer_type")}
            onChange={handleTypeChange}
          >
            <FormControlLabel
              value="singleChoice"
              control={<Radio />}
              label="Single Choice"
            />
            <FormControlLabel
              value="multipleChoice"
              control={<Radio />}
              label="Multiple Choice"
            />
            <FormControlLabel
              value="trueFalse"
              control={<Radio />}
              label="True/False"
            />
            <FormControlLabel
              value="sortingChoice"
              control={<Radio />}
              label="Sorting Choice"
            />
            <FormControlLabel
              value="matrixSortingChoice"
              control={<Radio />}
              label="Matrix Sorting Choice"
            />
            <FormControlLabel
              value="fillInTheBlank"
              control={<Radio />}
              label="Fill in the Blank"
            />
            <FormControlLabel
              value="numerical"
              control={<Radio />}
              label="Numerical"
            />
            <FormControlLabel
              value="rangeType"
              control={<Radio />}
              label="Range Type"
            />
            {/* <FormControlLabel
                  value="paragraph"
                  control={<Radio />}
                  label="Paragraph"
                /> */}
          </RadioGroup>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default QuestionAnswerTypeSection;
