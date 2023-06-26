import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  FormControlLabel,
  Button,
  TextareaAutosize,
} from "@mui/material";

function SortingChoice() {
  return (
    <div>
      <Option title="Option1"></Option>
      <Option title="Option2"></Option>
    </div>
  );
}
const Option = ({ title }) => {
  return (
    <Card sx={{ margin: "10px" }}>
      <CardHeader title={title}></CardHeader>
      <CardContent>
        <TextareaAutosize
          minRows={4}
          style={{ width: "100%" }}
        ></TextareaAutosize>
        <Button variant="contained" color="error">
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};
export default SortingChoice;
