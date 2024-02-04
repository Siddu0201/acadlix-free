import {
  Alert,
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

  const changeType = (type) => {
    props?.watch("language")?.forEach((_, index) => {
      props?.setValue(`language.${index}.answer_data`, props?.getAnswerData(type), {shouldDirty: true});
    })
  }

  const handleTypeChange = (e) => {
    props?.setValue("answer_type", e.target.value, {shouldDirty: true});
    changeType(e.target.value);
  }

  React.useEffect(() => {
    changeType(props?.watch("answer_type"));
  },[]);

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
          <Alert severity="warning">By switching answer type existing entries will be deleted.</Alert>
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
