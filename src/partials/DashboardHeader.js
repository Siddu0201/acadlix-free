import React from "react";
import { Typography, Box, AppBar, Toolbar, IconButton, Avatar, Button } from "@mui/material";
import { ImSwitch, IoMenu } from "@acadlix/helpers/icons";
import { nameToInitials } from "@acadlix/helpers/util";
import { __ } from "@wordpress/i18n";

const DashboardHeader = ({ handleDrawerToggle, isDesktop }) => {
  const handleLogout = () => {
    if (!acadlixOptions?.logout_url) return;
    window.location.href = acadlixOptions?.logout_url;
  }
  return (
    <>
      <AppBar
        position={isDesktop ? "static" : "fixed"}
      >
        <Toolbar>
          <IconButton
            className="acadlix-icon-btn"
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              mr: {
                xs: 0,
                sm: 2,
              },
              '&:hover,&:active,&:focus': {
                backgroundColor: 'transparent',
              },
            }}
            onClick={handleDrawerToggle}
          >
            <IoMenu />
          </IconButton>
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
            <HeaderLogo
              sx={{
                height: isDesktop ? 50 : 40,
              }}
            />
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
                component="div"
                variant="h6"
                sx={{
                  color: "primary.contrastText",
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                }}
              >
                {acadlixOptions?.user?.display_name}
              </Typography>
              {
                isDesktop ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleLogout}
                    sx={{
                      color: "primary.contrastText",
                      borderColor: "primary.contrastText",
                      ":hover, :focus": {
                        color: "primary.contrastText",
                        borderColor: "primary.contrastText",
                      },
                    }}
                  >
                    {__("Logout", "acadlix")}
                  </Button>
                ) :
                  (
                    <IconButton
                      className="acadlix-icon-btn"
                      size="medium"
                      edge="end"
                      color="inherit"
                      aria-label="account"
                      onClick={handleLogout}
                      sx={{
                        '&:hover,&:active,&:focus': {
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      <ImSwitch />
                    </IconButton>
                  )

              }
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      {!isDesktop && <Toolbar />}
    </>
  )
};

export default DashboardHeader;

const HeaderLogo = (props) => {
  if (acadlixOptions?.settings?.acadlix_enable_site_logo_in_header === "yes" && acadlixOptions?.logo_url) {
    return (
      <img
        src={acadlixOptions?.logo_url}
        alt={acadlixOptions?.blog_name}
        style={props?.sx}
      />
    )
  }
  return (
    <Typography
      variant="h3"
      component="div"
      sx={{
        color: 'primary.contrastText',
      }}
    >
      {acadlixOptions?.blog_name}
    </Typography>
  )
}
