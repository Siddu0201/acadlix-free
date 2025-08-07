import React from 'react'
import Grid from '@mui/material/Grid'
import CustomTypography from '@acadlix/components/CustomTypography'
import CustomFontSize from '@acadlix/components/CustomFontSize'
import CustomFontWeight from '@acadlix/components/CustomFontWeight'
import CustomLineHeight from '@acadlix/components/CustomLineHeight'
import CustomLetterSpacing from '@acadlix/components/CustomLetterSpacing'
import { __ } from '@wordpress/i18n'

const TypographyH1 = (props) => {
    return (
        <Grid
            container
            spacing={{
                xs: 2,
                sm: 4,
            }}
            sx={{
                alignItems: "center",
                marginTop: 4,
            }}
        >
            <Grid
                size={{ lg: 3, md: 3, sm: 6, xs: 6 }}
            >
                <CustomTypography>
                    {__('Font Size', 'acadlix')}
                </CustomTypography>
            </Grid>
            <Grid
                size={{ lg: 3, md: 3, sm: 6, xs: 6 }}
            >
                <CustomFontSize
                    name={`typography.h1.fontSize.${props?.type}`}
                    {...props}
                />
            </Grid>
            <Grid
                size={{ lg: 3, md: 3, sm: 6, xs: 6 }}
            >
                <CustomTypography>
                    {__('Font Weight', 'acadlix')}
                </CustomTypography>
            </Grid>
            <Grid
                size={{ lg: 3, md: 3, sm: 6, xs: 6 }}
            >
                <CustomFontWeight
                    name={`typography.h1.fontWeight.${props?.type}`}
                    {...props}
                />
            </Grid>
            <Grid
                size={{ lg: 3, md: 3, sm: 6, xs: 6 }}
            >
                <CustomTypography>
                    {__('Line Height', 'acadlix')}
                </CustomTypography>
            </Grid>
            <Grid
                size={{ lg: 3, md: 3, sm: 6, xs: 6 }}
            >
                <CustomLineHeight
                    name={`typography.h1.lineHeight.${props?.type}`}
                    {...props}
                />
            </Grid>
            <Grid
                size={{ lg: 3, md: 3, sm: 6, xs: 6 }}
            >
                <CustomTypography>
                    {__('Letter Spacing', 'acadlix')}
                </CustomTypography>
            </Grid>
            <Grid
                size={{ lg: 3, md: 3, sm: 6, xs: 6 }}
            >
                <CustomLetterSpacing
                    name={`typography.h1.letterSpacing.${props?.type}`}
                    {...props}
                />
            </Grid>
        </Grid>
    )
}

export default TypographyH1