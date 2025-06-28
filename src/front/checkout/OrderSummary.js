import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import { __ } from "@wordpress/i18n";
import { currencyPosition } from "@acadlix/helpers/util";

const OrderSummary = (props) => {
  const is_payment_gateway_active = () => {
    if (
      props?.watch("razorpay") ||
      props?.watch("paypal") ||
      props?.watch("payumoney")
    ) {
      return true;
    }

    return false;
  };

  return (
    <Box>
      <Card>
        <CardHeader title={__('Order Summary', 'acadlix')} />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            {props?.isFetching ? (
              <Grid size={{ xs: 12, sm: 12, lg: 12 }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Grid>
            ) : (
              <>
                <Grid size={{ xs: 12, lg: 12 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      {__('Price:', 'acadlix')}
                    </Typography>
                    <Typography variant="body2">
                      {currencyPosition(
                        props
                          ?.watch("order_items")
                          ?.reduce((total, c) => total + c?.price, 0)
                      )}
                    </Typography>
                  </Box>
                  <Divider />
                </Grid>
                {/* <Grid size={{  xs: 12 ,  lg: 12  }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      {__('Discount:', 'acadlix')}
                    </Typography>
                    <Typography variant="body2">
                      {currencyPosition(
                        props
                          ?.watch("order_items")
                          ?.reduce((total, c) => total + c?.discount, 0)
                      )}
                    </Typography>
                  </Box>
                  <Divider />
                </Grid> */}
                <Grid size={{ xs: 12, lg: 12 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      {__('Tax:', 'acadlix')}
                    </Typography>
                    <Typography variant="body2">
                      {currencyPosition(
                        props
                          ?.watch("order_items")
                          ?.reduce((total, c) => total + c?.tax, 0)
                      )}
                    </Typography>
                  </Box>
                  <Divider />
                </Grid>
                <Grid size={{ xs: 12, lg: 12 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      {__('Total:', 'acadlix')}
                    </Typography>
                    <Typography variant="body2">
                      {currencyPosition(
                        props
                          ?.watch("order_items")
                          ?.reduce((total, c) => total + c?.price_after_tax, 0)
                      )}
                    </Typography>
                  </Box>
                  <Divider />
                </Grid>
                <Grid size={{ xs: 12, lg: 12 }}>
                  <LoadingButton
                    color="success"
                    variant="contained"
                    fullWidth
                    loading={props?.watch("is_checkout_loading")}
                    onClick={props?.handleSubmit(props?.handleCheckout)}
                    disabled={
                      props?.watch("cart")?.length === 0 ||
                      !is_payment_gateway_active() ||
                      !props?.watch("is_user_logged_in") ||
                      props?.watch("is_checkout_locked")
                    }
                  >
                    {__('Checkout', 'acadlix')}
                  </LoadingButton>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderSummary;
