import React from 'react'
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';

const PayU = (props) => {
    const payuSetting = {
        component: "Fragment",
        component_name: "payu_settings_fragment",
        children: [
            {
                component: "Box",
                component_name: "payu_settings_box",
                props: {
                    sx: {
                        marginY: 2,
                        backgroundColor: "grey.light",
                    },
                },
                children: [
                    {
                        component: "Box",
                        component_name: "payu_header_box",
                        props: {
                            sx: {
                                display: "flex",
                                justifyContent: "space-between",
                            },
                        },
                        children: [
                            {
                                component: "Typography",
                                component_name: "payu_header_title",
                                props: {
                                    variant: "h5",
                                    sx: {
                                        paddingX: 2,
                                        paddingY: 2,
                                    },
                                },
                                value: __("PayU", "acadlix"),
                            },
                            {
                                component: "FormControlLabel",
                                component_name: "payu_enable_switch",
                                props: {
                                    label: __("Enable PayU", "acadlix"),
                                    value: "yes",
                                    checked: props?.watch("acadlix_payu_active") === "yes",
                                    control: { component: "CustomSwitch", props: {} },
                                    onClick: (e) => {
                                        if (e?.target?.checked !== undefined) {
                                            props?.setValue(
                                                "acadlix_payu_active",
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
                        component_name: "payu_header_divider",
                    },
                ],
            },
            props?.watch("acadlix_payu_active") === "yes" && ({
                component: "Grid",
                component_name: "payu_main_grid",
                props: {
                    container: true,
                    spacing: { xs: 2, sm: 4 },
                    sx: { alignItems: "center" },
                },
                children: [
                    // 🔹 Info Alert
                    {
                        component: "Grid",
                        component_name: "payu_webhook_info_grid",
                        props: {
                            size: { lg: 12, md: 12, sm: 12, xs: 12 },
                        },
                        children: [
                            {
                                component: "Alert",
                                component_name: "payu_webhook_info_alert",
                                props: {
                                    severity: "info",
                                },
                                value: __("Required webhook event: Successful", "acadlix"),
                            },
                        ],
                    },
                    // 🔹 Make Default PayU
                    {
                        component: "Grid",
                        component_name: "payu_make_default_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "payu_make_default_label",
                                value: __("Make Default", "acadlix"),
                            },
                        ],
                    },

                    {
                        component: "Grid",
                        component_name: "payu_make_default_switch_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                        },
                        children: [
                            {
                                component: "FormControlLabel",
                                component_name: "payu_default_gateway_switch",
                                props: {
                                    label: __("Default", "acadlix"),
                                    value: "payu",
                                    checked: props?.watch("acadlix_default_payment_gateway") === "payu",
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
                    // 🔹 Enable Sandbox
                    {
                        component: "Grid",
                        component_name: "payu_enable_sandbox_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "payu_enable_sandbox_label",
                                value: __("Enable Sandbox", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "payu_enable_sandbox_switch_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                        },
                        children: [
                            {
                                component: "FormControlLabel",
                                component_name: "payu_enable_sandbox_switch",
                                props: {
                                    label: __("Activate", "acadlix"),
                                    value: "yes",
                                    checked: props?.watch("acadlix_payu_sandbox") === "yes",
                                    control: { component: "CustomSwitch", props: {} },
                                    onClick: (e) => {
                                        if (e?.target?.checked !== undefined) {
                                            props?.setValue(
                                                "acadlix_payu_sandbox",
                                                e?.target?.checked ? e?.target?.value : "no",
                                                { shouldDirty: true }
                                            );
                                        }
                                    },
                                },
                            },
                        ],
                    },
                    // 🔹 Merchant Key
                    {
                        component: "Grid",
                        component_name: "payu_merchant_key_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "payu_merchant_key_label",
                                value: __("Merchant Key", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "payu_merchant_key_input_grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                        },
                        children: [
                            {
                                component: "PasswordTextField",
                                component_name: "payu_merchant_key_input",
                                props: {
                                    ...props?.register("acadlix_payu_merchant_key"),
                                    fullWidth: true,
                                    size: "small",
                                    label: __("Merchant Key", "acadlix"),
                                    // value: props?.watch("acadlix_payu_merchant_key"),
                                    onChange: (e) => {
                                        props?.setValue("acadlix_payu_merchant_key", e?.target?.value, {
                                            shouldDirty: true,
                                        });
                                    },
                                },
                            },
                        ],
                    },
                    // 🔹 Salt
                    {
                        component: "Grid",
                        component_name: "payu_salt_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "payu_salt_label",
                                value: __("Salt", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "payu_salt_input_grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                        },
                        children: [
                            {
                                component: "PasswordTextField",
                                component_name: "payu_salt_input",
                                props: {
                                    ...props?.register("acadlix_payu_salt"),
                                    fullWidth: true,
                                    size: "small",
                                    label: __("Salt", "acadlix"),
                                    // value: props?.watch("acadlix_payu_salt"),
                                    onChange: (e) => {
                                        props?.setValue("acadlix_payu_salt", e?.target?.value, {
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
                        component_name: "payu_webhook_url_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "payu_webhook_url_label",
                                value: __("Webhook URL", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "payu_webhook_url_input_grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomCopyableText",
                                component_name: "payu_webhook_url_input",
                                props: {
                                    value: props?.options?.acadlix_payu_webhook_url,
                                },
                            },
                        ],
                    },
                ],
            }),
        ],  
    };

    // 🔹 Apply WordPress-style filter for extensibility
    const payu_setting_after = window?.acadlixHooks?.applyFilters?.(
        "acadlix.admin.payment_gateways.payu.after",
        [payuSetting],
        {
            register: props?.register,
            control: props?.control,
            watch: props?.watch,
            setValue: props?.setValue,
        }
    ) ?? [];

    return (
        <>
            {payu_setting_after.map((field, i) => (
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

export default PayU