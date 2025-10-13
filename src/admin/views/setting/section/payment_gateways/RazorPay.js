import React from 'react'
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';

const RazorPay = (props) => {
    const razorpaySetting = {
        component: "Fragment",
        component_name: "razorpay_settings_fragment",
        children: [
            {
                component: "Box",
                component_name: "razorpay_settings_box",
                props: {
                    sx: {
                        marginY: 2,
                        backgroundColor: "grey.light",
                    },
                },
                children: [
                    {
                        component: "Box",
                        component_name: "razorpay_header_box",
                        props: {
                            sx: {
                                display: "flex",
                                justifyContent: "space-between",
                            },
                        },
                        children: [
                            {
                                component: "Typography",
                                component_name: "razorpay_header_title",
                                props: {
                                    variant: "h5",
                                    sx: {
                                        paddingX: 2,
                                        paddingY: 2,
                                    },
                                },
                                value: __("RazorPay", "acadlix"),
                            },
                            {
                                component: "FormControlLabel",
                                component_name: "razorpay_default_gateway_switch",
                                props: {
                                    label: __("Default", "acadlix"),
                                    value: "razorpay",
                                    checked: props?.watch("acadlix_default_payment_gateway") === "razorpay",
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
                        component: "Divider",
                        component_name: "razorpay_header_divider",
                    },
                ],
            },
            {
                component: "Grid",
                component_name: "razorpay_main_grid",
                props: {
                    container: true,
                    spacing: { xs: 2, sm: 4 },
                    sx: { alignItems: "center" },
                },
                children: [
                    // 🔹 Info Alert
                    {
                        component: "Grid",
                        component_name: "razorpay_webhook_info_grid",
                        props: {
                            size: { lg: 12, md: 12, sm: 12, xs: 12 },
                        },
                        children: [
                            {
                                component: "Alert",
                                component_name: "razorpay_webhook_info_alert",
                                props: {
                                    severity: "info",
                                },
                                value: __("Required webhook event: payment.authorized, payment.failed", "acadlix"),
                            },
                        ],
                    },
                    // 🔹 Enable Razorpay
                    {
                        component: "Grid",
                        component_name: "razorpay_enable_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "razorpay_enable_label",
                                value: __("Enable RazorPay", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "razorpay_enable_switch_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                        },
                        children: [
                            {
                                component: "FormControlLabel",
                                component_name: "razorpay_enable_switch",
                                props: {
                                    label: __("Activate", "acadlix"),
                                    value: "yes",
                                    checked: props?.watch("acadlix_razorpay_active") === "yes",
                                    control: { component: "CustomSwitch", props: {} },
                                    onClick: (e) => {
                                        if (e?.target?.checked !== undefined) {
                                            props?.setValue(
                                                "acadlix_razorpay_active",
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
                        component: "Grid",
                        component_name: "razorpay_test_mode_switch_grid",
                        props: {
                            size: { lg: 6, md: 6, sm: 0, xs: 0 },
                            sx: { display: { lg: "block", md: "block", sm: "none", xs: "none" } },
                        },
                        value: "",
                    },
                    // 🔹 Client ID
                    {
                        component: "Grid",
                        component_name: "razorpay_client_id_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "razorpay_client_id_label",
                                value: __("Client ID", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                            component_name: "razorpay_client_id_input_grid",
                        },
                        children: [
                            {
                                component: "PasswordTextField",
                                component_name: "razorpay_client_id_input",
                                props: {
                                    fullWidth: true,
                                    size: "small",
                                    label: __("Client ID", "acadlix"),
                                    value: props?.watch("acadlix_razorpay_client_id"),
                                    onChange: (e) => {
                                        props?.setValue("acadlix_razorpay_client_id", e?.target?.value, {
                                            shouldDirty: true,
                                        });
                                    },
                                },
                            },
                        ],
                    },
                    // 🔹 Secret Key
                    {
                        component: "Grid",
                        component_name: "razorpay_secret_key_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "razorpay_secret_key_label",
                                value: __("Secret Key", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "razorpay_secret_key_input_grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                        },
                        children: [
                            {
                                component: "PasswordTextField",
                                component_name: "razorpay_secret_key_input",
                                props: {
                                    fullWidth: true,
                                    size: "small",
                                    label: __("Secret Key", "acadlix"),
                                    value: props?.watch("acadlix_razorpay_secret_key"),
                                    onChange: (e) => {
                                        props?.setValue("acadlix_razorpay_secret_key", e?.target?.value, {
                                            shouldDirty: true,
                                        });
                                    },
                                },
                            },
                        ],
                    },
                    // 🔹 Webhook Secret
                    {
                        component: "Grid",
                        component_name: "razorpay_webhook_secret_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "razorpay_webhook_secret_label",
                                value: __("Webhook Secret", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "razorpay_webhook_secret_input_grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                        },
                        children: [
                            {
                                component: "PasswordTextField",
                                component_name: "razorpay_webhook_secret_input",
                                props: {
                                    fullWidth: true,
                                    size: "small",
                                    label: __("Webhook Secret", "acadlix"),
                                    value: props?.watch("acadlix_razorpay_webhook_secret"),
                                    onChange: (e) => {
                                        props?.setValue("acadlix_razorpay_webhook_secret", e?.target?.value, {
                                            shouldDirty: true,
                                        });
                                    },
                                },
                            },
                        ],
                    },
                    // 🔹 Webhook URL
                    {
                        component: "Grid",
                        component_name: "razorpay_webhook_url_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "razorpay_webhook_url_label",
                                value: __("Webhook URL", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "razorpay_webhook_url_input_grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomCopyableText",
                                component_name: "razorpay_webhook_url_input",
                                props: {
                                    value: props?.options?.acadlix_razorpay_webhook_url,
                                },
                            },
                        ],
                    },
                ],
            },
        ]
    };

    // 🔹 Apply WordPress-style filter for extensibility
    const razorpay_setting_after = window?.acadlixHooks?.applyFilters?.(
        "acadlix.admin.payment_gateways.razorpay.after",
        [razorpaySetting],
        {
            register: props?.register,
            control: props?.control,
            watch: props?.watch,
            setValue: props?.setValue,
        }
    ) ?? [];

    return (
        <>
            {razorpay_setting_after.map((field, i) => (
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

export default RazorPay