import React from "react";
import {
  CardHeader,
  CardContent,
  Card,
} from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";
function Numerical() {
  return (
    <Card>
      <CardHeader title="Numerical"
      titleTypographyProps={{
        variant: 'h6'
      }}></CardHeader>
      <CardContent sx={{
        paddingTop: 1
      }}>
        <CustomTextField
          size="small"
          type="number"
          label="Enter number"
          helperText="Numerical values only"
        />
      </CardContent>
    </Card>
  );
}

export default Numerical;
