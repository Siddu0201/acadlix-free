import React from 'react'
import Grid from '@mui/material/Grid';
import CustomTypography from "@acadlix/components/CustomTypography";
import FormControlLabel from '@mui/material/FormControlLabel';
import CustomSwitch from "@acadlix/components/CustomSwitch";
import PasswordTextField from "@acadlix/components/PasswordTextField";
import { __ } from "@wordpress/i18n";
import CustomCopyableText from '@acadlix/components/CustomCopyableText';
import { Alert, Box, Divider, Typography } from '@mui/material';

const Stripe = (props) => {
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
                        {__("Stripe", "acadlix")}
                    </Typography>
                    <FormControlLabel
                        control={<CustomSwitch />}
                        label={__("Default", "acadlix")}
                        value="stripe"
                        checked={props?.watch("acadlix_default_payment_gateway") === "stripe"}
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
                    lg: 12,
                    md: 12,
                    sm: 12,
                    xs: 12,
                }}
                >
                    <Alert severity="info">
                        {__('Required webhook event: checkout*', 'acadlix')}
                    </Alert>
                </Grid>
                <Grid size={{
                    lg: 3,
                    md: 3,
                    sm: 6,
                    xs: 12
                }}>
                    <CustomTypography>
                        {__('Enable Stripe', 'acadlix')}
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
                        label={__("Stripe", "acadlix")}
                        value="yes"
                        checked={props?.watch("acadlix_stripe_active") === "yes"}
                        onClick={(e) => {
                            if (e?.target?.checked !== undefined) {
                                props?.setValue("acadlix_stripe_active", e?.target?.checked ? e?.target?.value : "no", {
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
                        checked={props?.watch("acadlix_stripe_sandbox") === "yes"}
                        onClick={(e) => {
                            if (e?.target?.checked !== undefined) {
                                props?.setValue("acadlix_stripe_sandbox", e?.target?.checked ? e?.target?.value : "no", {
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
                        {__('Public key', 'acadlix')}
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
                        label={__("Public key", "acadlix")}
                        value={props?.watch("acadlix_stripe_public_key")}
                        onChange={(e) => {
                            props?.setValue("acadlix_stripe_public_key", e?.target?.value, {
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
                        value={props?.watch("acadlix_stripe_secret_key")}
                        onChange={(e) => {
                            props?.setValue("acadlix_stripe_secret_key", e?.target?.value, {
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
                        {__('Webhook Signature Key', 'acadlix')}
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
                        label={__("Webhook Signature Key", "acadlix")}
                        value={props?.watch("acadlix_stripe_webhook_signature_key")}
                        onChange={(e) => {
                            props?.setValue("acadlix_stripe_webhook_signature_key", e?.target?.value, {
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
                        value={props?.options?.acadlix_stripe_webhook_url}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default Stripe