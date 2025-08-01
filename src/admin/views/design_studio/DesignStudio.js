import { AppBar, Box, Button, Card, CardActions, CardContent, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, MenuItem, MenuList, Paper, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react'
import { useForm } from 'react-hook-form';
import Grid from '@mui/material/Grid2';
import { IoMenu } from '@acadlix/helpers/icons';
import { __ } from '@wordpress/i18n';
import { useNavigate } from 'react-router-dom';
import Palette from './sections/Palette';
import Basic from './sections/Basic';
import { PostUpdateTheme } from '@acadlix/requests/admin/AdminThemeRequest';
import toast from 'react-hot-toast';
import { filteredThemeRoutes } from '@acadlix/admin/AdminDesignStudio';

const DesignStudio = ({ selected = 'palette' }) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

    const baseDefaults = {
        palette: {
            primary: {
                main: theme.palette.primary.main,
                dark: theme.palette.primary.dark,
                light: theme.palette.primary.light,
                contrastText: theme.palette.primary.contrastText,
            },
            success: {
                main: theme.palette.success.main,
                dark: theme.palette.success.dark,
                light: theme.palette.success.light,
                contrastText: theme.palette.success.contrastText,
            },
            error: {
                main: theme.palette.error.main,
                dark: theme.palette.error.dark,
                light: theme.palette.error.light,
                contrastText: theme.palette.error.contrastText,
            },
            warning: {
                main: theme.palette.warning.main,
                dark: theme.palette.warning.dark,
                light: theme.palette.warning.light,
                contrastText: theme.palette.warning.contrastText,
            },
            info: {
                main: theme.palette.info.main,
                dark: theme.palette.info.dark,
                light: theme.palette.info.light,
                contrastText: theme.palette.info.contrastText,
            },
            grey: {
                main: theme.palette.grey.main,
                dark: theme.palette.grey.dark,
                light: theme.palette.grey.light,
                contrastText: theme.palette.grey.contrastText,
            },
            text: {
                primary: theme.palette.text.primary,
                secondary: theme.palette.text.secondary,
            },
        }
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

    if (process?.env?.REACT_APP_IS_PREMIUM === 'true') {
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
                    rowSpacing={3}
                    spacing={4}
                    sx={{
                        padding: 4,
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
                                    variant="h6"
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
                        <Card>
                            {
                                selected === 'basic' && <Basic {...methods} />
                            }
                            {
                                selected === 'palette' && <Palette {...methods} />
                            }
                            <CardActions>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    loading={updateMutation?.isPending}
                                >
                                    {__('Save Changes', 'acadlix')}
                                </Button>
                            </CardActions>
                        </Card>

                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default DesignStudio

const DesktopSidebar = ({ selected, isDesktop, open }) => {
    const navigate = useNavigate();
    if(!isDesktop) return null;
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
    if(isDesktop) return null;
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