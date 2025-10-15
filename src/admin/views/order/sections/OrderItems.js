import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    TextField,
} from '@mui/material';
import React from 'react'
import { __ } from '@wordpress/i18n';
import { GetOrderCourses } from '@acadlix/requests/admin/AdminOrderRequest';
import { currencyPosition, getStripHtml } from '@acadlix/helpers/util';
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';

const OrderItems = (props) => {
    const defaultSetting = {
        component: "Grid",
        component_name: "order_items_grid",
        props: {
            size: { xs: 12, sm: 12 },
        },
        children: [
            {
                component: "Card",
                component_name: "order_items_card",
                children: [
                    {
                        component: "CardContent",
                        component_name: "order_items_card_content",
                        children: [
                            {
                                component: "Box",
                                component_name: "order_items_box",
                                props: {
                                    sx: {
                                        marginY: 2,
                                    }
                                },
                                children: [
                                    {
                                        component: "Typography",
                                        component_name: "order_items_title_typography",
                                        props: {
                                            variant: "h4"
                                        },
                                        value: props?.create ? __("Add Course(s) to Order", "acadlix") : __("Order Items", "acadlix")
                                    },
                                    {
                                        component: "Divider",
                                        component_name: "order_items_divider",
                                    }
                                ]
                            },
                            {
                                component: "Grid",
                                component_name: "order_items_grid_container",
                                props: {
                                    container: true,
                                    spacing: {
                                        xs: 2,
                                        sm: 4,
                                    },
                                    alignItems: "center",
                                },
                                children: [
                                    props?.create && ({
                                        component: "Grid",
                                        component_name: "order_items_grid_item",
                                        props: {
                                            size: { xs: 12, sm: 6, lg: 2 },
                                        },
                                        children: [
                                            {
                                                component: "CustomTypography",
                                                component_name: "order_items_add_courses_typography",
                                                value: __("Add Courses", "acadlix")
                                            }
                                        ]
                                    }),
                                    props?.create && ({
                                        component: "Grid",
                                        component_name: "order_items_grid_order_courses",
                                        props: {
                                            size: { xs: 12, sm: 6, lg: 4 },
                                        },
                                        children: [
                                            {
                                                component: <OrderCourse {...props} />
                                            }
                                        ]
                                    }),
                                    {
                                        component: "Grid",
                                        component_name: "order_items_grid_table",
                                        props: {
                                            size: { xs: 12, sm: 12, lg: 12 },
                                        },
                                        children: [
                                            {
                                                component: "TableContainer",
                                                component_name: "order_items_table_container",
                                                children: [
                                                    {
                                                        component: "Table",
                                                        component_name: "order_items_table",
                                                        props: {
                                                            sx: {
                                                                minWidth: 650,
                                                            },
                                                            "aria-label": "simple table",
                                                        },
                                                        children: [
                                                            {
                                                                component: "TableHead",
                                                                component_name: "order_items_table_head",
                                                                children: [
                                                                    {
                                                                        component: "TableRow",
                                                                        component_name: "order_items_head_table_row",
                                                                        children: [
                                                                            {
                                                                                component: "TableCell",
                                                                                component_name: "order_items_course_label_table_cell",
                                                                                value: __("Course", "acadlix")
                                                                            },
                                                                            {
                                                                                component: "TableCell",
                                                                                component_name: "order_items_quantity_label_table_cell",
                                                                                value: __("Quantity", "acadlix")
                                                                            },
                                                                            {
                                                                                component: "TableCell",
                                                                                component_name: "order_items_price_label_table_cell",
                                                                                value: __("Price", "acadlix")
                                                                            },
                                                                            {
                                                                                component: "TableCell",
                                                                                component_name: "order_items_additional_fee_label_table_cell",
                                                                                value: __("Additional Fee", "acadlix")
                                                                            },
                                                                            {
                                                                                component: "TableCell",
                                                                                component_name: "order_items_discount_label_table_cell",
                                                                                value: __("Discount", "acadlix")
                                                                            },
                                                                            {
                                                                                component: "TableCell",
                                                                                component_name: "order_items_price_after_discount_label_table_cell",
                                                                                value: __("Price After Discount", "acadlix")
                                                                            },
                                                                            {
                                                                                component: "TableCell",
                                                                                component_name: "order_items_tax_label_table_cell",
                                                                                value: __("Tax", "acadlix")
                                                                            },
                                                                            {
                                                                                component: "TableCell",
                                                                                component_name: "order_items_price_after_tax_label_table_cell",
                                                                                value: __("Price After Tax", "acadlix")
                                                                            },
                                                                            props?.create && ({
                                                                                component: "TableCell",
                                                                                component_name: "order_items_action_label_table_cell",
                                                                                value: __("Action", "acadlix")
                                                                            })
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                component: "TableBody",
                                                                component_name: "order_items_table_body",
                                                                children: [
                                                                    ...props?.watch("order_items")?.map((item, index) => {
                                                                        return {
                                                                            component: <OrderItem key={index} item={item} index={index} {...props} />
                                                                        }
                                                                    }),
                                                                    props?.watch("order_items")?.length > 0 && ({
                                                                        component: "Fragment",
                                                                        component_name: "order_items_total_row_fragment",
                                                                        children: [
                                                                            {
                                                                                component: "TableRow",
                                                                                component_name: "order_items_total_table_row",
                                                                                children: [
                                                                                    {
                                                                                        component: "TableCell",
                                                                                        component_name: "order_items_span_table_cell",
                                                                                        props: {
                                                                                            colSpan: 5,
                                                                                            rowSpan: 4,
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        component: "TableCell",
                                                                                        component_name: "order_items_subtotal_label_table_cell",
                                                                                        value: __("Subtotal", "acadlix")
                                                                                    },
                                                                                    {
                                                                                        component: "TableCell",
                                                                                        component_name: "order_items_subtotal_value_table_cell",
                                                                                        value: currencyPosition(props?.watch("order_items")?.reduce((total, item) => total + item?.price_after_discount, 0), getStripHtml(acadlixOptions?.currency_symbols[props?.watch('meta.currency')]))
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                component: "TableRow",
                                                                                component_name: "order_items_discount_row",
                                                                                children: [
                                                                                    {
                                                                                        component: "TableCell",
                                                                                        component_name: "order_items_total_discount_label_table_cell",
                                                                                        value: __("Discount", "acadlix")
                                                                                    },
                                                                                    {
                                                                                        component: "TableCell",
                                                                                        component_name: "order_items_total_discount_value_table_cell",
                                                                                        value: currencyPosition(props?.watch("order_items")?.reduce((total, item) => total + item?.discount, 0), getStripHtml(acadlixOptions?.currency_symbols[props?.watch('meta.currency')]))
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                component: "TableRow",
                                                                                component_name: "order_items_tax_row",
                                                                                children: [
                                                                                    {
                                                                                        component: "TableCell",
                                                                                        component_name: "order_items_total_tax_label_table_cell",
                                                                                        value: __("Tax", "acadlix")
                                                                                    },
                                                                                    {
                                                                                        component: "TableCell",
                                                                                        component_name: "order_items_total_tax_value_table_cell",
                                                                                        value: currencyPosition(props?.watch("order_items")?.reduce((total, item) => total + item?.tax, 0), getStripHtml(acadlixOptions?.currency_symbols[props?.watch('meta.currency')]))
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                component: "TableRow",
                                                                                component_name: "order_items_total_row",
                                                                                children: [

                                                                                    {
                                                                                        component: "TableCell",
                                                                                        component_name: "order_items_total_label_table_cell",
                                                                                        value: __("Total", "acadlix")
                                                                                    },
                                                                                    {
                                                                                        component: "TableCell",
                                                                                        component_name: "order_items_total_value_table_cell",
                                                                                        children: [
                                                                                            {
                                                                                                component: "b",
                                                                                                component_name: "order_items_total_value_table_cell_b",
                                                                                                value: currencyPosition(props?.watch("order_items")?.reduce((total, item) => total + item?.price_after_tax, 0), getStripHtml(acadlixOptions?.currency_symbols[props?.watch('meta.currency')]))
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            },
                                                                        ]
                                                                    })
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

    const order_items = window?.acadlixHooks?.applyFilters?.(
        "acadlix.admin.order.order_items",
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
            {order_items.map((field, i) => (
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

const OrderCourse = (props) => {
    const [inputValue, setInputValue] = React.useState("");
    const [course, setCourse] = React.useState(null);

    const { data, isFetching, refetch } = GetOrderCourses(inputValue);
    React.useEffect(() => {
        if (inputValue?.length >= 3) {
            refetch();
        }
    }, [inputValue]);
    const handleAddOrderItem = () => {
        if (course) {
            const price = course?.rendered_metas?.enable_sale_price ?
                Number(course?.rendered_metas?.sale_price) || 0
                : Number(course?.rendered_metas?.price) || 0;
            const discount = props?.watch("meta.is_free") ? price : 0;
            const price_after_discount = price - discount;
            const tax = course?.rendered_metas?.tax && Number(course?.rendered_metas?.tax_percent) > 0 ?
                price > 0 ?
                    Math.round((Number(course?.rendered_metas?.tax_percent) * price_after_discount / 100) * 100) / 100
                    : 0
                : 0;
            const price_after_tax = price_after_discount + tax;
            props?.setValue("courses", [...props?.watch("courses"), course], { shouldDirty: true });
            props?.setValue(
                "order_items",
                [...props?.watch("order_items"),
                window?.acadlixHooks?.applyFilters?.(
                    "acadlix.admin.order.order_items.add_order_items",
                    {
                        course_id: course?.ID,
                        course_title: course?.post_title,
                        quantity: 1,
                        price: price,
                        additional_fee: 0,
                        discount: discount,
                        price_after_discount: price_after_discount,
                        tax: tax,
                        price_after_tax: price_after_tax
                    },
                    {
                        course: course,
                        watch: props?.watch,
                        setValue: props?.setValue,
                    }
                )
                ]);

            props?.setValue("total_amount",
                props?.watch("order_items")?.reduce((acc, item) => acc + item?.price_after_tax, 0),
                {
                    shouldDirty: true
                });
            setInputValue("");
            setCourse(null);
        }
    }


    return (
        <Box sx={{
            display: "flex",
            gap: 2
        }}>
            <Autocomplete
                size="small"
                freeSolo
                disableClearable
                inputValue={inputValue}
                loading={isFetching}
                fullWidth
                value={course}
                options={data?.data?.courses?.length > 0 ?
                    data?.data?.courses?.filter(c => !props?.watch("order_items")?.some(o => o?.course_id === c?.ID)) : []}
                getOptionLabel={(option) => option?.post_title || ""}
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
                    setCourse(newValue);
                }}
            />
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleAddOrderItem}
            >
                {__('Add', 'acadlix')}
            </Button>
        </Box>
    )
}

const OrderItem = ({ item, index, ...props }) => {
    const handleRemoveOrder = (id) => {
        props.setValue("order_items",
            props?.watch("order_items").filter((item) => item?.course_id !== id),
            { shouldDirty: true }
        );
        props.setValue("courses",
            props?.watch("courses").filter((item) => item?.ID !== id),
            { shouldDirty: true }
        );
    }
    const defaultSetting = {
        component: "Fragment",
        children: [
            {
                component: "TableRow",
                component_name: "order_items_detail_table_row",
                index: index,
                props: {
                    sx: {
                        '&:last-child td, &:last-child th': { border: 0 },
                    }
                },
                children: [
                    {
                        component: "TableCell",
                        component_name: "order_items_title_table_cell",
                        props: {
                            component: "th",
                            scope: "row"
                        },
                        value: item?.course_title
                    },
                    {
                        component: "TableCell",
                        component_name: "order_items_quantity_table_cell",
                        value: item?.quantity
                    },
                    {
                        component: "TableCell",
                        component_name: "order_items_price_table_cell",
                        value: currencyPosition(item?.price)
                    },
                    {
                        component: "TableCell",
                        component_name: "order_items_additional_fee_table_cell",
                        value: currencyPosition(item?.additional_fee)
                    },
                    {
                        component: "TableCell",
                        component_name: "order_items_discount_table_cell",
                        value: currencyPosition(item?.discount)
                    },
                    {
                        component: "TableCell",
                        component_name: "order_items_price_after_discount_table_cell",
                        value: currencyPosition(item?.price_after_discount)
                    },
                    {
                        component: "TableCell",
                        component_name: "order_items_tax_table_cell",
                        value: currencyPosition(item?.tax)
                    },
                    {
                        component: "TableCell",
                        component_name: "order_items_price_after_tax_table_cell",
                        value: currencyPosition(item?.price_after_tax)
                    },
                    props?.create && ({
                        component: "TableCell",
                        component_name: "order_items_action_table_cell",
                        children: [
                            {
                                component: "IconButton",
                                component_name: "order_items_action_table_cell_icon_button",
                                props: {
                                    onClick: handleRemoveOrder.bind(this, item?.course_id)
                                },
                                children: [
                                    {
                                        component_name: "order_items_action_fa_trash_table_cell_icon_button",
                                        component: "FaTrash",
                                        props: {
                                            style: {
                                                fontSize: 14,
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    })
                ]
            }
        ]
    }

    const order_item = window?.acadlixHooks?.applyFilters?.(
        "acadlix.admin.order.order_item",
        [defaultSetting],
        {
            register: props?.register,
            control: props?.control,
            watch: props?.watch,
            setValue: props?.setValue,
            create: props?.create,
            item,
            index,
            handleRemoveOrder,
        }
    ) ?? [];

    return (
        <>
            {order_item.map((field, i) => (
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
};



export default OrderItems
