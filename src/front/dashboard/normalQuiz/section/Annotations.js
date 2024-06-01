import React from 'react';
import { Box } from '@mui/material';
import '../styling.css';

const Annotations = () => {
  const correctStyle = {
    marginTop : '2px',
    height: '15px',
    width: '15px',
    backgroundColor: '#64B335',
    marginRight: '5px', // Added space after the correct button
    display: 'inline-block',
  };

  const incorrectStyle = {
    marginTop : '2px',
    backgroundColor: '#FFB800',
    height: '15px',
    width: '15px',
    marginLeft: '5px', // Added space after the incorrect button
    display: 'inline-block',
  };

  return (
    <Box className='annotation'>
      <div className='antn-btn-c' style={correctStyle}></div>
      Correct
      <div className='antn-btn-i' style={incorrectStyle}></div>
      Incorrect
    </Box>
  );
}

export default Annotations;
