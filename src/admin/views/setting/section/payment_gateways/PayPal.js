import React from 'react'
import Grid from '@mui/material/Grid2';
import CustomTypography from "@acadlix/components/CustomTypography";
import FormControlLabel from '@mui/material/FormControlLabel';
import CustomSwitch from "@acadlix/components/CustomSwitch";
import PasswordTextField from "@acadlix/components/PasswordTextField";
import { __ } from "@wordpress/i18n";

const PayPal = (props) => {
    return (
        <Grid
            container
            spacing={4}
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
        </Grid>
    )
}

export default PayPal