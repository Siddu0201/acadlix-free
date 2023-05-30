import { Box, useTheme } from '@mui/material'
import React from 'react'

const BoxMain = (props) => {
  const theme = useTheme();
  return (
    <Box component="main" {...props} sx={{ 
        padding: 6,
        [theme.breakpoints.down('sm')]: {
            paddingLeft: 4,
            paddingRight: 4,
        },
        ...props?.sx
        }}>
        
    </Box>
  )
}

export default BoxMain
