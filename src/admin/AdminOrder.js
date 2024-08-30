import React from "react";
import Provider from "../provider/Provider";
import AdminLayout from "../layout/AdminLayout";
import { Toaster } from "react-hot-toast";

const AdminOrder = () => {
  return (
    <Provider>
      <Toaster position="bottom-right" />
      <AdminLayout>Orders</AdminLayout>
    </Provider>
  );
};

export default AdminOrder;
