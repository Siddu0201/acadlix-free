import React from "react";
import DashboardHeader from "../partials/DashboardHeader";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const DashboardLayout = () => {
  return (
    <>
      <DashboardHeader />
      <Box sx={{
        paddingX: {
          xs: 4,
          md: 40,
        }
      }}>
        <Outlet />  
      </Box>
    </>
  );
};

export default DashboardLayout;
