import React from 'react'
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';

const PayPal = (props) => {
    const paypalSetting = {
        component: "Fragment",
        component_name: "paypal_settings_fragment",
        children: [
            {
                component: "Box",
                component_name: "paypal_settings_box",
                props: {
                    sx: {
                        marginY: 2,
                        backgroundColor: "grey.light",
                    },
                },
                children: [
                    {
                        component: "Box",
                        component_name: "paypal_header_box",
                        props: {
                            sx: {
                                display: "flex",
                                justifyContent: "space-between",
                            },
                        },
                        children: [
                            {
                                component: "Typography",
                                component_name: "paypal_header_title",
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
                                        value: __("PayPal", "acadlix"),
                                    },
                                    {
                                        component: "CustomFeatureTooltip",
                                        component_name: "paypal_feature_tooltip",
                                        props: {
                                            plan: "open",
                                            msg: __("Refer docs to configure the PayPal Payment Gateway Properly.", "acadlix"),
                                            placement: "right-start",
                                            redirectTo: `${acadlixOptions?.acadlix_docs_url}monetization/paypal/`,
                                        }
                                    }
                                ],
                            },
                            {
                                component: "FormControlLabel",
                                component_name: "paypal_active_switch",
                                props: {
                                    label: __("Enable PayPal", "acadlix"),
                                    value: "yes",
                                    checked: props?.watch("acadlix_paypal_active") === "yes",
                                    control: {
                                        component: "CustomSwitch",
                                        props: {}
                                    },
                                    onClick: (e) => {
                                        if (e?.target?.checked !== undefined) {
                                            props?.setValue(
                                                "acadlix_paypal_active",
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
                        component_name: "paypal_header_divider",
                    },
                ],
            },
            props?.watch("acadlix_paypal_active") === "yes" && ({
                component: "Grid",
                component_name: "paypal_main_grid",
                props: {
                    container: true,
                    spacing: { xs: 2, sm: 4 },
                    sx: { alignItems: "center" },
                },
                children: [
                    // 🔹 Info Alert
                    {
                        component: "Grid",
                        component_name: "paypal_webhook_info_grid",
                        props: {
                            size: { lg: 12, md: 12, sm: 12, xs: 12 },
                        },
                        children: [
                            {
                                component: "Alert",
                                component_name: "paypal_webhook_info_alert",
                                props: {
                                    severity: "info",
                                },
                                value: __("Required webhook event: CHECKOUT.ORDER.APPROVED", "acadlix"),
                            },
                        ],
                    },
                    // 🔹 Make Default
                    {
                        component: "Grid",
                        component_name: "paypal_make_default_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "paypal_make_default_label",
                                value: __("Make Default", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "paypal_make_default_switch_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                        },
                        children: [
                            {
                                component: "FormControlLabel",
                                component_name: "paypal_make_default_switch",
                                props: {
                                    label: __("Default", "acadlix"),
                                    value: "paypal",
                                    checked: props?.watch("acadlix_default_payment_gateway") === "paypal",
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
                        component_name: "paypal_enable_sandbox_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "paypal_enable_sandbox_label",
                                value: __("Enable Sandbox", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "paypal_enable_sandbox_switch_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                        },
                        children: [
                            {
                                component: "FormControlLabel",
                                component_name: "paypal_enable_sandbox_switch",
                                props: {
                                    label: __("Activate", "acadlix"),
                                    value: "yes",
                                    checked: props?.watch("acadlix_paypal_sandbox") === "yes",
                                    control: { component: "CustomSwitch", props: {} },
                                    onClick: (e) => {
                                        if (e?.target?.checked !== undefined) {
                                            props?.setValue(
                                                "acadlix_paypal_sandbox",
                                                e?.target?.checked ? e?.target?.value : "no",
                                                { shouldDirty: true }
                                            );
                                        }
                                    },
                                },
                            },
                        ],
                    },
                    // 🔹 Client ID
                    {
                        component: "Grid",
                        component_name: "paypal_client_id_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "paypal_client_id_label",
                                value: __("Client ID", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "paypal_client_id_input_grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                        },
                        children: [
                            {
                                component: "PasswordTextField",
                                props: {
                                    ...props?.register("acadlix_paypal_client_id"),
                                    component_name: "paypal_client_id_input",
                                    fullWidth: true,
                                    size: "small",
                                    label: __("Client ID", "acadlix"),
                                    // value: props?.watch("acadlix_paypal_client_id"),
                                    onChange: (e) => {
                                        props?.setValue("acadlix_paypal_client_id", e?.target?.value, {
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
                        component_name: "paypal_secret_key_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "paypal_secret_key_label",
                                value: __("Secret Key", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "paypal_secret_key_input_grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                        },
                        children: [
                            {
                                component: "PasswordTextField",
                                component_name: "paypal_secret_key_input",
                                props: {
                                    ...props?.register("acadlix_paypal_secret_key"),
                                    fullWidth: true,
                                    size: "small",
                                    label: __("Secret Key", "acadlix"),
                                    // value: props?.watch("acadlix_paypal_secret_key"),
                                    onChange: (e) => {
                                        props?.setValue("acadlix_paypal_secret_key", e?.target?.value, {
                                            shouldDirty: true,
                                        });
                                    },
                                },
                            },
                        ],
                    },
                    // 🔹 Webhook Id
                    {
                        component: "Grid",
                        component_name: "paypal_webhook_id_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "paypal_webhook_id_label",
                                value: __("Webhook ID", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "paypal_webhook_id_input_grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                        },
                        children: [
                            {
                                component: "PasswordTextField",
                                component_name: "paypal_webhook_id_input",
                                props: {
                                    ...props?.register("acadlix_paypal_webhook_id"),
                                    fullWidth: true,
                                    size: "small",
                                    label: __("Webhook ID", "acadlix"),
                                    // value: props?.watch("acadlix_paypal_webhook_id"),
                                    onChange: (e) => {
                                        props?.setValue("acadlix_paypal_webhook_id", e?.target?.value, {
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
                        component_name: "paypal_webhook_url_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "paypal_webhook_url_label",
                                value: __("Webhook URL", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "paypal_webhook_url_input_grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomCopyableText",
                                component_name: "paypal_webhook_url_input",
                                props: {
                                    value: props?.options?.acadlix_paypal_webhook_url,
                                },
                            },
                        ],
                    },
                ],
            }),
        ]
    };

    // 🔹 Apply WordPress-style filter for extensibility
    const paypal_setting_after = window?.acadlixHooks?.applyFilters?.(
        "acadlix.admin.payment_gateways.paypal.after",
        [paypalSetting],
        {
            register: props?.register,
            control: props?.control,
            watch: props?.watch,
            setValue: props?.setValue,
        }
    ) ?? [];

    return (
        <>
            {paypal_setting_after.map((field, i) => (
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

export default PayPal