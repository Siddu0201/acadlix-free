import React from "react";
import DashboardHeader from "@acadlix/partials/DashboardHeader";
import { Outlet } from "react-router-dom";
import { Avatar, Box, Card, Container, CssBaseline, Divider, Drawer, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import DashboardNavbar from "@acadlix/partials/DashboardNavbar";
import { nameToInitials } from "@acadlix/helpers/util";

const DashboardLayout = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const [open, setOpen] = React.useState(isDesktop);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  return (
    <Container
      disableGutters
      maxWidth="lg"
      sx={{
        px: {
          xs: 0,
          sm: 2,
        },
        width: {
          xs: "100%",
          sm: "100%",
          md: "100%",
          lg: "100%"
        },
      }}
    >
      <CssBaseline />

      <Box>
        <Grid
          container
          spacing={{
            xs: 2,
            sm: 4,
          }}
          sx={{
            padding: {
              xs: 0,
              sm: 4,
            },
          }}
        >
          <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
            <DashboardHeader
              handleDrawerToggle={handleDrawerToggle}
              isDesktop={isDesktop}
            />
          </Grid>
          <DesktopSidebar
            isDesktop={isDesktop}
            open={open}
            setOpen={setOpen}
            handleDrawerToggle={handleDrawerToggle}
          />
          <MobileSidebar
            isDesktop={isDesktop}
            open={open}
            setOpen={setOpen}
            handleDrawerToggle={handleDrawerToggle}
          />
          <Grid
            size={{
              lg: open ? 9 : 12,
              md: open ? 9 : 12,
              sm: open ? 8 : 12,
              xs: 12
            }}
            sx={{
              mx: {
                xs: 2,
                sm: 0,
              },
            }}
          >
            <Outlet 
              context={{
                open: open
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardLayout;


const DesktopSidebar = ({ isDesktop, open, setOpen, handleDrawerToggle }) => {
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
        <DashboardNavbar
          handleDrawerToggle={handleDrawerToggle}
          isDesktop={isDesktop}
        />
      </Card>
    </Grid>
  )
}

const MobileSidebar = ({ isDesktop, open, setOpen, handleDrawerToggle }) => {
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
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingY: 4,
            paddingX: 2,
          }}
        >
          <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}>
            {
              acadlixOptions?.user_avatar_url
                ? (
                  <Avatar
                    src={acadlixOptions?.user_avatar_url}
                    sx={{
                      width: 40,
                      height: 40,
                    }}
                  />
                )
                : (
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                    }}
                  >
                    {nameToInitials(acadlixOptions?.user?.display_name)}
                  </Avatar>
                )
            }
            <Typography
              variant="h6"
            >
              {acadlixOptions?.user?.display_name}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <DashboardNavbar
          handleDrawerToggle={handleDrawerToggle}
        />
      </Drawer>
    </Box>
  )
}
