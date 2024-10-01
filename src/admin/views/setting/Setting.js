import React from "react";
import {
  Tabs,
  Tab,
  Box,
  Grid,
  Card,
  CardContent,
  FormControl,
  Typography,
  Button,
} from "@mui/material";
import GridItem1 from "../../../components/GridItem1";
import Card1 from "../../../components/Card1";
import General from "./section/General";
import Payment from "./section/Payment";
import Notification from "./section/Notification";
import Personalization from "./section/Personalization";
import Registration from "./section/Registration";
import Translation from "./section/Translation";
import Tools from "./section/Tools";
import License from "./section/License";
import Certificate from "./section/Certificate";
import { TabContext, TabList, TabPanel } from "@mui/lab";


function Setting() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box>
      <Grid container rowSpacing={3} spacing={4} sx={{
        padding: 4
      }}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
            <Card1>
              <Box sx={{ width: "100%" }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      aria-label="scrollable prevent tabs example"
                    >
                      <Tab label="General" value="1" />
                      <Tab label="Payment" value="2" />
                      <Tab label="Notification" value="3" />
                      <Tab label="Personalization" value="4" />
                      <Tab label="Registration" value="5" />
                      <Tab label="Translation" value="6" />
                      <Tab label="Tools" value="7" />
                      <Tab label="License" value="8" />
                      <Tab label="Certificate" value="9" />
                    </TabList>
                  </Box>
                  <TabPanel value="1" >
                    <General />
                  </TabPanel>
                  <TabPanel value="2" >
                    <Payment />
                  </TabPanel>
                  <TabPanel value="3" >
                    <Notification />
                  </TabPanel>
                  <TabPanel value="4" >
                    <Personalization />
                  </TabPanel>
                  <TabPanel value="5" >
                    <Registration />
                  </TabPanel>
                  <TabPanel value="6" >
                    <Translation />
                  </TabPanel>
                  <TabPanel value="7" >
                    <Tools />
                  </TabPanel>
                  <TabPanel value="8" >
                    <License />
                  </TabPanel>
                  <TabPanel value="9" >
                    <Certificate />
                  </TabPanel>
                </TabContext>
              </Box>
            </Card1>
        </Grid>
      </Grid>
      <Button
        sx={{ float: "right", margin: "5px" }}
        variant="contained"
        color="success"
      >
        Save
      </Button>
    </Box>
  );
}

export default Setting;
