import * as React from "react";
import BoxMain from "../../../components/BoxMain";
import Card1 from "../../../components/Card1";
import Fill from "./Fill";
import RangeType from "./RangeType";
import TrueFalse from "./TrueFalse";
import Numerical from "./Numerical";
import MultipleChoice from "./MultipleChoice";
import SingleChoice from "./SingleChoice";
import SortingChoice from "./SortingChoice";
import MatrixSortingChoice from "./MatrixSortingChoice";
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
function Question() {
  const [answer, setAnswer] = React.useState("trueFalse");

  const handleChange = (event) => {
    setAnswer(event.target.value);
  };
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
              <RadioGroup row value={answer} onChange={handleChange}>
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
                  value="fill-in-the-blank"
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
            {(() => {
              switch (answer) {
                case "single-choice":
                  return <SingleChoice />;
                  break;
                case "multiple-choice":
                  return <MultipleChoice />;
                  break;
                case "truefalse":
                  return <TrueFalse />;
                  break;
                case "sorting-choice":
                  return <SortingChoice />;
                  break;
                case "matrix-sorting-choice":
                  return <MatrixSortingChoice />;
                  break;
                case "fill-in-the-blank":
                  return <Fill />;
                  break;
                case "numerical":
                  return <Numerical />;
                  break;
                case "range-type":
                  return <RangeType />;
                  break;
                case "paragraph":
                  break;
                default:
                  break;
              }
            })()}
          </Card1>
          <Button variant="contained" color="success">
            Save
          </Button>
        </FormControl>
      </BoxMain>
    </div>
  );
}

export default Question;
