import React from "react";
import Provider from "../provider/Provider";
import AdminLayout from "../layout/AdminLayout";
import { Toaster } from "react-hot-toast";
import { HashRouter, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Lesson from "./views/lesson/Lesson";
import CreateLesson from "./views/lesson/CreateLesson";
import EditLesson from "./views/lesson/EditLesson";
import "./AdminLesson.css";
import ScrollToTop from "../helpers/ScrollToTop";

const AdminLesson = () => {
  return (
    <Provider>
      <HashRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Toaster position="bottom-right" />
          <ScrollToTop />
          <Routes>
            <Route element={<AdminLayout />}>
              <Route index element={<Lesson />} />
              <Route path="create" element={<CreateLesson />} />
              <Route path="edit/:lesson_id" element={<EditLesson />} />
            </Route>
          </Routes>
        </LocalizationProvider>
      </HashRouter>
    </Provider>
  );
};

export default AdminLesson;
