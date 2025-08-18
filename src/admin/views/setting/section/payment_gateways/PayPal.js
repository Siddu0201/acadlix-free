import React from 'react'
import Grid from '@mui/material/Grid';
import CustomTypography from "@acadlix/components/CustomTypography";
import FormControlLabel from '@mui/material/FormControlLabel';
import CustomSwitch from "@acadlix/components/CustomSwitch";
import PasswordTextField from "@acadlix/components/PasswordTextField";
import { __ } from "@wordpress/i18n";
import { Box, Divider, Typography } from '@mui/material';
import CustomCopyableText from '@acadlix/components/CustomCopyableText';

const PayPal = (props) => {
    return (
        <>
            <Box
                sx={{
                    marginY: 2,
                    backgroundColor: 'grey.light',
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            paddingX: 2,
                            paddingY: 2,
                        }}
                    >
                        {__("PayPal", "acadlix")}
                    </Typography>
                    <FormControlLabel
                        control={<CustomSwitch />}
                        label={__("Default", "acadlix")}
                        value="paypal"
                        checked={props?.watch("acadlix_default_payment_gateway") === "paypal"}
                        onClick={(e) => {
                            if (e?.target?.checked !== undefined) {
                                props?.setValue("acadlix_default_payment_gateway", e?.target?.checked ? e?.target?.value : "", {
                                    shouldDirty: true,
                                });
                            }
                        }}
                    />
                </Box>
                <Divider />
            </Box>
            <Grid
                container
                spacing={{
                    xs: 2,
                    sm: 4,
                }}
                sx={{
                    alignItems: "center",
                }}
            >
                <Grid size={{
                    lg: 3,
                    md: 3,
                    sm: 6,
                    xs: 12
                }}>
                    <CustomTypography>
                        {__('Enable PayPal', 'acadlix')}
                    </CustomTypography>
                </Grid>
                <Grid size={{
                    lg: 3,
                    md: 3,
                    sm: 6,
                    xs: 12
                }}>
                    <FormControlLabel
                        control={<CustomSwitch />}
                        label={__("PayPal", "acadlix")}
                        value="yes"
                        checked={props?.watch("acadlix_paypal_active") === "yes"}
                        onClick={(e) => {
                            if (e?.target?.checked !== undefined) {
                                props?.setValue("acadlix_paypal_active", e?.target?.checked ? e?.target?.value : "no", {
                                    shouldDirty: true,
                                });
                            }
                        }}
                    />
                </Grid>
                <Grid size={{
                    lg: 3,
                    md: 3,
                    sm: 6,
                    xs: 12
                }}>
                    <CustomTypography>
                        {__('Enable Sandbox', 'acadlix')}
                    </CustomTypography>
                </Grid>
                <Grid size={{
                    lg: 3,
                    md: 3,
                    sm: 6,
                    xs: 12
                }}>
                    <FormControlLabel
                        control={<CustomSwitch />}
                        label={__("Sandbox", "acadlix")}
                        value="yes"
                        checked={props?.watch("acadlix_paypal_sandbox") === "yes"}
                        onClick={(e) => {
                            if (e?.target?.checked !== undefined) {
                                props?.setValue("acadlix_paypal_sandbox", e?.target?.checked ? e?.target?.value : "no", {
                                    shouldDirty: true,
                                });
                            }
                        }}
                    />
                </Grid>
                <Grid size={{
                    lg: 3,
                    md: 3,
                    sm: 3,
                    xs: 12
                }}>
                    <CustomTypography>
                        {__('Client ID', 'acadlix')}
                    </CustomTypography>
                </Grid>
                <Grid size={{
                    lg: 9,
                    md: 9,
                    sm: 9,
                    xs: 12
                }}>
                    <PasswordTextField
                        fullWidth
                        size="small"
                        label={__("Client ID", "acadlix")}
                        value={props?.watch("acadlix_paypal_client_id")}
                        onChange={(e) => {
                            props?.setValue("acadlix_paypal_client_id", e?.target?.value, {
                                shouldDirty: true,
                            });
                        }}
                    />
                </Grid>
                <Grid size={{
                    lg: 3,
                    md: 3,
                    sm: 3,
                    xs: 12
                }}>
                    <CustomTypography>
                        {__('Secret Key', 'acadlix')}
                    </CustomTypography>
                </Grid>
                <Grid size={{
                    lg: 9,
                    md: 9,
                    sm: 9,
                    xs: 12
                }}>
                    <PasswordTextField
                        fullWidth
                        size="small"
                        label={__("Secret Key", "acadlix")}
                        value={props?.watch("acadlix_paypal_secret_key")}
                        onChange={(e) => {
                            props?.setValue("acadlix_paypal_secret_key", e?.target?.value, {
                                shouldDirty: true,
                            });
                        }}
                    />
                </Grid>
                <Grid size={{
                    lg: 3,
                    md: 3,
                    sm: 3,
                    xs: 12
                }}>
                    <CustomTypography>
                        {__('Webhook ID', 'acadlix')}
                    </CustomTypography>
                </Grid>
                <Grid size={{
                    lg: 9,
                    md: 9,
                    sm: 9,
                    xs: 12
                }}>
                    <PasswordTextField
                        fullWidth
                        size="small"
                        label={__("Webhook ID", "acadlix")}
                        value={props?.watch("acadlix_paypal_webhook_id")}
                        onChange={(e) => {
                            props?.setValue("acadlix_paypal_webhook_id", e?.target?.value, {
                                shouldDirty: true,
                            });
                        }}
                    />
                </Grid>
                <Grid size={{
                    lg: 3,
                    md: 3,
                    sm: 3,
                    xs: 12
                }}>
                    <CustomTypography>
                        {__('Webhook URL', 'acadlix')}
                    </CustomTypography>
                </Grid>
                <Grid size={{
                    lg: 9,
                    md: 9,
                    sm: 9,
                    xs: 12
                }}>
                    <CustomCopyableText
                        value={acadlixOptions?.options?.acadlix_paypal_webhook_url}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default PayPal