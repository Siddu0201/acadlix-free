import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dashboardMenu from "@acadlix/menu/dashboardMenu";
import { __ } from "@wordpress/i18n";

const DashboardNavbar = ({ handleDrawerToggle, isDesktop }) => {
  const path = useLocation();
  const navigate = useNavigate();
  return (
    <List component="nav">
      {
        dashboardMenu.map((route, index) => (
          <ListItemButton
            key={index}
            selected={path?.pathname.includes(route?.path)}
            onClick={() => {
              if(route?.isRedirect) {
                window.location.href = route.path;
                return;
              }
              navigate(route.path);
              if(!isDesktop) {
                handleDrawerToggle();
              }
            }}
          >
            <ListItemIcon
              sx={{
                color: (theme) => theme.palette.primary.main,
                minWidth: 30,
                fontSize: 20,
              }}
            >
              {route.icon}
            </ListItemIcon>
            <ListItemText
              primary={route.name}
              slotProps={{
                primary: {
                  sx: {
                    color: path?.pathname.includes(route?.path) ? 'primary.main' : 'text.primary',
                  }
                }
              }}
            />
          </ListItemButton>
        ))
      }
    </List>
  )
};

export default DashboardNavbar;
