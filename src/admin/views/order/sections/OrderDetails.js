import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';
import React from 'react'
import { __ } from '@wordpress/i18n';

const OrderDetails = (props) => {

    const defaultSetting = {
        component: "Grid",
        component_name: "order_details_grid",
        props: {
            size: { xs: 12, sm: 12 },
        },
        children: [
            {
                component: "Card",
                component_name: "order_details_card",
                children: [
                    {
                        component: "CardContent",
                        component_name: "order_details_card_content",
                        children: [
                            {
                                component: "Box",
                                component_name: "order_details_box",
                                props: {
                                    sx: {
                                        marginY: 2,
                                    }
                                },
                                children: [
                                    {
                                        component: "Typography",
                                        component_name: "order_details_title_typography",
                                        props: {
                                            variant: "h4"
                                        },
                                        value: __("Order Details", "acadlix")
                                    },
                                    {
                                        component: "Divider",
                                        component_name: "order_details_divider"
                                    }
                                ]
                            },
                            {
                                component: "Grid",
                                component_name: "order_details_grid_container",
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
                                        component_name: "order_details_order_id_label_grid_item",
                                        props: {
                                            size: { xs: 12, sm: 6, lg: 3 },
                                        },
                                        children: [
                                            {
                                                component: "CustomTypography",
                                                component_name: "order_details_label_custom_typography",
                                                value: __("Order ID", "acadlix")
                                            }
                                        ]
                                    },
                                    {
                                        component: "Grid",
                                        component_name: "order_details_order_id_value_grid_item",
                                        props: {
                                            size: { xs: 12, sm: 6, lg: 3 },
                                        },
                                        children: [
                                            {
                                                component: "Typography",
                                                component_name: "order_details_order_id_value_typography",
                                                props: {
                                                    variant: "body1",
                                                },
                                                value: `#${props?.watch("id")}`,
                                            }
                                        ]
                                    },
                                    {
                                        component: "Grid",
                                        component_name: "order_details_payment_method_grid_item",
                                        props: {
                                            size: { xs: 12, sm: 6, lg: 3 },
                                        },
                                        children: [
                                            {
                                                component: "CustomTypography",
                                                component_name: "order_details_payment_method_label_custom_typography",
                                                value: __("Payment Method", "acadlix")
                                            }
                                        ]
                                    },
                                    {
                                        component: "Grid",
                                        component_name: "order_details_payment_method_value_grid_item",
                                        props: {
                                            size: { xs: 12, sm: 6, lg: 3 },
                                        },
                                        children: [
                                            {
                                                component: "Typography",
                                                component_name: "order_details_payment_method_value_typography",
                                                props: {
                                                    variant: "body1",
                                                    sx: {
                                                        textTransform: "uppercase",
                                                    }
                                                },
                                                value: props?.watch("meta.payment_method"),
                                            }
                                        ]
                                    },
                                    {
                                        component: "Grid",
                                        component_name: "order_details_order_id_label_grid_item",
                                        props: {
                                            size: { xs: 12, sm: 6, lg: 3 },
                                        },
                                        children: [
                                            {
                                                component: "CustomTypography",
                                                component_name: "order_details_label_custom_typography",
                                                value: __("Transaction ID", "acadlix")
                                            }
                                        ]
                                    },
                                    {
                                        component: "Grid",
                                        component_name: "order_details_order_id_value_grid_item",
                                        props: {
                                            size: { xs: 12, sm: 6, lg: 9 },
                                        },
                                        children: [
                                            {
                                                component: "Typography",
                                                component_name: "order_details_order_id_value_custom_typography",
                                                props: {
                                                    variant: "body1",
                                                },
                                                value: props?.watch("meta.transaction_id") ?? "N/A",
                                            }
                                        ]
                                    },
                                    props?.watch("meta.offline_user_text") && {
                                        component: "Fragment",
                                        component_name: "order_details_offline_payment_user_text_fragment",
                                        children: [
                                            {
                                                component: "Grid",
                                                component_name: "order_details_offline_user_text_label_grid_item",
                                                props: {
                                                    size: { xs: 12, sm: 6, lg: 3 },
                                                },
                                                children: [
                                                    {
                                                        component: "CustomTypography",
                                                        component_name: "order_details_offline_user_text_label_custom_typography",
                                                        value: __("Offline User Text", "acadlix")
                                                    }
                                                ]
                                            },
                                            {
                                                component: "Grid",
                                                component_name: "order_details_offline_user_text_value_grid_item",
                                                props: {
                                                    size: { xs: 12, sm: 6, lg: 9 },
                                                },
                                                children: [
                                                    {
                                                        component: "Typography",
                                                        component_name: "order_details_offline_user_text_value_custom_typography",
                                                        props: {
                                                            variant: "body1",
                                                        },
                                                        value: props?.watch("meta.offline_user_text") ?? "N/A",
                                                    }
                                                ]
                                            },
                                        ]
                                    },
                                    props?.watch("meta.offline_upload_file") != null && {
                                        component: "Fragment",
                                        component_name: "order_details_offline_payment_upload_file_fragment",
                                        children: [
                                            {
                                                component: "Grid",
                                                component_name: "order_details_offline_upload_file_label_grid_item",
                                                props: {
                                                    size: { xs: 12, sm: 6, lg: 3 },
                                                },
                                                children: [
                                                    {
                                                        component: "CustomTypography",
                                                        component_name: "order_details_offline_upload_file_label_custom_typography",
                                                        value: __("Offline Upload File", "acadlix")
                                                    }
                                                ]
                                            },
                                            {
                                                component: "Grid",
                                                component_name: "order_details_offline_upload_file_value_grid_item",
                                                props: {
                                                    size: { xs: 12, sm: 6, lg: 9 },
                                                },
                                                children: [
                                                    {
                                                        component: "Link",
                                                        component_name: "order_details_offline_upload_file_value_custom_typography",
                                                        props: {
                                                            href: props?.watch("meta.offline_upload_file")?.file_url ?? "#",
                                                            target: "_blank",
                                                            rel: "noopener noreferrer",
                                                        },
                                                        value: props?.watch("meta.offline_upload_file")?.file_name ?? "N/A",
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

    const order_details_setting = window?.acadlixHooks?.applyFilters?.(
        "acadlix.admin.order.order_details",
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
            {order_details_setting.map((field, i) => (
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

export default OrderDetails