import AdminLayout from '@acadlix/layout/AdminLayout'
import Provider from '@acadlix/provider/Provider'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import Student from './views/student/Student'
import './AdminStudent.css'


const AdminStudent = () => {
  const routes = [
    true && {
      path: "/",
      element: <Student />,
    },
  ];

  const filteredRoutes = window.acadlixHooks?.applyFilters(
    'acadlix.admin.student.routes',
    routes
  )?.filter(Boolean) || [];

  return (
    <Provider>
      <HashRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Toaster position='bottom-right' />
          <Routes>
            <Route element={<AdminLayout />} >
              {filteredRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Route>
            <Route path='*' element={<div>{__("No path found", "acadlix")}</div>} />
          </Routes>
        </LocalizationProvider>
      </HashRouter>
    </Provider>
  )
}

export default AdminStudent