import React from "react";
import Provider from "@acadlix/provider/Provider";
import AdminLayout from "@acadlix/layout/AdminLayout";
import { Toaster } from "react-hot-toast";
import { HashRouter, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Lesson from "./views/lesson/Lesson";
import CreateLesson from "./views/lesson/CreateLesson";
import EditLesson from "./views/lesson/EditLesson";
import "./AdminLesson.css";
import ScrollToTop from "@acadlix/helpers/ScrollToTop";
import { __ } from "@wordpress/i18n";
import { hasCapability } from "@acadlix/helpers/util";
const AdminLesson = () => {
  return (
    <Provider>
      <HashRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Toaster position="bottom-right" />
          <ScrollToTop />
          <Routes>
            <Route element={<AdminLayout />}>
              {
                hasCapability("acadlix_show_lesson") &&
                <Route index element={<Lesson />} />
              }
              {
                hasCapability("acadlix_add_lesson") &&
                <Route path="create" element={<CreateLesson />} />
              }
              {
                hasCapability("acadlix_edit_lesson") &&
                <Route path="edit/:lesson_id" element={<EditLesson />} />
              }
            </Route>
            <Route path="*" element={<div>{__('No path found', 'acadlix')}</div>}></Route>
          </Routes>
        </LocalizationProvider>
      </HashRouter>
    </Provider>
  );
};

export default AdminLesson;
