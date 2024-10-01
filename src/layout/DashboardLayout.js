import React from "react";
import DashboardHeader from "../partials/DashboardHeader";
import { Outlet } from "react-router-dom";
import { Box, Container, CssBaseline } from "@mui/material";
import DashboardNavbar from "../partials/DashboardNavbar";

const DashboardLayout = () => {
  return (
    <Container
      disableGutters
      maxWidth="lg"
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        width: { xs: "100%", sm: "100%", md: "100%", lg: "100%" },
      }}
    >
      <CssBaseline />

      <Box display="flex" flexDirection="column" minHeight="100vh">
        <DashboardHeader />
        <DashboardNavbar />
        <Box flexGrow={1} display="flex" flexDirection="column" overflow="auto">
          <Outlet />
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardLayout;
