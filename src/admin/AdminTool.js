import React from 'react'
import Provider from '@acadlix/provider/Provider'
import { Toaster } from 'react-hot-toast'
import AdminLayout from '@acadlix/layout/AdminLayout'
import { __ } from '@wordpress/i18n';
import { hasCapability } from '@acadlix/helpers/util';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Tool from './views/tool/Tool';

const AdminTool = () => {
  const routes = [
    hasCapability("acadlix_show_import_export_tool") && {
      path: "/",
      name: "import_export",
      label: __('Import/Export', 'acadlix'),
      isFree: true,
    },
  ];

  const filteredToolRoutes = window.acadlixHooks?.applyFilters(
    'acadlix.admin.tool.routes',
    routes
  )?.filter(Boolean) || [];

  return (
    <Provider>
      <HashRouter>
        <Toaster position="bottom-right" />
        <Routes>
          <Route element={<AdminLayout />}>
            {
              hasCapability("acadlix_show_tool") && filteredToolRoutes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Tool
                      selected={route.name}
                      filteredToolRoutes={filteredToolRoutes}
                    />
                  }
                />
              ))
            }
          </Route>
        </Routes>
      </HashRouter>
    </Provider>
  )
}

export default AdminTool
