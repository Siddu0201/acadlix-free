import React from 'react';
import { Typography } from '@mui/material';

const Description = (props) => {
  return (
    <Typography variant="body1" className='description' sx={{ marginY: '9px' }}>
      {props.desctxt}
    </Typography>
  );
}

export default Description;
