import React from 'react'
import { Box, Divider, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';
import CustomTypography from '@acadlix/components/CustomTypography';

const OpenAiOption = React.lazy(() =>
    process.env.REACT_APP_IS_PREMIUM === 'true' ?
        import("@acadlix/pro/admin/setting/integration/OpenAiOption") :
        import("@acadlix/free/admin/setting/integration/OpenAiOption")
);

const Integration = (props) => {
    const integration_before_start = window?.acadlixHooks?.applyFilters?.(
        "acadlix.admin.settings.integration.before_start",
        [],
        {
            register: props?.register,
            control: props?.control,
            watch: props?.watch,
            setValue: props?.setValue,
        }
    ) ?? [];
    const integration_after_start = window?.acadlixHooks?.applyFilters?.(
        "acadlix.admin.settings.integration.after_start",
        [],
        {
            register: props?.register,
            control: props?.control,
            watch: props?.watch,
            setValue: props?.setValue,
        }
    ) ?? [];
    return (
        <Box>
            {integration_before_start.map((field, i) => (
                <React.Fragment key={`field-${i}`}>
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
            {/* Open AI  */}
            <Box
                sx={{
                    marginY: 2,
                }}
            >
                <Typography variant="h4">{__("AI Intergrations", "acadlix")}</Typography>
                <Divider />
            </Box>
            <Grid
                container
                spacing={4}
                sx={{
                    alignItems: "center",
                }}
            >
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <CustomTypography>
                        {__("OpenAI API Key", "acadlix")}
                    </CustomTypography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 9 }}>
                    <React.Suspense fallback={null}>
                        <OpenAiOption
                            {...props}
                        />
                    </React.Suspense>
                </Grid>
            </Grid>
            {integration_after_start.map((field, i) => (
                <React.Fragment key={`field-${i}`}>
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
        </Box>
    )
}

export default Integration