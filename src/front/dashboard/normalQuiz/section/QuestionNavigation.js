import React from 'react';
import { Box } from '@mui/material';
import '../styling.css';
import QuestionBox from './QuestionBox';
import ListOfQuestions from './ListOfQuestions';

const numberOfQuestions = ListOfQuestions.length;

const QuestionNavigation = () => {
  return (
    <Box className='question-navigation'>
      {Array.from({ length: numberOfQuestions }, (_, i) => (
        <QuestionBox key={i} num={i + 1} />
      ))}
    </Box>
  );
};

export default QuestionNavigation;
