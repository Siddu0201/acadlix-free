import { Box } from '@mui/material'
import { pieArcLabelClasses, PieChart } from '@mui/x-charts'
import React from 'react'

const AdvanceQuestionReportChart = (props) => {
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
              { id: 0, value: props?.correct, label: "Correct %", color: props?.colorCode?.correct  },
              { id: 1, value: props?.incorrect, label: "Incorrect %", color: props?.colorCode?.incorrect },
              { id: 2, value: props?.skipped, label: "Skipped %", color: props?.colorCode?.skipped },
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

export default AdvanceQuestionReportChart
