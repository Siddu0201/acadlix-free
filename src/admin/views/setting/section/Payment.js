import React from "react";
import { Box, FormControlLabel, Grid } from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";
import CustomSwitch from "../../../../components/CustomSwitch";

function Payment() {
  return (
    <Box sx={{ color: "black" }}>
      <h3>Payment Gateway</h3>
      <Grid container>
        <GridItem1 xs={12} lg={3}>
          <FormControlLabel control={<CustomSwitch />} label="RazorPay" />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type="text"
            label="RazorPay Key"
          />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type="text"
            label="RazorPay Salt"
          />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <FormControlLabel control={<CustomSwitch />} label="Sandbox" />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <FormControlLabel control={<CustomSwitch />} label="PayPal" />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type="text"
            label="PayPal Key"
          />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type="text"
            label="PayPal Salt"
          />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <FormControlLabel control={<CustomSwitch />} label="Sandbox" />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <FormControlLabel control={<CustomSwitch />} label="PayUMoney" />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type="text"
            label="PayUMoney Key"
          />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type="text"
            label="PayUMoney Salt"
          />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <FormControlLabel control={<CustomSwitch />} label="Sandbox" />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="Offline Payment Method"
          />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="Admin/Instructor Can Assign Courses To Student"
          />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="Admin/Instructor Can Remove Student From Course"
          />
        </GridItem1>
      </Grid>
    </Box>
  );
}

export default Payment;
