import { AppBar, Box, Button, Card, CardActions, CardContent, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, MenuItem, MenuList, Paper, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react'
import { useForm } from 'react-hook-form';
import Grid from '@mui/material/Grid2';
import { IoMenu } from '@acadlix/helpers/icons';
import { __ } from '@wordpress/i18n';
import { useNavigate } from 'react-router-dom';
import Basic from './sections/Basic';
import { PostUpdateTheme } from '@acadlix/requests/admin/AdminThemeRequest';
import toast from 'react-hot-toast';
import { filteredThemeRoutes } from '@acadlix/admin/AdminDesignStudio';
import { defaultPaletteColor, defaultTypography } from '@acadlix/provider/CustomThemeProvider';

const DesignSections = React.lazy(() =>
    process.env.REACT_APP_IS_PREMIUM === 'true' ?
        import("@acadlix/pro/admin/views/design_studio/DesignSections") :
        import("@acadlix/free/admin/design_studio/DesignSections")
);

const DesignStudio = ({ selected = 'palette' }) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
    const themeSettings = window?.acadlixOptions?.theme_settings;

    const baseDefaults = {
        palette: {
            primary: {
                main: themeSettings?.palette?.primary?.main ?? defaultPaletteColor.main.primary,
                dark: themeSettings?.palette?.primary?.dark ?? defaultPaletteColor.dark.primary,
                light: themeSettings?.palette?.primary?.light ?? defaultPaletteColor.light.primary,
                contrastText: themeSettings?.palette?.primary?.contrastText ?? defaultPaletteColor.contrastText.primary,
            },
            secondary: {
                main: themeSettings?.palette?.secondary?.main ?? defaultPaletteColor.main.secondary,
                dark: themeSettings?.palette?.secondary?.dark ?? defaultPaletteColor.dark.secondary,
                light: themeSettings?.palette?.secondary?.light ?? defaultPaletteColor.light.secondary,
                contrastText: themeSettings?.palette?.secondary?.contrastText ?? defaultPaletteColor.contrastText.secondary,
            },
            success: {
                main: themeSettings?.palette?.success?.main ?? defaultPaletteColor.main.success,
                dark: themeSettings?.palette?.success?.dark ?? defaultPaletteColor.dark.success,
                light: themeSettings?.palette?.success?.light ?? defaultPaletteColor.light.success,
                contrastText: themeSettings?.palette?.success?.contrastText ?? defaultPaletteColor.contrastText.success,
            },
            error: {
                main: themeSettings?.palette?.error?.main ?? defaultPaletteColor.main.error,
                dark: themeSettings?.palette?.error?.dark ?? defaultPaletteColor.dark.error,
                light: themeSettings?.palette?.error?.light ?? defaultPaletteColor.light.error,
                contrastText: themeSettings?.palette?.error?.contrastText ?? defaultPaletteColor.contrastText.error,
            },
            warning: {
                main: themeSettings?.palette?.warning?.main ?? defaultPaletteColor.main.warning,
                dark: themeSettings?.palette?.warning?.dark ?? defaultPaletteColor.dark.warning,
                light: themeSettings?.palette?.warning?.light ?? defaultPaletteColor.light.warning,
                contrastText: themeSettings?.palette?.warning?.contrastText ?? defaultPaletteColor.contrastText.warning,
            },
            info: {
                main: themeSettings?.palette?.info?.main ?? defaultPaletteColor.main.info,
                dark: themeSettings?.palette?.info?.dark ?? defaultPaletteColor.dark.info,
                light: themeSettings?.palette?.info?.light ?? defaultPaletteColor.light.info,
                contrastText: themeSettings?.palette?.info?.contrastText ?? defaultPaletteColor.contrastText.info,
            },
            grey: {
                main: themeSettings?.palette?.grey?.main ?? defaultPaletteColor.main.grey,
                dark: themeSettings?.palette?.grey?.dark ?? defaultPaletteColor.dark.grey,
                light: themeSettings?.palette?.grey?.light ?? defaultPaletteColor.light.grey,
                contrastText: themeSettings?.palette?.grey?.contrastText ?? defaultPaletteColor.contrastText.grey,
            },
            text: {
                primary: themeSettings?.palette?.text?.primary ?? defaultPaletteColor.text.primary,
                secondary: themeSettings?.palette?.text?.secondary ?? defaultPaletteColor.text.secondary,
            },
        },
        typography: {
            h1: {
                fontSize: {
                    desktop: themeSettings?.typography?.h1?.fontSize?.desktop ?? defaultTypography.fontSize.h1.desktop,
                    tablet: themeSettings?.typography?.h1?.fontSize?.tablet ?? defaultTypography.fontSize.h1.tablet,
                    mobile: themeSettings?.typography?.h1?.fontSize?.mobile ?? defaultTypography.fontSize.h1.mobile,
                },
                fontWeight: {
                    desktop: themeSettings?.typography?.h1?.fontWeight?.desktop ?? defaultTypography.fontWeight.h1.desktop,
                    tablet: themeSettings?.typography?.h1?.fontWeight?.tablet ?? defaultTypography.fontWeight.h1.tablet,
                    mobile: themeSettings?.typography?.h1?.fontWeight?.mobile ?? defaultTypography.fontWeight.h1.mobile,
                },
                lineHeight: {
                    desktop: themeSettings?.typography?.h1?.lineHeight?.desktop ?? defaultTypography.lineHeight.h1.desktop,
                    tablet: themeSettings?.typography?.h1?.lineHeight?.tablet ?? defaultTypography.lineHeight.h1.tablet,
                    mobile: themeSettings?.typography?.h1?.lineHeight?.mobile ?? defaultTypography.lineHeight.h1.mobile,
                },
                letterSpacing: {
                    desktop: themeSettings?.typography?.h1?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.h1.desktop,
                    tablet: themeSettings?.typography?.h1?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.h1.tablet,
                    mobile: themeSettings?.typography?.h1?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.h1.mobile,
                },
            },
            h2: {
                fontSize: {
                    desktop: themeSettings?.typography?.h2?.fontSize?.desktop ?? defaultTypography.fontSize.h2.desktop,
                    tablet: themeSettings?.typography?.h2?.fontSize?.tablet ?? defaultTypography.fontSize.h2.tablet,
                    mobile: themeSettings?.typography?.h2?.fontSize?.mobile ?? defaultTypography.fontSize.h2.mobile,
                },
                fontWeight: {
                    desktop: themeSettings?.typography?.h2?.fontWeight?.desktop ?? defaultTypography.fontWeight.h2.desktop,
                    tablet: themeSettings?.typography?.h2?.fontWeight?.tablet ?? defaultTypography.fontWeight.h2.tablet,
                    mobile: themeSettings?.typography?.h2?.fontWeight?.mobile ?? defaultTypography.fontWeight.h2.mobile,
                },
                lineHeight: {
                    desktop: themeSettings?.typography?.h2?.lineHeight?.desktop ?? defaultTypography.lineHeight.h2.desktop,
                    tablet: themeSettings?.typography?.h2?.lineHeight?.tablet ?? defaultTypography.lineHeight.h2.tablet,
                    mobile: themeSettings?.typography?.h2?.lineHeight?.mobile ?? defaultTypography.lineHeight.h2.mobile,
                },
                letterSpacing: {
                    desktop: themeSettings?.typography?.h2?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.h2.desktop,
                    tablet: themeSettings?.typography?.h2?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.h2.tablet,
                    mobile: themeSettings?.typography?.h2?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.h2.mobile,
                },
            },
            h3: {
                fontSize: {
                    desktop: themeSettings?.typography?.h3?.fontSize?.desktop ?? defaultTypography.fontSize.h3.desktop,
                    tablet: themeSettings?.typography?.h3?.fontSize?.tablet ?? defaultTypography.fontSize.h3.tablet,
                    mobile: themeSettings?.typography?.h3?.fontSize?.mobile ?? defaultTypography.fontSize.h3.mobile,
                },
                fontWeight: {
                    desktop: themeSettings?.typography?.h3?.fontWeight?.desktop ?? defaultTypography.fontWeight.h3.desktop,
                    tablet: themeSettings?.typography?.h3?.fontWeight?.tablet ?? defaultTypography.fontWeight.h3.tablet,
                    mobile: themeSettings?.typography?.h3?.fontWeight?.mobile ?? defaultTypography.fontWeight.h3.mobile,
                },
                lineHeight: {
                    desktop: themeSettings?.typography?.h3?.lineHeight?.desktop ?? defaultTypography.lineHeight.h3.desktop,
                    tablet: themeSettings?.typography?.h3?.lineHeight?.tablet ?? defaultTypography.lineHeight.h3.tablet,
                    mobile: themeSettings?.typography?.h3?.lineHeight?.mobile ?? defaultTypography.lineHeight.h3.mobile,
                },
                letterSpacing: {
                    desktop: themeSettings?.typography?.h3?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.h3.desktop,
                    tablet: themeSettings?.typography?.h3?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.h3.tablet,
                    mobile: themeSettings?.typography?.h3?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.h3.mobile,
                },
            },
            h4: {
                fontSize: {
                    desktop: themeSettings?.typography?.h4?.fontSize?.desktop ?? defaultTypography.fontSize.h4.desktop,
                    tablet: themeSettings?.typography?.h4?.fontSize?.tablet ?? defaultTypography.fontSize.h4.tablet,
                    mobile: themeSettings?.typography?.h4?.fontSize?.mobile ?? defaultTypography.fontSize.h4.mobile,
                },
                fontWeight: {
                    desktop: themeSettings?.typography?.h4?.fontWeight?.desktop ?? defaultTypography.fontWeight.h4.desktop,
                    tablet: themeSettings?.typography?.h4?.fontWeight?.tablet ?? defaultTypography.fontWeight.h4.tablet,
                    mobile: themeSettings?.typography?.h4?.fontWeight?.mobile ?? defaultTypography.fontWeight.h4.mobile,
                },
                lineHeight: {
                    desktop: themeSettings?.typography?.h4?.lineHeight?.desktop ?? defaultTypography.lineHeight.h4.desktop,
                    tablet: themeSettings?.typography?.h4?.lineHeight?.tablet ?? defaultTypography.lineHeight.h4.tablet,
                    mobile: themeSettings?.typography?.h4?.lineHeight?.mobile ?? defaultTypography.lineHeight.h4.mobile,
                },
                letterSpacing: {
                    desktop: themeSettings?.typography?.h4?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.h4.desktop,
                    tablet: themeSettings?.typography?.h4?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.h4.tablet,
                    mobile: themeSettings?.typography?.h4?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.h4.mobile,
                },
            },
            h5: {
                fontSize: {
                    desktop: themeSettings?.typography?.h5?.fontSize?.desktop ?? defaultTypography.fontSize.h5.desktop,
                    tablet: themeSettings?.typography?.h5?.fontSize?.tablet ?? defaultTypography.fontSize.h5.tablet,
                    mobile: themeSettings?.typography?.h5?.fontSize?.mobile ?? defaultTypography.fontSize.h5.mobile,
                },
                fontWeight: {
                    desktop: themeSettings?.typography?.h5?.fontWeight?.desktop ?? defaultTypography.fontWeight.h5.desktop,
                    tablet: themeSettings?.typography?.h5?.fontWeight?.tablet ?? defaultTypography.fontWeight.h5.tablet,
                    mobile: themeSettings?.typography?.h5?.fontWeight?.mobile ?? defaultTypography.fontWeight.h5.mobile,
                },
                lineHeight: {
                    desktop: themeSettings?.typography?.h5?.lineHeight?.desktop ?? defaultTypography.lineHeight.h5.desktop,
                    tablet: themeSettings?.typography?.h5?.lineHeight?.tablet ?? defaultTypography.lineHeight.h5.tablet,
                    mobile: themeSettings?.typography?.h5?.lineHeight?.mobile ?? defaultTypography.lineHeight.h5.mobile,
                },
                letterSpacing: {
                    desktop: themeSettings?.typography?.h5?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.h5.desktop,
                    tablet: themeSettings?.typography?.h5?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.h5.tablet,
                    mobile: themeSettings?.typography?.h5?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.h5.mobile,
                },
            },
            h6: {
                fontSize: {
                    desktop: themeSettings?.typography?.h6?.fontSize?.desktop ?? defaultTypography.fontSize.h6.desktop,
                    tablet: themeSettings?.typography?.h6?.fontSize?.tablet ?? defaultTypography.fontSize.h6.tablet,
                    mobile: themeSettings?.typography?.h6?.fontSize?.mobile ?? defaultTypography.fontSize.h6.mobile,
                },
                fontWeight: {
                    desktop: themeSettings?.typography?.h6?.fontWeight?.desktop ?? defaultTypography.fontWeight.h6.desktop,
                    tablet: themeSettings?.typography?.h6?.fontWeight?.tablet ?? defaultTypography.fontWeight.h6.tablet,
                    mobile: themeSettings?.typography?.h6?.fontWeight?.mobile ?? defaultTypography.fontWeight.h6.mobile,
                },
                lineHeight: {
                    desktop: themeSettings?.typography?.h6?.lineHeight?.desktop ?? defaultTypography.lineHeight.h6.desktop,
                    tablet: themeSettings?.typography?.h6?.lineHeight?.tablet ?? defaultTypography.lineHeight.h6.tablet,
                    mobile: themeSettings?.typography?.h6?.lineHeight?.mobile ?? defaultTypography.lineHeight.h6.mobile,
                },
                letterSpacing: {
                    desktop: themeSettings?.typography?.h6?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.h6.desktop,
                    tablet: themeSettings?.typography?.h6?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.h6.tablet,
                    mobile: themeSettings?.typography?.h6?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.h6.mobile,
                },
            },
            body1: {
                fontSize: {
                    desktop: themeSettings?.typography?.body1?.fontSize?.desktop ?? defaultTypography.fontSize.body1.desktop,
                    tablet: themeSettings?.typography?.body1?.fontSize?.tablet ?? defaultTypography.fontSize.body1.tablet,
                    mobile: themeSettings?.typography?.body1?.fontSize?.mobile ?? defaultTypography.fontSize.body1.mobile,
                },
                fontWeight: {
                    desktop: themeSettings?.typography?.body1?.fontWeight?.desktop ?? defaultTypography.fontWeight.body1.desktop,
                    tablet: themeSettings?.typography?.body1?.fontWeight?.tablet ?? defaultTypography.fontWeight.body1.tablet,
                    mobile: themeSettings?.typography?.body1?.fontWeight?.mobile ?? defaultTypography.fontWeight.body1.mobile,
                },
                lineHeight: {
                    desktop: themeSettings?.typography?.body1?.lineHeight?.desktop ?? defaultTypography.lineHeight.body1.desktop,
                    tablet: themeSettings?.typography?.body1?.lineHeight?.tablet ?? defaultTypography.lineHeight.body1.tablet,
                    mobile: themeSettings?.typography?.body1?.lineHeight?.mobile ?? defaultTypography.lineHeight.body1.mobile,
                },
                letterSpacing: {
                    desktop: themeSettings?.typography?.body1?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.body1.desktop,
                    tablet: themeSettings?.typography?.body1?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.body1.tablet,
                    mobile: themeSettings?.typography?.body1?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.body1.mobile,
                },
            },
            body2: {
                fontSize: {
                    desktop: themeSettings?.typography?.body2?.fontSize?.desktop ?? defaultTypography.fontSize.body2.desktop,
                    tablet: themeSettings?.typography?.body2?.fontSize?.tablet ?? defaultTypography.fontSize.body2.tablet,
                    mobile: themeSettings?.typography?.body2?.fontSize?.mobile ?? defaultTypography.fontSize.body2.mobile,
                },
                fontWeight: {
                    desktop: themeSettings?.typography?.body2?.fontWeight?.desktop ?? defaultTypography.fontWeight.body2.desktop,
                    tablet: themeSettings?.typography?.body2?.fontWeight?.tablet ?? defaultTypography.fontWeight.body2.tablet,
                    mobile: themeSettings?.typography?.body2?.fontWeight?.mobile ?? defaultTypography.fontWeight.body2.mobile,
                },
                lineHeight: {
                    desktop: themeSettings?.typography?.body2?.lineHeight?.desktop ?? defaultTypography.lineHeight.body2.desktop,
                    tablet: themeSettings?.typography?.body2?.lineHeight?.tablet ?? defaultTypography.lineHeight.body2.tablet,
                    mobile: themeSettings?.typography?.body2?.lineHeight?.mobile ?? defaultTypography.lineHeight.body2.mobile,
                },
                letterSpacing: {
                    desktop: themeSettings?.typography?.body2?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.body2.desktop,
                    tablet: themeSettings?.typography?.body2?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.body2.tablet,
                    mobile: themeSettings?.typography?.body2?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.body2.mobile,
                },
            },
            subtitle1: {
                fontSize: {
                    desktop: themeSettings?.typography?.subtitle1?.fontSize?.desktop ?? defaultTypography.fontSize.subtitle1.desktop,
                    tablet: themeSettings?.typography?.subtitle1?.fontSize?.tablet ?? defaultTypography.fontSize.subtitle1.tablet,
                    mobile: themeSettings?.typography?.subtitle1?.fontSize?.mobile ?? defaultTypography.fontSize.subtitle1.mobile,
                },
                fontWeight: {
                    desktop: themeSettings?.typography?.subtitle1?.fontWeight?.desktop ?? defaultTypography.fontWeight.subtitle1.desktop,
                    tablet: themeSettings?.typography?.subtitle1?.fontWeight?.tablet ?? defaultTypography.fontWeight.subtitle1.tablet,
                    mobile: themeSettings?.typography?.subtitle1?.fontWeight?.mobile ?? defaultTypography.fontWeight.subtitle1.mobile,
                },
                lineHeight: {
                    desktop: themeSettings?.typography?.subtitle1?.lineHeight?.desktop ?? defaultTypography.lineHeight.subtitle1.desktop,
                    tablet: themeSettings?.typography?.subtitle1?.lineHeight?.tablet ?? defaultTypography.lineHeight.subtitle1.tablet,
                    mobile: themeSettings?.typography?.subtitle1?.lineHeight?.mobile ?? defaultTypography.lineHeight.subtitle1.mobile,
                },
                letterSpacing: {
                    desktop: themeSettings?.typography?.subtitle1?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.subtitle1.desktop,
                    tablet: themeSettings?.typography?.subtitle1?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.subtitle1.tablet,
                    mobile: themeSettings?.typography?.subtitle1?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.subtitle1.mobile,
                },
            },
            subtitle2: {
                fontSize: {
                    desktop: themeSettings?.typography?.subtitle2?.fontSize?.desktop ?? defaultTypography.fontSize.subtitle2.desktop,
                    tablet: themeSettings?.typography?.subtitle2?.fontSize?.tablet ?? defaultTypography.fontSize.subtitle2.tablet,
                    mobile: themeSettings?.typography?.subtitle2?.fontSize?.mobile ?? defaultTypography.fontSize.subtitle2.mobile,
                },
                fontWeight: {
                    desktop: themeSettings?.typography?.subtitle2?.fontWeight?.desktop ?? defaultTypography.fontWeight.subtitle2.desktop,
                    tablet: themeSettings?.typography?.subtitle2?.fontWeight?.tablet ?? defaultTypography.fontWeight.subtitle2.tablet,
                    mobile: themeSettings?.typography?.subtitle2?.fontWeight?.mobile ?? defaultTypography.fontWeight.subtitle2.mobile,
                },
                lineHeight: {
                    desktop: themeSettings?.typography?.subtitle2?.lineHeight?.desktop ?? defaultTypography.lineHeight.subtitle2.desktop,
                    tablet: themeSettings?.typography?.subtitle2?.lineHeight?.tablet ?? defaultTypography.lineHeight.subtitle2.tablet,
                    mobile: themeSettings?.typography?.subtitle2?.lineHeight?.mobile ?? defaultTypography.lineHeight.subtitle2.mobile,
                },
                letterSpacing: {
                    desktop: themeSettings?.typography?.subtitle2?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.subtitle2.desktop,
                    tablet: themeSettings?.typography?.subtitle2?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.subtitle2.tablet,
                    mobile: themeSettings?.typography?.subtitle2?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.subtitle2.mobile,
                },
            },
        },
    };

    const filteredDefaults = window?.acadlixHooks?.applyFilters?.(
        "acadlix.admin.design_studio.defaultValues",
        baseDefaults,
    ) ?? baseDefaults;

    const methods = useForm({
        defaultValues: filteredDefaults,
    });

    const [open, setOpen] = React.useState(isDesktop ? true : false);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    if (process?.env?.REACT_APP_MODE === 'development') {
        console.log(methods.watch());
    }

    const updateMutation = PostUpdateTheme();
    const onSubmit = (data) => {
        updateMutation.mutate(data, {
            onSuccess: (data) => {
                toast.success(__('Theme updated successfully', 'acadlix'));
                window.location.reload();
                // console.log(data);
            }
        });
    };

    return (
        <Box>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Grid
                    container
                    spacing={{
                        xs: 2,
                        sm: 4,
                    }}
                    sx={{
                        padding: {
                            xs: 2,
                            sm: 4,
                        },
                    }}
                >
                    <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                        <AppBar
                            position="static"
                        >
                            <Toolbar>
                                <IconButton
                                    size="large"
                                    edge="start"
                                    color="inherit"
                                    aria-label="menu"
                                    sx={{ mr: 2 }}
                                    onClick={handleDrawerToggle}
                                >
                                    <IoMenu />
                                </IconButton>
                                <Typography
                                    variant="h3"
                                    component="div"
                                    sx={{
                                        color: 'primary.contrastText',
                                    }}
                                >
                                    {__('Design Studio', 'acadlix')}
                                </Typography>
                            </Toolbar>
                        </AppBar>
                    </Grid>
                    <DesktopSidebar
                        selected={selected}
                        isDesktop={isDesktop}
                        open={open}
                    />
                    <MobileSidebar
                        selected={selected}
                        isDesktop={isDesktop}
                        open={open}
                        setOpen={setOpen}
                    />
                    <Grid
                        size={{
                            lg: open ? 9 : 12,
                            md: open ? 9 : 12,
                            sm: open ? 8 : 12,
                            xs: 12
                        }}
                        sx={{

                        }}
                    >
                        {
                            selected === 'basic' && (
                                <Basic
                                    {...methods}
                                    selected={selected}
                                    isPending={updateMutation?.isPending}
                                />
                            )
                        }
                        <React.Suspense fallback={null}>
                            <DesignSections
                                {...methods}
                                selected={selected}
                                isPending={updateMutation?.isPending}
                            />
                        </React.Suspense>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default DesignStudio

const DesktopSidebar = ({ selected, isDesktop, open }) => {
    const navigate = useNavigate();
    if (!isDesktop) return null;
    return (
        <Grid
            size={{
                lg: open ? 3 : 0,
                md: open ? 3 : 0,
                sm: open ? 4 : 0,
                xs: 12
            }}
            sx={{
                display: {
                    lg: open ? 'block' : 'none',
                    md: open ? 'block' : 'none',
                    sm: open ? 'block' : 'none',
                    xs: 'none',
                },
            }}
        >
            <Card sx={{ height: '100%' }}>
                <List component="nav">
                    {
                        filteredThemeRoutes.map((route, index) => (
                            <ListItemButton
                                key={index}
                                selected={selected === route.name}
                                onClick={() => navigate(route.path)}
                            >
                                <ListItemText
                                    primary={route.label}
                                    slotProps={{
                                        primary: {
                                            sx: {
                                                color: selected === route.name ? 'primary.main' : 'text.primary',
                                            }
                                        }
                                    }}
                                />
                            </ListItemButton>
                        ))
                    }
                </List>
            </Card>
        </Grid>
    )
}

const MobileSidebar = ({ selected, isDesktop, open, setOpen }) => {
    const navigate = useNavigate();
    if (isDesktop) return null;
    return (
        <Box>
            <Drawer
                variant="temporary"
                anchor="left"
                open={open}
                onClose={() => setOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: '200px',
                        top: "46px"
                    },
                }}
            >
                <List component="nav">
                    {
                        filteredThemeRoutes.map((route, index) => (
                            <ListItemButton
                                key={index}
                                selected={selected === route.name}
                                onClick={() => navigate(route.path)}
                            >
                                <ListItemText
                                    primary={route.label}
                                    slotProps={{
                                        primary: {
                                            sx: {
                                                color: selected === route.name ? 'primary.main' : 'text.primary',
                                            }
                                        }
                                    }}
                                />
                            </ListItemButton>
                        ))
                    }
                </List>
            </Drawer>
        </Box>
    )

}