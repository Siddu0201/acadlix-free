import {
    Autocomplete, 
    CircularProgress, 
    TextField
} from '@mui/material';
import React from 'react'
import { __ } from '@wordpress/i18n';
import { GetOrderUsers } from '@acadlix/requests/admin/AdminOrderRequest';
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';

const OrderOptions = (props) => {
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
                                                                        component_name: "order_options_select_user_grid_item",
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
                                                                                component: <OrderUser {...props} />
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
                                                    {
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
                                                    },
                                                    {
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
                                                                    onChange: (e) => {
                                                                        if (e?.target?.checked) {
                                                                            props?.setValue("order_items",
                                                                                props?.watch("order_items")?.map((item) => {
                                                                                    return {
                                                                                        ...item,
                                                                                        discount: item?.price,
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
                                                                                    const price_after_discount = item?.price;
                                                                                    const tax = course?.rendered_metas?.tax && Number(course?.rendered_metas?.tax_percent) > 0 ?
                                                                                        item?.price > 0 ?
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
                                                                    },
                                                                }
                                                            }
                                                        ]
                                                    },
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
            onInputChange={(event, newValue) => setInputValue(newValue)}
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
            onChange={(_, newValue) => {
                props?.setValue("user_id", newValue?.ID, {
                    shouldDirty: true
                });
                setInputValue("");
            }}
        />
    )
}
