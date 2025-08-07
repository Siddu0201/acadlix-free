import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import { __ } from "@wordpress/i18n";

const PaymentMethod = (props) => {
  const useActivePaymentGateways = (props) => {
    const gateways = {
      razorpay: ["razorpay_client_id", "razorpay_secret_key"],
      paypal: ["paypal_client_id", "paypal_secret_key"],
      payu: ["payu_merchant_key", "payu_salt"],
    };

    return React.useMemo(() => {
      let activeGateways = 0;
      let activeGatewayName = "";
      Object.keys(gateways).forEach((gateway) => {
        if (props.watch(gateway) && gateways[gateway].every(key => props.watch(key))) {
          activeGateways++;
          activeGatewayName = gateway;
        }
      });
      return { activeGateways, activeGatewayName };
    }, []);
  };

  const { activeGateways, activeGatewayName } = useActivePaymentGateways(props);

  React.useEffect(() => {
    if (activeGateways === 1) {
      props.setValue("payment_method", activeGatewayName, { shouldDirty: true });
    }
  }, [activeGateways]);
  return (
    <Box>
      <Card>
        <CardHeader title={__("Payment Method", "acadlix")} />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            {props?.watch("razorpay") &&
              props?.watch("razorpay_client_id") &&
              props?.watch("razorpay_secret_key") && (
                <Grid size={{ xs: 12, lg: 12 }}>
                  <Card>
                    <CardContent
                      sx={{
                        paddingY: 1,
                        paddingX: 3,
                        ":last-child": {
                          paddingY: 1,
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
                        sx={{
                          width: "100%"
                        }}
                        label={__('Razorpay', 'acadlix')}
                        disabled={!props?.watch("is_user_logged_in")}
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
              props?.watch("paypal_client_id") &&
              props?.watch("paypal_secret_key") && (
                <Grid size={{ xs: 12, lg: 12 }}>
                  <Card>
                    <CardContent
                      sx={{
                        paddingY: 1,
                        paddingX: 3,
                        ":last-child": {
                          paddingY: 1,
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
                        sx={{
                          width: "100%"
                        }}
                        label={__('Paypal', 'acadlix')}
                        disabled={!props?.watch("is_user_logged_in")}
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
              props?.watch("payu_merchant_key") &&
              props?.watch("payu_salt") && (
                <Grid size={{ xs: 12, lg: 12 }}>
                  <Card>
                    <CardContent
                      sx={{
                        paddingY: 1,
                        paddingX: 3,
                        ":last-child": {
                          paddingY: 1,
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
                        sx={{
                          width: "100%"
                        }}
                        label={__("PayU", "acadlix")}
                        disabled={!props?.watch("is_user_logged_in")}
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
                <Grid size={{ xs: 12, lg: 12 }}>
                  <Typography variant="body1">
                    {__("No payment gatway is activated, contact admin.", "acadlix")}
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
