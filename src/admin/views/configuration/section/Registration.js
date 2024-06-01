import React from "react";
import {
  Box,
  Grid,
  FormControlLabel,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";
import CustomSwitch from "../../../../components/CustomSwitch";

function Registration() {
  return (
    <Box sx={{ color: "black" }}>
      <Grid container>
        <GridItem1 xs={3} lg={3}>
          <Typography variant="body1">
            Enable
          </Typography>
        </GridItem1>
        <GridItem1 xs={3} lg={3}>
          <Typography variant="body1">
            Required
          </Typography>
        </GridItem1>
        <GridItem1 xs={6} lg={4}>
          <Typography variant="body1">
            Label
          </Typography>
        </GridItem1>
        <GridItem1 xs={3} lg={3}>
          <FormControlLabel control={<CustomSwitch />} />
        </GridItem1>
        <GridItem1 xs={3} lg={3}>
          <FormControlLabel control={<CustomSwitch />} />
        </GridItem1>
        <GridItem1 xs={6} lg={4}>
          <CustomTextField
            fullWidth
            size="small"
            label="First name"
          />
        </GridItem1>
        <GridItem1 xs={3} lg={3}>
          <FormControlLabel control={<CustomSwitch />} />
        </GridItem1>
        <GridItem1 xs={3} lg={3}>
          <FormControlLabel control={<CustomSwitch />} />
        </GridItem1>
        <GridItem1 xs={6} lg={4}>
          <CustomTextField
            fullWidth
            size="small"
            label="Last name"
          />
        </GridItem1>
        <GridItem1 xs={3} lg={3}>
          <FormControlLabel control={<CustomSwitch />} />
        </GridItem1>
        <GridItem1 xs={3} lg={3}>
          <FormControlLabel control={<CustomSwitch />} />
        </GridItem1>
        <GridItem1 xs={6} lg={4}>
          <CustomTextField
            fullWidth
            size="small"
            label="Email ID"
          />
        </GridItem1>
        <GridItem1 xs={3} lg={3}>
          <FormControlLabel control={<CustomSwitch />} />
        </GridItem1>
        <GridItem1 xs={3} lg={3}>
          <FormControlLabel control={<CustomSwitch />} />
        </GridItem1>
        <GridItem1 xs={6} lg={4}>
          <CustomTextField
            fullWidth
            size="small"
            label="Choose Username"
          />
        </GridItem1>
        <GridItem1 xs={3} lg={3}>
          <FormControlLabel control={<CustomSwitch />} />
        </GridItem1>
        <GridItem1 xs={3} lg={3}>
          <FormControlLabel control={<CustomSwitch />} />
        </GridItem1>
        <GridItem1 xs={6} lg={4}>
          <CustomTextField
            fullWidth
            size="small"
            label="Mobile number"
          />
        </GridItem1>
        <GridItem1 xs={3} lg={3}>
          <FormControlLabel control={<CustomSwitch />} />
        </GridItem1>
        <GridItem1 xs={3} lg={3}>
          <FormControlLabel control={<CustomSwitch />} />
        </GridItem1>
        <GridItem1 xs={6} lg={4}>
          <CustomTextField
            fullWidth
            size="small"
            label="Highest Qualification"
          />
        </GridItem1>
      </Grid>
    </Box>
  );
}

export default Registration;
