import React from "react";
import {
  CardHeader,
  CardContent,
} from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";
function Numerical() {
  return (
    <div>
      <CardContent>
        <h3>Answer Value</h3>
        <CustomTextField
          fullWidth
          size="small"
          multiline
          rows={2}
          helperText="Numerical values only"
        />
      </CardContent>
    </div>
  );
}

export default Numerical;
