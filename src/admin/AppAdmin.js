import { ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./AppAdmin.css";
import Testing from "./views/Testing";
import AdminLayout from "../layout/AdminLayout";
import "react-datepicker/dist/react-datepicker.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Quiz from "./views/quiz/Quiz";
import CreateQuiz from "./views/quiz/CreateQuiz";
import EditQuiz from "./views/quiz/EditQuiz";
import Question from "./views/question/Question";
import CreateQuestion from "./views/question/CreateQuestion";
import EditQuestion from "./views/question/EditQuestion";
import Course from "./views/course/Course";
import Configuration from "./views/configuration/Configuration";
import QuizResult from "./views/quiz/quiz-result/QuizResult";
import QuizResultAnswerSheet from "./views/quiz/quiz-result/QuizResultAnswerSheet";
import Provider from "../provider/Provider";

const AppAdmin = () => {
  return (
    <>
      <Provider>
        <HashRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Toaster position="bottom-right" />
            <Routes>
              <Route element={<AdminLayout />}>
                <Route index element={<div> hello world</div>} />
                <Route path="/quiz">
                  <Route index element={<Quiz />} />
                  <Route path="create" element={<CreateQuiz />} />
                  <Route path="edit/:quiz_id" element={<EditQuiz />} />
                  <Route path=":quiz_id/question">
                    <Route index element={<Question />} />
                    <Route path="create" element={<CreateQuestion />} />
                    <Route
                      path="edit/:question_id"
                      element={<EditQuestion />}
                    />
                  </Route>
                  <Route path=":quiz_id/result">
                    <Route index element={<QuizResult />} />
                    <Route
                      path=":statistic_ref_id"
                      element={<QuizResultAnswerSheet />}
                    />
                  </Route>
                </Route>
                <Route path="/course" element={<div>{<Course />}</div>} />

                <Route
                  path="/testing"
                  element={
                    <div>
                      <Testing />
                    </div>
                  }
                />
                <Route
                  path="/configuration"
                  element={
                    <div>
                      <Configuration />
                    </div>
                  }
                />
              </Route>
              <Route path="*" element={<div>No path found</div>}></Route>
            </Routes>
            <ReactQueryDevtools position="bottom-right" />
          </LocalizationProvider>
        </HashRouter>
      </Provider>
    </>
  );
};

export default AppAdmin;
