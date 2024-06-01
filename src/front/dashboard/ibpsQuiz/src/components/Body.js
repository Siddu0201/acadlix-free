import React from 'react';
import Question from './Question';
import LanguageSelect from './LanguageSelect';
import QuestionActions from './QuestionActions';
import QuestionType from './QuestionType';
import Sections from './Sections';
import SectionsTimeLabel from './SectionsTimeLabel';

const Body = () => {
  return (
    <box className='w-9/12 flex flex-col justify-between'>
    <box>
    <Sections />
    <SectionsTimeLabel />
    <Sections />
    <QuestionType />
    <LanguageSelect />
      <Question />
    </box>
      <QuestionActions />
    </box>
  )
}

export default Body;
