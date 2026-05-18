import React from "react";
import { __ } from "@wordpress/i18n";
import { currencyPosition } from "@acadlix/helpers/util";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";

const OrderSummary = (props) => {

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
                                  component: "div",
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
                                  component: "div",
                                  variant: "body2",
                                },
                                value: currencyPosition(
                                  props
                                    ?.watch("order_items")
                                    ?.reduce((total, c) => total + c?.price, 0),
                                  props?.watch("currency_symbol")
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
                        component_name: "checkout_order_summary_subtotal_grid_item",
                        props: {
                          size: {
                            xs: 12,
                            lg: 12,
                          },
                        },
                        children: [
                          {
                            component: "Box",
                            component_name: "checkout_order_summary_subtotal_box",
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
                                component_name: "checkout_order_summary_subtotal_label_typography",
                                props: {
                                  component: "div",
                                  variant: "body1",
                                  sx: {
                                    fontWeight: "bold",
                                  },
                                },
                                value: __('Subtotal:', 'acadlix')
                              },
                              {
                                component: "Typography",
                                component_name: "checkout_order_summary_subtotal_value_typography",
                                props: {
                                  component: "div",
                                  variant: "body2",
                                },
                                value: currencyPosition(
                                  props
                                    ?.watch("order_items")
                                    ?.reduce((total, c) => total + (c?.price + c?.additional_fee), 0),
                                  props?.watch("currency_symbol")
                                )
                              },
                            ]
                          },
                          {
                            component: "Divider",
                            component_name: "checkout_order_summary_subtotal_divider",
                          },
                        ]
                      },
                      {
                        component: "Grid",
                        component_name: "checkout_order_summary_discount_grid_item",
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
                                  component: "div",
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
                                  component: "div",
                                  variant: "body2",
                                  sx: {
                                    color: props
                                      ?.watch("order_items")
                                      ?.reduce((total, c) => total + c?.discount, 0) > 0 ? "error.main" : "text.primary",
                                  },
                                },
                                value: `${props
                                  ?.watch("order_items")
                                  ?.reduce((total, c) => total + c?.discount, 0) > 0 ? "-" : ""}
                                  ${currencyPosition(
                                    props
                                      ?.watch("order_items")
                                      ?.reduce((total, c) => total + c?.discount, 0),
                                    props?.watch("currency_symbol")
                                  )}`
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
                        component_name: "checkout_order_summary_price_after_discount_grid_item",
                        props: {
                          size: {
                            xs: 12,
                            lg: 12,
                          },
                        },
                        children: [
                          {
                            component: "Box",
                            component_name: "checkout_order_summary_price_after_discount_box",
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
                                component_name: "checkout_order_summary_price_after_discount_label_typography",
                                props: {
                                  component: "div",
                                  variant: "body1",
                                  sx: {
                                    fontWeight: "bold",
                                  },
                                },
                                value: __('Price After Discount:', 'acadlix')
                              },
                              {
                                component: "Typography",
                                component_name: "checkout_order_summary_price_after_discount_value_typography",
                                props: {
                                  component: "div",
                                  variant: "body2",
                                },
                                value: `${currencyPosition(
                                  props
                                    ?.watch("order_items")
                                    ?.reduce((total, c) => total + c?.price_after_discount, 0),
                                  props?.watch("currency_symbol")
                                )}`
                              },
                            ]
                          },
                          {
                            component: "Divider",
                            component_name: "checkout_order_summary_price_after_discount_divider",
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
                                  component: "div",
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
                                  component: "div",
                                  variant: "body2",
                                },
                                value: currencyPosition(
                                  props
                                    ?.watch("order_items")
                                    ?.reduce((total, c) => total + c?.tax, 0),
                                  props?.watch("currency_symbol")
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
                                  component: "div",
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
                                  component: "div",
                                  variant: "body2",
                                },
                                value: currencyPosition(
                                  props
                                    ?.watch("order_items")
                                    ?.reduce((total, c) => total + c?.price_after_tax, 0),
                                  props?.watch("currency_symbol")
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
                              className: "acadlix-btn",
                              color: "primary",
                              variant: "contained",
                              fullWidth: true,
                              sx: {
                                textTransform: "uppercase",
                              },
                              loading: props?.watch("is_checkout_loading"),
                              disabled: props?.is_checkout_disabled,
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
      is_payment_gateway_active: props?.is_payment_gateway_active,
      is_checkout_disabled: props?.is_checkout_disabled,
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
    </>
  );
};

export default OrderSummary;
