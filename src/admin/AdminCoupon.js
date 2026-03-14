import React from 'react'
import "./AdminCoupon.css";
import { hasCapability } from '@acadlix/helpers/util';
import Coupon from './views/coupon/Coupon';
import Provider from '@acadlix/provider/Provider';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AdminLayout from '@acadlix/layout/AdminLayout';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from '@acadlix/helpers/ScrollToTop';
import { __ } from '@wordpress/i18n';
import CreateCoupon from './views/coupon/CreateCoupon';
import EditCoupon from './views/coupon/EditCoupon';

const AdminCoupon = () => {
  const routes = [
    hasCapability("acadlix_show_coupon") && {
      path: "/",
      element: <Coupon />,
    },
    hasCapability("acadlix_add_coupon") && {
      path: "/create",
      element: <CreateCoupon />,
    },
    hasCapability("acadlix_edit_coupon") && {
      path: "/edit/:coupon_id",
      element: <EditCoupon />,
    },
  ];

  const filteredRoutes = window.acadlixHooks?.applyFilters(
    'acadlix.admin.coupon.routes',
    routes
  )?.filter(Boolean) || [];

  return (
    <Provider>
      <HashRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Toaster position="bottom-right" />
          <ScrollToTop />
          <Routes>
            <Route element={<AdminLayout />}>
              {
                filteredRoutes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))
              }
            </Route>
            <Route path="*" element={<div>{__('No path found', 'acadlix')}</div>}></Route>
          </Routes>
        </LocalizationProvider>
      </HashRouter>
    </Provider>
  )
}

export default AdminCoupon