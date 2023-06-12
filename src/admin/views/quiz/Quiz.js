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
} from "@mui/material";
import React from "react";
import BoxMain from "../../../components/BoxMain";
import GridItem1 from "../../../components/GridItem1";
import Card1 from "../../../components/Card1";
import PropTypes from "prop-types";
import General from "./General";
import Question from "./Question";
import Result from "./Result";
import Notification from "./Notification";
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
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const Quiz = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box>
      <Grid container>
        <GridItem1 lg={3} md={3} sm={3} xs={0}>
          <Card
            sx={{
              height: "100%",
            }}
          >
            <CardContent>Sidebar</CardContent>
          </Card>
        </GridItem1>
        <GridItem1 lg={9} md={9} sm={9} xs={12}>
          <FormControl sx={{ width: "100%" }}>
            <Card1 sx={{ padding: "10px" }}>
              <CardContent>
                <Autocomplete
                  sx={{ border: "none", float: "left", width: "250px" }}
                  disablePortal
                  id="combo-box-demo"
                  options={Categories}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Quiz Categories" />
                  )}
                />
                <Button
                  style={{ float: "right", margin: "5px" }}
                  variant="contained"
                  color="success"
                >
                  Load Template
                </Button>
                <Autocomplete
                  sx={{ float: "right", width: "250px", border: 0 }}
                  disablePortal
                  id="combo-box-demo"
                  options={templates}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Template" />
                  )}
                />
              </CardContent>
            </Card1>
            <Card1>
              <CardContent>
                <h3>Quiz Title</h3>
                <TextField fullWidth />
                <h3>Description</h3>
                <TextareaAutosize minRows={4} style={{ width: "100%" }} />
                <Button
                  style={{ margin: "5px" }}
                  variant="contained"
                  color="success"
                >
                  Add Quiz
                </Button>
              </CardContent>
            </Card1>
            <Card1>
              <CardHeader title="Mode"></CardHeader>
              <CardContent>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  <Grid sx={{ textAlign: "center", color: "black" }}>
                    <Grid container>
                      <GridItem1 lg={4}>
                        <FormControlLabel value="normal" control={<Radio />} />
                        <h3>Normal</h3>
                        <FormControlLabel
                          control={<Switch />}
                          label="Unable Back Button"
                        />

                        <FormControlLabel
                          control={<Switch />}
                          label="Unable Check Button"
                        />
                      </GridItem1>
                      <GridItem1 lg={4}>
                        <FormControlLabel
                          value="Check_and_continue"
                          control={<Radio />}
                        />
                        <h3>Check And Continue</h3>
                        <FormControlLabel
                          control={<Switch />}
                          label="Unable Check on Option Selected"
                        />
                      </GridItem1>
                      <GridItem1 lg={4}>
                        <FormControlLabel
                          value="question_below_each_other"
                          control={<Radio />}
                        />
                        <h3>Question Below Each Other</h3>
                        <FormControlLabel
                          control={<TextField type="number" />}
                          label="Questions per page"
                        />
                      </GridItem1>
                    </Grid>
                    <Grid container>
                      <GridItem1 lg={8}>
                        <h3>Indian Exam Mode</h3>

                        <h5>(Quiz Option will only set as per the exam)</h5>
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
                        <h3>Other</h3>
                        <TextField />
                      </GridItem1>
                      <GridItem1 lg={4}>
                        <FormControlLabel
                          value="advanced"
                          control={<Radio />}
                        />
                        <h3>Advanced Mode</h3>
                      </GridItem1>
                    </Grid>
                  </Grid>
                </RadioGroup>
              </CardContent>
            </Card1>
            <Card1>
              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="fullWidth"
                  >
                    <Tab label="General" {...a11yProps(0)} />
                    <Tab label="Question" {...a11yProps(1)} />
                    <Tab label="Result" {...a11yProps(2)} />
                    <Tab label="Notification" {...a11yProps(3)} />
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                  <General />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Question />
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <Result />
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <Notification />
                </TabPanel>
              </Box>
            </Card1>
          </FormControl>
        </GridItem1>
      </Grid>
    </Box>
  );
};

export default Quiz;
