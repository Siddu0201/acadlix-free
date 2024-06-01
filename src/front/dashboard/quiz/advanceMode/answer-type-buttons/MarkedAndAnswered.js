import { Box, Button, Typography } from '@mui/material'
import React from 'react'

const MarkedAndAnswered = (props) => {
  return (
    <Box sx={{
      height: props?.large ? "43px" : "28px",
      width: props?.large ? "50px" :"28px",
      backgroundColor: props?.colorCode?.marked_for_review_background,
      borderRadius: "50%",
      position: "relative"
    }}>
      <Box sx={{
        height: "12px",
        width: "12px",
        backgroundColor: "#7bc021",
        borderRadius: "50%",
        position: "absolute",
        bottom: "-2px",
        right: "-2px",
      }}>
        <Box sx={{
          border: "1px solid white",
          margin: "2px",
          padding: "0.65px",
        }}>
          <Box sx={{
            border: "1px solid white",
            margin: "1px",
          }}></Box>
          <Box sx={{
            border: "1px solid white",
            margin: "1px"
          }}></Box>
        </Box>
      </Box>
      <Typography component="p" sx={{
        display: "flex",
        justifyContent: "center",
        color: props?.colorCode?.marked_for_review_color,
        position: "relative",
        top: props?.large ? "0px" : "2px",
        fontSize: props?.large ? "1.417em" : "12px",
        fontWeight: "normal",
        lineHeight: props?.large ? "43px" : "1.5rem",
      }}>
        {props?.children}
      </Typography>
    </Box>
    // <Box sx={{
    //     width: '100%',
    //     display: 'flex',
    //     justifyContent: 'center'
    // }}>
    //     <Button
    //     {...props}
    //     variant="contained"
    //     disableElevation
    //     sx={{
    //         ...props?.sx,
    //         width: "100%",
    //         minWidth: "75%",
    //         maxWidth: '75%',
    //         float: "left",
    //         textAlign: "center",
    //         height: "28px",
    //         backgroundColor: "gold",
    //         color: "black !important",
    //         borderRadius: '50%',
    //         fontWeight: 600,
    //         fontSize: '16px',
    //         '&:hover': {
    //             backgroundColor: 'gold'
    //         }
    //     }}
    //     >
    //     {props?.children}
    //     </Button>
    // </Box>
  )
}

export default MarkedAndAnswered
