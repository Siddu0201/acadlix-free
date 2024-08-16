import { Box, Typography } from "@mui/material";
import React from "react";

const NtaMarkedAndAnswered = (props) => {
  return (
    <Box
      sx={{
        height: props?.large ? "43px" : "35px",
        width: props?.large ? "50px" : "35px",
        backgroundColor: props?.colorCode?.marked_for_review_background,
        borderRadius: "50%",
        position: "relative",
      }}
    >
      <Box
        sx={{
          height: "12px",
          width: "12px",
          backgroundColor: "#7bc021",
          borderRadius: "50%",
          position: "absolute",
          bottom: "-2px",
          right: "-2px",
        }}
      >
        <Box
          sx={{
            border: "1px solid white",
            margin: "2px",
            padding: "0.65px",
          }}
        >
          <Box
            sx={{
              border: "1px solid white",
              margin: "1px",
            }}
          ></Box>
          <Box
            sx={{
              border: "1px solid white",
              margin: "1px",
            }}
          ></Box>
        </Box>
      </Box>
      <Typography
        component="p"
        sx={{
          display: "flex",
          justifyContent: "center",
          color: props?.colorCode?.marked_for_review_color,
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

export default NtaMarkedAndAnswered;
