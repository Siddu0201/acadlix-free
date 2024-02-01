import React from 'react';
import { Box, Typography } from '@mui/material';
import '../styling.css';

const ResultMessageBox = () => {
  return (
    <Box className='res-msg-bx'>
      <Typography>
        Your result has been entered into leaderboard
      </Typography>
      <Box className='res-msg-bx-cnt'>
        <Typography>
          You signed up successfully.
        </Typography>
      </Box>
    </Box>
  );
};

export default ResultMessageBox;
