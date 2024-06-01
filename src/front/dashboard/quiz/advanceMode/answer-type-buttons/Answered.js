import { Button, Box, Typography } from "@mui/material";
import React from "react";

const Answered = (props) => {
  return (
    <Box sx={{
      height: props?.large ? "43px" : "26px",
      width: props?.large ? "50px" : "29px",
      background: props?.colorCode?.answered_background,
      overflow: "hidden",
      position: "relative",
    }}
    >
      <Box sx={{
        position: "absolute",
        height: props?.large ? "31px" : "19px",
        width: "11px",
        top: "-7px",
        left: "-5px",
        backgroundColor: props?.parentBackground,
        transform: "rotate(40deg)",
      }}></Box>
      <Box sx={{
        position: "absolute",
        height: props?.large ? "31px" : "19px",
        width: "11px",
        top: "-7px",
        right: "-5px",
        backgroundColor: props?.parentBackground,
        transform: "rotate(140deg)",
      }}></Box>
      <Typography component="p" sx={{
        position: "relative",
        color: "white",
        display: "flex",
        justifyContent: "center",
        top: props?.large ? "0px" : "2px",
        fontSize: props?.large ? "1.417em" : "12px",
        fontWeight: "normal",
        lineHeight: props?.large ? "43px" : "1.5rem",
      }}>{props?.children}</Typography>
    </Box>
    // <Button
    //   {...props}
    //   variant="contained"
    //   disableElevation
    //   sx={{
    //     ...props?.sx,
    //     width: "100%",
    //     minWidth: "100%",
    //     float: "left",
    //     textAlign: "center",
    //     height: "28px",
    //     backgroundColorColor: "green",
    //     color: "#fff !important",
    //     borderTopRightRadius: "100px",
    //     borderTopLeftRadius: "100px",
    //     fontWeight: 600,
    //     fontSize: '16px',
    //     '&:hover': {
    //         backgroundColor: 'green'
    //     }
    //   }}
    // >
    //   {props?.children}
    // </Button>
  );
};

export default Answered;
