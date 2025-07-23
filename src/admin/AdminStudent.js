import AdminLayout from '@acadlix/layout/AdminLayout'
import Provider from '@acadlix/provider/Provider'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { hasCapability } from '@acadlix/helpers/util'
import Student from './views/student/Student'
import './AdminStudent.css'


const StudentView = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import('@acadlix/pro/admin/views/student/StudentView')
    : Promise.resolve({ default: () => null })
);
const AdminStudent = () => {
  return (
    <Provider>
      <HashRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Toaster position='bottom-right' />
          <Routes>
            <Route element={<AdminLayout />} >
              {
                // hasCapability('acadlix_show_student') &&
                <Route index element={<Student />} />
              }

              {
                acadlixOptions.isAdvancedReportActive &&
                <Route path="view/:student_id" element={<React.Suspense fallback={null}><StudentView /></React.Suspense>} />
              }

            </Route>
            <Route path='*' element={<div>{__("No path found", "acadlix")}</div>} />
          </Routes>
        </LocalizationProvider>
      </HashRouter>
    </Provider>
  )
}

export default AdminStudent