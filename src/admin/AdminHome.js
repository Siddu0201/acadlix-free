import React from "react";
import Provider from "../provider/Provider";
import { Toaster } from "react-hot-toast";
import Home from "./views/home/Home";
import AdminLayout from "../layout/AdminLayout";

const AdminHome = () => {
  return (
    <Provider>
      <Toaster position="bottom-right" />
      <AdminLayout>
        <Home />
      </AdminLayout>
    </Provider>
  );
};

export default AdminHome;
