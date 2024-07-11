import { ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import { HashRouter, Route, Routes } from "react-router-dom";
import "./AppAdmin.css";
import Testing from "./views/Testing";
import AdminLayout from "../layout/AdminLayout";
import "react-datepicker/dist/react-datepicker.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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

const AppAdmin = () => {

  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      }
    }
  }));

  const mode = "light";
  const themeColor = "primary";

  const colors = {
    main: {
      // primary: "#696CFF",
      primary: "#1c64f2",
      grey: "#8592A3",
      success: "#71DD37",
      error: "#FF3E1D",
      warning: "#FFAB00",
      info: "#03C3EC",
    },
    light: {
      primary: "#8082FF",
      grey: "#97A2B1",
      success: "#86E255",
      error: "#FF5B3F",
      warning: "#FFB826",
      info: "#29CCEF",
    },
    dark: {
      // primary: "#6062E8",
      primary: "#1c64f2c",
      grey: "#798594",
      success: "#67C932",
      error: "#E8381A",
      warning: "#E89C00",
      info: "#03B1D7",
    },
  };
  const theme = createTheme({
    typography: {
      fontFamily: [
        '"Public Sans"',
        "san-serif",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
    spacing: (factor) => `${0.25 * factor}rem`,
    shape: {
      borderRadius: 6,
    },
    palette: {
      mode,
      shape: {
        borderRadius: "6px",
      },
      customColors: {
        dark: "219, 219, 235",
        light: "55, 71, 92",
      },
      primary: {
        main: colors.main[themeColor],
        light: colors.light[themeColor],
        dark: colors.dark[themeColor],
        contrastText: "#fff",
      },
      ...(mode === "light"
        ? {
            background: {
              paper: "#ffffff",
              default: "#f5f5f9",
            },
            text: {
              primary: "rgba(55, 71, 92, 0.87)",
              secondary: "rgba(55, 71, 92, 0.6)",
            },
          }
        : {
            background: {
              paper: "#2b2c40",
              default: "#232333",
            },
            text: {
              primary: "rgba(219, 219, 235, 0.87)",
              secondary: "rgba(219, 219, 235, 0.6)",
            },
          }),
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiCardHeader:{
        styleOverrides: {
          root: {
            padding: `8px 16px`,
          }
        }
      },
      MuiCard: {
        defaultProps: {
          elevation: 6,
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          sizeSmall: {
            height: 24,
          },
          root: {
            height: 24,
            "&.MuiChip-rounded": {
              borderRadius: "4px",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          contained: {
            color: '#fff!important',
          }
        }
      },
      MuiDataGrid: {
        defaultProps: {},
        styleOverrides: {
          columnHeaders: {
            borderTop: "1px solid rgba(50, 71, 92, 0.12)",
            borderRadius: 0,
          },
          root: {
            border: 0,
            borderRadius: 0,
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          input:{
            ":disabled": {
              opacity: "0 !important",
            }
          }
        }
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            "&.Mui-disabled": {
              "input": {
                opacity: "0 !important"
              }
            }
          }
        }
      }
    },
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <div>
            <ThemeProvider theme={theme}>
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
                        <Route path="edit/:question_id" element={<EditQuestion />} />
                      </Route>
                      <Route path=":quiz_id/result">
                        <Route index element={<QuizResult />} />
                        <Route path=":statistic_ref_id" element={<QuizResultAnswerSheet />} />
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
            </ThemeProvider>
          </div>
        </HashRouter>
      </QueryClientProvider>
    </>
  );
};

export default AppAdmin;
