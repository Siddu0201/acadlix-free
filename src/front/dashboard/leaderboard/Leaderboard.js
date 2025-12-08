import Loader from '@acadlix/components/Loader';
import { GetFrontQuizLeaderboardById } from '@acadlix/requests/front/FrontQuizRequest';
import { useTheme } from '@emotion/react';
import { Box, useMediaQuery } from '@mui/material';
import React from 'react'
import LeaderboardContent from './LeaderboardContent';

const Leaderboard = (props) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const { isFetching, data } = GetFrontQuizLeaderboardById(props?.quiz_id);
  if (isFetching) {
    return <Loader />;
  }

  return (
    <Box>
      <LeaderboardContent
        {...props}
        logo={data?.data?.logo}
        quiz={data?.data?.quiz}
        toplist={data?.data?.toplist ?? []}
        toplist_count={data?.data?.toplist_count ?? 0}
        isDesktop={isDesktop}
      />
    </Box>
  )
}

export default Leaderboard