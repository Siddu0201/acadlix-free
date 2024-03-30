import { Box, Card, CardContent, Typography } from '@mui/material'
import React from 'react'

const AverageResultSection = () => {
  return (
    <Box sx={{
      display: "flex",
      justifyContent: "center",
    }}>
      <Card>
        <CardContent sx={{
          paddingBottom: '16px !important'
        }}>
          <Box sx={{
            display: 'flex',
            marginX: 2,
            marginY: 2, 
          }}>
            <Typography sx={{
              fontWeight: 'bold',
              paddingX: 3
            }}>
              Average Score: 
            </Typography>
            <Typography>
              0%
            </Typography>
          </Box>
          <Box sx={{
            display: 'flex',
            marginX: 2,
            marginY: 2,
          }}>
            <Typography sx={{
              fontWeight: 'bold',
              paddingX: 3
            }}>
              Your Score:
            </Typography>
            <Typography>
              50%
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AverageResultSection
