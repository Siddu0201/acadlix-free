import React from "react";
import DashboardHeader from "../partials/DashboardHeader";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div>
      <DashboardHeader />
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
