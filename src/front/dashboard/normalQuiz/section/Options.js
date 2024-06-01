import React, { useState } from 'react';
import '../styling.css';

const Options = (props) => {
  const [selectedChoice, setSelectedChoice] = useState(null);

  const handleOptionClick = (optionId) => {
    setSelectedChoice(optionId);
  };

  return (
    <div className='option-container'>
      <div className={`choice ${selectedChoice === 'option-1' ? 'selected-choice' : ''}`}>
        <input
          type="radio"
          name="select"
          id="option-1"
          onClick={() => handleOptionClick('option-1')}
        />
        <label htmlFor="option-1">
          <span>{props.opt[0]}</span> <br />
        </label>
      </div>

      <div className={`choice ${selectedChoice === 'option-2' ? 'selected-choice' : ''}`}>
        <input
          type="radio"
          name="select"
          id="option-2"
          onClick={() => handleOptionClick('option-2')}
        />
        <label htmlFor="option-2" >
          <span >{props.opt[1]}</span> <br />
        </label>
      </div>

      <div className={`choice ${selectedChoice === 'option-3' ? 'selected-choice' : ''}`}>
        <input
          type="radio"
          name="select"
          id="option-3"
          onClick={() => handleOptionClick('option-3')}
        />
        <label htmlFor="option-3">
          <span>{props.opt[2]}</span> <br />
        </label>
      </div>

      <div className={`choice ${selectedChoice === 'option-4' ? 'selected-choice' : ''}`}>
        <input
          type="radio"
          name="select"
          id="option-4"
          onClick={() => handleOptionClick('option-4')}
        />
        <label htmlFor="option-4">
          <span>{props.opt[3]}</span> <br />
        </label>
      </div>
    </div>
  );
};

export default Options;
