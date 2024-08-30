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
import Paragraph from "./views/paragraph/Paragraph";
import CreateParagraph from "./views/paragraph/CreateParagraph";
import EditParagraph from "./views/paragraph/EditParagraph";
import "./AdminQuiz.css";

const AdminQuiz = () => {
  return (
    <Provider>
      <HashRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Toaster position="bottom-right" />
          <Routes>
            <Route element={<AdminLayout />}>
              <Route index element={<Quiz />} />
              <Route path="create" element={<CreateQuiz />} />
              <Route path="edit/:quiz_id" element={<EditQuiz />} />
              <Route path=":quiz_id/question">
                <Route index element={<Question />} />
                <Route path="create" element={<CreateQuestion />} />
                <Route path="edit/:question_id" element={<EditQuestion />} />
              </Route>
              <Route path=":quiz_id/result">
                <Route index element={<QuizResult />} />
                <Route
                  path=":statistic_ref_id"
                  element={<QuizResultAnswerSheet />}
                />
              </Route>
              <Route path=":quiz_id/leaderboard">
                <Route index element={<QuizLeaderboard />} />
              </Route>
              <Route path=":quiz_id/paragraph">
                <Route index element={<Paragraph />} />
                <Route path="create" element={<CreateParagraph />} />
                <Route path="edit/:paragraph_id" element={<EditParagraph />} />
              </Route>
            </Route>
            <Route path="*" element={<div>No path found</div>}></Route>
          </Routes>
        </LocalizationProvider>
      </HashRouter>
    </Provider>
  );
};

export default AdminQuiz;
