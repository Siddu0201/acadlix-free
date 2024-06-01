import { Box } from '@mui/material'
import React from 'react'
import QuizContent from './QuizContent';
import { useTheme } from '@emotion/react';
import { useMediaQuery} from '@mui/material'
import { GetFrontQuizById } from '../../../requests/front/FrontQuizRequest';
import Loader from '../../../components/Loader';

const Quiz = (props) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const {isFetching, data} = GetFrontQuizById(props?.quiz_id);

  if(isFetching){
    return <Loader />
  }

  return (
    <Box>
      <QuizContent 
        {...props} 
        start={props?.start ?? false}
        quiz={data?.data?.quiz}
        isDesktop={isDesktop} 
      />
    </Box>
  )
}

export default Quiz
