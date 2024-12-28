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
import { Box, Button, Dialog, styled } from "@mui/material";
import { useForm } from "react-hook-form";
import Login from "./checkout/modal/Login.js";
import Register from "./checkout/modal/Register.js";

const Dashbaord = () => {

  const methods = useForm({
    defaultValues: {
      login_modal: false,
      login_modal_type: "login", // login/register
      users_can_register: Boolean(Number(acadlixOptions?.users_can_register)),
    }
  });

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
    "& .MuiPaper-root": {
      width: "100%",
    },
  }));

  const handleClose = () => {
    methods?.setValue("login_modal", false, { shouldDirty: true });
  };

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
          <BootstrapDialog
            open={methods?.watch("login_modal")}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xs"
          >
            {methods?.watch("login_modal_type") === "login" ? (
              <Login {...methods} handleClose={handleClose} />
            ) : (
              <Register {...methods} handleClose={handleClose} />
            )}
          </BootstrapDialog>
          <h3>{`Please login: `}
            <Button
              variant="contained"
              onClick={() => methods.setValue("login_modal", true, { shouldDirty: true })}>
              Login
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
            <Route path="/result" element={<Result />} />
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
          <Route path="*" element={<div>No path found</div>}></Route>
        </Routes>
      </HashRouter>
    </Provider>
  );
};

export default Dashbaord;
