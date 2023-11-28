import { Button } from '@mui/material'
import React from 'react'

const NotVisited = (props) => {
  return (
    <Button
      {...props}
      variant="contained"
      disableElevation
      sx={{
        ...props?.sx,
        width: "100%",
        minWidth: "100%",
        float: "left",
        textAlign: "center",
        height: "28px",
        backgroundColor: "#fff",
        color: "black !important",
        fontWeight: 600,
        fontSize: '16px',
        borderRadius: 0,
        '&:hover': {
            backgroundColor: '#fff'
        }
      }}
    >
      {props?.children}
    </Button>
  )
}

export default NotVisited
