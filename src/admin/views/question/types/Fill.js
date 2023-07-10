import React from "react";
import { CardHeader, CardContent } from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";
function Fill() {
  return (
    <div>
      <CardHeader title="Answer"></CardHeader>
      <CardContent>
        <CustomTextField
          fullWidth
          size="small"
          multiline
          rows={4}
        />
      </CardContent>
    </div>
  );
}

export default Fill;
