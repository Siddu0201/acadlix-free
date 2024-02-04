import React from 'react';
import '../styling.css';
import { Button } from '@mui/material';

const QuestionBox = (props) => {
  return (
    <div>
      <Button className='question-button'>{props.num}</Button>
    </div>
  );
};

export default QuestionBox;
