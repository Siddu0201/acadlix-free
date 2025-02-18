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
import { __ } from "@wordpress/i18n";

function Registration() {
  return (
    <Box sx={{ color: "black" }}>
      <Grid container>
        <GridItem1 xs={3} lg={3}>
          <Typography variant="body1">
            {__("Enable", "acadlix")}
          </Typography>
        </GridItem1>
        <GridItem1 xs={3} lg={3}>
          <Typography variant="body1">
            {__("Required", "acadlix")}
          </Typography>
        </GridItem1>
        <GridItem1 xs={6} lg={4}>
          <Typography variant="body1">
            {__("Label", "acadlix")}
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
            label={__("First name", "acadlix")}
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
            label={__("Last name", "acadlix")}
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
            label={__("Email ID", "acadlix")}
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
            label={__("Choose Username", "acadlix")}
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
            label={__("Mobile number", "acadlix")}
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
            label={__("Highest Qualification", "acadlix")}
          />
        </GridItem1>
      </Grid>
    </Box>
  );
}

export default Registration;
