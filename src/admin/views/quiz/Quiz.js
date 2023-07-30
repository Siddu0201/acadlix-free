import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Button,
  Autocomplete,
  TextField,
  TextareaAutosize,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Tabs,
  Tab,
  Typography,
  Switch,
  FormLabel,
  useTheme,
} from "@mui/material";
import React from "react";
import Card1 from "../../../components/Card1";
import General from "./tabs/General";
import Question from "./tabs/Question";
import Result from "./tabs/Result";
import Notification from "./tabs/Notification";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CustomTextField from "../../../components/CustomTextField";
const Categories = [
  { label: "category1" },
  { label: "category2" },
  { label: "category3" },
];
const templates = [
  { label: "tempelate1" },
  { label: "tempelate2" },
  { label: "tempelate3" },
];

const Quiz = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box>
      <Grid container rowSpacing={3} spacing={4} sx={{
        padding: 4
      }}>
        {/* Top section containing category and template load */}
        <Grid item xs={12} sm={12}>
          <Card>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={3}>
                    <Autocomplete
                      size="small"
                      options={Categories}
                      renderInput={(params) => (
                        <TextField {...params} label="Select Quiz Categories" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'end'
                    }}>
                      <Autocomplete
                        sx={{
                          minWidth: {
                            xs: '200px',
                            sm: '300px'
                          },
                          marginRight: 3,
                        }}
                        size="small"
                        options={templates}
                        renderInput={(params) => (
                          <TextField {...params} label="Select Template" />
                        )}
                      />
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                      >
                        Load Template
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
          </Card>
        </Grid>

        {/* Second section contain title and Description */}
        <Grid item xs={12} sm={12}>
          <Card>
              <CardContent>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={12}>
                    <CustomTextField 
                      fullWidth
                      name="title"
                      size="small"
                      label="Enter quiz title"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <CustomTextField 
                      fullWidth
                      name="title"
                      size="small"
                      label="Enter quiz description"
                      multiline
                      rows={2}
                     
                    />
                  </Grid>
                </Grid>
              </CardContent>
          </Card>
        </Grid>

        {/* Third section contain quiz mode */}
        <Grid item xs={12} sm={12}>
          <Card>
              <CardHeader title="Mode"></CardHeader>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{
                      height: '100%'
                    }}>
                      <CardContent>
                        <Box sx={{
                          textAlign: 'center',
                          marginY: 2
                        }}>
                          <Radio
                            checked={true}
                            name="mode"
                            sx={{
                              padding: 1
                            }}
                          />
                          <h3 style={{
                            margin: '5px 0 10px 0',
                            cursor: 'pointer'
                          }}>
                            Normal
                          </h3>
                        </Box>
                        <Box>
                          <FormControlLabel
                            control={<Switch />}
                            label="Enable Back Button"
                          />

                          <FormControlLabel
                            control={<Switch />}
                            label="Enable Check Button"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{
                      height: '100%'
                    }}>
                      <CardContent>
                        <Box sx={{
                          textAlign: 'center',
                          marginY: 2
                        }}>
                          <Radio
                            name="mode"
                            sx={{
                              padding: 1
                            }}
                          />
                          <h3 style={{
                            margin: '5px 0 10px 0',
                            cursor: 'pointer'
                          }}>
                            Check And Continue
                          </h3>
                        </Box>
                        <Box>
                          <FormControlLabel
                            control={<Switch />}
                            label="Enable Check on Option Selected"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{
                      height: '100%'
                    }}>
                      <CardContent>
                        <Box sx={{
                          textAlign: 'center',
                          marginY: 2
                        }}>
                          <Radio
                            name="mode"
                            sx={{
                              padding: 1
                            }}
                          />
                          <h3 style={{
                            margin: '5px 0 10px 0',
                            cursor: 'pointer'
                          }}>
                            Question Below Each Other
                          </h3>
                        </Box>
                        <Box>
                          <h3>
                            Question per page
                          </h3>
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
                  <Grid item xs={12} sm={12}>
                    <Card sx={{
                      height: '100%'
                    }}>
                      <CardContent>
                        <Box sx={{
                          textAlign: 'center',
                          marginY: 2
                        }}>
                          <Radio
                            name="mode"
                            sx={{
                              padding: 1
                            }}
                          />
                          <h3 style={{
                            margin: '5px 0 5px 0',
                            cursor: 'pointer'
                          }}>
                            Advance mode
                          </h3>
                          <h5 style={{
                            margin: "5px 0",
                          }}>
                            (Quiz Option will only set as per the exam)
                          </h5>
                        </Box>
                        <Box sx={{
                          textAlign: 'center'
                        }}>
                          <FormControl>
                            <RadioGroup
                              row
                              name="advance_mode"
                            >
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
                              <FormControlLabel
                                value="advance panel"
                                control={<Radio />}
                                label="Advance Panel"
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

        {/* Fourth section contain quiz settings */}
        <Grid item xs={12} sm={12}>
          <Card1>
              <Box sx={{ width: "100%" }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList 
                        onChange={handleChange}
                        variant="scrollable"
                        allowScrollButtonsMobile
                        aria-label="scrollable prevent tabs example"
                      >
                        <Tab label="General" value="1" />
                        <Tab label="Question" value="2" />
                        <Tab label="Result" value="3" />
                        <Tab label="Notification" value="4" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <General />
                    </TabPanel>
                    <TabPanel value="2">
                      <Question />
                    </TabPanel>
                    <TabPanel value="3">
                      <Result />
                    </TabPanel>
                    <TabPanel value="4">
                      <Notification />
                    </TabPanel>
                </TabContext>
              </Box>
          </Card1>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Quiz;
