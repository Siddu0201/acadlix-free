import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import dashboardMenu from "@acadlix/menu/dashboardMenu";
import { __ } from "@wordpress/i18n";

const DashboardNavbar = () => {
  const path = useLocation();

  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: { xs: "transparent", sm: "white" },
        color: "black",
        borderRadius: "10px",
        my: {
          lg: "10px",
          md: "10px",

          sm: "10px",
          xs: "1px",
        },

        boxShadow: {
          xs: "none",
          lg: "0px 4px 12px rgba(0, 0, 0, 0.3)",
          md: "0px 4px 12px rgba(0, 0, 0, 0.3)",
          sm: "0px 4px 12px rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            borderRadius: "10px",
            minHeight: {
              sm: "50px",
              xs: "45px",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "flex-start",
              marginLeft: 2,
              overflowX: "auto",
            }}
          >
            {
              acadlixOptions?.settings?.acadlix_disable_home_menu === "yes" ? null : (
                <Button
                  sx={{
                    // my: 0,
                    // color: "black",
                    // display: "block",
                    // padding: {
                    //   sm: "6px 8px",
                    //   xs: 0,
                    // },
                    // textDecoration: "none",
                    // whiteSpace: "nowrap",
                    // minWidth: "auto",
                  }}
                  variant="text"
                  color="primary"
                  size="small"
                  onClick={() => {
                    window.location.href = acadlixOptions?.home_url;
                  }}
                >
                  {__("Home", "acadlix")}
                </Button>
              )}
            {dashboardMenu.map((page) => (
              <Button
                key={page?.id}
                variant={path?.pathname === page?.path ? "contained" : "text"}
                color="primary"
                size="small"
                onClick={() => {
                  navigate(page?.path);
                }}
                sx={{
                  // my: 0,
                  // color: path?.pathname === page?.path ? "blue" : "black",
                  // display: "block",
                  // padding: {
                  //   sm: "6px 8px",
                  //   xs: 0,
                  // },
                  // textDecoration: "none",
                  // whiteSpace: "nowrap",
                  // minWidth: "auto",
                }}
              >
                {page?.name}
              </Button>
            ))}
            <Button
              sx={{
                // my: 0,
                // color: "black",
                // display: "block",
                // padding: {
                //   sm: "6px 8px",
                //   xs: 0,
                // },
                // textDecoration: "none",
                // whiteSpace: "nowrap",
                // minWidth: "auto",
              }}
              variant="text"
              color="primary"
              size="small"
              onClick={() => {
                navigate(acadlixOptions?.logout_url);
              }}
            >
              {__("Logout", "acadlix")}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default DashboardNavbar;
