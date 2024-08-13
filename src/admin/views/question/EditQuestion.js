import React from 'react'
import QuestionContent from './QuestionContent'
import { useParams } from 'react-router-dom'
import Loader from '../../../components/Loader';
import { GetQuizQuestionById } from '../../../requests/admin/AdminQuestionRequest';

const EditQuestion = () => {
  const {quiz_id, question_id} = useParams();
  const {isFetching, data } = GetQuizQuestionById(quiz_id, question_id);

  if(isFetching) {
    return <Loader />;
  }

  return (
    <>
      <QuestionContent 
        quiz_id={quiz_id}
        question_id={question_id}
        create={false}
        quiz={data?.data?.quiz}
        question={data?.data?.question}
        subjects={data?.data?.subjects}
        paragraphs={data?.data?.paragraphs}
      /> 
    </>
  )
}

export default EditQuestion
