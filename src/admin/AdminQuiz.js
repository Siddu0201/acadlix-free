import React from "react";
import Provider from "../provider/Provider";
import { HashRouter, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Toaster } from "react-hot-toast";
import AdminLayout from "../layout/AdminLayout";
import Quiz from "./views/quiz/Quiz";
import CreateQuiz from "./views/quiz/CreateQuiz";
import EditQuiz from "./views/quiz/EditQuiz";
import Question from "./views/question/Question";
import CreateQuestion from "./views/question/CreateQuestion";
import EditQuestion from "./views/question/EditQuestion";
import QuizResult from "./views/quiz/quiz-result/QuizResult";
import QuizResultAnswerSheet from "./views/quiz/quiz-result/QuizResultAnswerSheet";
import QuizLeaderboard from "./views/quiz/quiz-leaderboard/QuizLeaderboard";
import "./AdminQuiz.css";
import ScrollToTop from "../helpers/ScrollToTop";
import { __ } from "@wordpress/i18n";
import { hasCapability } from "../helpers/util";

const Paragraph = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import("@acadlix/pro/admin/views/paragraph/Paragraph") // Use pro version in Pro build
    : Promise.resolve({ default: () => null })           // Provide fallback if in Free build
);

const CreateParagraph = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import("@acadlix/pro/admin/views/paragraph/CreateParagraph") // Use pro version in Pro build
    : Promise.resolve({ default: () => null })           // Provide fallback if in Free build
);
const EditParagraph = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import("@acadlix/pro/admin/views/paragraph/EditParagraph") // Use pro version in Pro build
    : Promise.resolve({ default: () => null })           // Provide fallback if in Free build
);
const QuizResultAnswerSheet = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import("@acadlix/pro/admin/quiz/quiz-result/QuizResultAnswerSheet") // Use pro version in Pro build
    : Promise.resolve({ default: () => null })           // Provide fallback if in Free build
);

const AdminQuiz = () => {
  return (
    <Provider>
      <HashRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Toaster position="bottom-right" />
          <ScrollToTop />
          <Routes>
            <Route element={<AdminLayout />}>
              {
                hasCapability("acadlix_show_quiz") &&
                <Route index element={<Quiz />} />
              }
              {
                hasCapability("acadlix_add_quiz") &&
                <Route path="create" element={<CreateQuiz />} />
              }
              {
                hasCapability("acadlix_edit_quiz") &&
                <Route path="edit/:quiz_id" element={<EditQuiz />} />
              }
              <Route path=":quiz_id/question">
                {
                  hasCapability("acadlix_show_question") &&
                  <Route index element={<Question />} />
                }
                {
                  hasCapability("acadlix_add_question") &&
                  <Route path="create" element={<CreateQuestion />} />
                }
                {
                  hasCapability("acadlix_edit_question") &&
                  <Route path="edit/:question_id" element={<EditQuestion />} />
                }
              </Route>
              <Route path=":quiz_id/result">
                {
                  hasCapability("acadlix_show_statistic") &&
                  <Route index element={<QuizResult />} />
                }
                {
                  hasCapability("acadlix_show_answersheet") &&
                  <Route
                    path=":statistic_ref_id"
                    element={<React.Suspense fallback={null}><QuizResultAnswerSheet /></React.Suspense>}
                  />
                }
              </Route>
              <Route path=":quiz_id/leaderboard">
                {
                  hasCapability("acadlix_show_leaderboard") &&
                  <Route index element={<QuizLeaderboard />} />
                }
              </Route>
              {
                <Route path=":quiz_id/paragraph">
                  {
                    hasCapability("acadlix_show_paragraph") &&
                    <Route index element={<React.Suspense fallback={null}><Paragraph /></React.Suspense>} />
                  }
                  {
                    hasCapability("acadlix_add_paragraph") &&
                    <Route path="create" element={<React.Suspense fallback={null}><CreateParagraph /></React.Suspense>} />
                  }
                  {
                    hasCapability("acadlix_edit_paragraph") &&
                    <Route path="edit/:paragraph_id" element={<React.Suspense fallback={null}><EditParagraph /></React.Suspense>} />
                  }
                </Route>
              }
            </Route>
            <Route path="*" element={<div>{__('No path found', 'acadlix')}</div>}></Route>
          </Routes>
        </LocalizationProvider>
      </HashRouter>
    </Provider>
  );
};

export default AdminQuiz;
