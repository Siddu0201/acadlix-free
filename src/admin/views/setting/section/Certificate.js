import React from "react";
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";
import { useForm } from "react-hook-form";
import { PostCreatePage } from "@acadlix/requests/admin/AdminSettingRequest";
import { Button, CircularProgress, Paper, TextField } from "@mui/material";
import { hasCapability } from "@acadlix/helpers/util";
import { FaImage } from "@acadlix/helpers/icons";
import toast from "react-hot-toast";

const Certificate = (props) => {
  const methods = useForm({
    defaultValues: window?.acadlixHooks?.applyFilters?.(
      "acadlix.admin.settings.certificate.default_values",
      {
        all_pages: props?.all_pages ?? [],
        cetificateInput: "",
      }
    )
  });

  const createPageMutation = PostCreatePage();

  const defaultSetting = {
    component: "Card",
    component_name: "setting_certificate_card",
    children: [
      {
        component: "CardContent",
        component_name: "setting_certificate_card_content",
        children: [
          {
            component: "Box",
            component_name: "setting_certificate_option_card_box",
            children: [
              {
                component: "Box",
                component_name: "setting_certificate_option_card_box_header",
                props: {
                  sx: {
                    marginY: 2,
                  },
                },
                children: [
                  {
                    component: "Typography",
                    component_name: "setting_certificate_option_card_title",
                    props: {
                      variant: "h4",
                    },
                    children: [
                      {
                        component: "span",
                        value: __("Certificate Options", "acadlix"),
                      },
                    ]
                  },
                  {
                    component: "Divider",
                  },
                ],
              },
              {
                component: "Grid",
                component_name: "setting_certificate_option_card_grid",
                props: {
                  container: true,
                  spacing: 2,
                  sx: {
                    alignItems: "center",
                  }
                },
                children: [
                  {
                    component: "Grid",
                    component_name: "setting_certificate_option_card_grid_item_authorised_name_label",
                    props: {
                      size: { xs: 12, sm: 6, lg: 3 },
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        value: __("Authorised Name", "acadlix"),
                      },
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "setting_certificate_option_card_grid_item_authorised_name_field",
                    props: {
                      size: { xs: 12, sm: 6, lg: 9 },
                    },
                    children: [
                      {
                        component: "CustomTextField",
                        component_name: "setting_certificate_option_custom_textfield_authorised_name_field",
                        props: {
                          ...props?.register("acadlix_certificate_authorised_name"),
                          fullWidth: true,
                          size: "small",
                          type: "text",
                          label: __("Authorised Name", "acadlix"),
                          // value: props?.watch("acadlix_certificate_authorised_name") || "",
                          onChange: (e) => {
                            props?.setValue("acadlix_certificate_authorised_name", e.target.value, {
                              shouldDirty: true,
                            });
                          }
                        },
                      }
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "setting_certificate_option_card_grid_item_authorised_company_label",
                    props: {
                      size: { xs: 12, sm: 6, lg: 3 },
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        value: __("Authorised Company Name", "acadlix"),
                      },
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "setting_certificate_option_card_grid_item_authorised_company_field",
                    props: {
                      size: { xs: 12, sm: 6, lg: 9 },
                    },
                    children: [
                      {
                        component: "CustomTextField",
                        component_name: "setting_certificate_option_custom_textfield_authorised_company_field",
                        props: {
                          ...props?.register("acadlix_certificate_authorised_company"),
                          fullWidth: true,
                          size: "small",
                          type: "text",
                          label: __("Authorised Company Name", "acadlix"),
                          // value: props?.watch("acadlix_certificate_authorised_company") || "",
                          onChange: (e) => {
                            props?.setValue("acadlix_certificate_authorised_company", e.target.value, {
                              shouldDirty: true,
                            });
                          }
                        },
                      }
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "setting_certificate_option_card_grid_item_show_instructor",
                    props: {
                      size: { xs: 12, sm: 6, lg: 3 },
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        value: __("Show instructor name on the certificate", "acadlix"),
                      },
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "setting_certificate_option_card_grid_item_show_instructor_field",
                    props: {
                      size: { xs: 12, sm: 6, lg: 9 },
                    },
                    children: [
                      {
                        component: "FormControlLabel",
                        component_name: "setting_certificate_option_form_control_show_instructor_name_on_certificate",
                        props: {
                          control: {
                            component: "CustomSwitch",
                          },
                          value: "yes",
                          label: __("Enable", "acadlix"),
                          checked: props?.watch("acadlix_certificate_show_instructor_name_on_certificate") === "yes" || false,
                          onChange: (e) => {
                            if (e.target.checked !== undefined) {
                              props?.setValue("acadlix_certificate_show_instructor_name_on_certificate", e.target.checked ? e?.target?.value : "no", {
                                shouldDirty: true,
                              });
                            }
                          },
                        },
                      }
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "setting_certificate_option_card_grid_item_show_course_completion_date",
                    props: {
                      size: { xs: 12, sm: 6, lg: 3 },
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        value: __("Show course completion date on the certificate", "acadlix"),
                      },
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "setting_certificate_option_card_grid_item_show_course_completion_date_field",
                    props: {
                      size: { xs: 12, sm: 6, lg: 9 },
                    },
                    children: [
                      {
                        component: "FormControlLabel",
                        component_name: "setting_certificate_option_form_control_show_course_completion_date_on_certificate",
                        props: {
                          control: {
                            component: "CustomSwitch",
                          },
                          value: "yes",
                          label: __("Enable", "acadlix"),
                          checked: props?.watch("acadlix_certificate_show_course_completion_date_on_certificate") === "yes" || false,
                          onChange: (e) => {
                            if (e.target.checked !== undefined) {
                              props?.setValue("acadlix_certificate_show_course_completion_date_on_certificate", e.target.checked ? e?.target?.value : "no", {
                                shouldDirty: true,
                              });
                            }
                          },
                        },
                      }
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "setting_certificate_option_card_grid_item_certificate_page_label",
                    props: {
                      size: { xs: 12, sm: 6, lg: 3 },
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        value: __("Certificate Page", "acadlix"),
                      },
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "setting_certificate_option_card_grid_item_certificate_page_field",
                    props: {
                      size: { xs: 12, sm: 6, lg: 9 },
                    },
                    children: [
                      {
                        component: "Autocomplete",
                        props: {
                          size: "small",
                          value: props?.watch("acadlix_certificate_page_id") !== null
                            ? methods?.watch("all_pages")?.find(
                              (p) => p.ID === Number(props?.watch("acadlix_certificate_page_id"))
                            ) || null
                            : null,
                          options: methods?.watch("all_pages") || [],
                          getOptionLabel: (option) => `${option.post_title} (#${option.ID})` || "",
                          isOptionEqualToValue: (option, value) => option.ID === value.ID,
                          onChange: (e, newValue) => {
                            props?.setValue("acadlix_certificate_page_id", newValue ? newValue.ID : null, {
                              shouldDirty: true,
                            });
                          },
                          renderInput: (params) => (
                            <TextField
                              {...params}
                              slotProps={{
                                input: {
                                  ...params.InputProps,
                                  endAdornment: (
                                    <React.Fragment>
                                      {methods?.watch("certificateInput") !== "" &&
                                        createPageMutation?.isPending ? (
                                        <CircularProgress color="inherit" size={20} />
                                      ) : null}
                                      {params.InputProps.endAdornment}
                                    </React.Fragment>
                                  ),
                                }
                              }}
                              onChange={(e) => methods?.setValue("certificateInput", e.target.value)}
                            />
                          ),
                          slots: {
                            paper: (data) => (
                              <Paper>
                                {data?.children}
                                <Button
                                  color="primary"
                                  fullWidth
                                  disabled={!hasCapability("acadlix_create_page_setting")}
                                  sx={{ justifyContent: "flex-start", pl: 2 }}
                                  onMouseDown={(e) => {
                                    if (methods?.watch("certificateInput") === "") {
                                      toast.error(__("Title cannot be empty.", "acadlix"));
                                      return;
                                    }
                                    createPageMutation?.mutate(
                                      {
                                        title: methods?.watch("certificateInput"),
                                        user_id: acadlixOptions?.user_id,
                                      },
                                      {
                                        onSuccess: (data) => {
                                          // console.log(data?.data);
                                          methods?.setValue(
                                            "certificateInput",
                                            "",
                                            { shouldDirty: true }
                                          );
                                          methods?.setValue(
                                            "all_pages",
                                            data?.data?.all_pages,
                                            { shouldDirty: true }
                                          );
                                          props?.setValue(
                                            "acadlix_certificate_page_id",
                                            data?.data?.page_id,
                                            { shouldDirty: true }
                                          );
                                        },
                                      }
                                    );
                                  }}
                                >
                                  + {__("Add New", "acadlix")}
                                </Button>
                              </Paper>
                            )
                          }
                        },
                      }
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "setting_certificate_option_card_grid_item_certificate_link_in_email_field",
                    props: {
                      size: { xs: 12, sm: 6, lg: 3 },
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        value: __("Certificate link in email", "acadlix"),
                      },
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "setting_certificate_option_card_grid_item_certificate_link_in_email_field",
                    props: {
                      size: { xs: 12, sm: 6, lg: 9 },
                    },
                    children: [
                      {
                        component: "FormControlLabel",
                        component_name: "setting_certificate_option_form_control_show_certificate_link_in_email",
                        props: {
                          control: {
                            component: "CustomSwitch",
                          },
                          value: "yes",
                          label: __("Enable", "acadlix"),
                          checked: props?.watch("acadlix_certificate_show_certificate_link_in_email") === "yes" || false,
                          onChange: (e) => {
                            if (e.target.checked !== undefined) {
                              props?.setValue("acadlix_certificate_show_certificate_link_in_email", e.target.checked ? e?.target?.value : "no", {
                                shouldDirty: true,
                              });
                            }
                          },
                        },
                      },
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "setting_certificate_option_card_grid_item_certificate_signature_image_field",
                    props: {
                      size: { xs: 12, sm: 6, lg: 3 },
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        children: [
                          {
                            component: "span",
                            value: __("Upload Signature Image", "acadlix"),
                          },
                        ]
                      },
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "setting_certificate_option_card_grid_item_certificate_signature_image_field",
                    props: {
                      size: { xs: 12, sm: 6, lg: 9 },
                    },
                    children: [
                      {
                        component: "Box",
                        props: {
                          sx: {
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            border: "1px solid lightgray",
                            padding: 1,
                            borderRadius: 1,
                          },
                        },
                        children: [
                          {
                            component: "Avatar",
                            props: {
                              variant: "rounded",
                              src: props?.watch("acadlix_certificate_signature")?.url ?? acadlixOptions?.default_img_url,
                              sx: {
                                width: "140px",
                                height: "86px",
                              }
                            },
                          },
                          {
                            component: "Box",
                            props: {
                              sx: {
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                pl: 1,
                              },
                            },
                            children: [
                              {
                                component: "CustomTypography",
                                props: {
                                  variant: "body2",
                                },
                                value: __("Recommended size: 700x430px.", "acadlix"),
                              },
                              {
                                component: "CustomTypography",
                                props: {
                                  variant: "body2",
                                },
                                value: __("File Support: .jpg, .jpeg, .png", "acadlix"),
                              },
                              {
                                component: "MediaUpload",
                                props: {
                                  onSelect: (media) => {
                                    console.log(media);
                                    if (!media?.url) {
                                      toast.error(__("Media upload failed. Please try again.", "acadlix"));
                                      return;
                                    }

                                    if (["jpg", "jpeg", "png"].indexOf(media?.subtype) === -1) {
                                      toast.error(__("Unsupported file type. Please upload a .jpg, .jpeg, or .png file.", "acadlix"));
                                      return;
                                    }
                                    props?.setValue(
                                      "acadlix_certificate_signature",
                                      {
                                        id: media?.id,
                                        url: media?.url,
                                        filename: media?.filename,
                                        author: media?.author,
                                        height: media?.height,
                                        width: media?.width,
                                        filesizeInBytes: media?.filesizeInBytes,
                                      },
                                      { shouldDirty: true }
                                    );
                                  },
                                  render: ({ open }) => (
                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={open}
                                      startIcon={<FaImage />}
                                    >
                                      {__("Upload", "acadlix")}
                                    </Button>
                                  ),
                                },
                              },
                            ]
                          }
                        ]
                      },
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "setting_certificate_option_card_grid_item_certificate_template",
                    props: {
                      size: { xs: 12, sm: 6, lg: 3 },
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        value: __("Select Certificate Template", "acadlix"),
                      },
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "setting_certificate_option_card_grid_item_certificate_template_field",
                    props: {
                      size: { xs: 12, sm: 6, lg: 9 },
                    },
                    children: [
                      {
                        component: "FormControl",
                        props: {
                          fullWidth: true,
                        },
                        children: [
                          {
                            component: "RadioGroup",
                            props: {
                              row: false,
                              value: props?.watch("acadlix_certificate_template") || "",
                              onChange: (e) => {
                                props?.setValue("acadlix_certificate_template", e.target.value, {
                                  shouldDirty: true,
                                });
                              },
                            },
                            children: [
                              {
                                component: "FormControlLabel",
                                props: {
                                  value: "classic-landscape",
                                  control: {
                                    component: "Radio",
                                  },
                                  label: {
                                    component: "Box",
                                    props: {
                                      sx: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      },
                                    },
                                    children: [
                                      {
                                        component: "Avatar",
                                        props: {
                                          src: `${acadlixOptions?.certificate_url_path || ""}sample-classic-landscape.png`,
                                          alt: "Classic Landscape",
                                          sx: { width: 300, height: 250 },
                                          slotProps: {
                                            img: {
                                              sx: {
                                                objectFit: "contain",
                                              }
                                            }
                                          },
                                          variant: "rounded",
                                        },
                                      },
                                    ]
                                  },
                                },
                              },
                              {
                                component: "FormControlLabel",
                                props: {
                                  value: "modern-landscape",
                                  control: {
                                    component: "Radio",
                                  },
                                  label: {
                                    component: "Box",
                                    props: {
                                      sx: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      },
                                    },
                                    children: [
                                      {
                                        component: "Avatar",
                                        props: {
                                          src: `${acadlixOptions?.certificate_url_path || ""}sample-modern-landscape.png`,
                                          alt: "Modern Landscape",
                                          sx: { width: 300, height: 250 },
                                          slotProps: {
                                            img: {
                                              sx: {
                                                objectFit: "contain",
                                              }
                                            }
                                          },
                                          variant: "rounded",
                                        },
                                      },
                                    ]
                                  },
                                },
                              },
                              {
                                component: "FormControlLabel",
                                props: {
                                  value: "modern-portrait",
                                  control: {
                                    component: "Radio",
                                  },
                                  label: {
                                    component: "Box",
                                    props: {
                                      sx: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      },
                                    },
                                    children: [
                                      {
                                        component: "Avatar",
                                        props: {
                                          src: `${acadlixOptions?.certificate_url_path || ""}sample-modern-portrait.png`,
                                          alt: "Modern Portrait",
                                          sx: { width: 300, height: 250 },
                                          slotProps: {
                                            img: {
                                              sx: {
                                                objectFit: "contain",
                                              }
                                            }
                                          },
                                          variant: "rounded",
                                        },
                                      },
                                    ]
                                  },
                                },
                              },
                            ],
                          },
                        ],
                      }
                    ],
                  },
                ],
              },
            ],
          },
          {
            component: "CardActions",
            component_name: "setting_certificate_card_actions",
            children: [
              {
                component: "Button",
                component_name: "setting_certificate_card_actions_button",
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
      },
    ],
  };

  // 🔹 Apply WordPress-style filter for extensibility
  const certificate_setting = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.settings.certificate",
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
      {
        certificate_setting.map((field, i) => (
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
  );
}

export default Certificate;
