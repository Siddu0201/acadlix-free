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
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";
function Result() {
  return (
    <div>
      <Box sx={{ color: "black" }}>
        <Grid container>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Result" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Answer Sheet" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Average Score" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Speed" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Status" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Minimum % to pass"
              type="number"
            />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
           <FormControlLabel control={<Switch />} label="Percentile" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Accuracy %" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Per Question Time" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Subject Wise Analysis" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Result Comparison with top 5 Students" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Marks Distribution" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Leaderboard" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Rank" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="was the solution helpful" />
          </GridItem1>
        </Grid>
        <h3>Result Text(Optional)</h3>
        <FormControlLabel control={<Switch />} label="% Based Result Text" />
          <CustomTextField
            fullWidth
            size="small"
            multiline
            rows={3}
          />
          <Button
            sx={{ marginY: 3 }}
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
