import { Box, Button, Typography } from "@mui/material";
import React from "react";

const Marked = (props) => {
  return (
    <Box
      sx={{
        height: props?.large ? "43px" : "29px",
        width: props?.large ? "50px" : "29px",
        backgroundColor: props?.colorCode?.marked_for_review_background,
        borderRadius: "50%",
      }}
    >
      <Typography
        component="p"
        sx={{
          display: "flex",
          justifyContent: "center",
          color: props?.colorCode?.marked_for_review_color,
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
    //         backgroundColor: "#5f00f7",
    //         color: "#fff !important",
    //         borderRadius: '50%',
    //         fontWeight: 600,
    //         fontSize: '16px',
    //         '&:hover': {
    //             backgroundColor: '#5f00f7'
    //         }
    //     }}
    //     >
    //     {props?.children}
    //     </Button>
    // </Box>
  );
};

export default Marked;
