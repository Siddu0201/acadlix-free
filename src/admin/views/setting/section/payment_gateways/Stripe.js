import React from 'react'
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';

const Stripe = (props) => {
    const stripeSetting = {
        component: "Fragment",
        component_name: "stripe_settings_fragment",
        children: [
            {
                component: "Box",
                component_name: "stripe_settings_box",
                props: {
                    sx: { marginY: 2, backgroundColor: "grey.light" },
                },
                children: [
                    {
                        component: "Box",
                        component_name: "stripe_header_box",
                        props: {
                            sx: { display: "flex", justifyContent: "space-between" },
                        },
                        children: [
                            {
                                component: "Typography",
                                component_name: "stripe_header_title",
                                props: {
                                    variant: "h5",
                                    sx: { paddingX: 2, paddingY: 2 },
                                },
                                value: __("Stripe", "acadlix"),
                            },
                            {
                                component: "FormControlLabel",
                                component_name: "stripe_enable_switch",
                                props: {
                                    label: __("Enable Stripe", "acadlix"),
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
                    {
                        component: "Divider",
                        component_name: "stripe_header_divider",
                    },
                ],
            },
            props?.watch("acadlix_stripe_active") === "yes" && ({
                component: "Grid",
                component_name: "stripe_main_grid",
                props: {
                    container: true,
                    spacing: { xs: 2, sm: 4 },
                    sx: { alignItems: "center" },
                },
                children: [
                    // 🔹 Info Alert
                    {
                        component: "Grid",
                        component_name: "stripe_webhook_info_grid",
                        props: {
                            size: { lg: 12, md: 12, sm: 12, xs: 12 },
                        },
                        children: [
                            {
                                component: "Alert",
                                component_name: "stripe_webhook_info_alert",
                                props: {
                                    severity: "info",
                                },
                                value: __("Required webhook event: checkout*", "acadlix"),
                            },
                        ],
                    },

                    // 🔹 Make Default
                    {
                        component: "Grid",
                        component_name: "stripe_make_default_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "stripe_make_default_label",
                                value: __("Make Default", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "stripe_make_default_switch_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                        },
                        children: [
                            {
                                component: "FormControlLabel",
                                component_name: "stripe_default_gateway_switch",
                                props: {
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

                    // 🔹 Enable Sandbox
                    {
                        component: "Grid",
                        component_name: "stripe_enable_sandbox_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "stripe_enable_sandbox_label",
                                value: __("Enable Sandbox", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "stripe_enable_sandbox_switch_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                        },
                        children: [
                            {
                                component: "FormControlLabel",
                                component_name: "stripe_enable_sandbox_switch",
                                props: {
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
                        component_name: "stripe_public_key_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "stripe_public_key_label",
                                value: __("Public key", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "stripe_public_key_input_grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                        },
                        children: [
                            {
                                component: "PasswordTextField",
                                component_name: "stripe_public_key_input",
                                props: {
                                    ...props?.register("acadlix_stripe_public_key"),
                                    fullWidth: true,
                                    size: "small",
                                    label: __("Public key", "acadlix"),
                                    // value: props?.watch("acadlix_stripe_public_key"),
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
                        component_name: "stripe_secret_key_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "stripe_secret_key_label",
                                value: __("Secret Key", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "stripe_secret_key_input_grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                        },
                        children: [
                            {
                                component: "PasswordTextField",
                                component_name: "stripe_secret_key_input",
                                props: {
                                    ...props?.register("acadlix_stripe_secret_key"),
                                    fullWidth: true,
                                    size: "small",
                                    label: __("Secret Key", "acadlix"),
                                    // value: props?.watch("acadlix_stripe_secret_key"),
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
                        component_name: "stripe_webhook_signature_key_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "stripe_webhook_signature_key_label",
                                value: __("Webhook Signature Key", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "stripe_webhook_signature_key_input_grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                        },
                        children: [
                            {
                                component: "PasswordTextField",
                                component_name: "stripe_webhook_signature_key_input",
                                props: {
                                    ...props?.register("acadlix_stripe_webhook_signature_key"),
                                    fullWidth: true,
                                    size: "small",
                                    label: __("Webhook Signature Key", "acadlix"),
                                    // value: props?.watch("acadlix_stripe_webhook_signature_key"),
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
                        component_name: "stripe_webhook_url_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "stripe_webhook_url_label",
                                value: __("Webhook URL", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "stripe_webhook_url_input_grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomCopyableText",
                                component_name: "stripe_webhook_url_input",
                                props: {
                                    value: props?.options?.acadlix_stripe_webhook_url,
                                },
                            },
                        ],
                    },
                ],
            }),
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