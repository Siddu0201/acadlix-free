import React from "react";
import Provider from "../provider/Provider";
import AdminLayout from "../layout/AdminLayout";
import { Toaster } from "react-hot-toast";
import { HashRouter, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Assignment from "./views/assignment/Assignment";
import CreateAssignment from "./views/assignment/CreateAssignment";
import EditAssignment from "./views/assignment/EditAssignment";
import "./AdminAssignment.css";
import ScrollToTop from "../helpers/ScrollToTop";
import { __ } from "@wordpress/i18n";
import { hasCapability } from "../helpers/util";
import ViewSubmissionAssignment from "./views/assignment/ViewSubmissionAssignment";
import EvaluationAssignment from "./views/assignment/EvaluationAssignment";

const AdminAssignment = () => {
  return (
    <Provider>
      <HashRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Toaster position="bottom-right" />
          <ScrollToTop />
          <Routes>
            <Route element={<AdminLayout />}>
              <Route index element={<Assignment />} />
              {
                hasCapability("acadlix_add_assignment") &&
                <Route path="create" element={<CreateAssignment />} />
              }
              {
                hasCapability("acadlix_edit_assignment") &&
                <Route path="edit/:assignment_id" element={<EditAssignment />} />
              }
              <Route path="view/:assignment_id" element={<ViewSubmissionAssignment />} />
              <Route path="view/:assignment_id/evaluate/:course_statistics_id" element={<EvaluationAssignment />} />
            </Route>
            <Route path="*" element={<div>{__('No path found', 'acadlix')}</div>} />
          </Routes>
        </LocalizationProvider>
      </HashRouter>
    </Provider>
  );
};

export default AdminAssignment;

