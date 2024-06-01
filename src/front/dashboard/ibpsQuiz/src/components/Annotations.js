import React from 'react';
import NotAnswered from '../Buttons/NotAnswered';
import Answered from '../Buttons/Answered';
import NotVisBtn from '../Buttons/NotVisBtn';
import MarkedForReview from '../Buttons/MarkedForReview';

const Annotations = () => {
  return (
    <box className="flex">
      <box>
      <Answered /> Answered
      </box>
      <box>
      <NotAnswered /> Not Answered
      </box>
      <box>
      <NotVisBtn /> Not Visited
      </box>
      <box>
      <MarkedForReview /> Marked for Review
      </box>
    </box>
  )
}

export default Annotations;
