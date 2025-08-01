import React from 'react'
import './AdminDesignStudio.css';
import Provider from '@acadlix/provider/Provider'
import { Toaster } from 'react-hot-toast'
import AdminLayout from '@acadlix/layout/AdminLayout'
import { hasCapability } from '@acadlix/helpers/util'
import DesignStudio from './views/design_studio/DesignStudio'
import { HashRouter, Route, Routes } from 'react-router-dom';
import { __ } from '@wordpress/i18n';

const routes = [
  hasCapability("acadlix_show_design_studio") && {
    path: "/",
    name: "basic",
    label: __('Basic', 'acadlix'),
    element: <DesignStudio selected="basic" />,
  },
  hasCapability("acadlix_show_design_studio") && {
    path: "/palette",
    name: "palette",
    label: __('Palette', 'acadlix'),
    element: <DesignStudio selected="palette" />,
  },
  hasCapability("acadlix_show_design_studio") && {
    path: "/typography",
    name: "typography",
    label: __('Typography', 'acadlix'),
    element: <DesignStudio selected="typography" />,
  },
];

export const filteredThemeRoutes = window.acadlixHooks?.applyFilters(
  'acadlix.admin.design_studio.routes',
  routes
)?.filter(Boolean) || [];
const AdminDesignStudio = () => {

  return (
    <Provider>
      <HashRouter>
        <Toaster position="bottom-right" />
        <Routes>
          <Route element={<AdminLayout />}>
            {
              filteredThemeRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))
            }
          </Route>
        </Routes>
      </HashRouter>
    </Provider>
  ) 
}

export default AdminDesignStudio