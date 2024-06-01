import React from 'react';
import { Box, Typography } from '@mui/material';
import ListOfQuestions from './ListOfQuestions';
import Options from './Options';
import '../styling.css';

const Question = () => {
  return (
    <Box>
      {ListOfQuestions.map((question, index) => (
        <Box key={index}>
          <Box className='qn'>
            <Typography variant="h6">{index + 1}.{question.name}</Typography>
            <Typography variant="h7" className='points'>1 points</Typography>
          </Box>

          <Options opt={question.options} />
          
          <Box className='correct-optn'>
            <Typography component="strong">Correct</Typography>
            <br />
            {question.correctOption}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Question;
