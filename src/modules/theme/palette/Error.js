import React from 'react'
import Grid from '@mui/material/Grid2';
import CustomTypography from '@acadlix/components/CustomTypography';
import CustomColorPicker from '@acadlix/components/CustomColorPicker';
import { __ } from '@wordpress/i18n';

const Error = (props) => {
    return (
        <Grid
            container
            spacing={4}
            sx={{
                alignItems: "center",
            }}
        >
            <Grid
                size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
            >
                <CustomTypography>
                    {__('Main', 'acadlix')}
                </CustomTypography>
            </Grid>
            <Grid
                size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
            >
                <CustomColorPicker
                    {...props}
                    name='palette.error.main'
                />
            </Grid>
            <Grid
                size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
            >
                <CustomTypography>
                    {__('Dark', 'acadlix')}
                </CustomTypography>
            </Grid>
            <Grid
                size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
            >
                <CustomColorPicker
                    {...props}
                    name='palette.error.dark'
                />
            </Grid>
            <Grid
                size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
            >
                <CustomTypography>
                    {__('Light', 'acadlix')}
                </CustomTypography>
            </Grid>
            <Grid
                size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
            >
                <CustomColorPicker
                    {...props}
                    name='palette.error.light'
                />
            </Grid>
            <Grid
                size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
            >
                <CustomTypography>
                    {__('Contrast Text', 'acadlix')}
                </CustomTypography>
            </Grid>
            <Grid
                size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
            >
                <CustomColorPicker
                    {...props}
                    name='palette.error.contrastText'
                />
            </Grid>
        </Grid>
    )
}

export default Error