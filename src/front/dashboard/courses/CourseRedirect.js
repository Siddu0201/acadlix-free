import { Box } from '@mui/material';
import React from 'react'
import { useLocation, useParams } from 'react-router-dom'

const CourseRedirect = () => {
  const {orderItemId} = useParams();
  const location = useLocation();
  const hash = location?.pathname;
  return (
    <Box>
        {
            hash.includes("lesson") || hash.includes("quiz") ?
            <Box>Lesson/Quiz Redirect</Box> :
            <Box>Redirect</Box>
        }
    </Box>
  )
}

export default CourseRedirect
