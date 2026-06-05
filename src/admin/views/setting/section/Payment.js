import React from "react";
import { __ } from "@wordpress/i18n";
import PayU from "./payment_gateways/PayU";
import PayPal from "./payment_gateways/PayPal";
import RazorPay from "./payment_gateways/RazorPay";
import Stripe from "./payment_gateways/Stripe";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";
import Offline from "./payment_gateways/Offline";
import KnitPay from "./payment_gateways/KnitPay";

function Payment(props) {
  const defaultSetting = {
    component: "Grid",
    component_name: "setting_payment_grid_container",
    props: {
      container: true,
      spacing: 4,
    },
    children: [
      {
        component: "Grid",
        component_name: "setting_payment_grid_item",
        props: {
          size: { xs: 12, sm: 12 },
        },
        children: [
          {
            component: "Card",
            component_name: "setting_payment_card",
            children: [
              {
                component: "CardContent",
                component_name: "setting_payment_card_content",
                children: [
                  {
                    component: "Box",
                    component_name: "setting_payment_card_box",
                    children: [
                      {
                        component: "Box",
                        component_name: "setting_payment_card_box_sx",
                        props: {
                          sx: {
                            marginY: 2,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          },
                        },
                        children: [
                          {
                            component: "Typography",
                            component_name: "setting_payment_card_title",
                            props: {
                              variant: "h4",
                            },
                            value: __("Payment Gateway", "acadlix"),
                          },
                          {
                            component: "Divider",
                          },
                        ],
                      },
                      {
                        component: <RazorPay {...props} />,
                      },
                      {
                        component: <PayPal {...props} />,
                      },
                      {
                        component: <PayU {...props} />,
                      },
                      {
                        component: <Stripe {...props} />,
                      },
                      {
                        component: <Offline {...props} />,
                      },
                      acadlixOptions?.isKnitPayActive && ({
                        component: <KnitPay {...props} />,
                      }),
                    ],
                  },
                ],
              },
            ],
          }
        ]
      },
      {
        component: "Grid",
        component_name: "setting_payment_grid_item_save",
        props: {
          size: { xs: 12, sm: 12 },
          sx: {
            position: "sticky",
            bottom: 0,
            zIndex: 10,
          }
        },
        children: [
          {
            component: "Card",
            component_name: "setting_payment_card_save",
            children: [
              {
                component: "CardContent",
                component_name: "setting_payment_card_content_save",
                props: {
                  sx: {
                    padding: 4,
                    ":last-child": {
                      paddingBottom: 4,
                    },
                  },
                },
                children: [
                  {
                    component: "Button",
                    component_name: "setting_payment_save_button",
                    props: {
                      variant: "contained",
                      color: "primary",
                      type: "submit",
                      loading: props?.isPending,
                    },
                    value: __("Save", "acadlix"),
                  },
                ],
              },
            ],
          }
        ]
      }
    ]
  };

  // 🔹 Apply WordPress-style filter for extensibility
  const payment_setting = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.settings.payment",
    [defaultSetting],
    {
      register: props?.register,
      control: props?.control,
      watch: props?.watch,
      setValue: props?.setValue,
    }
  ) ?? [];

  return (
    <>
      {payment_setting.map((field, i) => (
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
  )
}

export default Payment;