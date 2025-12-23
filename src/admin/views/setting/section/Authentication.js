import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';
import React from 'react'
import { __ } from "@wordpress/i18n";

const Authentication = (props) => {
  const defaultSetting = {
    component: "Card",
    component_name: "setting_authentication_card",
    children: [
      {
        component: "CardContent",
        component_name: "setting_authentication_card_content",
        children: [
          {
            component: "Box",
            component_name: "setting_authentication_login_option_card_box",
            children: [
              {
                component: "Box",
                component_name: "setting_authentication_login_option_card_box_header",
                props: {
                  sx: {
                    marginY: 2,
                  },
                },
                children: [
                  {
                    component: "Typography",
                    component_name: "setting_authentication_login_option_card_title",
                    props: {
                      variant: "h4",
                    },
                    value: __("Login Options", "acadlix"),
                  },
                  {
                    component: "Divider",
                  },
                ],
              },
              {
                component: "Grid",
                component_name: "setting_authentication_login_option_grid",
                props: {
                  container: true,
                  spacing: {
                    xs: 2,
                    sm: 4,
                  },
                  sx: {
                    alignItems: "center",
                  },
                },
                children: [
                  {
                    component: "Grid",
                    component_name: "setting_authentication_login_option_grid_item_login_shortcode_label",
                    props: {
                      size: { xs: 12, sm: 6, lg: 3 },
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        value: __("Login Shortcode", "acadlix"),
                      }
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "setting_authentication_login_option_grid_item_login_shortcode_value",
                    props: {
                      size: { xs: 12, sm: 6, lg: 4 },
                    },
                    children: [
                      {
                        component: "CustomCopyableText",
                        props: {
                          value: "[acadlix_login]",
                          successMessage: __("Login shortcode copied to clipboard!", "acadlix"),
                          errorMessage: __("Failed to copy login shortcode: ", "acadlix"),
                        },
                      }
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "setting_authentication_login_option_grid_item_spacer",
                    props: {
                      size: { xs: 0, sm: 0, lg: 5 },
                    }
                  },
                  {
                    component: "Grid",
                    component_name: "setting_authentication_login_option_grid_item_default_screen_label",
                    props: {
                      size: { xs: 12, sm: 6, lg: 3 },
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        value: __("Default Screen", "acadlix"),
                      }
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "setting_authentication_login_option_grid_item_default_screen_value",
                    props: {
                      size: { xs: 12, sm: 6, lg: 9 },
                    },
                    children: [
                      {
                        component: "FormGroup",
                        component_name: "setting_authentication_login_option_default_screen_form_group",
                        props: {
                          row: true,
                        },
                        children: [
                          {
                            component: "FormControlLabel",
                            component_name: "setting_authentication_login_option_default_screen_form_control_label_login",
                            props: {
                              control: {
                                component: "Radio",
                                props: {
                                  size: "small",
                                },
                              },
                              label: __("Login Screen", "acadlix"),
                              value: "login",
                              checked: props?.watch("acadlix_default_auth_screen") === "login",
                              onClick: (e) => {
                                if (e?.target?.checked !== undefined) {
                                  props?.setValue(
                                    "acadlix_default_auth_screen",
                                    e?.target?.value,
                                    { shouldDirty: true }
                                  )
                                }
                              },
                            },
                          },
                          {
                            component: "FormControlLabel",
                            component_name: "setting_authentication_login_option_default_screen_form_control_label_register",
                            props: {
                              control: {
                                component: "Radio",
                                props: {
                                  size: "small",
                                },
                              },
                              label: __("Register Screen", "acadlix"),
                              value: "register",
                              checked: props?.watch("acadlix_default_auth_screen") === "register",
                              onClick: (e) => {
                                if (e?.target?.checked !== undefined) {
                                  props?.setValue(
                                    "acadlix_default_auth_screen",
                                    e?.target?.value,
                                    { shouldDirty: true }
                                  )
                                }
                              },
                            },
                          },
                        ],
                      }
                    ],
                  }
                ],
              }
            ],
          },
          {
            component: "Box",
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
                      variant: "h4",
                    },
                    value: __("Registration Options", "acadlix"),
                  },
                  {
                    component: "Divider",
                  },
                ],
              },
              {
                component: "Grid",
                props: {
                  container: true,
                  spacing: {
                    xs: 2,
                    sm: 4,
                  },
                  sx: {
                    alignItems: "center",
                  },
                },
                children: [
                  {
                    component: "Grid",
                    props: {
                      size: { xs: 12, sm: 4, lg: 4 },
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        value: __("Enable Phone Number", "acadlix"),
                      }
                    ],
                  },
                  {
                    component: "Grid",
                    props: {
                      size: { xs: 12, sm: 4, lg: 4 },
                    },
                    children: [
                      {
                        component: "FormControlLabel",
                        props: {
                          control: {
                            component: "CustomSwitch",
                          },
                          label: __("Enable", "acadlix"),
                          value: "yes",
                          checked: props?.watch("acadlix_registration_options.phone.enabled"),
                          onClick: (e) => {
                            if (e?.target?.checked !== undefined) {
                              props?.setValue(
                                "acadlix_registration_options.phone.enabled",
                                e?.target?.checked,
                                { shouldDirty: true }
                              )
                            }
                          },
                        },
                      }
                    ],
                  },
                  {
                    component: "Grid",
                    props: {
                      size: { xs: 12, sm: 4, lg: 4 },
                    },
                    children: [
                      {
                        component: "FormControlLabel",
                        props: {
                          control: {
                            component: "CustomSwitch",
                          },
                          label: __("Required", "acadlix"),
                          value: "yes",
                          checked: props?.watch("acadlix_registration_options.phone.required"),
                          disabled: !props?.watch("acadlix_registration_options.phone.enabled"),
                          onClick: (e) => {
                            if (e?.target?.checked !== undefined) {
                              props?.setValue(
                                "acadlix_registration_options.phone.required",
                                e?.target?.checked,
                                { shouldDirty: true }
                              )
                            }
                          },
                        },
                      }
                    ],
                  }
                ],
              }
            ],
          },
          {
            component: "Box",
            component_name: "setting_authentication_card_box",
            children: [
              {
                component: "Box",
                component_name: "setting_authentication_card_box_header",
                props: {
                  sx: {
                    marginY: 2,
                  },
                },
                children: [
                  {
                    component: "Typography",
                    component_name: "setting_authentication_card_title",
                    props: {
                      variant: "h4",
                    },
                    value: __("Fraud Protection", "acadlix"),
                  },
                  {
                    component: "Divider",
                  },
                ],
              },
              {
                component: "Box",
                props: {
                  sx: {
                    marginY: 2,
                    backgroundColor: "grey.light",
                  },
                },
                children: [
                  {
                    component: "Box",
                    props: {
                      sx: {
                        display: "flex",
                        justifyContent: "space-between",
                      },
                    },
                    children: [
                      {
                        component: "Typography",
                        props: {
                          variant: "h5",
                          sx: {
                            padding: 2
                          },
                        },
                        children: [
                          {
                            component: "span",
                            value: __("Fraud Protection (reCAPTCHA v3)", "acadlix"),
                          },
                          {
                            component: "CustomFeatureTooltip",
                            component_name: "fraud_protection_feature_tooltip",
                            props: {
                              plan: "open",
                              msg: __("Refer docs to configure the Google reCAPTCHA v3.", "acadlix"),
                              placement: "right-start",
                              redirectTo: `${acadlixOptions?.acadlix_docs_url}settings/authentication/#fraud-protection`,
                            }
                          }
                        ],
                      },
                      {
                        component: "FormControlLabel",
                        props: {
                          control: {
                            component: "CustomSwitch",
                          },
                          label: __("Enable Fraud Protection", "acadlix"),
                          value: "yes",
                          checked: props?.watch("acadlix_enable_fraud_protection") === "yes",
                          onClick: (e) => {
                            if (e?.target?.checked !== undefined) {
                              props?.setValue(
                                "acadlix_enable_fraud_protection",
                                e?.target?.checked ? e?.target?.value : "no",
                                { shouldDirty: true }
                              )
                            }
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: "Divider",
                  },
                ],
              },
              props?.watch("acadlix_enable_fraud_protection") === "yes" && ({
                component: "Grid",
                props: {
                  container: true,
                  spacing: {
                    xs: 2,
                    sm: 4,
                  },
                  sx: {
                    alignItems: "center",
                  },
                },
                children: [
                  {
                    component: "Grid",
                    props: {
                      size: { xs: 12, sm: 6, lg: 3 },
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        value: __("v3 Site Key", "acadlix"),
                      }
                    ],
                  },
                  {
                    component: "Grid",
                    props: {
                      size: { xs: 12, sm: 6, lg: 9 },
                    },
                    children: [
                      {
                        component: "PasswordTextField",
                        props: {
                          ...props?.register("acadlix_v3_site_key"),
                          fullWidth: true,
                          size: "small",
                          label: __("Enter v3 Site Key", "acadlix"),
                          // value: props?.watch("acadlix_v3_site_key"),
                          onChange: (e) => props?.setValue("acadlix_v3_site_key", e.target.value, { shouldDirty: true }),
                        },
                      }
                    ],
                  },
                  {
                    component: "Grid",
                    props: {
                      size: { xs: 12, sm: 6, lg: 3 },
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        value: __("v3 Secret Key", "acadlix"),
                      }
                    ],
                  },
                  {
                    component: "Grid",
                    props: {
                      size: { xs: 12, sm: 6, lg: 9 },
                    },
                    children: [
                      {
                        component: "PasswordTextField",
                        props: {
                          ...props?.register("acadlix_v3_secret_key"),
                          fullWidth: true,
                          size: "small",
                          label: __("Enter v3 Secret Key", "acadlix"),
                          // value: props?.watch("acadlix_v3_secret_key"),
                          onChange: (e) => props?.setValue("acadlix_v3_secret_key", e.target.value, { shouldDirty: true }),
                        },
                      }
                    ],
                  },
                ],
              })
            ],
          },
        ],
      },
      {
        component: "CardActions",
        component_name: "setting_authentication_card_actions",
        children: [
          {
            component: "Button",
            component_name: "setting_authentication_card_actions_button",
            props: {
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
  const authentication_setting = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.settings.authentication",
    [defaultSetting],
    {
      register: props?.register,
      control: props?.control,
      watch: props?.watch,
      setValue: props?.setValue,
      options: props?.options,
    }
  ) ?? [];
  return (
    <>
      {authentication_setting.map((field, i) => (
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

export default Authentication