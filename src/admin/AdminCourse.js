import React from 'react'
import Provider from '../provider/Provider'
import { Toaster } from 'react-hot-toast'

const AdminCourse = () => {
  const courseData = window?.acadlixCourseList;
  console.log(courseData);  
  return (
    <Provider>
      <Toaster position="bottom-right" />
      Test course sdgfsdf
    </Provider>
  )
}

export default AdminCourse
