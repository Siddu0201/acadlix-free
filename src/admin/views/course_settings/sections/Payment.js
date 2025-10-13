import React from "react";
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";
import { getNumberStep } from "@acadlix/helpers/util";

const PaymentPro = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_course_settings_payment_pro" */
      "@acadlix/pro/admin/course_settings/sections/PaymentPro"
    )
    : Promise.resolve({ default: () => null })
);

const Payment = (props) => {
  let defaultSetting = {
    component: "Box",
    component_name: "course_payment_box",
    children: [
      {
        component: "Grid",
        component_name: "course_payment_main_grid",
        props: {
          container: true,
          spacing: 3
        },
        children: [
          {
            component: "Grid",
            props: {
              size: {
                xs: 12,
                sm: 4
              },
            },
            component_name: "course_payment_price_outer_grid_item",
            children: [
              {
                component: "Grid",
                component_name: "course_payment_price_inner_grid",
                props: {
                  container: true,
                  spacing: 2,
                },
                children: [
                  {
                    component: "Grid",
                    props: {
                      size: {
                        xs: 12,
                        sm: 12
                      },
                    },
                    component_name: "course_payment_price_label_grid_item",
                    children: [
                      {
                        component: "Typography",
                        props: {
                          variant: "h6",
                        },
                        component_name: "course_payment_price_label_typography",
                        value: __('Price (0 => Free)', 'acadlix')
                      }
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "course_payment_price_text_field_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        sm: 12
                      },
                    },
                    children: [
                      {
                        component: "CustomTextField",
                        component_name: "course_payment_price_text_field",
                        props: {
                          fullWidth: true,
                          size: "small",
                          type: "number",
                          value: props?.watch("meta.price") ?? 0,
                          slotProps: {
                            htmlInput: {
                              min: 0, // 👈 set minimum value here
                              step: getNumberStep(Number(acadlixOptions?.settings?.acadlix_number_of_decimals))
                            },
                          },
                          onChange: (e) => {
                            props?.setValue("meta.price", Number(e?.target?.value), {
                              shouldDirty: true,
                            });
                          },
                          onKeyDown: props?.handleKeyDown,
                          sx: {
                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                            {
                              display: "none",
                            },
                            "& input[type=number]": {
                              MozAppearance: "textfield",
                            },
                          }
                        }
                      }
                    ]
                  }
                ]
              },
            ]
          },
          {
            component: "Grid",
            component_name: "course_payment_enable_sale_price_outer_grid_item",
            props: {
              size: {
                xs: 12,
                sm: 4
              },
            },
            children: [
              {
                component: "Grid",
                component_name: "course_payment_enable_sale_price_inner_grid",
                props: {
                  container: true,
                  spacing: 2,
                },
                children: [
                  {
                    component: "Grid",
                    component_name: "course_payment_enable_sale_price_label_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        sm: 12
                      },
                    },
                    children: [
                      {
                        component: "Typography",
                        component_name: "course_payment_enable_sale_price_label_typography",
                        props: {
                          variant: "h6",
                        },
                        value: __("Activate Sale Price", "acadlix")
                      }
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "course_payment_enable_sale_price_form_control_label_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        sm: 12
                      },
                    },
                    children: [
                      {
                        component: "FormControlLabel",
                        component_name: "course_payment_enable_sale_price_form_control_label",
                        props: {
                          label: __("Activate", "acadlix"),
                          checked: props?.watch("meta.enable_sale_price") ?? false,
                          control:
                          {
                            component: "Checkbox",
                            props: {}
                          },
                          onClick: (e) => {
                            if (e?.target?.checked !== undefined) {
                              props?.setValue("meta.enable_sale_price", e?.target?.checked, {
                                shouldDirty: true,
                              });
                            }
                          },
                          onKeyDown: props?.handleKeyDown,
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            component: "Grid",
            component_name: "course_payment_sale_price_outer_grid_item",
            props: {
              size: {
                xs: 12,
                sm: 4
              },
            },
            children: [
              {
                component: "Grid",
                component_name: "course_payment_sale_price_inner_grid",
                props: {
                  container: true,
                  spacing: 2,
                },
                children: [
                  {
                    component: "Grid",
                    component_name: "course_payment_sale_price_label_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        sm: 12
                      },
                    },
                    children: [
                      {
                        component: "Typography",
                        component_name: "course_payment_sale_price_label_typography",
                        props: {
                          variant: "h6"
                        },
                        value: __('Sale Price', 'acadlix')
                      }
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "course_payment_sale_price_text_field_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        sm: 12
                      },
                    },
                    children: [
                      {
                        component: "CustomTextField",
                        component_name: "course_payment_sale_price_text_field",
                        props: {
                          fullWidth: true,
                          size: "small",
                          type: "number",
                          value: props?.watch("meta.sale_price") ?? 0,
                          slotProps: {
                            htmlInput: {
                              min: 0, // 👈 set minimum value here
                              step: getNumberStep(Number(acadlixOptions?.settings?.acadlix_number_of_decimals))
                            },
                          },
                          onChange: (e) => {
                            props?.setValue("meta.sale_price", Number(e?.target?.value), {
                              shouldDirty: true,
                            });
                          },
                          onKeyDown: props?.handleKeyDown,
                          disabled: !props?.watch("meta.enable_sale_price"),
                          sx: {
                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                            {
                              display: "none",
                            },
                            "& input[type=number]": {
                              MozAppearance: "textfield",
                            },
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            component: "Grid",
            component_name: "course_payment_tax_outer_grid_item",
            props: {
              size: {
                xs: 12,
                sm: 6
              },
            },
            children: [
              {
                component: "Grid",
                component_name: "course_payment_tax_inner_grid",
                props: {
                  container: true,
                  spacing: 2,
                },
                children: [
                  {
                    component: "Grid",
                    component_name: "course_payment_tax_label_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        sm: 12
                      },
                    },
                    children: [
                      {
                        component: "Typography",
                        component_name: "course_payment_tax_label_typography",
                        props: {
                          variant: "h6"
                        },
                        value: __('Tax', 'acadlix')
                      }
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "course_payment_tax_form_control_label_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        sm: 12
                      },
                    },
                    children: [
                      {
                        component: "FormControlLabel",
                        component_name: "course_payment_tax_form_control_label",
                        props: {
                          label: __('Activate', 'acadlix'),
                          checked: props?.watch("meta.tax") ?? false,
                          control:
                          {
                            component: "Checkbox",
                            props: {}
                          },
                          onClick: (e) => {
                            if (e?.target?.checked !== undefined) {
                              props?.setValue("meta.tax", e?.target?.checked, {
                                shouldDirty: true,
                              });
                            }
                          },
                          onKeyDown: props?.handleKeyDown,
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            component: "Grid",
            component_name: "course_payment_tax_percent_outer_grid_item",
            props: {
              size: {
                xs: 12,
                sm: 6
              },
            },
            children: [
              {
                component: "Grid",
                component_name: "course_payment_tax_percent_inner_grid",
                props: {
                  container: true,
                  spacing: 2,
                },
                children: [
                  {
                    component: "Grid",
                    component_name: "course_payment_tax_percent_label_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        sm: 12
                      },
                    },
                    children: [
                      {
                        component: "Typography",
                        component_name: "course_payment_tax_percent_label_typography",
                        props: {
                          variant: "h6"
                        },
                        value: __('Tax (%)', 'acadlix')
                      }
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "course_payment_tax_percent_text_field_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        sm: 12
                      },
                    },
                    children: [
                      {
                        component: "CustomTextField",
                        component_name: "course_payment_tax_percent_text_field",
                        props: {
                          fullWidth: true,
                          size: "small",
                          type: "number",
                          disabled: !props?.watch("meta.tax"),
                          value: props?.watch("meta.tax_percent") ?? 0,
                          slotProps: {
                            htmlInput: {
                              min: 0, // 👈 set minimum value here
                              step: 0.01
                            },
                          },
                          onChange: (e) => {
                            props?.setValue("meta.tax_percent", Number(e?.target?.value), {
                              shouldDirty: true,
                            });
                          },
                          onKeyDown: props?.handleKeyDown,
                          sx: {
                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                            {
                              display: "none",
                            },
                            "& input[type=number]": {
                              MozAppearance: "textfield",
                            },
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          },
        ]
      }
    ]
  }
  const payment_after = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.course_settings.payment.after",
    [defaultSetting],
    {
      register: props?.register,
      control: props?.control,
      watch: props?.watch,
      setValue: props?.setValue,
      handleKeyDown: props?.handleKeyDown,
    }
  ) ?? [];

  return (
    <>
      {payment_after.map((field, i) => (
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
      <React.Suspense fallback={null}>
        <PaymentPro
          {...props}
        />
      </React.Suspense>
    </>
  );
};

export default Payment;
