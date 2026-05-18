import React from 'react'
import { __ } from '@wordpress/i18n'
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';

const CheckoutOptions = (props) => {
  const defaultSettings = {
    component: "Fragment",
    component_name: "checkout_options_fragment",
    children: [
      {
        component: "Box",
        component_name: "checkout_options_header_box",
        props: {
          sx: {
            marginY: 2
          },
        },
        children: [
          {
            component: "Typography",
            component_name: "checkout_options_header_typography",
            props: {
              variant: "h4",
            },
            value: __("Checkout Options", "acadlix")
          },
          {
            component: "Divider",
            component_name: "checkout_options_header_divider",
          }
        ]
      },
      {
        component: "Grid",
        component_name: "checkout_options_grid_container",
        props: {
          container: true,
          spacing: {
            xs: 2,
            sm: 4,
          },
          sx: {
            alignItems: "center",
          }
        },
        children: [
          {
            component: "Grid",
            component_name: "checkout_options_grid_item_coupon_code_label",
            props: {
              size: {
                xs: 12,
                sm: 6,
                lg: 3
              }
            },
            children: [
              {
                component: "CustomTypography",
                component_name: "checkout_options_custom_typography_coupon_code",
                value: __("Enable Coupon Code", "acadlix"),
              },
            ]
          },
          {
            component: "Grid",
            component_name: "checkout_options_grid_item_coupon_code_switch",
            props: {
              size: {
                xs: 12,
                sm: 6,
                lg: 3
              }
            },
            children: [
              {
                component: "FormControlLabel",
                component_name: "checkout_options_form_control_label_coupon_code",
                props: {
                  control: {
                    component: "CustomSwitch",
                  },
                  label: __("Activate", "acadlix"),
                  value: "yes",
                  checked: props.watch("acadlix_enable_coupon_code") === "yes" ? true : false,
                  onChange: (e) => {
                    if (e.target.checked !== undefined) {
                      props.setValue("acadlix_enable_coupon_code", e.target.checked ? "yes" : "no")
                    }
                  }
                },
              },
            ]
          }
        ]
      }
    ]
  };

  // 🔹 Apply WordPress-style filter for extensibility
  const checkout_options_settings = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.general.checkout_options",
    [defaultSettings],
    {
      register: props?.register,
      control: props?.control,
      watch: props?.watch,
      setValue: props?.setValue,
    }
  ) ?? [];
  return (
    <>
      {
        checkout_options_settings.map((field, i) => (
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
        ))
      }
    </>
  )
}

export default CheckoutOptions