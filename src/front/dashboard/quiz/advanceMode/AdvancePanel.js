import { useTheme } from '@emotion/react';
import { AppBar, Box, useMediaQuery } from '@mui/material';
import React from 'react'
import QuizSidebar from './advance-mode-section/QuizSidebar';
import QuizHeader from './advance-mode-section/QuizHeader';
import QuizSubjectAndLanguage from './advance-mode-section/QuizSubjectAndLanguage';
import QuizGeneralOptions from './advance-mode-section/QuizGeneralOptions';
import QuizQuestion from './advance-mode-section/QuizQuestion';
import QuizButtonOptions from './advance-mode-section/QuizButtonOptions';

const AdvancePanel = () => {
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
  )
}

export default AdvancePanel
