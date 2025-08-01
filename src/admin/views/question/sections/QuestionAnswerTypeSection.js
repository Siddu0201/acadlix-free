import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import { __ } from "@wordpress/i18n";

const RangeTypeOption = React.lazy(() => 
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import("@acadlix/pro/admin/question/sections/RangeTypeOption") :
    import("@acadlix/free/admin/question/sections/RangeTypeOption")
);

const NumericalOption = React.lazy(() => 
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import("@acadlix/pro/admin/question/sections/NumericalOption") :
    import("@acadlix/free/admin/question/sections/NumericalOption")
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
          titleTypographyProps={{
            sx: {
              fontWeight: 500,
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
