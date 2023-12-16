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
          {/*           
          Result option used to show result after quiz finish and options available in result are:
            - Hide Negative Marks
            - Speed 
            - Percentile 
            - Accuracy 
            - Rank 
            - Average Score
            - Subject Wise Analysis 
            - Marks Distribution 
            - Status 
          */}
          <GridItem1 xs={12} lg={12}>
            <FormControlLabel control={<Switch />} label="Result" />
          </GridItem1>

          {/* Used to hide negative marks in result  */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={<Switch />}
              label="Hide Negative Marks"
            />
          </GridItem1>

          {/* Its an average speed per question - total_time_taken/question  */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Speed" />
          </GridItem1>

          {/* Used to calculate percentage on the basis of topper - my_marks/topper_marks * 100  */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Percentile" />
          </GridItem1>

          {/* It tells the % of correct attempt from attempted question - total_correct/total_attempt * 100 */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Accuracy %" />
          </GridItem1>

          {/* Used to show rank  */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Rank" />
          </GridItem1>

          {/* Used to Show Average Score  */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Average Score" />
          </GridItem1>

          {/* Used to show subject wise analysis of quiz  */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={<Switch />}
              label="Subject Wise Analysis"
            />
          </GridItem1>

          {/* Used to show marks Distribution  */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Marks Distribution" />
          </GridItem1>

          {/* 
          Used to show Status - Pass /Fail on the basis of Percent 
          On check - Minimum % to pass option will open
           */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Status" />
          </GridItem1>

          {/* Minimum marks to pass - default 0  */}
          <GridItem1 xs={12} lg={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Minimum % to pass"
              type="number"
            />
          </GridItem1>
          {/* End of Result options */}

          {/* 
          Answer sheet option to show answer sheet and options availbales are: 
           - Per Question Time
           - was the solution helpful
           - report question/answer 
            */}
          <GridItem1 xs={12} lg={12}>
            <FormControlLabel control={<Switch />} label="Answer Sheet" />
          </GridItem1>

          {/* Used to show per question time in answer sheet    */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Per Question Time" />
          </GridItem1>

          {/* Used to ask the user as the solution is helpful or not - show like dislike emoji */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={<Switch />}
              label="Was the solution helpful"
            />
          </GridItem1>

          {/* A button to report regarding the question of the answer    */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={<Switch />}
              label="Report question/answer"
            />
          </GridItem1>

          {/* End Answer sheet option  */}

          {/* Option for Result Comparision with top 5 student    */}
          <GridItem1 xs={12} lg={12}>
            <FormControlLabel
              control={<Switch />}
              label="Result Comparison with top 5 Students"
            />
          </GridItem1>

          {/* 
          Options for Leaderboard contains
            - total number of entries
            - automatically display leaderboard in quiz result - don't display(default) , below the result , in a button 
            - Users can apply multiple times (on selection show field for number of time 0 as default for infinity)
             */}
          <GridItem1 xs={12} lg={12}>
            <FormControlLabel control={<Switch />} label="Leaderboard" />
          </GridItem1>

          <GridItem1 xs={12} lg={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Total number of enteries"
              type="number"
            />
          </GridItem1>

          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={<Switch />}
              label="User can apply multiple times"
            />
          </GridItem1>

          <GridItem1 xs={12} lg={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Number of time (0 -> Infinity)"
              type="number"
            />
          </GridItem1>
          
        </Grid>
        <h3>Result Text(Optional)</h3>
        <FormControlLabel control={<Switch />} label="% Based Result Text" />
        <CustomTextField fullWidth size="small" multiline rows={3} />
        <Button sx={{ marginY: 3 }} variant="contained" color="success">
          Add More
        </Button>
      </Box>
    </div>
  );
}

export default Result;
