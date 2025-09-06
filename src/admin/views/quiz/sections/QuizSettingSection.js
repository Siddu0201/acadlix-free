import { Box, Card, CardContent, Tab, Tabs } from "@mui/material";
import Grid from '@mui/material/Grid';
import React, { useEffect, useRef, useState } from "react";
import General from "../tabs/General";
import Question from "../tabs/Question";
import Result from "../tabs/Result";
import Notification from "../tabs/Notification";
import Instruction from "../tabs/Instruction";
import { __ } from "@wordpress/i18n";

const QuizSettingSection = (props) => {
  const [activeTab, setActiveTab] = useState(0);
  const sectionsRef = useRef([]);

  const sectionIds = [
    { id: "GENERAL", label: __("GENERAL", "acadlix") }, 
    { id: "QUESTION", label: __("QUESTION", "acadlix") }, 
    { id: "RESULT", label: __("RESULT", "acadlix") }, 
    { id: "NOTIFICATION", label: __("NOTIFICATION", "acadlix") }, 
    { id: "INSTRUCTION", label: __("INSTRUCTION", "acadlix") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Update active tab on scroll
      sectionsRef.current.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveTab(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    const section = sectionsRef.current[newValue];
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 60, // Adjust for sticky tab bar height
        behavior: "smooth",
      });
    }
  };

  return (
    <Grid size={{ xs: 12, sm: 12 }}>
      <Box
        sx={{
          position: "sticky",
          top: {
            xs: 0,
            sm: 46,
            md: 32,
          },
          zIndex: 1000,
          backgroundColor: "white",
          borderBottom: "1px solid #ddd",
          borderRadius: "4px",
        }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {sectionIds.map((id, index) => (
            <Tab
              key={id?.id}
              label={id?.label}
              sx={{
                display:
                  index === 4 && props?.watch("meta.mode") !== "advance_mode" ? "none" : "",
              }}
            />
          ))}
        </Tabs>
      </Box>
      {/* Sections */}
      {sectionIds.map((id, index) => (
        <Card
          key={id?.id}
          id={id?.id}
          ref={(el) => (sectionsRef.current[index] = el)}
          sx={{
            marginY: 3,
            display:
              index === 4 && props?.watch("meta.mode") !== "advance_mode" ? "none" : "",
          }}
        >
          <CardContent>
            {id?.id === "GENERAL" && <General {...props} />}
            {id?.id === "QUESTION" && <Question {...props} />}
            {id?.id === "RESULT" && <Result {...props} />}
            {id?.id === "NOTIFICATION" && <Notification {...props} />}
            {id?.id === "INSTRUCTION" && <Instruction {...props} />}
          </CardContent>
        </Card>
      ))}
      {/* <Card>
        <Box sx={{ width: "100%" }}>

          <TabContext value={props?.watch("quiz_section") ?? "1"}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={(_, newValue) => {
                  props?.setValue("quiz_section", newValue, { shouldDirty: true });
                }}
                variant="scrollable"
                allowScrollButtonsMobile
                aria-label="scrollable prevent tabs example"
              >
                <Tab label="General" value="1" />
                <Tab label="Question" value="2" />
                <Tab label="Result" value="3" />
                <Tab label="Notification" value="4" />
                <Tab label="Language" value="5" />
                <Tab
                  label="Instruction"
                  value="6"
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
            <TabPanel value="5">
              <Language {...props} />
            </TabPanel>
            <TabPanel
              value="6"
              sx={{
                display: props?.watch("mode") === "advance_mode" ? "" : "none",
              }}
            >
              <Instruction {...props} />
            </TabPanel>
          </TabContext>
        </Box>
      </Card> */}
    </Grid>
  );
};

export default QuizSettingSection;
