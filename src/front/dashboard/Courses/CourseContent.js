import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import GridItem1 from "../../../components/GridItem1";
import Notes from "./ContentTabs/Notes";
import Announcments from "./ContentTabs/Announcments";
import Discussion from "./ContentTabs/Discussion";
import CourseOverview from "./ContentTabs/CourseOverview";
import Sidebar from "./ContentTabs/Sidebar";
const CourseContent = () => {
  const theme = useTheme();
  const showSidebar = useMediaQuery(theme.breakpoints.up("sm"));

  const [value, setValue] = showSidebar
    ? React.useState("2")
    : React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <Box>
        <Grid container>
          {showSidebar && (
            <GridItem1 lg={3} md={3} sm={12} xs={12}>
              <Card sx={{ minHeight: "100%" }}>
                <CardHeader title="Course Content"></CardHeader>
                <CardContent>
                  <Sidebar />
                </CardContent>
              </Card>
            </GridItem1>
          )}
          <GridItem1 lg={9} md={9} sm={12} xs={12}>
            <Card style={{ marginRight: "10px" }}>
              <iframe
                src="https://www.youtube.com/embed/tgbNymZ7vqY?playlist=tgbNymZ7vqY&loop=1"
                width="100%"
                height="150%"
              ></iframe>
            </Card>
            <TabContext value={value}>
              <Box>
                {showSidebar && (
                  <TabList onChange={handleChange} variant="fullWidth">
                    <Tab label="Notes" value="2" />
                    <Tab label="Course Overview" value="3" />
                    <Tab label="Announcements" value="4" />
                    <Tab label="Discussion" value="5" />
                  </TabList>
                )}

                {!showSidebar && (
                  <TabList
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                  >
                    <Tab label="Course Content" value="1" />
                    <Tab label="Notes" value="2" />
                    <Tab label="Course Overview" value="3" />
                    <Tab label="Announcements" value="4" />
                    <Tab label="Discussion" value="5" />
                  </TabList>
                )}
              </Box>
              <TabPanel value="1">
                <Sidebar />
              </TabPanel>
              <TabPanel value="2">
                <Notes />
              </TabPanel>
              <TabPanel value="3">
                <CourseOverview />
              </TabPanel>
              <TabPanel value="4">
                <Announcments />
              </TabPanel>
              <TabPanel value="5">
                <Discussion />
              </TabPanel>
            </TabContext>
          </GridItem1>
        </Grid>
      </Box>
    </div>
  );
};

export default CourseContent;
