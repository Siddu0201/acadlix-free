import React from 'react'
import Grid from '@mui/material/Grid2';
import CustomTypography from '@acadlix/components/CustomTypography';
import CustomColorPicker from '@acadlix/components/CustomColorPicker';
import { __ } from '@wordpress/i18n';

const Text = (props) => {
    return (
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
            <Grid
                size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
            >
                <CustomTypography>
                    {__('Primary', 'acadlix')}
                </CustomTypography>
            </Grid>
            <Grid
                size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
            >
                <CustomColorPicker
                    {...props}
                    name='palette.text.primary'
                />
            </Grid>
            <Grid
                size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
            >
                <CustomTypography>
                    {__('Secondary', 'acadlix')}
                </CustomTypography>
            </Grid>
            <Grid
                size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
            >
                <CustomColorPicker
                    {...props}
                    name='palette.text.secondary'
                />
            </Grid>
        </Grid>
    )
}

export default Text