import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";
import CustomSwitch from "../../../../components/CustomSwitch";
import CustomTextField from "../../../../components/CustomTextField";

const QuizModeSection = (props) => {
  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <CardHeader
          title="Mode"
          titleTypographyProps={{
            sx: {
              fontWeight: 500,
              color: "black",
            },
          }}
        />
        <CardContent>
          <Grid container spacing={3}>
            {/* Used to enable normal mode 
                - contain enable back button
                - contain enable check button
            */}
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      textAlign: "center",
                      marginY: 2,
                    }}
                  >
                    <Radio
                      checked={props?.watch("mode") === "normal"}
                      name="mode"
                      sx={{
                        padding: 1,
                      }}
                      value="normal"
                      onClick={() => {
                        props?.setValue("mode", "normal", {shouldDirty: true});
                      }}
                    />
                    <h3
                      style={{
                        margin: "5px 0 10px 0",
                        cursor: "pointer",
                      }}
                    >
                      Normal
                    </h3>
                  </Box>
                  <Box>
                    <FormControlLabel
                      control={
                        <CustomSwitch
                          checked={props?.watch("enable_back_button") ?? false}
                          onChange={(e) => {
                            props?.setValue("enable_back_button", e?.target?.checked, {shouldDirty: true});
                          }}
                        />
                      }
                      label="Enable Back Button"
                    />

                    <FormControlLabel
                      control={
                        <CustomSwitch
                          checked={props?.watch("enable_check_button") ?? false}
                          onChange={(e) => {
                            props?.setValue("enable_check_button" , e?.target?.checked, {shouldDirty: true});
                          }}
                        />
                      }
                      label="Enable Check Button"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Used to enable check and continue mode
                - contain enable on option selected
            */}
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      textAlign: "center",
                      marginY: 2,
                    }}
                  >
                    <Radio
                      checked={props?.watch("mode") === "check_and_continue"}
                      name="mode"
                      sx={{
                        padding: 1,
                      }}
                      value="check_and_continue"
                      onClick={() => {
                        props?.setValue("mode", "check_and_continue", {shouldDirty: true});
                      }}
                    />
                    <h3
                      style={{
                        margin: "5px 0 10px 0",
                        cursor: "pointer",
                      }}
                    >
                      Check And Continue
                    </h3>
                  </Box>
                  <Box>
                    <FormControlLabel
                      control={
                        <CustomSwitch
                          checked={props?.watch("enable_check_on_option_selected") ?? false}
                          onChange={(e) => {
                            props?.setValue("enable_check_on_option_selected", e?.target?.checked, {shouldDirty: true});
                          }}
                        />
                      }
                      label="Enable Check on Option Selected"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Used to enable question below each other mode
                - contain question per page textfield
            */}
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      textAlign: "center",
                      marginY: 2,
                    }}
                  >
                    <Radio
                      checked={props?.watch("mode") === "question_below_each_other"}
                      name="mode"
                      sx={{
                        padding: 1,
                      }}
                      value="question_below_each_other"
                      onClick={() => {
                        props?.setValue("mode", "question_below_each_other", {shouldDirty: true});
                      }}
                    />
                    <h3
                      style={{
                        margin: "5px 0 10px 0",
                        cursor: "pointer",
                      }}
                    >
                      Question Below Each Other
                    </h3>
                  </Box>
                  <Box>
                    <h3>Question per page</h3>
                    <CustomTextField
                      size="small"
                      fullWidth
                      type="number"
                      label="Question per page"
                      value={props?.watch("question_per_page") ?? 10}
                      onChange={(e) => {
                        props?.setValue("question_per_page", Number(e?.target?.value), {shouldDirty: true});
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Used to enable advance mode
                - Advance Panel
                - IBPS
                - SSC
                - GATE
                - SBI
                - JEE
                - Railway
            */}
            <Grid item xs={12} sm={12}>
              <Card
                sx={{
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      textAlign: "center",
                      marginY: 2,
                    }}
                  >
                    <Radio
                      checked={props?.watch("mode") === "advance_mode"}
                      name="mode"
                      sx={{
                        padding: 1,
                      }}
                      value="advance_mode"
                      onClick={() => {
                        props?.setValue("mode", "advance_mode", {shouldDirty: true});
                      }}
                    />
                    <h3
                      style={{
                        margin: "5px 0 5px 0",
                        cursor: "pointer",
                      }}
                    >
                      Advance mode
                    </h3>
                    <h5
                      style={{
                        margin: "5px 0",
                      }}
                    >
                      (Quiz Option will only set as per the exam)
                    </h5>
                  </Box>
                  <Box
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <FormControl>
                      <RadioGroup row 
                        name="advance_mode"
                        onChange={(e) => {
                          props?.setValue("advance_mode_type", e.target.value, {shouldDirty: true});
                        }}
                      >
                        <FormControlLabel
                          value="advance_panel"
                          control={<Radio />}
                          label="Advance Panel"
                          checked={props?.watch("advance_mode_type") === "advance_panel"}
                        />
                        <FormControlLabel
                          value="ibps"
                          control={<Radio />}
                          label="IBPS"
                          checked={props?.watch("advance_mode_type") === "ibps"}
                        />
                        <FormControlLabel
                          value="ssc"
                          control={<Radio />}
                          label="SSC"
                          checked={props?.watch("advance_mode_type") === "ssc"}
                        />
                        <FormControlLabel
                          value="gate"
                          control={<Radio />}
                          label="GATE"
                          checked={props?.watch("advance_mode_type") === "gate"}
                        />
                        <FormControlLabel
                          value="sbi"
                          control={<Radio />}
                          label="SBI"
                          checked={props?.watch("advance_mode_type") === "sbi"}
                        />
                        <FormControlLabel
                          value="jee"
                          control={<Radio />}
                          label="JEE"
                          checked={props?.watch("advance_mode_type") === "jee"}
                        />
                        <FormControlLabel
                          value="railway"
                          control={<Radio />}
                          label="Railway"
                          checked={props?.watch("advance_mode_type") === "railway"}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default QuizModeSection;
