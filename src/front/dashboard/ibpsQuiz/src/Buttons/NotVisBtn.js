import React from 'react';
import Button from '@mui/material/Button';
const NotVisBtn = ({no}) => {
  return (
    <button className='bg-gray-200 m-2 p-3 border-gray-500 border-2 w-12'>
      {no}
    </button>
  )
}

export default NotVisBtn;
