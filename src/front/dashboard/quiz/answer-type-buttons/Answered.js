import { Button } from "@mui/material";
import React from "react";

const Answered = (props) => {
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
        backgroundColor: "green",
        color: "#fff !important",
        borderTopRightRadius: "100px",
        borderTopLeftRadius: "100px",
        fontWeight: 600,
        fontSize: '16px',
        '&:hover': {
            backgroundColor: 'green'
        }
      }}
    >
      {props?.children}
    </Button>
  );
};

export default Answered;
