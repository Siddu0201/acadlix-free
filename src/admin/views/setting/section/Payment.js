import React from "react";
import {
  Box,
  Divider,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";
import CustomSwitch from "../../../../components/CustomSwitch";

function Payment(props) {
  return (
    <Box sx={{ color: "black" }}>
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">Payment Gateway</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={4}
        sx={{
          alignItems: "center",
        }}
      >
        <Grid item xs={12} lg={3}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="RazorPay"
            value="yes"
            checked={props?.watch("acadlix_razorpay_active") === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue("acadlix_razorpay_active", e?.target?.checked ? e?.target?.value : "no", {
                  shouldDirty: true,
                });
              }
            }}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type="text"
            label="RazorPay Client ID"
            value={props?.watch("acadlix_razorpay_client_id")}
            onChange={(e) => {
              props?.setValue("acadlix_razorpay_client_id", e?.target?.value, {
                shouldDirty: true,
              });
            }}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type="text"
            label="RazorPay Secret Key"
            value={props?.watch("acadlix_razorpay_secret_key")}
            onChange={(e) => {
              props?.setValue("acadlix_razorpay_secret_key", e?.target?.value, {
                shouldDirty: true,
              });
            }}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
        </Grid>
        <Grid item xs={12} lg={3}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="PayPal"
            value="yes"
            checked={props?.watch("acadlix_paypal_active") === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue("acadlix_paypal_active", e?.target?.checked ? e?.target?.value : "no", {
                  shouldDirty: true,
                });
              }
            }}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type="text"
            label="PayPal Client ID"
            value={props?.watch("acadlix_paypal_client_id")}
            onChange={(e) => {
              props?.setValue("acadlix_paypal_client_id", e?.target?.value, {
                shouldDirty: true,
              });
            }}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type="text"
            label="PayPal Secret Key"
            value={props?.watch("acadlix_paypal_secret_key")}
            onChange={(e) => {
              props?.setValue("acadlix_paypal_secret_key", e?.target?.value, {
                shouldDirty: true,
              });
            }}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="Sandbox"
            value="yes"
            checked={props?.watch("acadlix_paypal_sandbox") === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue("acadlix_paypal_sandbox", e?.target?.checked ? e?.target?.value : "no", {
                  shouldDirty: true,
                });
              }
            }}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="PayU"
            value="yes"
            checked={props?.watch("acadlix_payu_active") === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue(
                  "acadlix_payu_active",
                  e?.target?.checked ? e?.target?.value : "no",
                  {
                    shouldDirty: true,
                  }
                );
              }
            }}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type="text"
            label="PayU Merchant Key"
            value={props?.watch("acadlix_payu_merchant_key")}
            onChange={(e) => {
              props?.setValue("acadlix_payu_merchant_key", e?.target?.value, {
                shouldDirty: true,
              });
            }}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type="text"
            label="PayU Salt"
            value={props?.watch("acadlix_payu_salt")}
            onChange={(e) => {
              props?.setValue(
                "acadlix_payu_salt",
                e?.target?.value,
                {
                  shouldDirty: true,
                }
              );
            }}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="Sandbox"
            value="yes"
            checked={props?.watch("acadlix_payu_sandbox") === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue(
                  "acadlix_payu_sandbox",
                  e?.target?.checked ? e?.target?.value : "no",
                  {
                    shouldDirty: true,
                  }
                );
              }
            }}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="Offline Payment Method"
            value="yes"
            checked={props?.watch("acadlix_offline_payment") === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue(
                  "acadlix_offline_payment",
                  e?.target?.checked ? e?.target?.value : "no",
                  {
                    shouldDirty: true,
                  }
                );
              }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Payment;
