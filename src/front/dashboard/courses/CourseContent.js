import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Tab,
  useMediaQuery,
  useTheme,
  AppBar,
  Drawer,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Announcments from "./courseTabs/Announcments";
import CourseOverview from "./courseTabs/CourseOverview";
import CourseSidebar from "./courseTabs/CourseSidebar";
import { FaAngleDown, FaArrowRight, FaTimes } from "react-icons/fa";

const CourseContent = () => {
  const theme = useTheme();
  const showDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const [open, setOpen] = useState(showDesktop ? true : false);
  const [scrollTop, setScrollTop] = useState(0);

  const [value, setValue] = useState(showDesktop ? '2' : '1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpen = () => {
    setOpen(curr => !curr);
    if(value === "1"){
      setValue("2");
    }
  }

  useEffect(() => {
    const handleScroll = (event) => {
      setScrollTop(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <Box>
      <Box>
        <AppBar
          position="static"
          sx={{
            height: 56,
          }}
        >
          {/* hello */}
        </AppBar>
      </Box>
      <Box>
        {/* Sidebar */}
        <Grid container>
          <Grid item xs={0} md={open ? 3 : 0}>
            <Card
              sx={{
                borderRadius: 0,
                height:
                  scrollTop > 56
                    ? "100%"
                    : `calc(100% - calc(56px - ${scrollTop}px))`,
                top: scrollTop > 56 ? 0 : `calc(56px - ${scrollTop}px)`,
                position: "fixed",
                zIndex: 1,
                width: {
                  xs: 0,
                  md: open ? "25%" : 0,
                },
              }}
            >
              <CardContent
                sx={{
                  padding: 0,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingY: 3,
                    paddingLeft: 5,
                    paddingRight: 3,
                    borderBottom: "1px solid #d1d7dc",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 19,
                        fontWeight: 600,
                      }}
                    >
                      Course content
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      cursor: "pointer",
                    }}
                    onClick={handleOpen}
                  >
                    <FaTimes />
                  </Box>
                </Box>
                <CourseSidebar />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={open ? 9 : 12}>
            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: open ? "none" : "flex",
                },
                position: "absolute",
                zIndex: 6,
                top: "5rem",
                left: 0,
                border: "1px solid #6a6f73",
                height: "2.5rem",
                paddingRight: 4,
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={handleOpen}
            >
              <FaArrowRight
                style={{
                  height: "1.5rem",
                  width: "1.5rem",
                }}
              />
            </Box>
            <Box
              sx={{
                minHeight: {
                  xs: "15rem",
                  sm: open ? "23rem" : "28rem",
                },
                maxHeight: {
                  xs: "15rem",
                  sm: open ? "23rem" : "28rem",
                },
                height: "100%",
                borderBottom: "1px solid #d1d7dc",
              }}
            >
              hello
            </Box>
            <Box sx={{
              paddingX: {
                xs: 0,
                sm: open ? 0 :'6%'
              }
            }}>
              <TabContext value={value}>
                <Box>
                    <TabList
                      onChange={handleChange}
                      variant="scrollable"
                      scrollButtons
                      allowScrollButtonsMobile
                    >
                      {!open &&
                        <Tab label="Course Content" value="1" />
                      }
                      <Tab label="Course Overview" value="2" />
                      <Tab label="Announcements" value="3" />
                    </TabList>
                </Box>
                <Box sx={{
                  paddingX: {
                    xs: 2,
                    sm: 9
                  }
                }}>
                  {!open &&
                    <TabPanel value="1">
                      <CourseSidebar />
                    </TabPanel>
                  }
                  <TabPanel value="2">
                    <CourseOverview />
                  </TabPanel>
                  <TabPanel value="3">
                    <Announcments />
                  </TabPanel>
                </Box>
              </TabContext>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CourseContent;
