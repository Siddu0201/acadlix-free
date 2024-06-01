import React from 'react';
import { Box, Typography } from '@mui/material';
import '../styling.css';
import { correctQues, totalQuestions } from './QuizResult';

const scorePercent = 50;

const ScoreBox = () => {
  return (
    <Box className='scorebox'>
      <Box className='avg-score'>
        <Typography className='score-text sbx'> Average Score: </Typography>
        <Box className='score-bar' style={{ width: '0%', textAlign: 'left' }}> 0% </Box>
      </Box>
      <Box className='your-score'>
        <Typography className='score-text sbx'> Your Score: </Typography>
        <Box className='score-bar' style={{ width: `${scorePercent}%`, textAlign: 'left' }}>{scorePercent}%</Box>
      </Box>
    </Box>
  );
}

export default ScoreBox;
