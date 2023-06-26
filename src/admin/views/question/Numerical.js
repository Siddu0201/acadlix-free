import React from "react";
import {
  CardHeader,
  CardContent,
  TextField,
  FormControlLabel,
} from "@mui/material";
function Numerical() {
  return (
    <div>
      <CardHeader title="Option"></CardHeader>
      <CardContent>
        <h3>Answer Value</h3>
        <FormControlLabel control={<TextField type="number" fullWidth />} />
      </CardContent>
    </div>
  );
}

export default Numerical;
