import React from "react";
import Quiz from "./dashboard/quiz/Quiz";
import QuizError from "./dashboard/quiz/QuizError";
import { __ } from "@wordpress/i18n";


const AppFront = (props) => {
  if (props?.advance && window?.location?.hash?.length == 0) {
    return <QuizError />;
  }

  if (props?.advance) {
    let segment = window?.location?.hash?.split("/");
    const token = segment?.[segment?.length - 1];
    const localToken = localStorage.getItem("acadlix_advance_quiz_token");
    if (localToken && localToken === token) {
      if (process.env.REACT_APP_MODE === "production") {
        localStorage.removeItem("acadlix_advance_quiz_token");
      }
      return (
        <Quiz {...props} quiz_id={segment[segment?.length - 2]} />
      );
    } else {
      return (
        <QuizError code="404" message={__("No Quiz Found", "acadlix")} />
      );
    }
  }

  return (
    <Quiz {...props} quiz_id={props?.quiz_id} />
  );
};

export default AppFront;
