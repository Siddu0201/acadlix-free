import React from 'react'
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';

const Stripe = (props) => {
    const stripeSetting = {
        component: "Fragment",
        children: [
            {
                component: "Box",
                props: {
                    component_name: "stripe_settings_box",
                    sx: { marginY: 2, backgroundColor: "grey.light" },
                },
                children: [
                    {
                        component: "Box",
                        props: {
                            sx: { display: "flex", justifyContent: "space-between" },
                            component_name: "stripe_header_box",
                        },
                        children: [
                            {
                                component: "Typography",
                                props: {
                                    variant: "h6",
                                    sx: { paddingX: 2, paddingY: 2 },
                                    component_name: "stripe_header_title",
                                },
                                value: __("Stripe", "acadlix"),
                            },
                            {
                                component: "FormControlLabel",
                                props: {
                                    component_name: "stripe_default_gateway_switch",
                                    label: __("Default", "acadlix"),
                                    value: "stripe",
                                    checked: props?.watch("acadlix_default_payment_gateway") === "stripe",
                                    control: { component: "CustomSwitch", props: {} },
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
                        props: { component_name: "stripe_header_divider" },
                    },
                ],
            },
            {
                component: "Grid",
                props: {
                    container: true,
                    spacing: { xs: 2, sm: 4 },
                    sx: { alignItems: "center" },
                    component_name: "stripe_main_grid",
                },
                children: [
                    // 🔹 Info Alert
                    {
                        component: "Grid",
                        props: {
                            size: { lg: 12, md: 12, sm: 12, xs: 12 },
                            component_name: "stripe_webhook_info_grid",
                        },
                        children: [
                            {
                                component: "Alert",
                                props: {
                                    severity: "info",
                                    component_name: "stripe_webhook_info_alert",
                                },
                                value: __("Required webhook event: checkout*", "acadlix"),
                            },
                        ],
                    },

                    // 🔹 Enable Stripe
                    {
                        component: "Grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                            component_name: "stripe_enable_label_grid",
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                props: { component_name: "stripe_enable_label" },
                                value: __("Enable Stripe", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                            component_name: "stripe_enable_switch_grid",
                        },
                        children: [
                            {
                                component: "FormControlLabel",
                                props: {
                                    component_name: "stripe_enable_switch",
                                    label: __("Activate", "acadlix"),
                                    value: "yes",
                                    checked: props?.watch("acadlix_stripe_active") === "yes",
                                    control: { component: "CustomSwitch", props: {} },
                                    onClick: (e) => {
                                        if (e?.target?.checked !== undefined) {
                                            props?.setValue(
                                                "acadlix_stripe_active",
                                                e?.target?.checked ? e?.target?.value : "no",
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
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                            component_name: "stripe_enable_sandbox_label_grid",
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                props: { component_name: "stripe_enable_sandbox_label" },
                                value: __("Enable Sandbox", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                            component_name: "stripe_enable_sandbox_switch_grid",
                        },
                        children: [
                            {
                                component: "FormControlLabel",
                                props: {
                                    component_name: "stripe_enable_sandbox_switch",
                                    label: __("Activate", "acadlix"),
                                    value: "yes",
                                    checked: props?.watch("acadlix_stripe_sandbox") === "yes",
                                    control: { component: "CustomSwitch", props: {} },
                                    onClick: (e) => {
                                        if (e?.target?.checked !== undefined) {
                                            props?.setValue(
                                                "acadlix_stripe_sandbox",
                                                e?.target?.checked ? e?.target?.value : "no",
                                                { shouldDirty: true }
                                            );
                                        }
                                    },
                                },
                            },
                        ],
                    },

                    // 🔹 Public Key
                    {
                        component: "Grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                            component_name: "stripe_public_key_label_grid",
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                props: { component_name: "stripe_public_key_label" },
                                value: __("Public key", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                            component_name: "stripe_public_key_input_grid",
                        },
                        children: [
                            {
                                component: "PasswordTextField",
                                props: {
                                    component_name: "stripe_public_key_input",
                                    fullWidth: true,
                                    size: "small",
                                    label: __("Public key", "acadlix"),
                                    value: props?.watch("acadlix_stripe_public_key"),
                                    onChange: (e) => {
                                        props?.setValue(
                                            "acadlix_stripe_public_key",
                                            e?.target?.value,
                                            { shouldDirty: true }
                                        );
                                    },
                                },
                            },
                        ],
                    },

                    // 🔹 Secret Key
                    {
                        component: "Grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                            component_name: "stripe_secret_key_label_grid",
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                props: { component_name: "stripe_secret_key_label" },
                                value: __("Secret Key", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                            component_name: "stripe_secret_key_input_grid",
                        },
                        children: [
                            {
                                component: "PasswordTextField",
                                props: {
                                    component_name: "stripe_secret_key_input",
                                    fullWidth: true,
                                    size: "small",
                                    label: __("Secret Key", "acadlix"),
                                    value: props?.watch("acadlix_stripe_secret_key"),
                                    onChange: (e) => {
                                        props?.setValue(
                                            "acadlix_stripe_secret_key",
                                            e?.target?.value,
                                            { shouldDirty: true }
                                        );
                                    },
                                },
                            },
                        ],
                    },

                    // 🔹 Webhook Signature Key
                    {
                        component: "Grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                            component_name: "stripe_webhook_signature_key_label_grid",
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                props: { component_name: "stripe_webhook_signature_key_label" },
                                value: __("Webhook Signature Key", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                            component_name: "stripe_webhook_signature_key_input_grid",
                        },
                        children: [
                            {
                                component: "PasswordTextField",
                                props: {
                                    component_name: "stripe_webhook_signature_key_input",
                                    fullWidth: true,
                                    size: "small",
                                    label: __("Webhook Signature Key", "acadlix"),
                                    value: props?.watch("acadlix_stripe_webhook_signature_key"),
                                    onChange: (e) => {
                                        props?.setValue(
                                            "acadlix_stripe_webhook_signature_key",
                                            e?.target?.value,
                                            { shouldDirty: true }
                                        );
                                    },
                                },
                            },
                        ],
                    },

                    // 🔹 Webhook URL
                    {
                        component: "Grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                            component_name: "stripe_webhook_url_label_grid",
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                props: { component_name: "stripe_webhook_url_label" },
                                value: __("Webhook URL", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                            component_name: "stripe_webhook_url_input_grid",
                        },
                        children: [
                            {
                                component: "CustomCopyableText",
                                props: {
                                    component_name: "stripe_webhook_url_input",
                                    value: props?.options?.acadlix_stripe_webhook_url,
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    };

    // 🔹 Hookable (for extensions)
    const stripe_setting_after = window?.acadlixHooks?.applyFilters?.(
        "acadlix.admin.payment_gateways.stripe.after",
        [stripeSetting],
        {
            register: props?.register,
            control: props?.control,
            watch: props?.watch,
            setValue: props?.setValue,
        }
    ) ?? [];

    return (
        <>
            {stripe_setting_after.map((field, i) => (
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

export default Stripe