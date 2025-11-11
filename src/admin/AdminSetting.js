import React from 'react'
import Provider from '@acadlix/provider/Provider'
import { Toaster } from 'react-hot-toast'
import AdminLayout from '@acadlix/layout/AdminLayout'
import Setting from './views/setting/Setting'
import "./AdminSetting.css";
import { hasCapability } from "@acadlix/helpers/util";
import { HashRouter, Route, Routes } from 'react-router-dom'
import { __ } from '@wordpress/i18n';


const AdminSetting = () => {
  const routes = [
    hasCapability("acadlix_show_general_setting") && {
      path: "/",
      name: "general",
      label: __('General', 'acadlix'),
      isFree: true,
    },
    hasCapability("acadlix_show_payment_setting") && {
      path: "/payment",
      name: "payment",
      label: __('Payment', 'acadlix'),
      isFree: false,
    },
    hasCapability("acadlix_show_notification_setting") && {
      path: "/notification",
      name: "notification",
      label: __('Notification', 'acadlix'),
      isFree: false,
    },
    hasCapability("acadlix_show_permalink_setting") && {
      path: "/permalink",
      name: "permalink",
      label: __('Permalink', 'acadlix'),
      isFree: false,
    },
    hasCapability("acadlix_show_quiz_setting") && {
      path: "/quiz",
      name: "quiz",
      label: __('Quiz', 'acadlix'),
      isFree: false,
    },
    hasCapability("acadlix_show_authentication_setting") && {
      path: "/authentication",
      name: "authentication",
      label: __('Authentication', 'acadlix'),
      isFree: false,
    },
    hasCapability("acadlix_show_integration_setting") && {
      path: "/integration",
      name: "integration",
      label: __('Integration', 'acadlix'),
      isFree: false,
    },
  ];

  const filteredSettingRoutes = window.acadlixHooks?.applyFilters(
    'acadlix.admin.setting.routes',
    routes
  )?.filter(Boolean) || [];
  return (
    <Provider>
      <HashRouter>
        <Toaster position="bottom-right" />
        <Routes>
          <Route element={<AdminLayout />}>
            {
              hasCapability("acadlix_show_setting") && filteredSettingRoutes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Setting 
                      selected={route.name}
                      filteredSettingRoutes={filteredSettingRoutes}
                    />
                  }
                />
              ))
            }
          </Route>
          <Route path="*" element={<div>{__('No path found', 'acadlix')}</div>}></Route>
        </Routes>
      </HashRouter>
    </Provider>
  )
}

export default AdminSetting
