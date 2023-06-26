import React from "react";
import {
  CardHeader,
  CardContent,
  FormControlLabel,
  Button,
  Checkbox,
  TextareaAutosize,
  Card,
} from "@mui/material";

function MultipleChoice() {
  return (
    <div>
      <Option title="Option1" />
      <Option title="Option2" />
      <Button variant="contained" color="success" sx={{ margin: "10px" }}>
        Add More
      </Button>
    </div>
  );
}
const Option = ({ title }) => {
  return (
    <Card sx={{ margin: "10px" }}>
      <CardHeader title={title}></CardHeader>
      <CardContent>
        <FormControlLabel control={<Checkbox />} label="Correct" />
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
export default MultipleChoice;
