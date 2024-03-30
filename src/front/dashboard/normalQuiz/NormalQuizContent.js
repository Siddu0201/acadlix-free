import { Box, Container } from '@mui/material'
import React from 'react'
import DescriptionSection from './section/DescriptionSection'
import ResultSection from './section/ResultSection'
import AverageResultSection from './section/AverageResultSection'
import SubjectResultSection from './section/SubjectResultSection'
import ResultTextSection from './section/ResultTextSection'
import LeaderboardSection from './section/LeaderboardSection'
import ViewButtonSection from './section/ViewButtonSection'
import QuestionOverviewSection from './section/QuestionOverviewSection'
import QuestionSection from './section/QuestionSection'

const NormalQuizContent = () => {
  return (
    <Container minWidth="80%">
        {/* <DescriptionSection />
        <ResultSection />
        <AverageResultSection />
        <SubjectResultSection />  
        <ResultTextSection />
        <LeaderboardSection />
        <ViewButtonSection /> */}
        <QuestionOverviewSection />
        <QuestionSection />
    </Container>
  )
}

export default NormalQuizContent
