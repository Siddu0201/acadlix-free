import React from "react";
import {
  CardHeader,
  CardContent,
  FormControlLabel,
  Button,
  Checkbox,
  TextareaAutosize,
  Card,
  Grid,
} from "@mui/material";
import GridItem1 from "../../../components/GridItem1";
function MatrixSortingChoice() {
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
        <Grid container>
          <GridItem1 lg={6}>
            <h3>Criteria</h3>
            <TextareaAutosize
              minRows={4}
              style={{ width: "100%" }}
            ></TextareaAutosize>
            <Button variant="contained" color="error">
              Delete
            </Button>
          </GridItem1>
          <GridItem1 lg={6}>
            <h3>Sort Element</h3>
            <TextareaAutosize
              minRows={4}
              style={{ width: "100%" }}
            ></TextareaAutosize>
          </GridItem1>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default MatrixSortingChoice;
