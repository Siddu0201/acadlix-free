import React from 'react';
import { Box, Typography } from '@mui/material';

const TimerBox = (props) => {
  const timerBoxStyle = {
    margin: '4',
    fontSize: 'inherit', 
    fontFamily: 'inherit', 
    color: 'inherit', 
  };

  return (
    <Box>
      <Typography className='timerBox' style={timerBoxStyle}>
        Time Limit: {props.time}
      </Typography>
    </Box>
  );
}

export default TimerBox;
