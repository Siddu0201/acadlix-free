import React from 'react'
import Grid from '@mui/material/Grid2';
import CustomTypography from '@acadlix/components/CustomTypography';
import CustomColorPicker from '@acadlix/components/CustomColorPicker';
import { __ } from '@wordpress/i18n';

const Success = (props) => {
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
                    {__('Main', 'acadlix')}
                </CustomTypography>
            </Grid>
            <Grid
                size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
            >
                <CustomColorPicker
                    {...props}
                    name='palette.success.main'
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
                    name='palette.success.dark'
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
                    name='palette.success.light'
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
                    name='palette.success.contrastText'
                />
            </Grid>
        </Grid>
    )
}

export default Success