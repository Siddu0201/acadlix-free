import React from "react";
import QuizContent from "./QuizContent";
import {
  GetCreateQuiz,
} from "../../../requests/admin/AdminQuizRequest";
import Loader from "../../../components/Loader";

const CreateQuiz = () => {
  const { isFetching, data } = GetCreateQuiz();

  if (isFetching) {
    return <Loader />;
  }

  return (
    <>
      <QuizContent
        quiz_id={null}
        create={true}
        quiz={null}
        categories={data?.data?.categories}
        languages={data?.data?.languages}
        non_prerquisites={data?.data?.quizes}
        isFetching={isFetching}
      />
    </>
  );
};

export default CreateQuiz;
