import React from "react";
import Provider from "../provider/Provider";
import AdminLayout from "../layout/AdminLayout";
import { Toaster } from "react-hot-toast";
import { HashRouter, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Order from "./views/order/Order";

const AdminOrder = () => {
  return (
    <Provider>
      <HashRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Toaster position="bottom-right" />
        <Routes>
          <Route element={<AdminLayout />}>
            <Route index element={<Order />} />
          </Route>
          <Route path="*" element={<div>No path found</div>}></Route>
        </Routes>
      </LocalizationProvider>
      </HashRouter>
    </Provider>
  );
};

export default AdminOrder;
