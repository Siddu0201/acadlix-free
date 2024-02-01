import React from 'react';
import { Button } from 'react-bootstrap';
import '../styling.css';

const QuestionBox = (props) => {
  return (
    <div>
      <Button className='question-button'>{props.num}</Button>
    </div>
  );
};

export default QuestionBox;
