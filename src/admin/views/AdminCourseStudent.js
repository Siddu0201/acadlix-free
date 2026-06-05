import AdminLayout from '@acadlix/layout/AdminLayout'
import Provider from '@acadlix/provider/Provider'
import { LocalizationProvider } from '@mui/x-date-pickers'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import CourseStudent from './course_students/CourseStudent'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const AdminCourseStudent = (props) => {

  return (
    <Provider id={props?.id}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Toaster position="bottom-right" />
        <AdminLayout>
          <CourseStudent courseId={props?.courseId} />
        </AdminLayout>
      </LocalizationProvider>
    </Provider>
  )
}

export default AdminCourseStudent