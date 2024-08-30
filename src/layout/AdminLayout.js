import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ children }) => {
  return (
    <Box
      sx={{
        boxSizing: "border-box",
        marginLeft: {
          md: "-20px",
          xs: "-10px",
        },
      }}
    >
      {children}
      <Outlet />
    </Box>
  );
};

export default AdminLayout;
