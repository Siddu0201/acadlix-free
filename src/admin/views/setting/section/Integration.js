import React from 'react'
import { Box, Divider, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { __ } from "@wordpress/i18n";

const OpenAiOption = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import("@acadlix/pro/admin/setting/integration/OpenAiOption") :
    import("@acadlix/free/admin/setting/integration/OpenAiOption")
);
const ZoomOption = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import("@acadlix/pro/admin/setting/integration/ZoomOption") :
    Promise.resolve(null)
);

const Integration = (props) => {
    return (
        <Box sx={{ color: "black" }}>
            {/* Page Setup  */}
            <Box
                sx={{
                    marginY: 2,
                }}
            >
                <Typography variant="h6">{__("AI Intergrations", "acadlix")}</Typography>
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
                    <React.Suspense fallback={null}>
                        <OpenAiOption
                            {...props}
                        />
                    </React.Suspense>
                </Grid>
            </Grid>

            <React.Suspense fallback={null}>
                <ZoomOption
                    {...props}
                />
            </React.Suspense>
        </Box>
    )
}

export default Integration