import React from "react";
import QuizContent from "./QuizContent";
import { useParams } from "react-router-dom";
import { GetQuizById } from "../../../requests/admin/AdminQuizRequest";
import Loader from "../../../components/Loader";

const EditQuiz = () => {
  const { quiz_id } = useParams();
  const { isFetching, data } = GetQuizById(quiz_id);

  if (isFetching) {
    return <Loader />;
  }

  return (
    <>
      <QuizContent
        quiz_id={quiz_id}
        create={false}
        quiz={data?.data?.quiz}
        categories={data?.data?.categories}
        languages={data?.data?.languages}
        non_prerquisites={data?.data?.quizes}
      />
    </>
  );
};

export default EditQuiz;
