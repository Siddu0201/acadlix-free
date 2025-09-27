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
import Grid from '@mui/material/Grid';
import React from "react";
import { __ } from "@wordpress/i18n";
import { currencyPosition } from "@acadlix/helpers/util";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";

const OrderSummary = (props) => {
  const is_payment_gateway_active = () => {
    if (
      acadlixCheckoutOptions?.is_razorpay_active ||
      acadlixCheckoutOptions?.is_paypal_active ||
      acadlixCheckoutOptions?.is_payu_active ||
      acadlixCheckoutOptions?.is_stripe_active
    ) {
      return true;
    }

    return false;
  };

  const defaultSetting = {
    component: "Box",
    component_name: "checkout_order_summary_box",
    children: [
      {
        component: "Card",
        component_name: "checkout_order_summary_card",
        children: [
          {
            component: "CardHeader",
            component_name: "checkout_order_summary_card_header",
            props: {
              title: __('Order Summary', 'acadlix')
            }
          },
          {
            component: "Divider",
            component_name: "checkout_order_summary_divider",
          },
          {
            component: "CardContent",
            component_name: "checkout_order_summary_card_content",
            children: [
              {
                component: "Grid",
                component_name: "checkout_order_summary_card_content_grid_container",
                props: {
                  container: true,
                  spacing: 2,
                },
                children: [
                  props?.isFetching ? ({
                    component: "Grid",
                    component_name: "checkout_order_summary_card_content_fetching_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        sm: 12,
                        lg: 12,
                      },
                      sx: {
                        display: "flex",
                        justifyContent: "center",
                      },
                    },
                    children: [
                      {
                        component: "CircularProgress",
                        component_name: "checkout_order_summary_card_content_fetching_circular_progress",
                      },
                    ],
                  }) : ({
                    component: "Fragment",
                    component_name: "checkout_order_summary_card_content_fragment",
                    children: [
                      {
                        component: "Grid",
                        component_name: "checkout_order_summary_price_grid_item",
                        props: {
                          size: {
                            xs: 12,
                            lg: 12,
                          },
                        },
                        children: [
                          {
                            component: "Box",
                            component_name: "checkout_order_summary_price_box",
                            props: {
                              sx: {
                                display: "flex",
                                justifyContent: "space-between",
                                paddingBottom: 2,
                              },
                            },
                            children: [
                              {
                                component: "Typography",
                                component_name: "checkout_order_summary_price_label_typography",
                                props: {
                                  variant: "body1",
                                  sx: {
                                    fontWeight: "bold",
                                  },
                                },
                                value: __('Price:', 'acadlix')
                              },
                              {
                                component: "Typography",
                                component_name: "checkout_order_summary_price_value_typography",
                                props: {
                                  variant: "body2",
                                },
                                value: currencyPosition(
                                  props
                                    ?.watch("order_items")
                                    ?.reduce((total, c) => total + c?.price, 0)
                                )
                              },
                            ]
                          },
                          {
                            component: "Divider",
                            component_name: "checkout_order_summary_price_divider",
                          },
                        ]
                      },
                      {
                        component: "Grid",
                        component_name: "checkout_order_summary_price_grid_item",
                        props: {
                          size: {
                            xs: 12,
                            lg: 12,
                          },
                        },
                        children: [
                          {
                            component: "Box",
                            component_name: "checkout_order_summary_price_box",
                            props: {
                              sx: {
                                display: "flex",
                                justifyContent: "space-between",
                                paddingBottom: 2,
                              },
                            },
                            children: [
                              {
                                component: "Typography",
                                component_name: "checkout_order_summary_price_label_typography",
                                props: {
                                  variant: "body1",
                                  sx: {
                                    fontWeight: "bold",
                                  },
                                },
                                value: __('Discount:', 'acadlix')
                              },
                              {
                                component: "Typography",
                                component_name: "checkout_order_summary_price_value_typography",
                                props: {
                                  variant: "body2",
                                },
                                value: currencyPosition(
                                  props
                                    ?.watch("order_items")
                                    ?.reduce((total, c) => total + c?.discount, 0)
                                )
                              },
                            ]
                          },
                          {
                            component: "Divider",
                            component_name: "checkout_order_summary_price_divider",
                          },
                        ]
                      },
                      {
                        component: "Grid",
                        component_name: "checkout_order_summary_tax_grid_item",
                        props: {
                          size: {
                            xs: 12,
                            lg: 12,
                          },
                        },
                        children: [
                          {
                            component: "Box",
                            component_name: "checkout_order_summary_tax_box",
                            props: {
                              sx: {
                                display: "flex",
                                justifyContent: "space-between",
                                paddingBottom: 2,
                              },
                            },
                            children: [
                              {
                                component: "Typography",
                                component_name: "checkout_order_summary_tax_label_typography",
                                props: {
                                  variant: "body1",
                                  sx: {
                                    fontWeight: "bold",
                                  },
                                },
                                value: __('Tax:', 'acadlix')
                              },
                              {
                                component: "Typography",
                                component_name: "checkout_order_summary_tax_value_typography",
                                props: {
                                  variant: "body2",
                                },
                                value: currencyPosition(
                                  props
                                    ?.watch("order_items")
                                    ?.reduce((total, c) => total + c?.tax, 0)
                                )
                              },
                            ]
                          },
                          {
                            component: "Divider",
                            component_name: "checkout_order_summary_tax_divider",
                          },
                        ]
                      },
                      {
                        component: "Grid",
                        component_name: "checkout_order_summary_total_grid_item",
                        props: {
                          size: {
                            xs: 12,
                            lg: 12,
                          },
                        },
                        children: [
                          {
                            component: "Box",
                            component_name: "checkout_order_summary_total_box",
                            props: {
                              sx: {
                                display: "flex",
                                justifyContent: "space-between",
                                paddingBottom: 2,
                              },
                            },
                            children: [
                              {
                                component: "Typography",
                                component_name: "checkout_order_summary_total_label_typography",
                                props: {
                                  variant: "body1",
                                  sx: {
                                    fontWeight: "bold",
                                  },
                                },
                                value: __('Total:', 'acadlix')
                              },
                              {
                                component: "Typography",
                                component_name: "checkout_order_summary_total_value_typography",
                                props: {
                                  variant: "body2",
                                },
                                value: currencyPosition(
                                  props
                                    ?.watch("order_items")
                                    ?.reduce((total, c) => total + c?.price_after_tax, 0)
                                )
                              },
                            ]
                          },
                          {
                            component: "Divider",
                            component_name: "checkout_order_summary_total_divider",
                          },
                        ]
                      },
                      {
                        component: "Grid",
                        component_name: "checkout_order_summary_button_grid_item",
                        props: {
                          size: {
                            xs: 12,
                            lg: 12,
                          }
                        },
                        children: [
                          {
                            component: "Button",
                            component_name: "checkout_order_summary_button",
                              props: {
                              color: "success",
                              variant: "contained",
                              fullWidth: true,
                              loading: props?.watch("is_checkout_loading"),
                              disabled: props?.watch("cart")?.length === 0 ||
                                !is_payment_gateway_active() ||
                                !props?.watch("is_user_logged_in") ||
                                props?.watch("is_checkout_locked"),
                              onClick: props?.handleSubmit(props?.handleCheckout),
                            },
                            value: __('Checkout', 'acadlix')
                          }
                        ]
                      }
                    ]
                  })
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const order_summary = window?.acadlixHooks?.applyFilters?.(
    "acadlix.front.checkout.order_summary",
    [defaultSetting],
    {
      register: props?.register,
      control: props?.control,
      watch: props?.watch,
      setValue: props?.setValue,
      is_payment_gateway_active: is_payment_gateway_active(),
      handleSubmit: props?.handleSubmit,
      handleCheckout: props?.handleCheckout,
    }
  ) ?? [];

  return (
    <>
      {order_summary.map((field, i) => (
        <React.Fragment key={i}>
          <DynamicMUIRenderer
            item={field}
            index={i}
            formProps={{
              register: props?.register,
              setValue: props?.setValue,
              watch: props?.watch,
              control: props?.control,
            }}
          />
        </React.Fragment>
      ))}
      {/* <Box>
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
                    <Button
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
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Box> */}
    </>
  );
};

export default OrderSummary;
