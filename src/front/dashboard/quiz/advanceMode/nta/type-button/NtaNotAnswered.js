import { Box, Typography } from "@mui/material";
import React from "react";

const NtaNotAnswered = (props) => {
  return (
    <Box
      sx={{
        height: props?.large ? "43px" : "35px",
        width: props?.large ? "50px" : "34px",
        background: props?.colorCode?.not_answered_background,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          height: props?.large ? "31px" : "19px",
          width: "38px",
          top: "-16px",
          right: "-2px",
          backgroundColor: props?.parentBackground,
          transform: "rotate(190deg)",
        }}
      ></Box>
      <Box
        sx={{
          position: "absolute",
          height: props?.large ? "31px" : "19px",
          width: "38px",
          bottom: "-16px",
          right: "-2px",
          backgroundColor: props?.parentBackground,
          transform: "rotate(-10deg)",
        }}
      ></Box>
      <Typography
        component="p"
        sx={{
          position: "relative",
          color: "white",
          display: "flex",
          justifyContent: "center",
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

export default NtaNotAnswered;
