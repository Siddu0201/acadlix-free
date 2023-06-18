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
import PropTypes from "prop-types";
import General from "./General";
import Payment from "./Payment";
import Notification from "./Notification";
import Personalization from "./Personalization";
import Registration from "./Registration";
import Translation from "./Translation";
import Tools from "./Tools";
import License from "./License";
import Certificate from "./Certificate";

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
function Configuration() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
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
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      <Tab label="General" {...a11yProps(0)} />
                      <Tab label="Payment" {...a11yProps(1)} />
                      <Tab label="Notification" {...a11yProps(2)} />
                      <Tab label="Personalization" {...a11yProps(3)} />
                      <Tab label="Registration" {...a11yProps(4)} />
                      <Tab label="Translation" {...a11yProps(5)} />
                      <Tab label="Tools" {...a11yProps(6)} />
                      <Tab label="License" {...a11yProps(7)} />
                      <Tab label="Certificate" {...a11yProps(8)} />
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0}>
                    <General />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <Payment />
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <Notification />
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    <Personalization />
                  </TabPanel>
                  <TabPanel value={value} index={4}>
                    <Registration />
                  </TabPanel>
                  <TabPanel value={value} index={5}>
                    <Translation />
                  </TabPanel>
                  <TabPanel value={value} index={6}>
                    <Tools />
                  </TabPanel>
                  <TabPanel value={value} index={7}>
                    <License />
                  </TabPanel>
                  <TabPanel value={value} index={8}>
                    <Certificate />
                  </TabPanel>
                </Box>
              </Card1>
            </FormControl>
          </GridItem1>
        </Grid>
        <Button
          sx={{ float: "right", margin: "5px" }}
          variant="contained"
          color="success"
        >
          Save
        </Button>
      </Box>
    </div>
  );
}

export default Configuration;
