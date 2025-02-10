import React from "react";
import {
  Box,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";
import CustomSwitch from "../../../../components/CustomSwitch";
import { useForm } from "react-hook-form";
import { MdVisibility, MdVisibilityOff } from "../../../../helpers/icons";

function Payment(props) {
  const methods = useForm({
    defaultValues: {
      showRazorpayClientID: false,
      showRazorpaySecretKey: false,
      showPaypalClientID: false,
      showPaypalSecretKey: false,
      showPayuMerchentKey: false,
      showPayuSalt: false,
    }
  });

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
            type={methods?.watch("showRazorpayClientID") ? "text" : "password"}
            label="RazorPay Client ID"
            value={props?.watch("acadlix_razorpay_client_id")}
            onChange={(e) => {
              props?.setValue("acadlix_razorpay_client_id", e?.target?.value, {
                shouldDirty: true,
              });
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => methods?.setValue("showRazorpayClientID", !methods?.watch("showRazorpayClientID"))}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseUp={(e) => e?.preventDefault()}
                    edge="end"
                    sx={{
                      boxShadow: "none",
                    }}
                  >
                    {methods?.watch("showRazorpayClientID") ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type={methods?.watch("showRazorpaySecretKey") ? "text" : "password"}
            label="RazorPay Secret Key"
            value={props?.watch("acadlix_razorpay_secret_key")}
            onChange={(e) => {
              props?.setValue("acadlix_razorpay_secret_key", e?.target?.value, {
                shouldDirty: true,
              });
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => methods?.setValue("showRazorpaySecretKey", !methods?.watch("showRazorpaySecretKey"))}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseUp={(e) => e?.preventDefault()}
                    edge="end"
                    sx={{
                      boxShadow: "none",
                    }}
                  >
                    {methods?.watch("showRazorpaySecretKey") ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                </InputAdornment>
              ),
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
            type={methods?.watch("showPaypalClientID") ? "text" : "password"}
            label="PayPal Client ID"
            value={props?.watch("acadlix_paypal_client_id")}
            onChange={(e) => {
              props?.setValue("acadlix_paypal_client_id", e?.target?.value, {
                shouldDirty: true,
              });
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => methods?.setValue("showPaypalClientID", !methods?.watch("showPaypalClientID"))}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseUp={(e) => e?.preventDefault()}
                    edge="end"
                    sx={{
                      boxShadow: "none",
                    }}
                  >
                    {methods?.watch("showPaypalClientID") ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type={methods?.watch("showPaypalSecretKey") ? "text" : "password"}
            label="PayPal Secret Key"
            value={props?.watch("acadlix_paypal_secret_key")}
            onChange={(e) => {
              props?.setValue("acadlix_paypal_secret_key", e?.target?.value, {
                shouldDirty: true,
              });
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => methods?.setValue("showPaypalSecretKey", !methods?.watch("showPaypalSecretKey"))}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseUp={(e) => e?.preventDefault()}
                    edge="end"
                    sx={{
                      boxShadow: "none",
                    }}
                  >
                    {methods?.watch("showPaypalSecretKey") ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                </InputAdornment>
              ),
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
            type={methods?.watch("showPayuMerchentKey") ? "text" : "password"}
            label="PayU Merchant Key"
            value={props?.watch("acadlix_payu_merchant_key")}
            onChange={(e) => {
              props?.setValue("acadlix_payu_merchant_key", e?.target?.value, {
                shouldDirty: true,
              });
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => methods?.setValue("showPayuMerchentKey", !methods?.watch("showPayuMerchentKey"))}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseUp={(e) => e?.preventDefault()}
                    edge="end"
                    sx={{
                      boxShadow: "none",
                    }}
                  >
                    {methods?.watch("showPayuMerchentKey") ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type={methods?.watch("showPayuSalt") ? "text" : "password"}
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => methods?.setValue("showPayuSalt", !methods?.watch("showPayuSalt"))}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseUp={(e) => e?.preventDefault()}
                    edge="end"
                    sx={{
                      boxShadow: "none",
                    }}
                  >
                    {methods?.watch("showPayuSalt") ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                </InputAdornment>
              ),
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
        {/* <Grid item xs={12} lg={4}>
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
        </Grid> */}
      </Grid>
    </Box>
  );
}

export default Payment;
