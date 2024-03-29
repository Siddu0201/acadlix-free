import React from 'react';
import { IBPS_LOGO } from '../utils/constants';
import { Typography } from '@mui/material';

const Header = () => {
  return (
    <box  className='flex justify-between'>
      <box>
      <img className='h-20 w-24' src = {IBPS_LOGO} />
      </box>
      <Typography style = {{
        color : 'purple',
        margin : '2px auto 2px auto',
      }} variant="h6">New IBPS Test</Typography>
    </box>
  )
}

export default Header;
