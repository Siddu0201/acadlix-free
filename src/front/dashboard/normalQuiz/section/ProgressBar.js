import React from 'react';
import { LinearProgress } from '@mui/material';

const ProgressBar = (props) => {
  return (
    <LinearProgress
      variant="determinate"
      value={props.name}
      sx={{ height: '10px', backgroundColor: '#00f' }}
    />
  );
};

export default ProgressBar;
