import React from 'react';
import { Box, Typography } from '@mui/material';
import ListOfQuestions from './ListOfQuestions';
import Options from './Options';


const Question = () => {
  return (
    <Box className='m-4'>
      {ListOfQuestions.map((question, index) => (
        <Box key={index}>
          <Box >
          <Typography variant="h6">Question No. {index + 1}</Typography>
            <Typography variant="h6">{question.name}</Typography>
          </Box>
          <Options opt={question.options} />
        </Box>
      ))}
    </Box>
  );
};

export default Question;
