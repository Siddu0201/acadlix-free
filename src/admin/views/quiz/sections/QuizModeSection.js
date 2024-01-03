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

const QuizModeSection = () => {
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
                      checked={true}
                      name="normal_mode"
                      sx={{
                        padding: 1,
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
                      control={<CustomSwitch />}
                      label="Enable Back Button"
                    />

                    <FormControlLabel
                      control={<CustomSwitch />}
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
                      name="mode"
                      sx={{
                        padding: 1,
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
                      control={<CustomSwitch />}
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
                      name="mode"
                      sx={{
                        padding: 1,
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
                      name="mode"
                      sx={{
                        padding: 1,
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
                      <RadioGroup row name="advance_mode">
                        <FormControlLabel
                          value="advance panel"
                          control={<Radio />}
                          label="Advance Panel"
                        />
                        <FormControlLabel
                          value="ibps"
                          control={<Radio />}
                          label="IBPS"
                        />
                        <FormControlLabel
                          value="ssc"
                          control={<Radio />}
                          label="SSC"
                        />
                        <FormControlLabel
                          value="gate"
                          control={<Radio />}
                          label="GATE"
                        />
                        <FormControlLabel
                          value="sbi"
                          control={<Radio />}
                          label="SBI"
                        />
                        <FormControlLabel
                          value="jee"
                          control={<Radio />}
                          label="JEE"
                        />
                        <FormControlLabel
                          value="railway"
                          control={<Radio />}
                          label="Railway"
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
