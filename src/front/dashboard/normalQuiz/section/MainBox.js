import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import MainHeader from './MainHeader';
import Heading from './Heading';
import TimerBox from './TimerBox';
import ProgressBar from './ProgressBar';
import CustomButton from './CustomButton';
import QuizResult from './QuizResult';
import Description from './Description';
import ResultTable from './ResultTable';
import ResultMessageBox from './ResultMessageBox';
import SummaryDashboard from './SummaryDashboard';
import Question from './Question';
import CopyRightText from './CopyRightText';

const descriptionText = 'This is the description of the quiz';
const testSubject = 'Geography';

const styles = {
  mainBox: {
    padding: '16px',
  },
  testName: {
    fontSize: '2rem',
    fontWeight: '550', // Adjust the font weight to match your original styling
    marginBottom: '1.5rem'
  },
  belowBtns: {
    display: 'flex',
    marginTop: '16px',
  },
};

const MainBox = () => {
  return (
    <Container minWidth="80%">
      <Box sx={styles.mainBox}>
        <MainHeader name='CodeSmashers' />
        <Typography variant='h1' sx={styles.testName}>
          Quiz Test
        </Typography>
        <Heading name={testSubject} />
        <TimerBox time='10' />
        <ProgressBar name='100' />
        <Description desctxt={descriptionText} />
        <CustomButton btname='Start Test' />
        <QuizResult subjectName={testSubject} timeTaken='20' />
        <Description desctxt='result text' />
        <ResultTable />
        <ResultMessageBox />
        <Box sx={styles.belowBtns}>
          <CustomButton btname='Restart Test' />
          <CustomButton btname='View Answers' />
        </Box>
        <SummaryDashboard />
        <Question />
        <CopyRightText />
      </Box>
    </Container>
  );
};

export default MainBox;
