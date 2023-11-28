import React from "react";
import { CardHeader, CardContent, Card } from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";

function Fill() {
  return (
    <Card>
      <CardHeader title="Fill in the Blank"
      titleTypographyProps={{
        variant: 'h6'
      }}></CardHeader>
      <CardContent sx={{
        paddingTop: 1
      }}>
        <CustomTextField
          fullWidth
          size="small"
          multiline
          rows={4}
        />
      </CardContent>
    </Card>
  );
}

export default Fill;
