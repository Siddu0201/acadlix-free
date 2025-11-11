import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';
import React from 'react'
import { __ } from "@wordpress/i18n";

const Authentication = (props) => {
    const defaultSetting = {
        component: "Card",
        component_name: "setting_authentication_card",
        children: [
            {
                component: "CardContent",
                component_name: "setting_authentication_card_content",
                children: [
                    {
                        component: "Box",
                        component_name: "setting_authentication_card_box",
                        children: [
                            {
                                component: "Box",
                                component_name: "setting_authentication_card_box_header",
                                props: {
                                    sx: {
                                        marginY: 2,
                                    },
                                },
                                children: [
                                    {
                                        component: "Typography",
                                        component_name: "setting_authentication_card_title",
                                        props: {
                                            variant: "h4",
                                        },
                                        value: __("Fraud Protection", "acadlix"),
                                    },
                                    {
                                        component: "Divider",
                                    },
                                ],
                            },
                            {
                                component: "Grid",
                                props: {
                                    container: true,
                                    spacing: {
                                        xs: 2,
                                        sm: 4,
                                    },
                                    sx: {
                                        alignItems: "center",
                                    },
                                },
                                children: [
                                    {
                                        component: "Grid",
                                        props: {
                                            size: { xs: 12, sm: 6, lg: 3 },
                                        },
                                        children: [
                                            {
                                                component: "CustomTypography",
                                                value: __("Enable Fraud Protection", "acadlix"),
                                            }
                                        ],
                                    },
                                    {
                                        component: "Grid",
                                        props: {
                                            size: { xs: 12, sm: 6, lg: 9 },
                                        },
                                        children: [
                                            {
                                                component: "FormControlLabel",
                                                props: {
                                                    control: {
                                                        component: "CustomSwitch",
                                                    },
                                                    label: __("Activate", "acadlix"),
                                                    value: "yes",
                                                    checked: props?.watch("acadlix_enable_fraud_protection") === "yes",
                                                    onClick: (e) => {
                                                        if (e?.target?.checked !== undefined) {
                                                            props?.setValue(
                                                                "acadlix_enable_fraud_protection",
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
                                        props: {
                                            size: { xs: 12, sm: 6, lg: 3 },
                                        },
                                        children: [
                                            {
                                                component: "CustomTypography",
                                                value: __("v3 Site Key", "acadlix"),
                                            }
                                        ],
                                    },
                                    {
                                        component: "Grid",
                                        props: {
                                            size: { xs: 12, sm: 6, lg: 9 },
                                        },
                                        children: [
                                            {
                                                component: "PasswordTextField",
                                                props: {
                                                    fullWidth: true,
                                                    size: "small",
                                                    label: __("Enter v3 Site Key", "acadlix"),
                                                    value: props?.watch("acadlix_v3_site_key"),
                                                    onChange: (e) => props?.setValue("acadlix_v3_site_key", e.target.value, { shouldDirty: true }),
                                                },
                                            }
                                        ],
                                    },
                                    {
                                        component: "Grid",
                                        props: {
                                            size: { xs: 12, sm: 6, lg: 3 },
                                        },
                                        children: [
                                            {
                                                component: "CustomTypography",
                                                value: __("v3 Secret Key", "acadlix"),
                                            }
                                        ],
                                    },
                                    {
                                        component: "Grid",
                                        props: {
                                            size: { xs: 12, sm: 6, lg: 9 },
                                        },
                                        children: [
                                            {
                                                component: "PasswordTextField",
                                                props: {
                                                    fullWidth: true,
                                                    size: "small",
                                                    label: __("Enter v3 Secret Key", "acadlix"),
                                                    value: props?.watch("acadlix_v3_secret_key"),
                                                    onChange: (e) => props?.setValue("acadlix_v3_secret_key", e.target.value, { shouldDirty: true }),
                                                },
                                            }
                                        ],
                                    },
                                ],
                            }
                        ],
                    },
                ],
            },
            {
                component: "CardActions",
                component_name: "setting_authentication_card_actions",
                children: [
                    {
                        component: "Button",
                        component_name: "setting_authentication_card_actions_button",
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
    };

    // 🔹 Apply WordPress-style filter for extensibility
    const authentication_setting = window?.acadlixHooks?.applyFilters?.(
        "acadlix.admin.settings.authentication",
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
            {authentication_setting.map((field, i) => (
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

export default Authentication