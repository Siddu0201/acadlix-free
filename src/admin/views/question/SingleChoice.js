import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  FormControlLabel,
  Button,
  RadioGroup,
  Radio,
  TextareaAutosize,
} from "@mui/material";

function SingleChoice() {
  return (
    <div>
      <RadioGroup>
        <Option title="Option1" opt="opt1"></Option>
        <Option title="Option2" opt="opt2"></Option>
      </RadioGroup>
    </div>
  );
}
const Option = ({ title, opt }) => {
  return (
    <Card sx={{ margin: "10px" }}>
      <CardHeader title={title}></CardHeader>
      <CardContent>
        <FormControlLabel control={<Radio />} label="Correct" value={opt} />
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
export default SingleChoice;
