import { Box, CircularProgress, Skeleton } from '@mui/material'
import React from 'react'
import QuizContent from './QuizContent';
import { useMediaQuery, useTheme } from '@mui/material'
import { GetFrontQuizById } from '@acadlix/requests/front/FrontQuizRequest';
import Loader from '@acadlix/components/Loader';

const Quiz = (props) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const { isFetching, data } = GetFrontQuizById(props?.quiz_id);

  if (isFetching) {
    if (props?.advance) {
      return <Loader />;
    } else {
      return <Skeleton variant="rounded" height={32} width={93} />;
    }
  }

  const enable_course_protection = acadlixOptions?.settings?.acadlix_enable_content_protection === "yes";
  const handleKeyDown = (e) => {
    // Disable Ctrl+C, Ctrl+V, Ctrl+U, and F12
    if (
      (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'u' || e.key === 's')) ||
      e.key === 'F12'
    ) {
      e.preventDefault();
      alert("Protected content.");
    }
  };

  return (
    <Box
      onContextMenu={(e) => {
        if (enable_course_protection) {
          e.preventDefault();
        }
      }}
      onKeyDown={(e) => {
        if (enable_course_protection) {
          handleKeyDown(e);
        }
      }}
      tabIndex={0}
      sx={{
        userSelect: enable_course_protection ? 'none' : 'auto',        // Disables text selection
        WebkitUserSelect: enable_course_protection ? 'none' : 'auto',  // For Safari
        MozUserSelect: enable_course_protection ? 'none' : 'auto',     // For Firefox
        msUserSelect: enable_course_protection ? 'none' : 'auto',      // For IE/Edge
        '& *': {
          userSelect: enable_course_protection ? 'none' : 'auto',      // Ensures children are also protected
        }
      }}
    >
      <QuizContent
        {...props}
        logo={data?.data?.logo}
        start={props?.start ?? false}
        quiz={data?.data?.quiz}
        isDesktop={isDesktop}
      />
    </Box>
  )
}

export default Quiz
