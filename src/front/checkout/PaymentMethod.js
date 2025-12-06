import React from "react";
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";

const PaymentMethod = (props) => {
  const useActivePaymentGateways = () => {
    const gateways = {
      razorpay: acadlixCheckoutOptions?.is_razorpay_active,
      paypal: acadlixCheckoutOptions?.is_paypal_active,
      payu: acadlixCheckoutOptions?.is_payu_active,
      stripe: acadlixCheckoutOptions?.is_stripe_active,
      offline: acadlixCheckoutOptions?.is_offline_active,
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

  const defaultSetting = {
    component: "Box",
    component_name: "checkout_payment_method_box",
    children: [
      {
        component: "Card",
        component_name: "checkout_payment_method_card",
        children: [
          {
            component: "CardHeader",
            component_name: "checkout_payment_method_card_header",
            props: {
              title: __("Payment Method", "acadlix")
            }
          },
          {
            component: "Divider",
            component_name: "checkout_payment_method_card_divider",
          },
          {
            component: "CardContent",
            component_name: "checkout_payment_method_card_content",
            children: [
              {
                component: "Grid",
                component_name: "checkout_payment_method_card_grid",
                props: {
                  container: true,
                  spacing: 2,
                },
                children: [
                  acadlixCheckoutOptions?.is_razorpay_active && ({
                    component: "Grid",
                    component_name: "checkout_payment_method_razorpay_grid",
                    props: {
                      size: {
                        xs: 12,
                        lg: 12,
                      },
                    },
                    children: [
                      {
                        component: "Card",
                        component_name: "checkout_payment_method_razorpay_card",
                        children: [
                          {
                            component: "CardContent",
                            component_name: "checkout_payment_method_razorpay_card_content",
                            props: {
                              sx: {
                                paddingY: 1,
                                paddingX: 3,
                                ":last-child": {
                                  paddingY: 1,
                                  paddingX: 3,
                                },
                                display: "flex",
                                alignItems: "center",
                              }
                            },
                            children: [
                              {
                                component: "FormControlLabel",
                                component_name: "checkout_payment_method_razorpay_card_form_control_label",
                                props: {
                                  slotProps: {
                                    typography: {
                                      sx: {
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                      },
                                    },
                                  },
                                  sx: {
                                    width: "100%"
                                  },
                                  label: __("Razorpay", "acadlix"),
                                  disabled: !props?.watch("is_user_logged_in"),
                                  control: {
                                    component: "Radio",
                                    component_name: "checkout_payment_method_razorpay_card_form_control_label_radio",
                                    props: {
                                      size: "small",
                                      name: "payment_method",
                                      checked: props?.watch("payment_method") === "razorpay",
                                      value: "razorpay",
                                      onClick: (e) => {
                                        props?.setValue(
                                          "payment_method",
                                          e?.target?.value,
                                          {
                                            shouldDirty: true,
                                          }
                                        );
                                      },
                                    },
                                  },
                                },
                              },
                            ]
                          },
                        ],
                      },
                    ],
                  }),
                  acadlixCheckoutOptions?.is_paypal_active && ({
                    component: "Grid",
                    component_name: "checkout_payment_method_paypal_grid",
                    props: {
                      size: {
                        xs: 12,
                        lg: 12,
                      },
                    },
                    children: [
                      {
                        component: "Card",
                        component_name: "checkout_payment_method_paypal_card",
                        children: [
                          {
                            component: "CardContent",
                            component_name: "checkout_payment_method_paypal_card_content",
                            props: {
                              sx: {
                                paddingY: 1,
                                paddingX: 3,
                                ":last-child": {
                                  paddingY: 1,
                                  paddingX: 3,
                                },
                                display: "flex",
                                alignItems: "center",
                              }
                            },
                            children: [
                              {
                                component: "FormControlLabel",
                                component_name: "checkout_payment_method_paypal_card_form_control_label",
                                props: {
                                  slotProps: {
                                    typography: {
                                      sx: {
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                      },
                                    },
                                  },
                                  sx: {
                                    width: "100%"
                                  },
                                  label: __("PayPal", "acadlix"),
                                  disabled: !props?.watch("is_user_logged_in"),
                                  control: {
                                    component: "Radio",
                                    component_name: "checkout_payment_method_paypal_card_form_control_label_radio",
                                    props: {
                                      size: "small",
                                      name: "payment_method",
                                      checked: props?.watch("payment_method") === "paypal",
                                      value: "paypal",
                                      onClick: (e) => {
                                        props?.setValue(
                                          "payment_method",
                                          e?.target?.value,
                                          {
                                            shouldDirty: true,
                                          }
                                        );
                                      },
                                    },
                                  },
                                },
                              },
                            ]
                          },
                        ],
                      },
                    ],
                  }),
                  acadlixCheckoutOptions?.is_payu_active && ({
                    component: "Grid",
                    component_name: "checkout_payment_method_payu_grid",
                    props: {
                      size: {
                        xs: 12,
                        lg: 12,
                      },
                    },
                    children: [
                      {
                        component: "Card",
                        component_name: "checkout_payment_method_payu_card",
                        children: [
                          {
                            component: "CardContent",
                            component_name: "checkout_payment_method_payu_card_content",
                            props: {
                              sx: {
                                paddingY: 1,
                                paddingX: 3,
                                ":last-child": {
                                  paddingY: 1,
                                  paddingX: 3,
                                },
                                display: "flex",
                                alignItems: "center",
                              }
                            },
                            children: [
                              {
                                component: "FormControlLabel",
                                component_name: "checkout_payment_method_payu_card_form_control_label",
                                props: {
                                  slotProps: {
                                    typography: {
                                      sx: {
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                      },
                                    },
                                  },
                                  sx: {
                                    width: "100%"
                                  },
                                  label: __("PayU", "acadlix"),
                                  disabled: !props?.watch("is_user_logged_in"),
                                  control: {
                                    component: "Radio",
                                    component_name: "checkout_payment_method_payu_card_form_control_label_radio",
                                    props: {
                                      size: "small",
                                      name: "payment_method",
                                      checked: props?.watch("payment_method") === "payu",
                                      value: "payu",
                                      onClick: (e) => {
                                        props?.setValue(
                                          "payment_method",
                                          e?.target?.value,
                                          {
                                            shouldDirty: true,
                                          }
                                        );
                                      },
                                    },
                                  },
                                },
                              },
                            ]
                          },
                        ],
                      },
                    ],
                  }),
                  acadlixCheckoutOptions?.is_stripe_active && ({
                    component: "Grid",
                    component_name: "checkout_payment_method_stripe_grid",
                    props: {
                      size: {
                        xs: 12,
                        lg: 12,
                      },
                    },
                    children: [
                      {
                        component: "Card",
                        component_name: "checkout_payment_method_stripe_card",
                        children: [
                          {
                            component: "CardContent",
                            component_name: "checkout_payment_method_stripe_card_content",
                            props: {
                              sx: {
                                paddingY: 1,
                                paddingX: 3,
                                ":last-child": {
                                  paddingY: 1,
                                  paddingX: 3,
                                },
                                display: "flex",
                                alignItems: "center",
                              }
                            },
                            children: [
                              {
                                component: "FormControlLabel",
                                component_name: "checkout_payment_method_stripe_card_form_control_label",
                                props: {
                                  slotProps: {
                                    typography: {
                                      sx: {
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                      },
                                    },
                                  },
                                  sx: {
                                    width: "100%"
                                  },
                                  label: __("Stripe", "acadlix"),
                                  disabled: !props?.watch("is_user_logged_in"),
                                  control: {
                                    component: "Radio",
                                    component_name: "checkout_payment_method_stripe_card_form_control_label_radio",
                                    props: {
                                      size: "small",
                                      name: "payment_method",
                                      checked: props?.watch("payment_method") === "stripe",
                                      value: "stripe",
                                      onClick: (e) => {
                                        props?.setValue(
                                          "payment_method",
                                          e?.target?.value,
                                          {
                                            shouldDirty: true,
                                          }
                                        );
                                      },
                                    },
                                  },
                                },
                              },
                            ]
                          },
                        ],
                      },
                    ],
                  }),
                  acadlixCheckoutOptions?.is_offline_active && ({
                    component: "Grid",
                    component_name: "checkout_payment_method_offline_grid",
                    props: {
                      size: {
                        xs: 12,
                        lg: 12,
                      },
                    },
                    children: [
                      {
                        component: "Card",
                        component_name: "checkout_payment_method_offline_card",
                        children: [
                          {
                            component: "CardContent",
                            component_name: "checkout_payment_method_offline_card_content",
                            props: {
                              sx: {
                                paddingY: 1,
                                paddingX: 3,
                                ":last-child": {
                                  paddingY: 1,
                                  paddingX: 3,
                                },
                                display: "flex",
                                alignItems: "center",
                              }
                            },
                            children: [
                              {
                                component: "FormControlLabel",
                                component_name: "checkout_payment_method_offline_card_form_control_label",
                                props: {
                                  slotProps: {
                                    typography: {
                                      sx: {
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                      },
                                    },
                                  },
                                  sx: {
                                    width: "100%"
                                  },
                                  label: __("Offline", "acadlix"),
                                  disabled: !props?.watch("is_user_logged_in"),
                                  control: {
                                    component: "Radio",
                                    component_name: "checkout_payment_method_offline_card_form_control_label_radio",
                                    props: {
                                      size: "small",
                                      name: "payment_method",
                                      checked: props?.watch("payment_method") === "offline",
                                      value: "offline",
                                      onClick: (e) => {
                                        props?.setValue(
                                          "payment_method",
                                          e?.target?.value,
                                          {
                                            shouldDirty: true,
                                          }
                                        );
                                      },
                                    },
                                  },
                                },
                              },
                            ]
                          },
                        ],
                      },
                    ],
                  }),
                  !acadlixCheckoutOptions?.is_razorpay_active &&
                  !acadlixCheckoutOptions?.is_paypal_active &&
                  !acadlixCheckoutOptions?.is_payu_active &&
                  !acadlixCheckoutOptions?.is_stripe_active &&
                  !acadlixCheckoutOptions?.is_offline_active &&
                   ({
                    component: "Grid",
                    component_name: "checkout_payment_method_no_payment_gateway_grid",
                    props: {
                      size: {
                        xs: 12,
                        lg: 12,
                      },
                    },
                    children: [
                      {
                        component: "Typography",
                        component_name: "checkout_payment_method_no_payment_gateway_typography",
                        props: {
                          variant: "body1",
                        },
                        value: __("No payment gateway is activated, contact admin.", "acadlix")
                      }
                    ]
                  })
                ],
              },
            ],
          }
        ]
      }
    ]
  };

  const payment_method = window?.acadlixHooks?.applyFilters?.(
    "acadlix.front.checkout.payment_method",
    [defaultSetting],
    {
      register: props?.register,
      control: props?.control,
      watch: props?.watch,
      setValue: props?.setValue,
      activeGateways: activeGateways,
      activeGatewayName: activeGatewayName,
    }
  ) ?? [];

  return (
    <>
      {payment_method.map((field, i) => (
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

export default PaymentMethod;
