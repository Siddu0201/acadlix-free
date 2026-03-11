import {
  Autocomplete,
  CircularProgress,
  TextField
} from '@mui/material';
import React from 'react'
import { __ } from '@wordpress/i18n';
import { GetOrderUsers } from '@acadlix/requests/admin/AdminOrderRequest';
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';
import { MdCheckBox, MdOutlineCheckBoxOutlineBlank } from '@acadlix/helpers/icons';

const OrderOptions = (props) => {
  const handleToogleFree = (e) => {
    if (e?.target?.checked) {
      props?.setValue("order_items",
        props?.watch("order_items")?.map((item) => {
          return {
            ...item,
            discount: item?.price + item?.additional_fee,
            price_after_discount: 0,
            tax: 0,
            price_after_tax: 0
          }
        })
      );
    } else {
      props?.setValue("order_items",
        props?.watch("order_items")?.map((item) => {
          const course = props?.watch("courses")?.find(c => c?.ID === item?.course_id);
          const price_after_discount = item?.price + item?.additional_fee;
          const tax = course?.rendered_metas?.tax && Number(course?.rendered_metas?.tax_percent) > 0 ?
            (item?.price + item?.additional_fee) > 0 ?
              Math.round((Number(course?.rendered_metas?.tax_percent) * price_after_discount / 100) * 100) / 100
              : 0
            : 0;
          const price_after_tax = price_after_discount + tax;
          return {
            ...item,
            discount: 0,
            price_after_discount: price_after_discount,
            tax: tax,
            price_after_tax: price_after_tax
          }
        })
      );
    }
    props?.setValue("total_amount",
      props?.watch("order_items")?.reduce((acc, item) => acc + item?.price_after_tax, 0),
      {
        shouldDirty: true
      });
    props?.setValue("meta.is_free", e?.target?.checked, {
      shouldDirty: true,
    });
  }
  const defaultSetting = {
    component: "Grid",
    component_name: "order_options_grid",
    props: {
      size: { xs: 12, sm: 12 },
    },
    children: [
      {
        component: "Card",
        component_name: "order_options_card",
        children: [
          {
            component: "CardContent",
            component_name: "order_options_card_content",
            children: [
              {
                component: "Box",
                component_name: "order_options_box",
                props: {
                  sx: {
                    marginY: 2,
                  }
                },
                children: [
                  {
                    component: "Typography",
                    component_name: "order_options_title_typography",
                    props: {
                      variant: "h4"
                    },
                    value: __("Order Options", "acadlix")
                  },
                  {
                    component: "Divider",
                    component_name: "order_options_divider"
                  }
                ]
              },
              {
                component: "Grid",
                component_name: "order_options_grid_container",
                props: {
                  container: true,
                  spacing: {
                    xs: 2,
                    sm: 4,
                  },
                  alignItems: "center",
                },
                children: [
                  {
                    component: "Grid",
                    component_name: "order_options_grid_item",
                    props: {
                      size: { xs: 12, sm: 12, lg: 6 },
                    },
                    children: [
                      {
                        component: "Grid",
                        component_name: "order_options_user_grid_container",
                        props: {
                          container: true,
                          spacing: {
                            xs: 2,
                            sm: 4,
                          },
                          alignItems: "center",
                        },
                        children: [
                          props?.create ?
                            (
                              {
                                component: "Fragment",
                                component_name: "order_options_user_grid_fragment",
                                children: [
                                  {
                                    component: "Grid",
                                    component_name: "order_options_user_type_grid_item_label",
                                    props: {
                                      size: { xs: 12, sm: 6, lg: 4 },
                                    },
                                    children: [
                                      {
                                        component: "CustomTypography",
                                        component_name: "order_options_user_type_label_custom_typography",
                                        value: __("Select user type", "acadlix")
                                      }
                                    ]
                                  },
                                  {
                                    component: "Grid",
                                    component_name: "order_options_user_type_grid_item",
                                    props: {
                                      size: { xs: 12, sm: 6, lg: 8 },
                                    },
                                    children: [
                                      {
                                        component: "FormControl",
                                        component_name: "order_options_user_type_form_control",
                                        props: {
                                          sx: {
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                          }
                                        },
                                        children: [
                                          {
                                            component: "RadioGroup",
                                            component_name: "order_options_user_type_radio_group",
                                            props: {
                                              name: "user_type",
                                              row: true,
                                              onChange: (e) => {
                                                props?.setValue("user_type", e?.target?.value, {
                                                  shouldDirty: true,
                                                });
                                              }
                                            },
                                            children: [
                                              {
                                                component: "FormControlLabel",
                                                component_name: "order_options_user_type_single_form_control_label",
                                                props: {
                                                  value: "single",
                                                  control: {
                                                    component: "Radio",
                                                  },
                                                  label: __("Single", "acadlix"),
                                                  checked: props?.watch("user_type") === "single",
                                                  componentsProps: {
                                                    typography: {
                                                      variant: "body2",
                                                    }
                                                  }
                                                }
                                              },
                                              {
                                                component: "FormControlLabel",
                                                component_name: "order_options_user_type_multiple_form_control_label",
                                                props: {
                                                  value: "multiple",
                                                  control: {
                                                    component: "Radio",
                                                  },
                                                  label: __("Multiple", "acadlix"),
                                                  checked: props?.watch("user_type") === "multiple",
                                                  componentsProps: {
                                                    typography: {
                                                      variant: "body2",
                                                    }
                                                  }
                                                }
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  },
                                  props?.watch("user_type") === "multiple" && ({
                                    component: "Fragment",
                                    component_name: "order_options_skip_already_purchased_fragment",
                                    children: [
                                      {
                                        component: "Grid",
                                        component_name: "order_options_skip_already_purchased_label_grid_item",
                                        props: {
                                          size: { xs: 12, sm: 6, lg: 4 },
                                        },
                                        children: [
                                          {
                                            component: "CustomTypography",
                                            component_name: "order_options_skip_already_purchased_label_custom_typography",
                                            value: __("Skip already purchased", "acadlix")
                                          }
                                        ]
                                      },
                                      {
                                        component: "Grid",
                                        component_name: "order_options_skip_already_purchased_grid_item",
                                        props: {
                                          size: { xs: 12, sm: 6, lg: 8 },
                                        },
                                        children: [
                                          {
                                            component: "FormControlLabel",
                                            component_name: "order_options_skip_already_purchased_form_control_label",
                                            props: {
                                              control: {
                                                component: "CustomSwitch",
                                              },
                                              label: __("Activate", "acadlix"),
                                              checked: props.watch("skip_already_purchased") ?? false,
                                              onChange: (e) => {
                                                props?.setValue("skip_already_purchased", e?.target?.checked, {
                                                  shouldDirty: true,
                                                });
                                              }
                                            }
                                          }
                                        ]
                                      }
                                    ]
                                  }),
                                  {
                                    component: "Grid",
                                    component_name: "order_options_select_user_grid_item_label",
                                    props: {
                                      size: { xs: 12, sm: 6, lg: 4 },
                                    },
                                    children: [
                                      {
                                        component: "CustomTypography",
                                        component_name: "order_options_select_user_label_custom_typography",
                                        value: __("Select user", "acadlix")
                                      }
                                    ]
                                  },
                                  {
                                    component: "Grid",
                                    component_name: "order_options_select_user_grid_item",
                                    props: {
                                      size: { xs: 12, sm: 6, lg: 8 },
                                    },
                                    children: [
                                      {
                                        component_name: "order_options_select_user_order_user",
                                        component: props.watch("user_type") === "single" ? <OrderUser {...props} /> : <OrderUsers {...props} />,
                                      }
                                    ]
                                  }
                                ]
                              }
                            ) :
                            (
                              {
                                component: "Fragment",
                                component_name: "order_options_user_fragment",
                                children: [
                                  {
                                    component: "Grid",
                                    component_name: "order_options_user_label_grid_item",
                                    props: {
                                      size: { xs: 12, sm: 6, lg: 4 },
                                    },
                                    children: [
                                      {
                                        component: "CustomTypography",
                                        component_name: "order_options_user_label_custom_typography",
                                        value: __("User", "acadlix")
                                      }
                                    ]
                                  },
                                  {
                                    component: "Grid",
                                    component_name: "order_options_user_grid_item",
                                    props: {
                                      size: { xs: 12, sm: 6, lg: 8 },
                                    },
                                    children: [
                                      {
                                        component: "Typography",
                                        component_name: "order_options_user_label_typography",
                                        props: {
                                          variant: "body1",
                                          component: "div"
                                        },
                                        children: [
                                          {
                                            component: "Fragment",
                                            component_name: "order_options_user_label_fragment",
                                            value: props?.watch("user_name"),
                                          },
                                          props?.watch("user_email") && ({
                                            component: "Typography",
                                            component_name: "order_options_user_label_email_typography",
                                            props: {
                                              variant: "body2",
                                              component: "div"
                                            },
                                            value: `(${props?.watch("user_email")})`
                                          })
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ),
                          props?.create && ({
                            component: "Grid",
                            component_name: "order_options_is_free_label_grid_item",
                            props: {
                              size: { xs: 12, sm: 6, lg: 4 },
                            },
                            children: [
                              {
                                component: "CustomTypography",
                                value: __("Is Free", "acadlix")
                              }
                            ]
                          }),
                          props?.create && ({
                            component: "Grid",
                            component_name: "order_options_is_free_grid_item",
                            props: {
                              size: { xs: 12, sm: 6, lg: 8 },
                            },
                            children: [
                              {
                                component: "FormControlLabel",
                                component_name: "order_options_is_free_form_control_label",
                                props: {
                                  control: {
                                    component: "CustomSwitch",
                                  },
                                  label: __("Activate", "acadlix"),
                                  checked: props.watch("meta.is_free") ?? false,
                                  onChange: handleToogleFree,
                                }
                              }
                            ]
                          }),
                          {
                            component: "Grid",
                            component_name: "order_options_order_status_label_grid_item",
                            props: {
                              size: { xs: 12, sm: 6, lg: 4 }
                            },
                            children: [
                              {
                                component: "CustomTypography",
                                component_name: "order_options_order_status_label_custom_typography",
                                value: __("Order Status", "acadlix")
                              }
                            ]
                          },
                          {
                            component: "Grid",
                            component_name: "order_options_order_status_grid_item",
                            props: {
                              size: { xs: 12, sm: 6, lg: 8 }
                            },
                            children: [
                              {
                                component: "FormControl",
                                component_name: "order_options_order_status_form_control",
                                props: {
                                  size: "small",
                                  fullWidth: true,
                                },
                                children: [
                                  {
                                    component: "InputLabel",
                                    component_name: "order_options_order_status_label_input_label",
                                    props: {
                                      id: "demo-simple-select-label",
                                    },
                                    value: __("Status", "acadlix")
                                  },
                                  {
                                    component: "Select",
                                    component_name: "order_options_order_status_select",
                                    props: {
                                      labelId: "demo-simple-select-label",
                                      id: "demo-simple-select",
                                      value: props?.watch("status"),
                                      name: "status",
                                      label: __("Status", "acadlix"),
                                      onChange: (e) => {
                                        props?.setValue("status", e?.target?.value, {
                                          shouldDirty: true,
                                        });
                                      }
                                    },
                                    children: [
                                      {
                                        component: "MenuItem",
                                        component_name: "order_options_order_status_pending_menu_item",
                                        props: {
                                          value: "pending",
                                        },
                                        value: __("Pending", "acadlix")
                                      },
                                      {
                                        component: "MenuItem",
                                        component_name: "order_options_order_status_success_menu_item",
                                        props: {
                                          value: "success",
                                        },
                                        value: __("Success", "acadlix")
                                      },
                                      {
                                        component: "MenuItem",
                                        component_name: "order_options_order_status_failed_menu_item",
                                        props: {
                                          value: "failed",
                                        },
                                        value: __("Failed", "acadlix")
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const order_options_setting = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.order.order_options",
    [defaultSetting],
    {
      register: props?.register,
      control: props?.control,
      watch: props?.watch,
      setValue: props?.setValue,
      create: props?.create,
    }
  ) ?? [];

  return (
    <>
      {order_options_setting.map((field, i) => (
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

export default OrderOptions


const OrderUser = (props) => {
  const [inputValue, setInputValue] = React.useState("");
  const { data, isFetching, refetch } = GetOrderUsers(inputValue);

  React.useEffect(() => {
    if (inputValue?.length >= 3) {
      refetch();
    }
  }, [inputValue]);

  return (
    <Autocomplete
      freeSolo
      disableClearable
      loading={isFetching}
      size="small"
      fullWidth
      value={
        data?.data?.users?.find(u => u?.ID == props?.watch("user_id")) ?? null
      }
      options={data?.data?.users?.length > 0 ?
        data?.data?.users : []}
      getOptionLabel={(option) => `${option?.display_name} (${option?.user_login})` || ""}
      isOptionEqualToValue={(option, value) => option?.ID === value?.ID}
      filterOptions={(x) => x}
      onInputChange={(_, newValue) => {
        if (newValue === "") {
          props?.setValue("user_id", null, {
            shouldDirty: true
          });
        }
        setInputValue(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={__('Type atleast 3 character', 'acadlix')}
          slotProps={{
            input: {
              ...params.InputProps,
              type: "search",
              endAdornment: (
                <>
                  {isFetching ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }
          }}
        />
      )}
      onChange={(_, newValue, reason) => {
        if (newValue?.ID) {
          props?.setValue("user_id", newValue?.ID ?? "", {
            shouldDirty: true
          });
          // console.log(newValue);
          if (newValue?.user_metas) {
            props?.setValue("billing_info", {
              first_name: newValue?.user_metas?.find(m => m?.meta_key == "first_name")?.meta_value,
              last_name: newValue?.user_metas?.find(m => m?.meta_key == "last_name")?.meta_value,
              email: newValue?.user_email,
              phonecode: newValue?.user_metas?.find(m => m?.meta_key == "_acadlix_profile_phonecode")?.meta_value,
              phone_number: newValue?.user_metas?.find(m => m?.meta_key == "_acadlix_profile_phone_number")?.meta_value,
              address: newValue?.user_metas?.find(m => m?.meta_key == "_acadlix_profile_address")?.meta_value,
              country: newValue?.user_metas?.find(m => m?.meta_key == "_acadlix_profile_country")?.meta_value,
              city: newValue?.user_metas?.find(m => m?.meta_key == "_acadlix_profile_city")?.meta_value,
              zip_code: newValue?.user_metas?.find(m => m?.meta_key == "_acadlix_profile_zip_code")?.meta_value,
            }, {
              shouldDirty: true
            });
          }
          setInputValue("");
        }
      }}
    />
  )
}

const OrderUsers = (props) => {
  return (
    <Autocomplete
      multiple
      id="users-autocomplete"
      size='small'
      fullWidth
      options={props?.users}
      value={props?.watch("users") || []}
      disableCloseOnSelect
      getOptionLabel={(option) => option.display_name || ""}
      isOptionEqualToValue={(option, value) => option?.ID === value?.ID}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        const SelectionIcon = selected ? MdCheckBox : MdOutlineCheckBoxOutlineBlank;

        return (
          <li key={key} {...optionProps}>
            <SelectionIcon
              style={{
                marginRight: 4,
                padding: 4,
                boxSizing: 'content-box',
                fontSize: 20,
              }}
            />
            {option.display_name}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} label="Select Users" placeholder="Select Users" />
      )}
      onChange={(_, newValue) => {
        props?.setValue("users", newValue, {
          shouldDirty: true,
        });
      }}
    />
  )
}
