import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import { __ } from "@wordpress/i18n";

const RangeTypeOption = React.lazy(() => 
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
        /* webpackChunkName: "admin_quiz_pro_range_type_option" */
        "@acadlix/pro/admin/question/sections/RangeTypeOption"
      )
    : import(
        /* webpackChunkName: "admin_quiz_free_range_type_option" */
        "@acadlix/free/admin/question/sections/RangeTypeOption"
      )
);

const NumericalOption = React.lazy(() => 
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
        /* webpackChunkName: "admin_quiz_pro_numerical_option" */
        "@acadlix/pro/admin/question/sections/NumericalOption"
      )
    : import(
        /* webpackChunkName: "admin_quiz_free_numerical_option" */
        "@acadlix/free/admin/question/sections/NumericalOption"
      )
);

const QuestionAnswerTypeSection = (props) => {
  const handleTypeChange = (e) => {
    props?.setValue("answer_type", e.target.value, { shouldDirty: true });
  }

  return (
    <Grid size={{ xs: 12, sm: 12 }}>
      <Card>
        <CardHeader
          title={__('Answer Type', 'acadlix')}
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
              value="freeChoice"
              control={<Radio />}
              label={__("Free Choice", "acadlix")}
            />
            <FormControlLabel
              value="sortingChoice"
              control={<Radio />}
              label={__("Sorting Choice", "acadlix")}
            />
            <FormControlLabel
              value="matrixSortingChoice"
              control={<Radio />}
              label={__('Matrix Sorting Choice', 'acadlix')}
            />
            <FormControlLabel
              value="fillInTheBlank"
              control={<Radio />}
              label={__("Fill in the Blank", "acadlix")}
            />
            <React.Suspense fallback={null}>
              <NumericalOption />
            </React.Suspense>
            <React.Suspense fallback={null}>
              <RangeTypeOption />
            </React.Suspense>
          </RadioGroup>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default QuestionAnswerTypeSection;
