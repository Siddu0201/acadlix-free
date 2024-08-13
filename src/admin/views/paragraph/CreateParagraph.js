import React from "react";
import ParagraphContent from "./ParagraphContent";
import { useParams } from "react-router-dom";
import { GetCreateQuizParagraph } from "../../../requests/admin/AdminParagraphRequest";
import Loader from "../../../components/Loader";

const CreateParagraph = () => {
  const {quiz_id} = useParams();
  const {isFetching, data} = GetCreateQuizParagraph(quiz_id);

  if(isFetching){
    return <Loader />;
  }


  return (
    <>
      <ParagraphContent
        create={true}
        paragraph={null}
        paragraph_id={null}
        quiz_id={quiz_id}
        quiz={data?.data?.quiz}
      />
    </>
  );
};

export default CreateParagraph;
