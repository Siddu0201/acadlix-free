import React from "react";
import {
  Box,
  Grid,
  FormControlLabel,
  Switch,
  TextareaAutosize,
  Button,
  TextField,
} from "@mui/material";
import GridItem1 from "../../../components/GridItem1";
function Result() {
  return (
    <div>
      <Box sx={{ color: "black" }}>
        <Grid container>
          <GridItem1 lg={4} xs={12}>
            <FormControlLabel control={<Switch />} label="Result" />
            <FormControlLabel control={<Switch />} label="Average Score" />
            <FormControlLabel control={<Switch />} label="Accuracy %" />
            <FormControlLabel
              control={<Switch />}
              label="Result Comparison with top 5 Students"
            />
            <FormControlLabel control={<Switch />} label="Leaderboard" />
          </GridItem1>
          <GridItem1 lg={4} xs={12}>
            <FormControlLabel control={<Switch />} label="Answer Sheet" />
            <FormControlLabel control={<Switch />} label="Speed" />
            <FormControlLabel control={<Switch />} label="Per Question Time" />
            <FormControlLabel control={<Switch />} label="Rank" />
            <FormControlLabel control={<Switch />} label="Status" />
            <h4>Minimun % to Pass</h4>
            <FormControlLabel control={<TextField type="number" />} />
          </GridItem1>
          <GridItem1 lg={4} xs={12}>
            <FormControlLabel control={<Switch />} label="Percentile" />
            <FormControlLabel
              control={<Switch />}
              label="Subject Wise Analysis"
            />
            <FormControlLabel control={<Switch />} label="Marks Distribution" />

            <FormControlLabel
              control={<Switch />}
              label="was the solution helpful"
            />
          </GridItem1>
        </Grid>
        <h3>Result Text(Optional)</h3>
        <FormControlLabel control={<Switch />} label="% Based Result Text" />
        <TextareaAutosize minRows={4} style={{ width: "100%" }} />
        <Button
          style={{ float: "right", margin: "5px" }}
          variant="contained"
          color="success"
        >
          Add More
        </Button>
      </Box>
    </div>
  );
}

export default Result;
