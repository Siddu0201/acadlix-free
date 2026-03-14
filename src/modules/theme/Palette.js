import React from 'react'
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Link,
    Typography
} from '@mui/material';
import { __ } from '@wordpress/i18n';
import { defaultPaletteColor } from '@acadlix/provider/CustomThemeProvider';
import Primary from './palette/Primary';
import Secondary from './palette/Secondary';
import Success from './palette/Success';
import Warning from './palette/Warning';
import Info from './palette/Info';
import Error from './palette/Error';
import Grey from './palette/Grey';
import Text from './palette/Text';
import CustomTypography from '@acadlix/components/CustomTypography';

const Palette = (props) => {
    const handleReset = () => {
        const defaultTheme = defaultPaletteColor;
        props?.reset({
            ...props?.watch(),
            palette: {
                ...props?.watch('palette'),
                primary: {
                    main: defaultTheme?.main?.primary,
                    dark: defaultTheme?.dark?.primary,
                    light: defaultTheme?.light?.primary,
                    contrastText: defaultTheme?.contrastText?.primary,
                },
                success: {
                    main: defaultTheme?.main?.success,
                    dark: defaultTheme?.dark?.success,
                    light: defaultTheme?.light?.success,
                    contrastText: defaultTheme?.contrastText?.success,
                },
                warning: {
                    main: defaultTheme?.main?.warning,
                    dark: defaultTheme?.dark?.warning,
                    light: defaultTheme?.light?.warning,
                    contrastText: defaultTheme?.contrastText?.warning,
                },
                info: {
                    main: defaultTheme?.main?.info,
                    dark: defaultTheme?.dark?.info,
                    light: defaultTheme?.light?.info,
                    contrastText: defaultTheme?.contrastText?.info,
                },
                error: {
                    main: defaultTheme?.main?.error,
                    dark: defaultTheme?.dark?.error,
                    light: defaultTheme?.light?.error,
                    contrastText: defaultTheme?.contrastText?.error,
                },
                grey: {
                    main: defaultTheme?.main?.grey,
                    dark: defaultTheme?.dark?.grey,
                    light: defaultTheme?.light?.grey,
                    contrastText: defaultTheme?.contrastText?.grey,
                },
                text: {
                    primary: defaultTheme?.text?.primary,
                    secondary: defaultTheme?.text?.secondary,
                },
            }
        });
    }
    let cardSx = {};
    if (props?.free) {
        cardSx = {
            position: 'relative',
            overflow: 'hidden',
            cursor: 'not-allowed',
            '&:hover .MuiBox-root': {
                opacity: 1,
                pointerEvents: 'auto',
            },
        }
    }
    return (
        <Card
            sx={cardSx}
        >
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
                            {__('Palette', 'acadlix')}
                        </Typography>
                        <Button
                            className='acadlix-btn'
                            variant="contained"
                            color="primary"
                            onClick={handleReset}
                        >
                            {__('Reset', 'acadlix')}
                        </Button>
                    </Box>
                }
            />
            <CardContent
                sx={{
                    pointerEvents: props?.free ? 'none' : 'auto',
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <CustomTypography>
                        {__('Learn how to personalize your LMS in our documentation →', 'acadlix')}
                    </CustomTypography>
                    <Typography variant="body1">
                        <Link
                            href={acadlixOptions?.basic_palette_link}
                            target="_blank"
                        >
                            {__('Click here', 'acadlix')}
                        </Link>
                    </Typography>
                </Box>
                <Box>
                    {/* Primary */}
                    <Box
                        sx={{
                            marginY: 2,
                            backgroundColor: 'grey.light',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                paddingX: 2,
                                paddingY: 1,
                            }}
                        >
                            {__("Primary", "acadlix")}
                        </Typography>
                        <Divider />
                    </Box>
                    <Primary {...props} />
                    {/* Secondary */}
                    <Box
                        sx={{
                            marginY: 2,
                            backgroundColor: 'grey.light',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                paddingX: 2,
                                paddingY: 1,
                            }}
                        >
                            {__("Secondary", "acadlix")}
                        </Typography>
                        <Divider />
                    </Box>
                    <Secondary {...props} />
                    {/* Success */}
                    <Box
                        sx={{
                            marginY: 2,
                            backgroundColor: 'grey.light',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                paddingX: 2,
                                paddingY: 1,
                            }}
                        >
                            {__("Success", "acadlix")}
                        </Typography>
                        <Divider />
                    </Box>
                    <Success {...props} />
                    {/* Warning */}
                    <Box
                        sx={{
                            marginY: 2,
                            backgroundColor: 'grey.light',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                paddingX: 2,
                                paddingY: 1,
                            }}
                        >
                            {__("Warning", "acadlix")}
                        </Typography>
                        <Divider />
                    </Box>
                    <Warning {...props} />
                    {/* Info */}
                    <Box
                        sx={{
                            marginY: 2,
                            backgroundColor: 'grey.light',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                paddingX: 2,
                                paddingY: 1,
                            }}
                        >
                            {__("Info", "acadlix")}
                        </Typography>
                        <Divider />
                    </Box>
                    <Info {...props} />
                    {/* Error */}
                    <Box
                        sx={{
                            marginY: 2,
                            backgroundColor: 'grey.light',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                paddingX: 2,
                                paddingY: 1,
                            }}
                        >
                            {__("Error", "acadlix")}
                        </Typography>
                        <Divider />
                    </Box>
                    <Error {...props} />
                    {/* Grey */}
                    <Box
                        sx={{
                            marginY: 2,
                            backgroundColor: 'grey.light',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                paddingX: 2,
                                paddingY: 1,
                            }}
                        >
                            {__("Grey", "acadlix")}
                        </Typography>
                        <Divider />
                    </Box>
                    <Grey {...props} />
                    {/* Text */}
                    <Box
                        sx={{
                            marginY: 2,
                            backgroundColor: 'grey.light',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                paddingX: 2,
                                paddingY: 1,
                            }}
                        >
                            {__("Text", "acadlix")}
                        </Typography>
                        <Divider />
                    </Box>
                    <Text {...props} />
                </Box>
            </CardContent>

            {/* Overlay with Upgrade CTA */}
            {
                props?.free && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            bgcolor: 'rgba(0, 0, 0, 0.6)',
                            color: '#fff',
                            transition: 'opacity 0.3s ease',
                            opacity: 0,
                            pointerEvents: 'none',
                            zIndex: 2,
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '20%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                textAlign: 'center',
                            }}
                        >
                            <Button 
                                className='acadlix-btn'
                                variant="contained" 
                                color="primary"
                                href={acadlixOptions?.pricing_link}
                                target="_blank"
                            >
                                {__('Upgrade to Pro', 'acadlix')}
                            </Button>
                        </Box>
                    </Box>
                )
            }
            <CardActions>
                <Button
                    className='acadlix-btn'
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

export default Palette