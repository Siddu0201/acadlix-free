import React from 'react'
import Grid from '@mui/material/Grid';
import CustomTypography from "@acadlix/components/CustomTypography";
import FormControlLabel from '@mui/material/FormControlLabel';
import CustomSwitch from "@acadlix/components/CustomSwitch";
import PasswordTextField from "@acadlix/components/PasswordTextField";
import { __ } from "@wordpress/i18n";
import CustomCopyableText from '@acadlix/components/CustomCopyableText';
import { Alert, Box, Divider, Typography } from '@mui/material';

const RazorPay = (props) => {
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
                        {__("RazorPay", "acadlix")}
                    </Typography>
                    <FormControlLabel
                        control={<CustomSwitch />}
                        label={__("Default", "acadlix")}
                        value="razorpay"
                        checked={props?.watch("acadlix_default_payment_gateway") === "razorpay"}
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
                        {__('Required webhook event: payment.authorized, payment.failed', 'acadlix')}
                    </Alert>
                </Grid>
                <Grid size={{
                    lg: 3,
                    md: 3,
                    sm: 6,
                    xs: 12
                }}>
                    <CustomTypography>
                        {__('Enable RazorPay', 'acadlix')}
                    </CustomTypography>
                </Grid>
                <Grid size={{
                    lg: 3,
                    md: 3,
                    sm: 6,
                    xs: 12,
                }}>
                    <FormControlLabel
                        control={<CustomSwitch />}
                        label={__("Activate", "acadlix")}
                        value="yes"
                        checked={props?.watch("acadlix_razorpay_active") === "yes"}
                        onClick={(e) => {
                            if (e?.target?.checked !== undefined) {
                                props?.setValue("acadlix_razorpay_active", e?.target?.checked ? e?.target?.value : "no", {
                                    shouldDirty: true,
                                });
                            }
                        }}
                    />
                </Grid>
                <Grid size={{
                    lg: 6,
                    md: 6,
                    sm: 0,
                    xs: 0,
                }}
                    sx={{
                        display: {
                            lg: "block",
                            md: "block",
                            sm: "none",
                            xs: "none",
                        }
                    }}
                >
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
                        value={props?.watch("acadlix_razorpay_client_id")}
                        onChange={(e) => {
                            props?.setValue("acadlix_razorpay_client_id", e?.target?.value, {
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
                        value={props?.watch("acadlix_razorpay_secret_key")}
                        onChange={(e) => {
                            props?.setValue("acadlix_razorpay_secret_key", e?.target?.value, {
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
                        {__('Webhook Secret', 'acadlix')}
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
                        label={__("Webhook Secret", "acadlix")}
                        value={props?.watch("acadlix_razorpay_webhook_secret")}
                        onChange={(e) => {
                            props?.setValue("acadlix_razorpay_webhook_secret", e?.target?.value, {
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
                        value={props?.options?.acadlix_razorpay_webhook_url}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default RazorPay