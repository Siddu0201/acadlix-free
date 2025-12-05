import React from 'react'
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";

const Offline = (props) => {
    const offlineSetting = {
        component: "Fragment",
        component_name: "offline_settings_fragment",
        children: [
            {
                component: "Box",
                component_name: "offline_settings_box",
                props: {
                    sx: {
                        marginY: 2,
                        backgroundColor: "grey.light",
                    },
                },
                children: [
                    {
                        component: "Box",
                        component_name: "offline_header_box",
                        props: {
                            sx: {
                                display: "flex",
                                justifyContent: "space-between",
                            },
                        },
                        children: [
                            {
                                component: "Typography",
                                component_name: "offline_header_title",
                                props: {
                                    variant: "h5",
                                    sx: {
                                        paddingX: 2,
                                        paddingY: 2,
                                    },
                                },
                                value: __("Offline Payment", "acadlix"),
                            },
                            {
                                component: "FormControlLabel",
                                component_name: "offline_active_switch",
                                props: {
                                    label: __("Enable Offline Payment", "acadlix"),
                                    value: "yes",
                                    checked: props?.watch("acadlix_offline_active") === "yes",
                                    control: {
                                        component: "CustomSwitch",
                                        props: {}
                                    },
                                    onClick: (e) => {
                                        if (e?.target?.checked !== undefined) {
                                            props?.setValue(
                                                "acadlix_offline_active",
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
                        component_name: "offline_header_divider",
                    },
                ],
            },
            props?.watch("acadlix_offline_active") === "yes" && ({
                component: "Grid",
                component_name: "offline_main_grid",
                props: {
                    container: true,
                    spacing: { xs: 2, sm: 4 },
                    sx: { alignItems: "center" },
                },
                children: [
                    // 🔹 Info Alert
                    {
                        component: "Grid",
                        component_name: "offline_info_grid",
                        props: {
                            size: { lg: 12, md: 12, sm: 12, xs: 12 },
                        },
                        children: [
                            {
                                component: "Alert",
                                component_name: "offline_info_alert",
                                props: {
                                    severity: "info",
                                },
                                value: __("Let users pay via bank transfer, cash, or QR code and submit a receipt or transaction ID for verification.", "acadlix"),
                            },
                        ],
                    },
                    // 🔹 Make Default
                    {
                        component: "Grid",
                        component_name: "offline_make_default_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "offline_make_default_label",
                                value: __("Make Default", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "offline_make_default_switch_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 6, xs: 12 },
                        },
                        children: [
                            {
                                component: "FormControlLabel",
                                component_name: "offline_make_default_switch",
                                props: {
                                    label: __("Default", "acadlix"),
                                    value: "offline",
                                    checked: props?.watch("acadlix_default_payment_gateway") === "offline",
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
                        component_name: "offline_test_mode_switch_grid",
                        props: {
                            size: { lg: 6, md: 6, sm: 0, xs: 0 },
                            sx: { display: { lg: "block", md: "block", sm: "none", xs: "none" } },
                        },
                        value: "",
                    },
                    // add Editor for Offline Instructions
                    {
                        component: "Grid",
                        component_name: "offline_instructions_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "offline_instructions_label",
                                value: __("Offline Instructions", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "offline_instructions_editor_grid",
                        props: {
                            size: { lg: 9, md: 9, sm: 9, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomWpEditor",
                                component_name: "offline_instructions_editor",
                                props: {
                                    id: "acadlix_offline_instructions",
                                    value: props?.watch("acadlix_offline_instructions") || "",
                                    onChange: (content) => {
                                        props?.setValue("acadlix_offline_instructions", content, { shouldDirty: true });
                                    },
                                },
                            },
                        ],
                    },
                    // 🔹 Enable File Upload
                    {
                        component: "Grid",
                        component_name: "offline_enable_file_upload_label_grid",
                        props: {
                            size: { lg: 3, md: 3, sm: 3, xs: 12 },
                        },
                        children: [
                            {
                                component: "CustomTypography",
                                component_name: "offline_enable_file_upload_label",
                                value: __("Enable File Upload", "acadlix"),
                            },
                        ],
                    },
                    {
                        component: "Grid",
                        component_name: "offline_enable_file_upload_input_grid",
                        props: {
                            size: { lg: 3, md: 9, sm: 9, xs: 12 },
                        },
                        children: [
                            {
                                component: "FormControlLabel",
                                component_name: "offline_enable_file_upload_switch",
                                props: {
                                    label: __("Activate", "acadlix"),
                                    value: "yes",
                                    checked: props?.watch("acadlix_offline_enable_file_upload") === "yes",
                                    control: {
                                        component: "CustomSwitch",
                                        props: {}
                                    },
                                    onClick: (e) => {
                                        if (e?.target?.checked !== undefined) {
                                            props?.setValue(
                                                "acadlix_offline_enable_file_upload",
                                                e?.target?.checked ? e?.target?.value : "no",
                                                { shouldDirty: true }
                                            );
                                        }
                                    },
                                },
                            },
                        ],
                    },

                    // 🔹 Upload File Fragment
                    props?.watch("acadlix_offline_enable_file_upload") === "yes" && ({
                        component: "Fragment",
                        component_name: "offline_max_upload_file_size_fragment",
                        children: [
                            // 🔹 Upload Max File Size Label    
                            {
                                component: "Grid",
                                component_name: "offline_max_upload_file_size_label_grid",
                                props: {
                                    size: { lg: 3, md: 3, sm: 3, xs: 12 },
                                },
                                children: [
                                    {
                                        component: "CustomTypography",
                                        component_name: "offline_max_upload_file_size_label",
                                        value: __("Upload File Size (Max)", "acadlix"),
                                    },
                                ],
                            },
                            {
                                component: "Grid",
                                component_name: "offline_max_upload_file_size_input_grid",
                                props: {
                                    size: { lg: 3, md: 9, sm: 9, xs: 12 },
                                },
                                children: [
                                    {
                                        component: "CustomTextField",
                                        component_name: "offline_max_upload_file_size_input",
                                        props: {
                                            fullWidth: true,
                                            size: "small",
                                            type: "number",
                                            label: __("File Size (in MB)", "acadlix"),
                                            value: props?.watch("acadlix_offline_max_upload_file_size") || "",
                                            slotProps: {
                                                htmlInput: {
                                                    min: 0, // 👈 set minimum value here
                                                },
                                            },
                                            onChange: (e) => {
                                                props?.setValue("acadlix_offline_max_upload_file_size", e?.target?.value, {
                                                    shouldDirty: true,
                                                });
                                            },
                                            sx: {
                                                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                                                {
                                                    display: "none",
                                                },
                                                "& input[type=number]": {
                                                    MozAppearance: "textfield",
                                                },
                                            }
                                        },
                                    },
                                ],
                            },
                            // 🔹 Allowed Mime type
                            {
                                component: "Grid",
                                component_name: "offline_allowed_mime_type_label_grid",
                                props: {
                                    size: { lg: 3, md: 3, sm: 3, xs: 12 },
                                },
                                children: [
                                    {
                                        component: "CustomTypography",
                                        component_name: "offline_allowed_mime_type_label",
                                        value: __("Allowed Mime type", "acadlix"),
                                    },
                                ],
                            },
                            {
                                component: "Grid",
                                component_name: "offline_allowed_mime_type_input_grid",
                                props: {
                                    size: { lg: 9, md: 9, sm: 9, xs: 12 },
                                },
                                children: [
                                    {
                                        component: "MimeAutocomplete",
                                        component_name: "offline_allowed_mime_type_input",
                                        props: {
                                            label: __("Allowed Mime type", "acadlix"),
                                            value: props?.watch("acadlix_offline_allowed_mime_types") || [],
                                            onChange: (newValue) => {
                                                props?.setValue("acadlix_offline_allowed_mime_types", newValue, {
                                                    shouldDirty: true,
                                                });
                                            },
                                        },
                                    },
                                ],
                            },
                        ],
                    }),
                ],
            }),
        ],
    }

    // 🔹 Apply WordPress-style filter for extensibility
    const offline_setting_after = window?.acadlixHooks?.applyFilters?.(
        "acadlix.admin.payment_gateways.offline.after",
        [offlineSetting],
        {
            register: props?.register,
            control: props?.control,
            watch: props?.watch,
            setValue: props?.setValue,
        }
    ) ?? [];

    return (
        <>
            {offline_setting_after.map((field, i) => (
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

export default Offline