import React from 'react';
import { Box } from '@mui/material';
import QuestionNavigation from './QuestionNavigation';
import Annotations from './Annotations';
import '../styling.css';

const SummaryDashboard = () => {
  return (
    <Box className='summary-dashboard'>
      <Box>
        <QuestionNavigation />
      </Box>
      <Box>
        <Annotations />
      </Box>
    </Box>
  );
};

export default SummaryDashboard;
