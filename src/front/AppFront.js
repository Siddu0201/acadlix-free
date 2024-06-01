import React from 'react'
import Provider from '../provider/Provider'
import Quiz from './dashboard/quiz/Quiz'
import { Box } from '@mui/material';


const AppFront = (props) => {
  const [quiz_id, setQuizId] = React.useState(props?.quiz_id ?? 0);

  if(props?.advance && window?.location?.hash?.length == 0){
    return <Box>No Data available</Box>;
  }

  React.useEffect(() => {
    if(window?.location?.hash){
      let segment = window?.location?.hash?.split('/');
      setQuizId(segment[segment?.length -1]);
    }
  },[]);

  return (
    <Provider>
      {
        quiz_id === 0 ?
        <Box>No Data available</Box>
        :
        <Quiz 
          {...props}
          quiz_id={props?.advance ? quiz_id :props?.quiz_id}
          />

      }
    </Provider>
  )
}

export default AppFront
