import React from "react";
import {
  CardHeader,
  CardContent,
  FormControlLabel,
  RadioGroup,
  Radio,
  Card,
} from "@mui/material";
function TrueFalse() {
  return (
    <Card>
      <CardHeader title="True/False"
      titleTypographyProps={{
        variant: 'h6'
      }}></CardHeader>
      <CardContent sx={{
        paddingTop: 1
      }}>
        <RadioGroup row>
          <FormControlLabel control={<Radio />} label="True" value="true" />
          <FormControlLabel control={<Radio />} label="False" value="false" />
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

export default TrueFalse;
