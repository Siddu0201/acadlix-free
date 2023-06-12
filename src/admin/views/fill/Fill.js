import React from "react";
import BoxMain from "../../../components/BoxMain";
import Card1 from "../../../components/Card1";
import {
  TextareaAutosize,
  Input,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Button,
  CardContent,
  CardHeader,
} from "@mui/material";
function Fill() {
  return (
    <div>
      <BoxMain>
        <FormControl>
          <Card1>
            <CardContent>
              <Input
                style={{ marginRight: "20px" }}
                placeholder="Question Title"
              />
              <Input style={{ marginRight: "20px" }} placeholder="+ Points" />
              <Input style={{ marginRight: "20px" }} placeholder="- Points" />
              <Input style={{ marginRight: "20px" }} placeholder="Topic" />
            </CardContent>
          </Card1>
          <Card1>
            <CardHeader title="Question"></CardHeader>
            <CardContent>
              <TextareaAutosize minRows={3} style={{ width: "100%" }} />
            </CardContent>
          </Card1>
          <Card1>
            <CardHeader title="Message with correct answer"></CardHeader>
            <CardContent>
              <TextareaAutosize minRows={3} style={{ width: "100%" }} />
            </CardContent>
          </Card1>
          <Card1>
            <CardHeader title="Answer Type"></CardHeader>
            <CardContent>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="single-choice"
                  control={<Radio />}
                  label="Single Choice"
                />
                <FormControlLabel
                  value="multiple-choice"
                  control={<Radio />}
                  label="Multiple Choice"
                />
                <FormControlLabel
                  value="truefalse"
                  control={<Radio />}
                  label="True/False"
                />
                <FormControlLabel
                  value="sorting-choice"
                  control={<Radio />}
                  label="Sorting Choice"
                />
                <FormControlLabel
                  value="matrix-sorting-choice"
                  control={<Radio />}
                  label="Matrix Sorting Choice"
                />
                <FormControlLabel
                  value="Fill-in-the-blank"
                  control={<Radio />}
                  label="Fill in the Blank"
                />
                <FormControlLabel
                  value="numerical"
                  control={<Radio />}
                  label="Numerical"
                />
                <FormControlLabel
                  value="range-type"
                  control={<Radio />}
                  label="Range Type"
                />
                <FormControlLabel
                  value="paragraph"
                  control={<Radio />}
                  label="Paragraph"
                />
              </RadioGroup>
            </CardContent>
          </Card1>
          <Card1>
            <CardHeader title="Hint(Optional)"></CardHeader>
            <CardContent>
              <TextareaAutosize minRows={3} style={{ width: "100%" }} />
            </CardContent>
          </Card1>
          <Card1>
            <CardHeader title="Answer"></CardHeader>
            <CardContent>
              <TextareaAutosize minRows={3} style={{ width: "100%" }} />
              <Button variant="contained" color="success">
                Save
              </Button>
            </CardContent>
          </Card1>
        </FormControl>
      </BoxMain>
    </div>
  );
}

export default Fill;
