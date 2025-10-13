import React from "react";
import { __ } from "@wordpress/i18n";
import PayU from "./payment_gateways/PayU";
import PayPal from "./payment_gateways/PayPal";
import RazorPay from "./payment_gateways/RazorPay";
import Stripe from "./payment_gateways/Stripe";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";

function Payment(props) {
  const defaultSetting = {
    component: "Card",
    props: {
      component_name: "setting_payment_card",
    },
    children: [
      {
        component: "CardContent",
        props: {
          component_name: "setting_payment_card_content",
        },
        children: [
          {
            component: "Box",
            props: {
              component_name: "setting_payment_card_box",
            },
            children: [
              {
                component: "Box",
                props: {
                  sx: {
                    marginY: 2,
                  },
                },
                children: [
                  {
                    component: "Typography",
                    props: {
                      component_name: "setting_payment_card_title",
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
            ],
          },
        ],
      },
      {
        component: "CardActions",
        props: {
          component_name: "setting_payment_card_actions",
        },
        children: [
          {
            component: "Button",
            props: {
              component_name: "setting_payment_card_actions_button",
              variant: "contained",
              color: "primary",
              type: "submit",
              loading: props?.isPending,
            },
            value: __("Save", "acadlix"),
          },
        ],
      }
    ],
  };

  // 🔹 Apply WordPress-style filter for extensibility
  const payment_setting = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.payment_gateways.payment",
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