import React from 'react'
import { __, sprintf } from "@wordpress/i18n";
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';

const KnitPay = (props) => {
  const knitPaySettings = {
    component: "Fragment",
    children: [
      {
        component: "Box",
        component_name: "knit_pay_settings_box",
        props: {
          sx: {
            marginY: 2,
            backgroundColor: "grey.light",
          },
        },
        children: [
          {
            component: "Box",
            component_name: "knit_pay_header_box",
            props: {
              sx: {
                display: "flex",
                justifyContent: "space-between",
              },
            },
            children: [
              {
                component: "Typography",
                component_name: "knit_pay_header_title",
                props: {
                  variant: "h5",
                  sx: {
                    paddingX: 2,
                    paddingY: 2,
                  },
                },
                children: [
                  {
                    component: "span",
                    value: __("KnitPay", "acadlix"),
                  },
                  // {
                  //   component: "CustomFeatureTooltip",
                  //   component_name: "knit_pay_feature_tooltip",
                  //   props: {
                  //     plan: "open",
                  //     msg: __("Refer docs to configure the KnitPay Payment Gateway Properly.", "acadlix"),
                  //     placement: "right-start",
                  //     redirectTo: `${acadlixOptions?.acadlix_docs_url}monetization/knitpay/`,
                  //   }
                  // }
                ],
              },
              {
                component: "FormControlLabel",
                component_name: "knit_pay_enable_switch",
                props: {
                  label: __("Enable KnitPay", "acadlix"),
                  value: "yes",
                  checked: props?.watch("acadlix_knit_pay_active") === "yes",
                  control: { component: "CustomSwitch", props: {} },
                  onClick: (e) => {
                    if (e?.target?.checked !== undefined) {
                      props?.setValue(
                        "acadlix_knit_pay_active",
                        e?.target?.checked ? e?.target?.value : "no",
                        { shouldDirty: true }
                      );
                    }
                  },
                },
              },
            ],
          },
          {
            component: "Divider",
            component_name: "knit_pay_header_divider",
          },
        ],
      },
      (
        props?.watch("acadlix_knit_pay_active") === "yes" && {
          component: "Grid",
          props: {
            container: true,
            spacing: { xs: 2, md: 4 },
            sx: { alignItems: "center" },
          },
          children: [
            // 🔹 Info Alert
            {
              component: "Grid",
              component_name: "knit_pay_info_grid",
              props: {
                size: { lg: 12, md: 12, sm: 12, xs: 12 },
              },
              children: [
                {
                  component: "Alert",
                  component_name: "knit_pay_info_alert",
                  props: {
                    severity: "info",
                  },
                  children: [
                    {
                      component: "RawHTML",
                      value: sprintf(
                        __("Configurations can be created in Knit Pay gateway configurations page at <a href='%s'>\"Knit Pay >> Configurations\"</a>.", "acadlix"),
                        acadlixOptions?.knitPayUrl
                      ),
                    }
                  ]
                },
              ],
            },
            {
              component: "Grid",
              component_name: "knit_pay_make_default_label_grid",
              props: {
                size: { lg: 3, md: 3, sm: 6, xs: 12 },
              },
              children: [
                {
                  component: "CustomTypography",
                  component_name: "knit_pay_make_default_label",
                  value: __("Make Default", "acadlix"),
                },
              ],
            },
            {
              component: "Grid",
              component_name: "knit_pay_make_default_switch_grid",
              props: {
                size: { lg: 3, md: 3, sm: 6, xs: 12 },
              },
              children: [
                {
                  component: "FormControlLabel",
                  component_name: "knit_pay_default_gateway_switch",
                  props: {
                    label: __("Default", "acadlix"),
                    value: "knitpay",
                    checked: props?.watch("acadlix_default_payment_gateway") === "knitpay",
                    control: {
                      component: "CustomSwitch",
                      props: {},
                    },
                    onClick: (e) => {
                      if (e?.target?.checked !== undefined) {
                        props?.setValue(
                          "acadlix_default_payment_gateway",
                          e?.target?.checked ? e?.target?.value : "",
                          { shouldDirty: true }
                        );
                      }
                    },
                  },
                },

              ],
            },
            {
              component: "Grid",
              component_name: "knit_pay_test_mode_switch_grid",
              props: {
                size: { lg: 6, md: 6, sm: 0, xs: 0 },
                sx: { display: { lg: "block", md: "block", sm: "none", xs: "none" } },
              },
              value: "",
            },
            {
              component: "Grid",
              component_name: "knit_pay_title_label_grid",
              props: {
                size: { lg: 3, md: 3, sm: 3, xs: 12 },
              },
              children: [
                {
                  component: "CustomTypography",
                  component_name: "knit_pay_title_label",
                  value: __("Title", "acadlix"),
                },
              ],
            },
            {
              component: "Grid",
              props: {
                size: { lg: 9, md: 9, sm: 9, xs: 12 },
                component_name: "knit_pay_title_input_grid",
              },
              children: [
                {
                  component: "CustomTextField",
                  component_name: "knit_pay_title_input",
                  props: {
                    ...props?.register("acadlix_knit_pay_title"),
                    fullWidth: true,
                    size: "small",
                    label: __("Title", "acadlix"),
                    // value: props?.watch("acadlix_knit_pay_title"),
                    onChange: (e) => {
                      props?.setValue("acadlix_knit_pay_title", e?.target?.value, {
                        shouldDirty: true,
                      });
                    },
                  },
                },
              ],
            },
            {
              component: "Grid",
              component_name: "knit_pay_configuration_label_grid",
              props: {
                size: { lg: 3, md: 3, sm: 3, xs: 12 },
              },
              children: [
                {
                  component: "CustomTypography",
                  component_name: "knit_pay_configuration_label",
                  value: __("Configuration", "acadlix"),
                },
              ],
            },
            {
              component: "Grid",
              props: {
                size: { lg: 9, md: 9, sm: 9, xs: 12 },
                component_name: "knit_pay_configuration_input_grid",
              },
              children: [
                {
                  component: "FormControl",
                  props: {
                    fullWidth: true,
                    size: "small",
                  },
                  children: [
                    {
                      component: "InputLabel",
                      props: {
                        id: "demo-simple-select-label",
                      },
                      value: __("Configuration", "acadlix"),
                    },
                    {
                      component: "Select",
                      props: {
                        labelId: "demo-simple-select-label",
                        id: "demo-simple-select",
                        value: props?.watch("acadlix_knit_pay_configuration"),
                        label: __("Configuration", "acadlix"),
                        onChange: (e) => {
                          props?.setValue("acadlix_knit_pay_configuration", e.target.value, { shouldDirty: true });
                        },
                      },
                      children: Object.entries(acadlixOptions?.knitPayGateways || {})?.filter(([key, gateway]) => gateway != "" && key != 0)?.map(([key, gateway]) => ({
                        component: "MenuItem",
                        props: {
                          value: key,
                        },
                        children: [
                          {
                            component: "RawHTML",
                            value: gateway,
                          }
                        ],
                      })) ?? []
                    },
                  ],
                }
              ]
            },
          ]
        }
      )
    ]
  }

  const knit_pay_setting_after = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.payment_gateways.knit_pay.after",
    [knitPaySettings],
    {
      register: props?.register,
      control: props?.control,
      watch: props?.watch,
      setValue: props?.setValue,
    }
  ) ?? [];

  return (
    <>
      {knit_pay_setting_after.map((field, i) => (
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

export default KnitPay