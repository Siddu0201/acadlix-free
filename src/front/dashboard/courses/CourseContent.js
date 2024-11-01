import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Tab,
  useMediaQuery,
  useTheme,
  AppBar,
  Typography,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { FaAngleDown, FaArrowRight, FaTimes } from "react-icons/fa";
import CourseOverview from "./contentTabs/CourseOverview";
import Announcments from "./contentTabs/Announcments";
import CourseSidebar from "./contentTabs/CourseSidebar";

const CourseContent = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const [open, setOpen] = useState(isDesktop ? true : false);
  const [sidebarHeight, setSidebarHeight] = useState(0);

  const [value, setValue] = useState(isDesktop ? "2" : "1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpen = () => {
    setOpen((curr) => !curr);
    if (value === "1") {
      setValue("2");
    }
  };

  React.useLayoutEffect(() => {
    let total = window?.innerHeight;
    if (acadlixOptions?.is_admin_bar_showing) {
      total -= isDesktop ? 32 : 46;
    }
    setSidebarHeight(total);
  });

  console.log(open);

  return (
    <Box>
      <Box>
        {/* Sidebar */}
        <Grid container>
          <Grid
            item
            xs={0}
            sm={open ? 4 : 0}
            md={open ? 3 : 0}
            sx={{
              display: {
                xs: "none",
                sm: open ? "block" : "none",
              },
            }}
          >
            <Card
              sx={{
                borderRadius: 0,
                height: `${sidebarHeight}px`,
              }}
            >
              <CardContent
                sx={{
                  padding: 0,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
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
                <Box
                  sx={{
                    overflowY: "scroll",
                  }}
                >
                  <CourseSidebar />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={open ? 8 : 12} md={open ? 9 : 12}>
            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: open ? "none" : "flex",
                },
                position: "absolute",
                zIndex: 6,
                top: "45%",
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingY: 3,
                  paddingLeft: 5,
                  paddingRight: 3,
                  borderBottom: "1px solid #d1d7dc",
                  backgroundColor: (theme) => theme.palette?.primary?.main,
                  color: (theme) => theme?.palette?.primary?.contrastText,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 19,
                    fontWeight: 600,
                  }}
                >
                  Lesson name
                </Typography>
              </Box>
              <Box>
                hello
              </Box>
            </Box>
            <Box
              sx={{
                paddingX: {
                  xs: 0,
                  sm: open ? 0 : "6%",
                },
              }}
            >
              <TabContext value={value}>
                <Box>
                  <TabList
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                  >
                    {!open && <Tab label="Course Content" value="1" />}
                    <Tab label="Course Overview" value="2" />
                    <Tab label="Announcements" value="3" />
                  </TabList>
                </Box>
                <Box
                  sx={{
                    paddingX: {
                      xs: 2,
                      sm: 9,
                    },
                  }}
                >
                  {!open && (
                    <TabPanel value="1">
                      <CourseSidebar />
                    </TabPanel>
                  )}
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
