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
  const useActivePaymentGateways = () => {
    const gateways = {
      razorpay: acadlixOptions?.is_razorpay_active,
      paypal: acadlixOptions?.is_paypal_active,
      payu: acadlixOptions?.is_payu_active,
      stripe: acadlixOptions?.is_stripe_active,
    };

    return React.useMemo(() => {
      let activeGateways = 0;
      let activeGatewayName = "";
      Object.keys(gateways).forEach((gateway) => {
        if (gateways[gateway]) {
          activeGateways++;
          activeGatewayName = gateway;
        }
      });
      return { activeGateways, activeGatewayName };
    }, []);
  };

  const { activeGateways, activeGatewayName } = useActivePaymentGateways();

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
            {acadlixOptions?.is_razorpay_active && (
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
            {acadlixOptions?.is_paypal_active && (
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
            {acadlixOptions?.is_payu_active && (
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
            {acadlixOptions?.is_stripe_active && (
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
                        label={__("Stripe", "acadlix")}
                        disabled={!props?.watch("is_user_logged_in")}
                        control={
                          <Radio
                            size="small"
                            name="payment_method"
                            checked={
                              props?.watch("payment_method") === "stripe"
                            }
                            value="stripe"
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
            {!acadlixOptions?.is_razorpay_active &&
              !acadlixOptions?.is_paypal_active &&
              !acadlixOptions?.is_payu_active &&
              !acadlixOptions?.is_stripe_active &&
               (
                <Grid size={{ xs: 12, lg: 12 }}>
                  <Typography variant="body1">
                    {__("No payment gateway is activated, contact admin.", "acadlix")}
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
