import React from "react";
import { Grid, Box, TextField, FormControlLabel, Switch } from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import Row from "../../../../components/Row";
function General() {
  return (
    <Box>
      <Grid container>
        <GridItem1 lg={6} sm={6}>
          <h4>Site Logo</h4>
          <FormControlLabel control={<TextField type="file" />} />
          <h4>Short Logo</h4>
          <FormControlLabel
            style={{ border: "none" }}
            control={<TextField type="file" />}
          />
          <h4>Date and Time Format</h4>
          
          <Row>
            <h4>Acadlix Registration</h4>
            <FormControlLabel
              style={{ marginLeft: "5px" }}
              control={<Switch />}
            />
          </Row>
          <Row>
            <h4>Items Per Page in Shop</h4>
            <FormControlLabel
              style={{ marginLeft: "5px" }}
              control={<TextField type="number" />}
            />
          </Row>
          <Row>
            <h4>One Click Checkout</h4>
            <FormControlLabel
              style={{ marginLeft: "5px" }}
              control={<Switch />}
            />
          </Row>
        </GridItem1>
        <GridItem1 lg={6} md={6}>
          <Row>
            <FormControlLabel
              style={{ marginLeft: "5px" }}
              control={<Switch />}
              label="Admin Auto Registration To Courses"
            />
          </Row>
          <Row>
            <h4>Remove Course/Quiz Limitations</h4>
            <FormControlLabel
              style={{ marginLeft: "5px" }}
              control={<Switch />}
            />
          </Row>
          <Row>
            <h4>Include In Report</h4>
            <FormControlLabel
              style={{ marginLeft: "5px" }}
              control={<Switch />}
            />
          </Row>
          <Row>
            <h4>Default Quiz Template</h4>
            <FormControlLabel
              style={{ marginLeft: "5px" }}
              control={<TextField />}
            />
          </Row>
          <Row>
            <h4>Default Question Template</h4>
            <FormControlLabel
              style={{ marginLeft: "5px" }}
              control={<TextField />}
            />
          </Row>
        </GridItem1>
      </Grid>
    </Box>
  );
}

export default General;
