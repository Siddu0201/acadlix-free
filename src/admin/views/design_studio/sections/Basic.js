import { CardContent, CardHeader, Box, Button, Typography, CardActions, Card } from '@mui/material'
import React from 'react'
import Grid from '@mui/material/Grid'
import { __ } from '@wordpress/i18n'
import CustomTypography from '@acadlix/components/CustomTypography'
import CustomColorPicker from '@acadlix/components/CustomColorPicker'
import { defaultPaletteColor } from '@acadlix/provider/CustomThemeProvider'

const Basic = (props) => {
    const handleReset = () => {
        const defaultTheme = defaultPaletteColor;
        props?.reset({
            ...props?.watch(),
            palette: {
                ...props?.watch('palette'),
                primary: {
                    ...props?.watch('palette.primary'),
                    main: defaultTheme?.main?.primary,
                    dark: defaultTheme?.dark?.primary,
                },
                text: {
                    ...props?.watch('palette.text'),
                    primary: defaultTheme?.text?.primary,
                    secondary: defaultTheme?.text?.secondary,
                },
                grey: {
                    ...props?.watch('palette.grey'),
                    main: defaultTheme?.main?.grey,
                    dark: defaultTheme?.dark?.grey,
                    light: defaultTheme?.light?.grey,
                },
            }
        });
    }
    return (
        <Card>
            <CardHeader
                title={
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Typography variant="h3">
                            {__('Basic', 'acadlix')}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleReset}
                        >
                            {__('Reset', 'acadlix')}
                        </Button>
                    </Box>
                }
            />
            <CardContent>
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
                            {__('Primary Color', 'acadlix')}
                        </CustomTypography>
                    </Grid>
                    <Grid
                        size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
                    >
                        <CustomColorPicker
                            {...props}
                            name='palette.primary.main'
                        />
                    </Grid>
                    <Grid
                        size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
                    >
                        <CustomTypography>
                            {__('Primary Hover Color', 'acadlix')}
                        </CustomTypography>
                    </Grid>
                    <Grid
                        size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
                    >
                        <CustomColorPicker
                            {...props}
                            name='palette.primary.dark'
                        />
                    </Grid>
                    <Grid
                        size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
                    >
                        <CustomTypography>
                            {__('Primary Text Color', 'acadlix')}
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
                            {__('Secondary Text Color', 'acadlix')}
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
                    <Grid
                        size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
                    >
                        <CustomTypography>
                            {__('Grey Main Color', 'acadlix')}
                        </CustomTypography>
                    </Grid>
                    <Grid
                        size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
                    >
                        <CustomColorPicker
                            {...props}
                            name='palette.grey.main'
                        />
                    </Grid>
                    <Grid
                        size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
                    >
                        <CustomTypography>
                            {__('Grey Dark Color', 'acadlix')}
                        </CustomTypography>
                    </Grid>
                    <Grid
                        size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
                    >
                        <CustomColorPicker
                            {...props}
                            name='palette.grey.dark'
                        />
                    </Grid>
                    <Grid
                        size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
                    >
                        <CustomTypography>
                            {__('Grey Light Color', 'acadlix')}
                        </CustomTypography>
                    </Grid>
                    <Grid
                        size={{ lg: 3, md: 3, sm: 3, xs: 6 }}
                    >
                        <CustomColorPicker
                            {...props}
                            name='palette.grey.light'
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    loading={props?.isPending}
                >
                    {__('Save Changes', 'acadlix')}
                </Button>
            </CardActions>
        </Card>
    )
}

export default Basic