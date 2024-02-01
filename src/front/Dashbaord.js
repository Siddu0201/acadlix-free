import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { ThemeProvider, createTheme } from "@mui/material";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import "../admin/AppAdmin.css";
import DashboardLayout from "../layout/DashboardLayout";
import Courses from "./dashboard/courses/Courses";
import CourseContent from "./dashboard/Courses/CourseContent";
import Result from "./dashboard/result/Result";
import PurchaseHistory from "./dashboard/purchaseHistory/PurchaseHistory";
import Profile from "./dashboard/profile/Profile";
import Sidebar from "./dashboard/Courses/ContentTabs/CourseSidebar";
import "./AppFront.css";
import Quiz from "./dashboard/quiz/Quiz.js";
import NormalQuiz from "./dashboard/normalQuiz/NormalQuiz.js";

const Dashbaord = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  const mode = "light";
  const themeColor = "primary";

  const colors = {
    main: {
      // primary: "#696CFF",
      primary: "#eb5252",
      grey: "#8592A3",
      success: "#71DD37",
      error: "#FF3E1D",
      warning: "#FFAB00",
      info: "#03C3EC",
      section: "#f8f9fc",
    },
    light: {
      primary: "#8082FF",
      grey: "#97A2B1",
      success: "#86E255",
      error: "#FF5B3F",
      warning: "#FFB826",
      info: "#29CCEF",
      section: "#f8f9fc",
    },
    dark: {
      // primary: "#6062E8",
      primary: "#a04444",
      grey: "#798594",
      success: "#67C932",
      error: "#E8381A",
      warning: "#E89C00",
      info: "#03B1D7",
      section: "#d4daed",
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
      section: {
        main: colors.main['section'],
        light: colors.light['section'],
        dark: colors.dark['section'],
        contrastText: "#3a3b45",
      },
      ...(mode === "light"
        ? {
            background: {
              paper: "#ffffff",
              default: "#f5f5f9",
            },
            text: {
              primary: "rgba(55, 71, 92, 1)!important",
              secondary: "rgba(55, 71, 92, 0.6)!important",
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
      MuiCardHeader: {
        styleOverrides: {
          root: {
            padding: `8px 16px`,
          },
        },
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
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            marginBottom: '0px !important'
          }
        }
      }
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <div>
          <ThemeProvider theme={theme}>
            <Routes>
              <Route element={<DashboardLayout />}>
                <Route path="/">
                  <Route
                    index
                    element={<Navigate to="/courses" replace={true} />}
                  />
                </Route>
                <Route index path="/courses" element={<Courses />} />
                <Route path="/result" element={<Result />} />
                <Route path="/purchase" element={<PurchaseHistory />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/normal-quiz" element={<NormalQuiz/>} />
              </Route>
              <Route path="/content" element={<CourseContent />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/sidebar" element={<Sidebar />} />
            </Routes>
          </ThemeProvider>
        </div>
      </HashRouter>
    </QueryClientProvider>
  );
};

export default Dashbaord;
