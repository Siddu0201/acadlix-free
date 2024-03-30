import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Card, Grid, Tab } from "@mui/material";
import React from "react";
import General from "../tabs/General";
import Question from "../tabs/Question";
import Result from "../tabs/Result";
import Notification from "../tabs/Notification";
import Instruction from "../tabs/Instruction";

const QuizSettingSection = (props) => {

  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <Box sx={{ width: "100%" }}>
          <TabContext value={props?.watch("quiz_section") ?? "1"}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={(_, newValue) => {
                  props?.setValue("quiz_section", newValue, {shouldDirty: true});
                }}
                variant="scrollable"
                allowScrollButtonsMobile
                aria-label="scrollable prevent tabs example"
              >
                <Tab label="General" value="1" />
                <Tab label="Question" value="2" />
                <Tab label="Result" value="3" />
                <Tab label="Notification" value="4" />
                <Tab
                  label="Instruction"
                  value="5"
                  sx={{
                    display:
                      props?.watch("mode") === "advance_mode" ? "" : "none",
                  }}
                />
              </TabList>
            </Box>
            <TabPanel value="1">
              <General {...props} />
            </TabPanel>
            <TabPanel value="2">
              <Question {...props} />
            </TabPanel>
            <TabPanel value="3">
              <Result {...props} />
            </TabPanel>
            <TabPanel value="4">
              <Notification {...props} />
            </TabPanel>
            <TabPanel
              value="5"
              sx={{
                display: props?.watch("mode") === "advance_mode" ? "" : "none",
              }}
            >
              <Instruction {...props} />
            </TabPanel>
          </TabContext>
        </Box>
      </Card>
    </Grid>
  );
};

export default QuizSettingSection;
