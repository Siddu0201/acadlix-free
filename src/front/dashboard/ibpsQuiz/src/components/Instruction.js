import { Button } from '@mui/material';
import React from 'react';

const Instruction = () => {
  return (
    <box className='bg-black  flex justify-between'>
      <Button style = {{color : 'yellow', textTransform: 'none'}}>New IBPS Test</Button>
      <Button style = {{color : 'white', textTransform: 'none'}}>ℹ️ View Instruction</Button>
    </box>
  )
}

export default Instruction;
