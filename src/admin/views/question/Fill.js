import React from "react";
import { CardHeader, CardContent, TextareaAutosize } from "@mui/material";
function Fill() {
  return (
    <div>
      <CardHeader title="Answer"></CardHeader>
      <CardContent>
        <TextareaAutosize minRows={3} style={{ width: "100%" }} />
      </CardContent>
    </div>
  );
}

export default Fill;
