import { Box, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts'
import React from 'react'

const ScoreChart = (props) => {
    const chartSetting = {
        width: 500,
        height: 300,
      };
      
      const dataset = [
        {
          score: props?.correct,
          type: 'Correct',
        },
        {
          score: props?.incorrect,
          type: 'Incorrect',
        },
        {
          score: props?.skipped,
          type: 'Skipped',
        },
        {
          score: props?.total,
          type: 'Total',
        },
      ];
  return (
    <Box 
    sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' ,
        marginBottom: 3
    }}>
        <BarChart
        dataset={dataset}
        yAxis={[{ scaleType: 'band', dataKey: 'type' }]}
        series={[{ dataKey: 'score' }]}
        layout="horizontal"
        grid={{ vertical: true }}
        margin={{ left: 100 }}
        {...chartSetting}
        />
    </Box>
  )
}

export default ScoreChart
