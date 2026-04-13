import React from "react";
import Provider from "@acadlix/provider/Provider";
import { HashRouter, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Toaster } from "react-hot-toast";
import AdminLayout from "@acadlix/layout/AdminLayout";
import Quiz from "./views/quiz/Quiz";
import CreateQuiz from "./views/quiz/CreateQuiz";
import EditQuiz from "./views/quiz/EditQuiz";
import Question from "./views/question/Question";
import CreateQuestion from "./views/question/CreateQuestion";
import EditQuestion from "./views/question/EditQuestion";
import QuizResult from "./views/quiz/quiz-result/QuizResult";
import QuizLeaderboard from "./views/quiz/quiz-leaderboard/QuizLeaderboard";
import "./AdminQuiz.css";
import ScrollToTop from "@acadlix/helpers/ScrollToTop";
import { __ } from "@wordpress/i18n";
import { hasCapability } from "@acadlix/helpers/util";
import AddQuestionWithAi from "./views/question/AddQuestionWithAi";

const AdminQuiz = () => {
  const routes = [
    hasCapability("acadlix_show_quiz") && {
      path: "/",
      element: <Quiz />,
    },
    hasCapability("acadlix_add_quiz") && {
      path: "/create",
      element: <CreateQuiz />,
    },
    hasCapability("acadlix_edit_quiz") && {
      path: "/edit/:quiz_id",
      element: <EditQuiz />,
    },
    hasCapability("acadlix_show_question") && {
      path: "/:quiz_id/question",
      element: <Question />,
    },
    hasCapability("acadlix_add_question") && {
      path: "/:quiz_id/question/create",
      element: <CreateQuestion />,
    },
    hasCapability("acadlix_edit_question") && {
      path: "/:quiz_id/question/edit/:question_id",
      element: <EditQuestion />,
    },
    hasCapability("acadlix_show_statistic") && {
      path: "/:quiz_id/result",
      element: <QuizResult />,
    },
    hasCapability("acadlix_show_leaderboard") && {
      path: "/:quiz_id/leaderboard",
      element: <QuizLeaderboard />,
    },
    hasCapability("acadlix_add_question_with_ai") && {
      path: "/:quiz_id/question/create_with_ai",
      element: <AddQuestionWithAi />,
    },
  ];

  const filteredRoutes = window.acadlixHooks?.applyFilters(
    'acadlix.admin.quiz.routes',
    routes
  )?.filter(Boolean) || [];

  return (
    <Provider>
      <HashRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Toaster position="bottom-right" />
          <ScrollToTop />
          <Routes>
            <Route element={<AdminLayout />}>
              {
                filteredRoutes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))
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
