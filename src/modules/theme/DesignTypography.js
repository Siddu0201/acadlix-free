import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    IconButton,
    Typography,
    useTheme
} from '@mui/material'
import React from 'react'
import { __ } from '@wordpress/i18n'
import { defaultTypography } from '@acadlix/provider/CustomThemeProvider'
import { FaMobileAlt, FaTabletScreenButton, IoDesktopSharp } from '@acadlix/helpers/icons'
import TypographyDesktop from './typography/TypographyDesktop'
import TypographyTablet from './typography/TypographyTablet'
import TypographyMobile from './typography/TypographyMobile'

const DesignTypography = (props) => {
    const theme = useTheme();
    const [selected, setSelected] = React.useState('desktop');
    const handleReset = () => {
        props?.reset({
            ...props?.watch(),
            typography: {
                ...props?.watch('typography'),
                h1: {
                    fontSize: {
                        desktop: defaultTypography.fontSize.h1.desktop,
                        tablet: defaultTypography.fontSize.h1.tablet,
                        mobile: defaultTypography.fontSize.h1.mobile,
                    },
                    fontWeight: {
                        desktop: defaultTypography.fontWeight.h1.desktop,
                        tablet: defaultTypography.fontWeight.h1.tablet,
                        mobile: defaultTypography.fontWeight.h1.mobile,
                    },
                    lineHeight: {
                        desktop: defaultTypography.lineHeight.h1.desktop,
                        tablet: defaultTypography.lineHeight.h1.tablet,
                        mobile: defaultTypography.lineHeight.h1.mobile,
                    },
                    letterSpacing: {
                        desktop: defaultTypography.letterSpacing.h1.desktop,
                        tablet: defaultTypography.letterSpacing.h1.tablet,
                        mobile: defaultTypography.letterSpacing.h1.mobile,
                    },
                },
                h2: {
                    fontSize: {
                        desktop: defaultTypography.fontSize.h2.desktop,
                        tablet: defaultTypography.fontSize.h2.tablet,
                        mobile: defaultTypography.fontSize.h2.mobile,
                    },
                    fontWeight: {
                        desktop: defaultTypography.fontWeight.h2.desktop,
                        tablet: defaultTypography.fontWeight.h2.tablet,
                        mobile: defaultTypography.fontWeight.h2.mobile,
                    },
                    lineHeight: {
                        desktop: defaultTypography.lineHeight.h2.desktop,
                        tablet: defaultTypography.lineHeight.h2.tablet,
                        mobile: defaultTypography.lineHeight.h2.mobile,
                    },
                    letterSpacing: {
                        desktop: defaultTypography.letterSpacing.h2.desktop,
                        tablet: defaultTypography.letterSpacing.h2.tablet,
                        mobile: defaultTypography.letterSpacing.h2.mobile,
                    },
                },
                h3: {
                    fontSize: {
                        desktop: defaultTypography.fontSize.h3.desktop,
                        tablet: defaultTypography.fontSize.h3.tablet,
                        mobile: defaultTypography.fontSize.h3.mobile,
                    },
                    fontWeight: {
                        desktop: defaultTypography.fontWeight.h3.desktop,
                        tablet: defaultTypography.fontWeight.h3.tablet,
                        mobile: defaultTypography.fontWeight.h3.mobile,
                    },
                    lineHeight: {
                        desktop: defaultTypography.lineHeight.h3.desktop,
                        tablet: defaultTypography.lineHeight.h3.tablet,
                        mobile: defaultTypography.lineHeight.h3.mobile,
                    },
                    letterSpacing: {
                        desktop: defaultTypography.letterSpacing.h3.desktop,
                        tablet: defaultTypography.letterSpacing.h3.tablet,
                        mobile: defaultTypography.letterSpacing.h3.mobile,
                    },
                },
                h4: {
                    fontSize: {
                        desktop: defaultTypography.fontSize.h4.desktop,
                        tablet: defaultTypography.fontSize.h4.tablet,
                        mobile: defaultTypography.fontSize.h4.mobile,
                    },
                    fontWeight: {
                        desktop: defaultTypography.fontWeight.h4.desktop,
                        tablet: defaultTypography.fontWeight.h4.tablet,
                        mobile: defaultTypography.fontWeight.h4.mobile,
                    },
                    lineHeight: {
                        desktop: defaultTypography.lineHeight.h4.desktop,
                        tablet: defaultTypography.lineHeight.h4.tablet,
                        mobile: defaultTypography.lineHeight.h4.mobile,
                    },
                    letterSpacing: {
                        desktop: defaultTypography.letterSpacing.h4.desktop,
                        tablet: defaultTypography.letterSpacing.h4.tablet,
                        mobile: defaultTypography.letterSpacing.h4.mobile,
                    },
                },
                h5: {
                    fontSize: {
                        desktop: defaultTypography.fontSize.h5.desktop,
                        tablet: defaultTypography.fontSize.h5.tablet,
                        mobile: defaultTypography.fontSize.h5.mobile,
                    },
                    fontWeight: {
                        desktop: defaultTypography.fontWeight.h5.desktop,
                        tablet: defaultTypography.fontWeight.h5.tablet,
                        mobile: defaultTypography.fontWeight.h5.mobile,
                    },
                    lineHeight: {
                        desktop: defaultTypography.lineHeight.h5.desktop,
                        tablet: defaultTypography.lineHeight.h5.tablet,
                        mobile: defaultTypography.lineHeight.h5.mobile,
                    },
                    letterSpacing: {
                        desktop: defaultTypography.letterSpacing.h5.desktop,
                        tablet: defaultTypography.letterSpacing.h5.tablet,
                        mobile: defaultTypography.letterSpacing.h5.mobile,
                    },
                },
                h6: {
                    fontSize: {
                        desktop: defaultTypography.fontSize.h6.desktop,
                        tablet: defaultTypography.fontSize.h6.tablet,
                        mobile: defaultTypography.fontSize.h6.mobile,
                    },
                    fontWeight: {
                        desktop: defaultTypography.fontWeight.h6.desktop,
                        tablet: defaultTypography.fontWeight.h6.tablet,
                        mobile: defaultTypography.fontWeight.h6.mobile,
                    },
                    lineHeight: {
                        desktop: defaultTypography.lineHeight.h6.desktop,
                        tablet: defaultTypography.lineHeight.h6.tablet,
                        mobile: defaultTypography.lineHeight.h6.mobile,
                    },
                    letterSpacing: {
                        desktop: defaultTypography.letterSpacing.h6.desktop,
                        tablet: defaultTypography.letterSpacing.h6.tablet,
                        mobile: defaultTypography.letterSpacing.h6.mobile,
                    },
                },
                body1: {
                    fontSize: {
                        desktop: defaultTypography.fontSize.body1.desktop,
                        tablet: defaultTypography.fontSize.body1.tablet,
                        mobile: defaultTypography.fontSize.body1.mobile,
                    },
                    fontWeight: {
                        desktop: defaultTypography.fontWeight.body1.desktop,
                        tablet: defaultTypography.fontWeight.body1.tablet,
                        mobile: defaultTypography.fontWeight.body1.mobile,
                    },
                    lineHeight: {
                        desktop: defaultTypography.lineHeight.body1.desktop,
                        tablet: defaultTypography.lineHeight.body1.tablet,
                        mobile: defaultTypography.lineHeight.body1.mobile,
                    },
                    letterSpacing: {
                        desktop: defaultTypography.letterSpacing.body1.desktop,
                        tablet: defaultTypography.letterSpacing.body1.tablet,
                        mobile: defaultTypography.letterSpacing.body1.mobile,
                    },
                },
                body2: {
                    fontSize: {
                        desktop: defaultTypography.fontSize.body2.desktop,
                        tablet: defaultTypography.fontSize.body2.tablet,
                        mobile: defaultTypography.fontSize.body2.mobile,
                    },
                    fontWeight: {
                        desktop: defaultTypography.fontWeight.body2.desktop,
                        tablet: defaultTypography.fontWeight.body2.tablet,
                        mobile: defaultTypography.fontWeight.body2.mobile,
                    },
                    lineHeight: {
                        desktop: defaultTypography.lineHeight.body2.desktop,
                        tablet: defaultTypography.lineHeight.body2.tablet,
                        mobile: defaultTypography.lineHeight.body2.mobile,
                    },
                    letterSpacing: {
                        desktop: defaultTypography.letterSpacing.body2.desktop,
                        tablet: defaultTypography.letterSpacing.body2.tablet,
                        mobile: defaultTypography.letterSpacing.body2.mobile,
                    },
                },
                subtitle1: {
                    fontSize: {
                        desktop: defaultTypography.fontSize.subtitle1.desktop,
                        tablet: defaultTypography.fontSize.subtitle1.tablet,
                        mobile: defaultTypography.fontSize.subtitle1.mobile,
                    },
                    fontWeight: {
                        desktop: defaultTypography.fontWeight.subtitle1.desktop,
                        tablet: defaultTypography.fontWeight.subtitle1.tablet,
                        mobile: defaultTypography.fontWeight.subtitle1.mobile,
                    },
                    lineHeight: {
                        desktop: defaultTypography.lineHeight.subtitle1.desktop,
                        tablet: defaultTypography.lineHeight.subtitle1.tablet,
                        mobile: defaultTypography.lineHeight.subtitle1.mobile,
                    },
                    letterSpacing: {
                        desktop: defaultTypography.letterSpacing.subtitle1.desktop,
                        tablet: defaultTypography.letterSpacing.subtitle1.tablet,
                        mobile: defaultTypography.letterSpacing.subtitle1.mobile,
                    },
                },
                subtitle2: {
                    fontSize: {
                        desktop: defaultTypography.fontSize.subtitle2.desktop,
                        tablet: defaultTypography.fontSize.subtitle2.tablet,
                        mobile: defaultTypography.fontSize.subtitle2.mobile,
                    },
                    fontWeight: {
                        desktop: defaultTypography.fontWeight.subtitle2.desktop,
                        tablet: defaultTypography.fontWeight.subtitle2.tablet,
                        mobile: defaultTypography.fontWeight.subtitle2.mobile,
                    },
                    lineHeight: {
                        desktop: defaultTypography.lineHeight.subtitle2.desktop,
                        tablet: defaultTypography.lineHeight.subtitle2.tablet,
                        mobile: defaultTypography.lineHeight.subtitle2.mobile,
                    },
                    letterSpacing: {
                        desktop: defaultTypography.letterSpacing.subtitle2.desktop,
                        tablet: defaultTypography.letterSpacing.subtitle2.tablet,
                        mobile: defaultTypography.letterSpacing.subtitle2.mobile,
                    },
                },

            },
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
                            {__('Typography', 'acadlix')}
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
            <CardContent
                sx={{
                    pointerEvents: props?.free ? 'none' : 'auto',
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                }}>
                    <IconButton
                        sx={{
                            color: selected === 'desktop' ? theme.palette.primary.main : theme.palette.text.primary,
                        }}
                        onClick={() => setSelected('desktop')}
                    >
                        <IoDesktopSharp />
                    </IconButton>
                    <IconButton
                        sx={{
                            color: selected === 'tablet' ? theme.palette.primary.main : theme.palette.text.primary,
                        }}
                        onClick={() => setSelected('tablet')}
                    >
                        <FaTabletScreenButton />
                    </IconButton>
                    <IconButton
                        sx={{
                            color: selected === 'mobile' ? theme.palette.primary.main : theme.palette.text.primary,
                        }}
                        onClick={() => setSelected('mobile')}
                    >
                        <FaMobileAlt />
                    </IconButton>
                </Box>

                {
                    selected === 'desktop' && (
                        <TypographyDesktop {...props} />
                    )
                }
                {
                    selected === 'tablet' && (
                        <TypographyTablet {...props} />
                    )
                }
                {
                    selected === 'mobile' && (
                        <TypographyMobile {...props} />
                    )
                }
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
                    variant="contained"
                    color="primary"
                    type="submit"
                    loading={props?.isPending}
                >
                    {__('Save Changes', 'acadlix')}
                </Button>
            </CardActions>
        </Card >
    )
}

export default DesignTypography





















