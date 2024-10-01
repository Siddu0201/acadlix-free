import React from "react";
import { Grid, Box, FormControlLabel } from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import DatePicker from "react-datepicker";
import CustomTextField from "../../../../components/CustomTextField";
import CustomSwitch from "../../../../components/CustomSwitch";

function General() {
  return (
    <Box>
      <Grid container>
        <GridItem1 xs={12} sm={5} lg={5}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={12}>
              {/* Site logo */}
              <CustomTextField
                fullWidth
                size="small"
                type="file"
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              {/* Short logo */}
              <CustomTextField
                fullWidth
                size="small"
                type="file"
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <DatePicker 
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="End Date and time"
                showTimeSelect
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <FormControlLabel
                label="Acadlix Registration"
                control={<CustomSwitch />}
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <CustomTextField
                fullWidth
                size="small"
                type="number"
                label="Items Per Page in Shop"
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <FormControlLabel
                label="One Click Checkout"
                control={<CustomSwitch />}
              />
            </Grid>
          </Grid>
        </GridItem1>
        <GridItem1 xs={12} sm={1} lg={1}></GridItem1>
        <GridItem1 xs={12} sm={6} lg={5}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={12}>
              <FormControlLabel
                control={<CustomSwitch />}
                label="Admin Auto Registration To Courses"
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <FormControlLabel
                control={<CustomSwitch />}
                label="Remove Course/Quiz Limitations"
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <FormControlLabel
                control={<CustomSwitch />}
                label="Include In Report"
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <CustomTextField
                fullWidth
                size="small"
                type="type"
                label="Default Quiz Template"
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <CustomTextField
                fullWidth
                size="small"
                type="type"
                label="Default Question Template"
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <CustomTextField
                fullWidth
                size="small"
                type="type"
                label="Grade management"
              />
            </Grid>
          </Grid>
        </GridItem1>
      </Grid>
    </Box>
  );
}

export default General;
