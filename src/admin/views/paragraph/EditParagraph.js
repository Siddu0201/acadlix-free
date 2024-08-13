import React from "react";
import { useParams } from "react-router-dom";
import ParagraphContent from "./ParagraphContent";
import Loader from "../../../components/Loader";
import { GetQuizParagraphById } from "../../../requests/admin/AdminParagraphRequest";

const EditParagraph = () => {
  const { quiz_id, paragraph_id } = useParams();
  const { isFetching, data } = GetQuizParagraphById(quiz_id, paragraph_id);

  if (isFetching) {
    return <Loader />;
  }
  return (
    <>
      <ParagraphContent
        create={false}
        paragraph={data?.data?.paragraph}
        paragraph_id={paragraph_id}
        quiz_id={quiz_id}
        quiz={data?.data?.quiz}
      />
    </>
  );
};

export default EditParagraph;
