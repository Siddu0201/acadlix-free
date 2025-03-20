import React from "react";
import Provider from "../provider/Provider";
import AdminLayout from "../layout/AdminLayout";
import { Toaster } from "react-hot-toast";
import { HashRouter, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Order from "./views/order/Order";
import { __ } from "@wordpress/i18n";
import CreateOrder from "./views/order/CreateOrder";
import EditOrder from "./views/order/EditOrder";
import "./AdminOrder.css";

const AdminOrder = () => {
  return (
    <Provider>
      <HashRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Toaster position="bottom-right" />
        <Routes>
          <Route element={<AdminLayout />}>
            <Route index element={<Order />} />
            <Route path="create" element={<CreateOrder />} />
            <Route path="edit/:order_id" element={<EditOrder />} />
          </Route>
          <Route path="*" element={<div>{__('No path found', 'acadlix')}</div>}></Route>
        </Routes>
      </LocalizationProvider>
      </HashRouter>
    </Provider>
  );
};

export default AdminOrder;
