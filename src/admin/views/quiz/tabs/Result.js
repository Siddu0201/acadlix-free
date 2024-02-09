import React from "react";
import {
  Box,
  Grid,
  FormControlLabel,
  Button,
  FormControl,
  RadioGroup,
  FormLabel,
  Radio,
  Typography,
} from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";
import CustomSwitch from "../../../../components/CustomSwitch";

const Result = (props) => {
  const loadPage = () => {
    props?.loadEditor("result_text");
  };

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      props?.removeEditor("result_text");
      window.removeEventListener("load", loadPage);
    };
  }, []);

  return (
    <div>
      <Box sx={{ color: "black" }}>
        <Grid container>
          {/*           
          Result option used to hide result after quiz finish and options available in result are:
            - Hide Negative Marks
            - Hide Quiz Time
            - Show Speed 
            - Show Percentile 
            - Show Accuracy % 
            - Show Rank 
            - Show Average Score
            - Show Subject Wise Analysis 
            - Show Marks Distribution 
            - Show Status Based on min %
            - Minimum % to pass 
            - Result Comparison with top 5 Students
          */}
          <GridItem1 xs={12} lg={12}>
  <Typography variant="h6">Result Options</Typography>
</GridItem1>
<GridItem1 xs={12} lg={12}>
  <FormControlLabel
    control={
      <CustomSwitch
        checked={props?.watch("hide_result") ?? false}
        onChange={(e) => {
          props?.setValue("hide_result", e?.target?.checked, { shouldDirty: true });
        }}
      />
    }
    label="Hide Result"
  />
</GridItem1>


          {/* Used to hide negative marks in result  */}
          <GridItem1 xs={12} lg={4}>
  <FormControlLabel
    control={
      <CustomSwitch
        checked={props?.watch("hide_negative_marks") ?? false}
        onChange={(e) => {
          props?.setValue("hide_negative_marks", e?.target?.checked, { shouldDirty: true });
        }}
      />
    }
    label="Hide Negative Marks"
  />
</GridItem1>


          {/* Used to hide quiz time in result  */}
          <GridItem1 xs={12} lg={4}>
  <FormControlLabel
    control={
      <CustomSwitch
        checked={props?.watch("hide_quiz_time") ?? false}
        onChange={(e) => {
          props?.setValue("hide_quiz_time", e?.target?.checked, { shouldDirty: true });
        }}
      />
    }
    label="Hide Quiz Time"
  />
</GridItem1>


          {/* Its an average speed per question - total_time_taken/question  */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={
              <CustomSwitch
        checked={props?.watch("show_speed") ?? false}
        onChange={(e) => {
          props?.setValue("show_speed", e?.target?.checked, { shouldDirty: true });
        }}
      />
            } label="Show Speed" />
          </GridItem1>

          {/* Used to calculate percentage on the basis of topper - my_marks/topper_marks * 100  */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={
            <CustomSwitch
        checked={props?.watch("show_percentile") ?? false}
        onChange={(e) => {
          props?.setValue("show_percentile", e?.target?.checked, { shouldDirty: true });
        }}
      />} label="Show Percentile" />
          </GridItem1>

          {/* It tells the % of correct attempt from attempted question - total_correct/total_attempt * 100 */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<CustomSwitch
        checked={props?.watch("show_accuracy") ?? false}
        onChange={(e) => {
          props?.setValue("show_accuracy", e?.target?.checked, { shouldDirty: true });
        }}
      />} label="Show Accuracy %" />
          </GridItem1>

          {/* Used to show rank  */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<CustomSwitch
        checked={props?.watch("show_rank") ?? false}
        onChange={(e) => {
          props?.setValue("show_rank", e?.target?.checked, { shouldDirty: true });
        }}
      />} label="Show Rank" />
          </GridItem1>

          {/* Used to Show Average Score  */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<CustomSwitch
        checked={props?.watch("show_average_score") ?? false}
        onChange={(e) => {
          props?.setValue("show_average_score", e?.target?.checked, { shouldDirty: true });
        }}
      />} label="Show Average Score" />
          </GridItem1>

          {/* Used to show subject wise analysis of quiz  */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={<CustomSwitch
        checked={props?.watch("show_subject_wise_analysis") ?? false}
        onChange={(e) => {
          props?.setValue("show_subject_wise_analysis", e?.target?.checked, { shouldDirty: true });
        }}
      />}
              label="Show Subject Wise Analysis"
            />
          </GridItem1>

          {/* Used to show marks Distribution  */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<CustomSwitch
        checked={props?.watch("show_marks_distribution") ?? false}
        onChange={(e) => {
          props?.setValue("show_marks_distribution", e?.target?.checked, { shouldDirty: true });
        }}
      />} label="Show Marks Distribution" />
          </GridItem1>

          {/* 
          Used to show Status - Pass /Fail on the basis of Percent 
          On check - Minimum % to pass option will open
           */}
          <GridItem1 xs={12} lg={6}>
            <FormControlLabel control={<CustomSwitch
        checked={props?.watch("show_status_based_on_min_percent") ?? false}
        onChange={(e) => {
          props?.setValue("show_status_based_on_min_percent", e?.target?.checked, { shouldDirty: true });
        }}
      />} label="Show Status Based On Min % (Pass/Fail)" />
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

          {/* Option for Result Comparision with top 5 student    */}
          <GridItem1 xs={12} lg={12}>
            <FormControlLabel
              control={<CustomSwitch
        checked={props?.watch("result_comparision_with_top_five_student") ?? false}
        onChange={(e) => {
          props?.setValue("result_comparision_with_top_five_student", e?.target?.checked, { shouldDirty: true });
        }}
      />}
              label="Result Comparison with top 5 Students"
            />
          </GridItem1>

          {/* End of Result options */}

          {/* 
          Answer sheet option to hide answer sheet and options availbales are: 
           - Show Per Question Time
           - was the solution helpful
           - bookmark
           - report question/answer 
            */}
          <GridItem1 xs={12} lg={12}>
            <Typography variant="h6">Answer Sheet Options</Typography>
          </GridItem1>   
          <GridItem1 xs={12} lg={12}>
            <FormControlLabel control={<CustomSwitch
        checked={props?.watch("hide_answer_sheet") ?? false}
        onChange={(e) => {
          props?.setValue("hide_answer_sheet", e?.target?.checked, { shouldDirty: true });
        }}
      />} label="Hide Answer Sheet" />
          </GridItem1>

          {/* Used to show per question time in answer sheet    */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<CustomSwitch
        checked={props?.watch("show_per_question_time") ?? false}
        onChange={(e) => {
          props?.setValue("show_per_question_time", e?.target?.checked, { shouldDirty: true });
        }}
      />} label="Show Per Question Time" />
          </GridItem1>

          {/* Used to ask the user as the solution is helpful or not - show like dislike emoji */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={<CustomSwitch
        checked={props?.watch("was_the_solution_helpful") ?? false}
        onChange={(e) => {
          props?.setValue("was_the_solution_helpful", e?.target?.checked, { shouldDirty: true });
        }}
      />}
              label="Was The Solution Helpful"
            />
          </GridItem1>

          {/* Used to ask user to bookmark question in answer sheet */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<CustomSwitch
        checked={props?.watch("book_mark") ?? false}
        onChange={(e) => {
          props?.setValue("book_mark", e?.target?.checked, { shouldDirty: true });
        }}
      />} label="Bookmark" />
          </GridItem1>

          {/* A button to report regarding the question of the answer    */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={<CustomSwitch
        checked={props?.watch("report_question_answer") ?? false}
        onChange={(e) => {
          props?.setValue("report_question_answer", e?.target?.checked, { shouldDirty: true });
        }}
      />}
              label="Report question/answer"
            />
          </GridItem1>

          {/* End Answer sheet option  */}

          {/* 
          Options for Leaderboard contains
            - total number of entries
            - Users can apply multiple times (on selection show field for number of time 0 as default for infinity)
            - Number of times user can apply
            - automatically display leaderboard in quiz result - don't display(default) , below the result , in a button 
             */}
          <GridItem1 xs={12} lg={12}>
            <Typography variant="h6">Leaderboard Options</Typography>
          </GridItem1>   
          <GridItem1 xs={12} lg={12}>
            <FormControlLabel control={<CustomSwitch
        checked={props?.watch("leaderboard") ?? false}
        onChange={(e) => {
          props?.setValue("leaderboard", e?.target?.checked, { shouldDirty: true });
        }}
      />} label="Leaderboard" />
          </GridItem1>

          {/* Total number of entries to be displayed in leaderboard */}
          <GridItem1 xs={12} lg={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Total number of enteries"
              type="number"
              value={1}
            />
          </GridItem1>

          {/* User can apply multiple times for leaderboard */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={<CustomSwitch
        checked={props?.watch("user_can_apply_multiple_times") ?? false}
        onChange={(e) => {
          props?.setValue("user_can_apply_multiple_times", e?.target?.checked, { shouldDirty: true });
        }}
      />}
              label="User can apply multiple times"
            />
          </GridItem1>

          {/* Number of times user can apply for leaderboard */}
          <GridItem1 xs={12} lg={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Number of time (0 -> Infinity)"
              type="number"
            />
          </GridItem1>

          {/* Option to show position of leaderboard in quiz result
            - don't display
            - below the result
            - in the button
          */}
          <GridItem1 xs={12} lg={12}>
            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormLabel
                id="acadlix-result-display-leaderboard-in-quiz-result"
                sx={{
                  marginRight: 4,
                  color: "black",
                  fontWeight: 500,
                  fontSize: '1rem',
                }}
              >
                Automatically display leaderboard in quiz result
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="acadlix-result-display-leaderboard-in-quiz-result"
              >
                <FormControlLabel
                  value="don't display"
                  label="don't display"
                  control={<Radio />}
                />
                <FormControlLabel
                  value="below the result"
                  label="below the result"
                  control={<Radio />}
                />
                <FormControlLabel
                  value="in the button"
                  label="in the button"
                  control={<Radio />}
                />
              </RadioGroup>
            </FormControl>
          </GridItem1>
          {/* End leaderboard options */}

          {/* Show result Text
            - show simple text or based on %
          */}
          <GridItem1 xs={12} lg={12}>
            <Typography variant="h6">Result Text</Typography>
          </GridItem1>
          <GridItem1 xs={12} lg={12}>
            <FormControlLabel
              control={<CustomSwitch
        checked={props?.watch("hide_quiz_time") ?? false}
        onChange={(e) => {
          props?.setValue("hide_quiz_time", e?.target?.checked, { shouldDirty: true });
        }}
      />}
              label="% Based Result Text"
            />
          </GridItem1>
          <GridItem1 xs={12} lg={12}>
            <textarea
              id="result_text"
              style={{
                width: "100%",
              }}
            />
          </GridItem1>
          <GridItem1 xs={12} lg={2}>
            <CustomTextField
              fullWidth
              size="small"
              multiline
              rows={1}
              label="Percentage"
            />
          </GridItem1>
          <GridItem1 xs={12} lg={10}>
            <CustomTextField
              fullWidth
              size="small"
              multiline
              rows={3}
              label="% text"
            />
          </GridItem1>
          <GridItem1 xs={12} lg={12}>
            <Button
              sx={{
                marginY: 3,
              }}
              variant="contained"
              color="success"
            >
              Add More
            </Button>
          </GridItem1>
        </Grid>
      </Box>
    </div>
  );
}

export default Result;
