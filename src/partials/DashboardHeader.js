import React from "react";
import { Typography, Box, AppBar, Toolbar, IconButton, Avatar } from "@mui/material";
import { IoMenu } from "@acadlix/helpers/icons";
import { nameToInitials } from "@acadlix/helpers/util";

const DashboardHeader = ({ handleDrawerToggle, isDesktop }) => {
  return (
    <>
      <AppBar
        position={isDesktop ? "static" : "fixed"}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              mr: 2,
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
            <HeaderLogo />
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
