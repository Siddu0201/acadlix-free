import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";

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
        <CardHeader title="Order Summary" />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            {props?.isFetching ? (
              <Grid
                item
                xs={12}
                md={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Grid>
            ) : (
              <>
                <Grid item xs={12} lg={12}>
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
                      Price:
                    </Typography>
                    <Typography variant="body2">
                      {props?.currencyPosition(
                        props
                          ?.watch("order_items")
                          ?.reduce((total, c) => total + c?.price, 0)
                      )}
                    </Typography>
                  </Box>
                  <Divider />
                </Grid>
                {/* <Grid item xs={12} lg={12}>
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
                      Discount:
                    </Typography>
                    <Typography variant="body2">
                      {props?.currencyPosition(
                        props
                          ?.watch("order_items")
                          ?.reduce((total, c) => total + c?.discount, 0)
                      )}
                    </Typography>
                  </Box>
                  <Divider />
                </Grid> */}
                <Grid item xs={12} lg={12}>
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
                      Tax:
                    </Typography>
                    <Typography variant="body2">
                      {props?.currencyPosition(
                        props
                          ?.watch("order_items")
                          ?.reduce((total, c) => total + c?.tax, 0)
                      )}
                    </Typography>
                  </Box>
                  <Divider />
                </Grid>
                <Grid item xs={12} lg={12}>
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
                      Total:
                    </Typography>
                    <Typography variant="body2">
                      {props?.currencyPosition(
                        props
                          ?.watch("order_items")
                          ?.reduce((total, c) => total + c?.price_after_tax, 0)
                      )}
                    </Typography>
                  </Box>
                  <Divider />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <Button
                    color="success"
                    variant="contained"
                    fullWidth
                    onClick={props?.handleSubmit(props?.handleCheckout)}
                    disabled={
                      props?.watch("cart")?.length === 0 ||
                      !is_payment_gateway_active()
                    }
                  >
                    {props?.watch("is_checkout_loading") ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      "Checkout"
                    )}
                  </Button>
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
