import React, { useEffect } from "react";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import "../admin/AppAdmin.css";
import DashboardLayout from "@acadlix/layout/DashboardLayout";
import Courses from "./dashboard/courses/Courses";
import Result from "./dashboard/result/Result";
import PurchaseHistory from "./dashboard/purchaseHistory/PurchaseHistory";
import Profile from "./dashboard/profile/Profile";
import "./AppFront.css";
import Provider from "@acadlix/provider/Provider.js";
import CourseContent from "./dashboard/courses/CourseContent.js";
import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import UserAuth from "@acadlix/modules/user-auth/UserAuth.js";
import { __ } from "@wordpress/i18n";
import ViewAnswersheet from "./dashboard/result/ViewAnswersheet.js";
import { Toaster } from 'react-hot-toast'
import Wishlist from "./dashboard/wishlist/Wishlist";

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

  const routes = [
    {
      parent: <DashboardLayout />,
      path: "/",
      element: <Navigate to="/courses" replace={true} />
    },
    {
      parent: <DashboardLayout />,
      path: "/courses",
      element: <Courses />
    },
    {
      parent: <DashboardLayout />,
      path: "/result",
      element: <Result />
    },
    {
      parent: <DashboardLayout />,
      path: "/result/:statistic_ref_id",
      element: <ViewAnswersheet />
    },
    {
      parent: <DashboardLayout />,
      path: "/purchase",
      element: <PurchaseHistory />
    },
    {
      parent: <DashboardLayout />,
      path: "/wishlist",
      element: <Wishlist />
    },
    {
      parent: <DashboardLayout />,
      path: "/profile",
      element: <Profile />
    },
    {
      path: "/course/:courseId",
      element: <CourseContent />
    },
    {
      path: "/course/:courseId/content/:courseSectionContentId",
      element: <CourseContent />
    },
    {
      path: "*",
      element: <div>{__('No path found', 'acadlix')}</div>
    }
  ];

  const filteredRoutes = window.acadlixHooks?.applyFilters(
    'acadlix.front.dashboard.routes',
    routes
  )?.filter(Boolean) || [];

  useEffect(() => {
    const script = document.querySelector('script[src*="adsbygoogle"]');
    if (script) {
      script.remove();
    }
  }, []);

  return (
    <Provider>
      <Toaster position="bottom-right" />
      <HashRouter>
        <Routes>
          {
            filteredRoutes.map((route, index) =>
              route.parent ? (
                <Route key={index} element={route.parent}>
                  <Route path={route.path} element={route.element} />
                </Route>
              ) : (
                <Route key={index} path={route.path} element={route.element} />
              )
            )
          }
        </Routes>
      </HashRouter>
    </Provider>
  );
};

export default Dashbaord;
