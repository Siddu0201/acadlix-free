import React from "react";
import { Box, FormControlLabel, Switch, Grid } from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";

function Payment() {
  return (
      <Box sx={{ color: "black" }}>
        <h3>Payment Gateway</h3>
        <Grid container>
          <GridItem1 xs={12} lg={3}>
            <FormControlLabel control={<Switch />} label="RazorPay" />
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
            <FormControlLabel control={<Switch />} label="Sandbox" />
          </GridItem1>
          <GridItem1 xs={12} lg={3}>
            <FormControlLabel control={<Switch />} label="PayPal" />
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
            <FormControlLabel control={<Switch />} label="Sandbox" />
          </GridItem1>
          <GridItem1 xs={12} lg={3}>
            <FormControlLabel control={<Switch />} label="PayPalUMoney" />
          </GridItem1>
          <GridItem1 xs={12} lg={3}>
            <CustomTextField
              fullWidth
              size="small"
              type="text"
              label="PayPalUMoney Key"
            />
          </GridItem1>
          <GridItem1 xs={12} lg={3}>
            <CustomTextField
              fullWidth
              size="small"
              type="text"
              label="PayPalUMoney Salt"
            />
          </GridItem1>
          <GridItem1 xs={12} lg={3}>
            <FormControlLabel control={<Switch />} label="Sandbox" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Offline Payment Method" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Admin/Instructor Can Assign Courses To Student" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Admin/Instructor Can Remove Student From Course" />
          </GridItem1>
        </Grid>
        
      </Box>
  );
}

export default Payment;
