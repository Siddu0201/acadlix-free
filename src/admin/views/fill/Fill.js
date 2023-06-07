import React from "react";
import BoxMain from "../../../components/BoxMain";
import {
  Container,
  TextareaAutosize,
  Input,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Button,
} from "@mui/material";
function Fill() {
  return (
    <div>
      <BoxMain>
        <Container
          maxWidth="100%"
          sx={{
            backgroundColor: "white",
            p: 3,
            mb: "15px",
          }}
        >
          <Input style={{ marginRight: "20px" }} placeholder="Question Title" />
          <Input style={{ marginRight: "20px" }} placeholder="+ Points" />
          <Input style={{ marginRight: "20px" }} placeholder="- Points" />
          <Input style={{ marginRight: "20px" }} placeholder="Topic" />
        </Container>
        <Container
          maxWidth="100%"
          sx={{
            backgroundColor: "white",
            p: 3,
            mb: "15px",
          }}
        >
          <h3>Question</h3>
          <TextareaAutosize minRows={3} style={{ width: "100%" }} />
        </Container>

        <Container
          maxWidth="100%"
          sx={{
            backgroundColor: "white",
            p: 3,
            mb: "15px",
          }}
        >
          <h3>Message with correct answer</h3>
          <TextareaAutosize minRows={3} style={{ width: "100%" }} />
        </Container>

        <Container
          maxWidth="100%"
          sx={{
            backgroundColor: "white",
            p: 3,
            mb: "15px",
          }}
        >
          <FormControl>
            <h3>Answer Type</h3>
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
          </FormControl>
        </Container>
        <Container
          maxWidth="100%"
          sx={{
            backgroundColor: "white",
            p: 3,
            mb: "15px",
          }}
        >
          <h3>Hint(Optional)</h3>
          <TextareaAutosize minRows={3} style={{ width: "100%" }} />
        </Container>

        <Container
          maxWidth="100%"
          sx={{
            backgroundColor: "white",
            p: 3,
            mb: "15px",
          }}
        >
          <h3>Answer</h3>
          <TextareaAutosize minRows={3} style={{ width: "100%" }} />
        </Container>
        <Button variant="contained" color="success">
          Save
        </Button>
      </BoxMain>
    </div>
  );
}

export default Fill;
