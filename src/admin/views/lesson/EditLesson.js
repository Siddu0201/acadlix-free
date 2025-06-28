import React from "react";
import LessonContent from "./LessonContent";
import { useParams } from "react-router-dom";
import Loader from "@acadlix/components/Loader";
import { GetLessonById } from "@acadlix/requests/admin/AdminLessonRequest";

const EditLesson = () => {
  const { lesson_id } = useParams();
  const { isFetching, data } = GetLessonById(lesson_id);

  if (isFetching) {
    return <Loader />;
  }

  return (
    <>
      <LessonContent
        lesson_id={lesson_id}
        create={false}
        lesson={data?.data?.lesson}
        isFetching={isFetching}
      />
    </>
  );
};

export default EditLesson;
