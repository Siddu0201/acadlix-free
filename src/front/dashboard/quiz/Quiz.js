import { AppBar, Box, useMediaQuery } from "@mui/material";
import React from "react";
import QuizSubjectAndLanguage from "./sections/QuizSubjectAndLanguage";
import QuizGeneralOptions from "./sections/QuizGeneralOptions";
import QuizQuestion from "./sections/QuizQuestion";
import QuizButtonOptions from "./sections/QuizButtonOptions";
import QuizHeader from "./sections/QuizHeader";
import QuizSidebar from "./sections/QuizSidebar";
import { useTheme } from "@emotion/react";

const Quiz = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [questionHeight, setQuestionHeight] = React.useState(0);
  
  React.useEffect(() => {
    let total = 0;
    if(isDesktop){
      total += document.getElementsByClassName('acadlix_quiz_header')[0]?.clientHeight ?? 0;
    }
    total += document.getElementsByClassName('acadlix_quiz_subject_and_language')[0]?.clientHeight ?? 0;
    total += document.getElementsByClassName('acadlix_quiz_general_options')[0]?.clientHeight ?? 0;
    total += document.getElementsByClassName('acadlix_quiz_button_options')[0]?.clientHeight ?? 0;
    setQuestionHeight(total);
  },[isDesktop]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  console.log(isDesktop);

  return (
    <Box>
      <QuizSidebar
        isDesktop={isDesktop}
        isOpen={isOpen}
        handleToggle={handleToggle}
      />
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#ffffff",
          boxShadow: "none",
          width: {
            xs: "100%",
            sm: isOpen ? "calc(100% - 300px)" : "100%",
          },
        }}
      >
        <QuizHeader isDesktop={isDesktop} />
        <QuizSubjectAndLanguage isDesktop={isDesktop} />
        <QuizGeneralOptions isDesktop={isDesktop} />
      </AppBar>
      <QuizQuestion questionHeight={questionHeight} isOpen={isOpen} isDesktop={isDesktop} />
      <QuizButtonOptions isOpen={isOpen} isDesktop={isDesktop} />
    </Box>
  );
};

export default Quiz;
