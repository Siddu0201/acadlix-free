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
import { __ } from "@wordpress/i18n";

const QuestionAnswerTypeSection = (props) => {
  const handleTypeChange = (e) => {
    props?.setValue("answer_type", e.target.value, {shouldDirty: true});
  }

  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <CardHeader
          title={__('Answer Type', 'acadlix')}
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
              label={__("Single Choice", "acadlix")}
            />
            <FormControlLabel
              value="multipleChoice"
              control={<Radio />}
              label={__("Multiple Choice", "acadlix")}
            />
            <FormControlLabel
              value="trueFalse"
              control={<Radio />}
              label={__("True/False", "acadlix")}
            />
            <FormControlLabel
              value="sortingChoice"
              control={<Radio />}
              label={__("Sorting Choice", "acadlix")}
            />
            {/* <FormControlLabel
              value="matrixSortingChoice"
              control={<Radio />}
              label={__('Matrix Sorting Choice', 'acadlix')}
            /> */}
            <FormControlLabel
              value="fillInTheBlank"
              control={<Radio />}
              label={__("Fill in the Blank", "acadlix")}
            />
            <FormControlLabel
              value="numerical"
              control={<Radio />}
              label={__("Numerical", "acadlix")}
            />
            <FormControlLabel
              value="rangeType"
              control={<Radio />}
              label={__("Range Type", "acadlix")}
            />
          </RadioGroup>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default QuestionAnswerTypeSection;
