import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import dashboardMenu from "../menu/dashboardMenu";
import { __ } from "@wordpress/i18n";

const DashboardNavbar = () => {
  const path = useLocation();
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
              flexGrow: 1,
              display: "flex",
              gap: 2,
              justifyContent: "flex-start",
              marginLeft: 2,
              overflowX: "auto",
            }}
          >
            <Button
              sx={{
                my: 0,
                color: "black",
                display: "block",
                padding: {
                  sm: "6px 8px",
                  xs: 0,
                },
                textDecoration: "none",
                whiteSpace: "nowrap",
                minWidth: "auto",
              }}
              component="a"
              href={acadlixOptions?.home_url}
            >
              {__("Home", "acadlix")}
            </Button>
            {dashboardMenu.map((page) => (
              <Button
                key={page?.id}
                component={NavLink}
                to={page?.path}
                sx={{
                  my: 0,
                  color: path?.pathname === page?.path ? "blue" : "black",
                  display: "block",
                  padding: {
                    sm: "6px 8px",
                    xs: 0,
                  },
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  minWidth: "auto",
                }}
              >
                {page?.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default DashboardNavbar;
