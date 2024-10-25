import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  Typography,
} from "@mui/material";
import React from "react";

const PaymentMethod = (props) => {
  return (
    <Box>
      <Card>
        <CardHeader title="Select Payment Method" />
        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            {props?.watch("razorpay") &&
              props?.watch("razorpay_client_id") !== "" &&
              props?.watch("razorpay_secret_key") !== "" && (
                <Grid item xs={12} lg={12}>
                  <Card>
                    <CardContent
                      sx={{
                        paddingY: 2,
                        paddingX: 3,
                        ":last-child": {
                          paddingY: 2,
                          paddingX: 3,
                        },
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FormControlLabel
                        slotProps={{
                          typography: {
                            sx: {
                              fontWeight: "bold",
                              fontSize: "14px",
                            },
                          },
                        }}
                        label="Razorpay"
                        control={
                          <Radio
                            size="small"
                            name="payment_method"
                            checked={
                              props?.watch("payment_method") === "razorpay"
                            }
                            value="razorpay"
                            onClick={(e) => {
                              props?.setValue(
                                "payment_method",
                                e?.target?.value,
                                {
                                  shouldDirty: true,
                                }
                              );
                            }}
                          />
                        }
                      />
                    </CardContent>
                  </Card>
                </Grid>
              )}
            {props?.watch("paypal") &&
              props?.watch("paypal_client_id") !== "" &&
              props?.watch("paypal_secret_key") !== "" && (
                <Grid item xs={12} lg={12}>
                  <Card>
                    <CardContent
                      sx={{
                        paddingY: 2,
                        paddingX: 3,
                        ":last-child": {
                          paddingY: 2,
                          paddingX: 3,
                        },
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FormControlLabel
                        slotProps={{
                          typography: {
                            sx: {
                              fontWeight: "bold",
                              fontSize: "14px",
                            },
                          },
                        }}
                        label="Paypal"
                        control={
                          <Radio
                            size="small"
                            name="payment_method"
                            checked={
                              props?.watch("payment_method") === "paypal"
                            }
                            value="paypal"
                            onClick={(e) => {
                              props?.setValue(
                                "payment_method",
                                e?.target?.value,
                                {
                                  shouldDirty: true,
                                }
                              );
                            }}
                          />
                        }
                      />
                    </CardContent>
                  </Card>
                </Grid>
              )}
            {props?.watch("payu") &&
              props?.watch("acadlix_payu_merchant_key") !== "" &&
              props?.watch("payu_salt") !== "" && (
                <Grid item xs={12} lg={12}>
                  <Card>
                    <CardContent
                      sx={{
                        paddingY: 2,
                        paddingX: 3,
                        ":last-child": {
                          paddingY: 2,
                          paddingX: 3,
                        },
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FormControlLabel
                        slotProps={{
                          typography: {
                            sx: {
                              fontWeight: "bold",
                              fontSize: "14px",
                            },
                          },
                        }}
                        label="PayU"
                        control={
                          <Radio
                            size="small"
                            name="payment_method"
                            checked={
                              props?.watch("payment_method") === "payu"
                            }
                            value="payu"
                            onClick={(e) => {
                              props?.setValue(
                                "payment_method",
                                e?.target?.value,
                                {
                                  shouldDirty: true,
                                }
                              );
                            }}
                          />
                        }
                      />
                    </CardContent>
                  </Card>
                </Grid>
              )}
            {!props?.watch("razorpay") &&
              !props?.watch("paypal") &&
              !props?.watch("payu") && (
                <Grid item xs={12} lg={12}>
                  <Typography variant="body1">
                    No payment gatway is activated, contact admin.
                  </Typography>
                </Grid>
              )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentMethod;
