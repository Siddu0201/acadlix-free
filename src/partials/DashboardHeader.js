import React from "react";
import { useLocation, matchPath, NavLink } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";
import menus from "../menu/dashboardMenu";

const DashboardHeader = () => {
  const { pathname } = useLocation();
  const activeItem = menus.find(
    (item) => !!matchPath({ path: item.path }, pathname)
  );
  return (
    <Tabs variant="fullWidth" value={activeItem?.id}>
      {menus.map((item) => (
        <Tab
          key={item.id}
          value={item.id}
          label={item.name}
          component={NavLink}
          to={item.path}
        />
      ))}
    </Tabs>
  );
};

export default DashboardHeader;
