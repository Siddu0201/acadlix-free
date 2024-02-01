import React from 'react';
import { Box, Typography } from '@mui/material';

const Heading = (props) => {
  return (
    <Box className='Heading' sx={{ marginBottom: '15px' }}>
      <Typography variant='h5' component='div'>
        {props.name}
      </Typography>
    </Box>
  );
}

export default Heading;
