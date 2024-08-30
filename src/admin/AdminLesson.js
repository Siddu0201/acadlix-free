import React from "react";
import Provider from "../provider/Provider";
import AdminLayout from "../layout/AdminLayout";
import { Toaster } from "react-hot-toast";

const AdminLesson = () => {
  return (
    <Provider>
      <Toaster position="bottom-right" />
      <AdminLayout>Lesson</AdminLayout>
    </Provider>
  );
};

export default AdminLesson;
