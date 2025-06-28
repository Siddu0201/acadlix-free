import { Box, CircularProgress, Skeleton } from '@mui/material'
import React from 'react'
import QuizContent from './QuizContent';
import { useMediaQuery, useTheme} from '@mui/material'
import { GetFrontQuizById } from '@acadlix/requests/front/FrontQuizRequest';
import Loader from '@acadlix/components/Loader';

const Quiz = (props) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const {isFetching, data} = GetFrontQuizById(props?.quiz_id);

  if(isFetching){
    if(props?.advance){
      return <Loader />;
    }else{
      return <Skeleton variant="rounded" height={32} width={93} />;
    }
  }

  return (
    <Box>
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
