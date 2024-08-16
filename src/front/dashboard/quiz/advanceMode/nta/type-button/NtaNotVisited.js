import { Box, Typography } from "@mui/material";
import React from "react";

const NtaNotVisited = (props) => {
  return (
    <Box
      sx={{
        height: props?.large ? "43px" : "35px",
        width: props?.large ? "50px" : "40px",
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
          top: props?.large ? "0px" : "5px",
          fontSize: props?.large ? "1.417em" : "16px",
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
  );
};

export default NtaNotVisited;
