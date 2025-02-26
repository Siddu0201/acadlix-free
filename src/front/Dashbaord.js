import React, { useEffect } from "react";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import "../admin/AppAdmin.css";
import DashboardLayout from "../layout/DashboardLayout";
import Courses from "./dashboard/courses/Courses";
import Result from "./dashboard/result/Result";
import PurchaseHistory from "./dashboard/purchaseHistory/PurchaseHistory";
import Profile from "./dashboard/profile/Profile";
import "./AppFront.css";
import Quiz from "./dashboard/quiz/Quiz.js";
import Provider from "../provider/Provider.js";
import CourseContent from "./dashboard/courses/CourseContent.js";
import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import UserAuth from "../modules/user-auth/UserAuth.js";
import { __ } from "@wordpress/i18n";
import ViewAnswersheet from "./dashboard/result/ViewAnswersheet.js";

const Dashbaord = () => {

  const methods = useForm({
    defaultValues: {
      login_modal: false,
    }
  });

  if (acadlixOptions?.user?.ID === undefined) {
    useEffect(() => {
      methods?.setValue("login_modal", true, { shouldDirty: true });
    }, []);

    return (
      <Provider>
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2
        }}>
          <UserAuth
            login_modal={methods?.watch("login_modal")}
            users_can_register={Boolean(Number(acadlixOptions?.users_can_register))}
            ajax_url={acadlixOptions?.ajax_url}
            nonce={acadlixOptions?.nonce}
            handleClose={() => methods?.setValue("login_modal", false)}
          />
          <h3>{__('Please login: ', 'acadlix')}
            <Button
              variant="contained"
              onClick={() => methods.setValue("login_modal", true, { shouldDirty: true })}>
              {__('Login', 'acadlix')}
            </Button>
          </h3>
        </Box>
      </Provider>
    )
  }

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
            <Route path="result">
              <Route index element={<Result />} />
              <Route path=":statistic_ref_id" element={<ViewAnswersheet />} />
            </Route>
            <Route path="/purchase" element={<PurchaseHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/normal" element={<Quiz mode="normal" />} />
          </Route>
          <Route path="/course/:orderItemId">
            <Route index element={<CourseContent />} />
            <Route path="content/:courseSectionContentId" element={<CourseContent />} />
          </Route>
          <Route
            path="/ibps"
            element={<Quiz mode="advance_mode" advance_mode="ibps" />}
          />
          <Route
            path="/advance_panel"
            element={<Quiz mode="advance_mode" advance_mode="advance_panel" />}
          />
          <Route path="*" element={<div>{__('No path found', 'acadlix')}</div>}></Route>
        </Routes>
      </HashRouter>
    </Provider>
  );
};

export default Dashbaord;
