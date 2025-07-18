import React from 'react'
import QuestionContent from './QuestionContent'
import { useParams } from 'react-router-dom'
import { GetCreateQuizQuestion } from '@acadlix/requests/admin/AdminQuestionRequest';
import Loader from '@acadlix/components/Loader';

const CreateQuestion = () => {
  const {quiz_id} = useParams();
  const {isFetching, data} = GetCreateQuizQuestion(quiz_id);
  
  if(isFetching) {
    return <Loader />;
  }

  return (
    <>
     <QuestionContent
        quiz_id={quiz_id}
        question_id={null}
        create={true}
        quiz={data?.data?.quiz}
        question={null}
        all_question_count={data?.data?.all_question_count}
        subjects={data?.data?.subjects}
        paragraphs={data?.data?.paragraphs}
     /> 
    </>
  )
}

export default CreateQuestion
