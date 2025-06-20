import React from 'react'
import { Box, Divider, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { __ } from "@wordpress/i18n";

const Integration = () => {
    return (
        <Box sx={{ color: "black" }}>
            {/* Page Setup  */}
            <Box
                sx={{
                    marginY: 2,
                }}
            >
                <Typography variant="h6">{__("Page Setup", "acadlix")}</Typography>
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
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 500,
                        }}
                    >
                        {__("OpenAI API Key", "acadlix")}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 9 }}>
                    <CustomTextField
                        fullWidth
                        size="small"
                        value={props?.watch("acadlix_openai_api_key")}
                        onChange={(e) => {
                            props?.setValue("acadlix_openai_api_key", e?.target?.value, {
                                shouldDirty: true,
                            });
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default Integration