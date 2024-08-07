import { Button, Box, Typography } from "@mui/material";
import React from "react";

const NotVisited = (props) => {
  return (
    <Box
      sx={{
        height: props?.large ? "43px" : "29px",
        width: props?.large ? "50px" : "29px",
        backgroundImage: `linear-gradient(to bottom right, ${props?.colorCode?.not_visited_background1}, ${props?.colorCode?.not_visited_background2})`,
        border: `1px solid ${props?.colorCode?.not_visited_border}`,
        borderRadius: "2px",
      }}
    >
      <Typography
        component="p"
        sx={{
          display: "flex",
          justifyContent: "center",
          color: props?.colorCode?.not_visited_color,
          position: "relative",
          top: props?.large ? "0px" : "2px",
          fontSize: props?.large ? "1.417em" : "12px",
          fontWeight: "normal",
          lineHeight: props?.large ? "43px" : "1.5rem",
        }}
        onClick={
          props?.handleClick
            ? props?.handleClick?.bind(this, props?.index)
            : null
        }
      >
        {props?.children}
      </Typography>
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
    //     backgroundColor: "#fff",
    //     color: "black !important",
    //     fontWeight: 600,
    //     fontSize: '16px',
    //     borderRadius: 0,
    //     '&:hover': {
    //         backgroundColor: '#fff'
    //     }
    //   }}
    // >
    //   {props?.children}
    // </Button>
  );
};

export default NotVisited;
