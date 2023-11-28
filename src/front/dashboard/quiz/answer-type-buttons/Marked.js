import { Box, Button } from '@mui/material'
import React from 'react'

const Marked = (props) => {
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
            backgroundColor: "#5f00f7",
            color: "#fff !important",
            borderRadius: '50%',
            fontWeight: 600,
            fontSize: '16px',
            '&:hover': {
                backgroundColor: '#5f00f7'
            }
        }}
        >
        {props?.children}
        </Button>
    </Box>
  )
}

export default Marked
