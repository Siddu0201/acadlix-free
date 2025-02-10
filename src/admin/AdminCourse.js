import React from 'react'
import Provider from '../provider/Provider'
import { Toaster } from 'react-hot-toast'
import CourseBuilder from './views/course/CourseBuilder';
import CourseSettings from './views/course_settings/CourseSettings';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const AdminCourse = (props) => {
  const course = window?.acadlixCourseList?.course;
  const users = window?.acadlixCourseList?.users;
  const user_id = window?.acadlixCourseList?.user_id ?? 0;
  return (
    <Provider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Toaster position="bottom-right" />
        {
          props?.type === "builder" &&
          <CourseBuilder course={course} user_id={user_id} />
        }
        {
          props?.type === "settings" &&
          <CourseSettings course={course} users={users} />
        }
      </LocalizationProvider>
    </Provider>
  )
}

export default AdminCourse
