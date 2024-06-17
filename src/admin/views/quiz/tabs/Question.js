import React from "react";
import {
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormHelperText,
  Box,
  Typography,
} from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import CustomSwitch from "../../../../components/CustomSwitch";
const Question = (props) => {
  return (
    <div>
      <Box sx={{ color: "black" }}>
        <Grid container>
          <GridItem1 xs={12} lg={12}>
            <Typography variant="h6">Question Options</Typography>
          </GridItem1>

          {/* Used to show morks - +points & -points in question */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={props?.watch("show_marks") ?? false}
                  onChange={(e) => {
                    props?.setValue("show_marks", e?.target?.checked, {
                      shouldDirty: true,
                    });
                  }}
                  disabled={props?.watch("mode") === "advance_mode" && props?.watch("advance_mode_type") !== "advance_panel"}
                />
              }
              label="Show Marks"
            />
            <FormHelperText>(Show +point & -point)</FormHelperText>
          </GridItem1>

          {/* Display subject in question */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={props?.watch("display_subject") ?? false}
                  onChange={(e) => {
                    props?.setValue("display_subject", e?.target?.checked, {
                      shouldDirty: true,
                    });
                  }}
                  disabled={props?.watch("mode") === "advance_mode" && props?.watch("advance_mode_type") !== "advance_panel"}
                />
              }
              label="Display Subject"
            />
          </GridItem1>

          {/* Show skip button in question to skip question */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={props?.watch("skip_question") ?? false}
                  onChange={(e) => {
                    props?.setValue("skip_question", e?.target?.checked, {
                      shouldDirty: true,
                    });
                  }}
                  disabled={props?.watch("mode") === "advance_mode" && props?.watch("advance_mode_type") !== "advance_panel"}
                />
              }
              label="Skip Question"
            />
          </GridItem1>

          {/* Show bullets in answer option- only for single and multiple choice */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={props?.watch("answer_bullet") ?? false}
                  onChange={(e) => {
                    props?.setValue("answer_bullet", e?.target?.checked, {
                      shouldDirty: true,
                    });
                  }}
                  disabled={props?.watch("mode") === "advance_mode" && props?.watch("advance_mode_type") !== "advance_panel"}
                />
              }
              label="Answer Bullet"
            />
          </GridItem1>

          {/* Type of bullets to show Numeric/Alphabatic */}
          <GridItem1 xs={12} lg={8}>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={(e) => {
                props?.setValue("answer_bullet_type", e?.target?.value, {shouldDirty: true});
              }}
            >
              <FormControlLabel
                value="numeric"
                control={<Radio />}
                label="Numeric"
                checked={props?.watch("answer_bullet_type") === "numeric"}
                disabled={!props?.watch("answer_bullet")}
                />
              <FormControlLabel
                value="alphabet"
                control={<Radio />}
                label="Alphabet"
                checked={props?.watch("answer_bullet_type") === "alphabet"}
                disabled={!props?.watch("answer_bullet")}
              />
            </RadioGroup>
          </GridItem1>

          {/* Used to randomize question */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={props?.watch("random_question") ?? false}
                  onChange={(e) => {
                    props?.setValue("random_question", e?.target?.checked, {
                      shouldDirty: true,
                    });
                  }}
                />
              }
              label="Random Question"
            />
          </GridItem1>

          {/* Used to randomize answer options - only for single and multiple choice */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={props?.watch("random_option") ?? false}
                  onChange={(e) => {
                    props?.setValue("random_option", e?.target?.checked, {
                      shouldDirty: true,
                    });
                  }}
                />
              }
              label="Random Option"
            />
            <FormHelperText>
              (Only for single and mulitple choice)
            </FormHelperText>
          </GridItem1>

          {/* Used to stop randomization of last option */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={
                    props?.watch("do_not_randomize_last_option") ?? false
                  }
                  onChange={(e) => {
                    props?.setValue(
                      "do_not_randomize_last_option",
                      e?.target?.checked,
                      { shouldDirty: true }
                    );
                  }}
                />
              }
              label="Do not randomize last option"
            />
          </GridItem1>

          {/* Used to show question overview in top of quiz */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={props?.watch("question_overview") ?? false}
                  onChange={(e) => {
                    props?.setValue("question_overview", e?.target?.checked, {
                      shouldDirty: true,
                    });
                  }}
                  disabled={props?.watch("mode") === "advance_mode" && props?.watch("advance_mode_type") !== "advance_panel"}
                />
              }
              label="Question Overview"
            />
          </GridItem1>

          {/* Used to hide question numbering  */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={props?.watch("hide_question_numbering") ?? false}
                  onChange={(e) => {
                    props?.setValue(
                      "hide_question_numbering",
                      e?.target?.checked,
                      { shouldDirty: true }
                    );
                  }}
                  disabled={props?.watch("mode") === "advance_mode" && props?.watch("advance_mode_type") !== "advance_panel"}
                />
              }
              label="Hide Question Numbering"
            />
          </GridItem1>

          {/* Sort question according to subject */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={props?.watch("sort_by_subject") ?? false}
                  onChange={(e) => {
                    props?.setValue("sort_by_subject", e?.target?.checked, {
                      shouldDirty: true,
                    });
                  }}
                />
              }
              label="Sort Questions By Subject"
            />
          </GridItem1>

          {/* Attempt question and move forward automatically- only for single choice */}
          <GridItem1 xs={12} lg={6}>
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={props?.watch("attempt_and_move_forward") ?? false}
                  onChange={(e) => {
                    props?.setValue(
                      "attempt_and_move_forward",
                      e?.target?.checked,
                      { shouldDirty: true }
                    );
                  }}
                />
              }
              label="Attempt & move forward automatically"
            />
            <FormHelperText>(only for single choice)</FormHelperText>
          </GridItem1>

          {/* Force user to answer each question */}
          <GridItem1 xs={12} lg={6}>
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={
                    props?.watch("force_user_to_answer_each_question") ?? false
                  }
                  onChange={(e) => {
                    props?.setValue(
                      "force_user_to_answer_each_question",
                      e?.target?.checked,
                      { shouldDirty: true }
                    );
                  }}
                  disabled={props?.watch("mode") === "advance_mode" && props?.watch("advance_mode_type") !== "advance_panel"}
                />
              }
              label="Force User to Answer Each Question"
            />
          </GridItem1>
        </Grid>
      </Box>
    </div>
  );
};

export default Question;
