import { Button } from '@mui/material'
import React from 'react'

const NotAnswered = (props) => {
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
        backgroundColor: "red",
        color: "#fff !important",
        borderBottomRightRadius: "100px",
        borderBottomLeftRadius: "100px",
        fontWeight: 600,
        fontSize: '16px',
        paddingTop: '3px',
        '&:hover': {
            backgroundColor: '#fc3f3f'
        }
      }}
    >
      {props?.children}
    </Button>
  )
}

export default NotAnswered
