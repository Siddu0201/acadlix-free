import React from 'react';
import { Typography, Box } from '@mui/material';
import ScoreBox from './ScoreBox';

export const totalQuestions = 2;
const attemptedQues = 1;
export const correctQues = 1;
const attempted = 1;
const categorized = 'Not Categorized';

const QuizResult = (props) => {
  return (
    <Box>
      <Typography variant="h5" className='result' style={{ color: '#fa7419', fontWeight: '500' }}>
        <span style={{ color: '#fa7419' }}>Your results are here!! for </span>
        <span style={{ color: '#64B335' }}>"{props.subjectName}"</span>
      </Typography>
      <Typography style={{ fontSize: '1rem', marginBottom: '10px', marginTop: '10px' }}>
        <span style={{ fontWeight: 'bold' }}>1 of 1 questions answered correctly</span>
        <br />
        Your time: {props.timeTaken}
      </Typography>
      <Typography component="strong" style={{  fontWeight: 'bold', fontSize: '1rem' }}>
        Your Final Score is : 1.00
      </Typography>
      <br />
      <Typography component="strong" style={{ fontWeight: 'bold', fontSize: '1rem' }}>
        You have attempted : {attemptedQues}
      </Typography>
      <br />
      <Typography component="strong" style={{ fontWeight: 'bold', fontSize: '1rem' }}>
        Number of Correct Questions : <span style={{ color: '#64B335', fontWeight: 'bold' }}>{correctQues}</span> and scored{' '}
        <span style={{ color: '#64B335', fontWeight: 'bold' }}>1</span>
      </Typography>
      <br />
      <Typography component="strong" style={{ fontWeight: 'bold', fontSize: '1rem' }}>
        Number of Incorrect Questions :{' '}
        <span style={{ color: 'red', fontWeight: 'bold' }}>{attempted - correctQues}</span> and Negative marks{' '}
        <span style={{ color: 'red', fontWeight: 'bold' }}>0.00 </span>
      </Typography>
      <ScoreBox />
      <Typography component="span" className='iscategorized'>
        <Typography variant="h5" style={{ color: '#6451cd', fontWeight: 'bold' }}>{categorized}</Typography>
      </Typography>
      <Typography component="strong" style={{ fontWeight: 'bold', fontSize: '1rem' }}>
        You have attempted: {attemptedQues}
      </Typography>
      <br />
      <Typography component="strong" style={{ fontWeight: 'bold', fontSize: '1rem' }}>
        Number of Correct Questions: {correctQues} and scored{' '}
        <span style={{ color: '#64B335', fontWeight: 'bold' }}>1.00</span>
      </Typography>
      <br />
      <Typography component="strong" style={{ fontWeight: 'bold', fontSize: '1rem' }}>
        Number of Incorrect Questions: <span style={{ color: 'red', fontWeight: 'bold' }}>{attempted - correctQues}</span> and Negative marks{' '}
        <span style={{ color: 'red', fontWeight: 'bold' }}>0.00 </span>
      </Typography>
    </Box>
  );
};

export default QuizResult;
