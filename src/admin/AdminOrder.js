import React from "react";
import Provider from "@acadlix/provider/Provider";
import AdminLayout from "@acadlix/layout/AdminLayout";
import { Toaster } from "react-hot-toast";
import { HashRouter, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Order from "./views/order/Order";
import { __ } from "@wordpress/i18n";
import CreateOrder from "./views/order/CreateOrder";
import EditOrder from "./views/order/EditOrder";
import "./AdminOrder.css";
import { hasCapability } from "@acadlix/helpers/util";

const AdminOrder = () => {
  return (
    <Provider>
      <HashRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Toaster position="bottom-right" />
        <Routes>
          <Route element={<AdminLayout />}>
            {
                hasCapability("acadlix_show_order") &&
                <Route index element={<Order />} />
            }
            {
                hasCapability("acadlix_add_order") &&
                <Route path="create" element={<CreateOrder />} />
            }
            {
                hasCapability("acadlix_edit_order") &&
                <Route path="edit/:order_id" element={<EditOrder />} />
            }
          </Route>
          <Route path="*" element={<div>{__('No path found', 'acadlix')}</div>}></Route>
        </Routes>
      </LocalizationProvider>
      </HashRouter>
    </Provider>
  );
};

export default AdminOrder;
