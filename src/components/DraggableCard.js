import React from "react";
import Draggable from "react-draggable";
import Card1 from "./Card1";
import {
  CardHeader,
  CardContent,
  FormControlLabel,
  TextareaAutosize,
  Checkbox,
  Button,
} from "@mui/material";
const DraggableCard = ({ title }) => {
  return (
    <Card1 {...{ title }}>
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
    </Card1>
  );
};
export default DraggableCard;
