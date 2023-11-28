import { Box, Button } from '@mui/material'
import React from 'react'

const MarkedAndAnswered = (props) => {
  return (
    <Box sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    }}>
        <Button
        {...props}
        variant="contained"
        disableElevation
        sx={{
            ...props?.sx,
            width: "100%",
            minWidth: "75%",
            maxWidth: '75%',
            float: "left",
            textAlign: "center",
            height: "28px",
            backgroundColor: "gold",
            color: "black !important",
            borderRadius: '50%',
            fontWeight: 600,
            fontSize: '16px',
            '&:hover': {
                backgroundColor: 'gold'
            }
        }}
        >
        {props?.children}
        </Button>
    </Box>
  )
}

export default MarkedAndAnswered
