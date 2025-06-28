import React from "react";
import QuizContent from "./QuizContent";
import {
  GetCreateQuiz,
} from "@acadlix/requests/admin/AdminQuizRequest";
import Loader from "@acadlix/components/Loader";

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
        prerequisites={null}
        categories={data?.data?.categories}
        templates={data?.data?.templates}
        languages={data?.data?.languages}
        quizzes={data?.data?.quizzes}
        isFetching={isFetching}
      />
    </>
  );
};

export default CreateQuiz;
