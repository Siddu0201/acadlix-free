import React from "react";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import "../admin/AppAdmin.css";
import DashboardLayout from "../layout/DashboardLayout";
import Courses from "./dashboard/courses/Courses";
import CourseContent from "./dashboard/Courses/CourseContent";
import Result from "./dashboard/result/Result";
import PurchaseHistory from "./dashboard/purchaseHistory/PurchaseHistory";
import Profile from "./dashboard/profile/Profile";
import "./AppFront.css";
import Quiz from "./dashboard/quiz/Quiz.js";
import Provider from "../provider/Provider.js";

const Dashbaord = () => {
  return (
    <Provider>
      <HashRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/">
              <Route
                index
                element={<Navigate to="/courses" replace={true} />}
              />
            </Route>
            <Route index path="/courses" element={<Courses />} />
            <Route path="/result" element={<Result />} />
            <Route path="/purchase" element={<PurchaseHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/normal" element={<Quiz mode="normal" />} />
          </Route>
          <Route path="/content" element={<CourseContent />} />
          <Route
            path="/ibps"
            element={<Quiz mode="advance_mode" advance_mode="ibps" />}
          />
          <Route
            path="/advance_panel"
            element={<Quiz mode="advance_mode" advance_mode="advance_panel" />}
          />
        </Routes>
      </HashRouter>
    </Provider>
  );
};

export default Dashbaord;
