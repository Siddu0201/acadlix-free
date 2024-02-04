import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Card, Grid, Tab } from "@mui/material";
import React from "react";
import General from "../tabs/General";
import Question from "../tabs/Question";
import Result from "../tabs/Result";
import Notification from "../tabs/Notification";

const QuizSettingSection = (props) => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <Box sx={{ width: "100%" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
              <General
                {...props}
              />
            </TabPanel>
            <TabPanel value="2">
              <Question 
                {...props}
              />
            </TabPanel>
            <TabPanel value="3">
              <Result
                {...props}
              />
            </TabPanel>
            <TabPanel value="4">
              <Notification
                {...props}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </Card>
    </Grid>
  );
};

export default QuizSettingSection;
