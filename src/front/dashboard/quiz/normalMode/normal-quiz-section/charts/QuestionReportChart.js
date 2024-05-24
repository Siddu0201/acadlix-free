import { Box, Typography } from '@mui/material'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts'
import React from 'react'

const QuestionReportChart = ({ skipped, correct, incorrect }) => {
  return (
    <Box 
    sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' ,
        marginBottom: 3
    }}>
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: correct, label: "Correct %" },
              { id: 1, value: incorrect, label: "Incorrect %" },
              { id: 2, value: skipped, label: "Skipped %" },
            ],
            arcLabel: (item) => `${item.value} %`,
            arcLabelMinAngle: 45,
          },
        ]}
        sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: 'white',
              fontWeight: 'bold',
              fontSize: "12px",
            },
          }}
          margin={{ bottom: 0, left: 70 }}
          height={300}
          width={400}
          slotProps={{
            legend: {
                direction: 'row',
                position: { vertical: 'bottom', horizontal: 'middle' },
                padding: 0,
                itemMarkWidth: 12,
                itemMarkHeight: 12,
                markGap: 6,
                fontSize: 10,
                fontWeight: 'bold',
              },
          }}
      />
    </Box>
  )
}

export default QuestionReportChart
