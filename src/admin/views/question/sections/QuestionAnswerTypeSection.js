import { Card, CardContent, CardHeader, FormControlLabel, Grid, Radio, RadioGroup } from "@mui/material";
import React from "react";

const QuestionAnswerTypeSection = (props) => {

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
          <RadioGroup row value={props?.answer} onChange={props?.handleChange}>
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
