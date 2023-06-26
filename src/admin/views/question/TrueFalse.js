import React from "react";
import {
  CardHeader,
  CardContent,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
function TrueFalse() {
  return (
    <div>
      <CardHeader title="Answer"></CardHeader>
      <CardContent>
        <RadioGroup row>
          <FormControlLabel control={<Radio />} label="True" value="true" />
          <FormControlLabel control={<Radio />} label="False" value="false" />
        </RadioGroup>
      </CardContent>
    </div>
  );
}

export default TrueFalse;
