import * as React from "react";
import Fill from "./types/Fill";
import RangeType from "./types/RangeType";
import TrueFalse from "./types/TrueFalse";
import Numerical from "./types/Numerical";
import MultipleChoice from "./types/MultipleChoice";
import SingleChoice from "./types/SingleChoice";
import SortingChoice from "./types/SortingChoice";
import MatrixSortingChoice from "./types/MatrixSortingChoice";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  CardContent,
  CardHeader,
  Grid,
  Card,
  Box,
  Autocomplete,
  TextField,
  Switch,
} from "@mui/material";
import CustomTextField from "../../../components/CustomTextField";
function Question() {
  const [answer, setAnswer] = React.useState("single-choice");

  const handleChange = (event) => {
    setAnswer(event.target.value);
  };

  const answerType = () => {
    switch (answer) {
      case "single-choice":
        return <SingleChoice />;
      case "multiple-choice":
        return <MultipleChoice />;
      case "true-false":
        return <TrueFalse />;
      case "sorting-choice":
        return <SortingChoice />;
      case "matrix-sorting-choice":
        return <MatrixSortingChoice />;
      case "fill-in-the-blank":
        return <Fill />;
      case "numerical":
        return <Numerical />;
      case "range-type":
        return <RangeType />;
      case "paragraph":
        break;
      default:
        break;
    }
  }

  return (
    <Box>
      <Grid container rowSpacing={3} spacing={4} sx={{
        padding: 4
      }}>
        {/* Top section contain title, points, subject, topic */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    label="Question Title"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    label="+ Point"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    label="- Point"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={[]}
                    renderInput={(params) => (
                      <TextField {...params} label="Subject" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={[]}
                    renderInput={(params) => (
                      <TextField {...params} label="Topic" />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Section contain question */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardHeader title="Question" />
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} lg={12}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    label="Question"
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Section contain correct answer */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardHeader title="Message with correct answer" />
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} lg={12}>
                  <FormControlLabel control={<Switch />} label="Different Message with Correct and Incorrect Answer?" />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    label="Correct message"
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    label="Incorrect message"
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Section contain hint */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardHeader title="Hint(Optional)" />
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} lg={12}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    label="Enter hint"
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Card>
            <CardHeader title="Answer Type" />
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
                  value="true-false"
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
          </Card>
        </Grid>
        
        {/* Section contain answer type form */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent>
              {answerType()}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Button variant="contained" color="success">
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Question;
