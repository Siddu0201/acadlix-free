import Provider from '@acadlix/provider/Provider'
import React from 'react'
import Leaderboard from './dashboard/leaderboard/Leaderboard'

const AppFrontLeaderboard = (props) => {
  return (
    <Provider>
        <Leaderboard {...props} />
    </Provider>
  )
}

export default AppFrontLeaderboard