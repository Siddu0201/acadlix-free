import React from 'react';
import { Box, Typography } from '@mui/material';

const MainHeader = (props) => {
  return (
    <Box className='mainHeader'>
      <Typography variant='h4' fontWeight='bold'>{props.name}</Typography>
    </Box>
  );
}

export default MainHeader;
