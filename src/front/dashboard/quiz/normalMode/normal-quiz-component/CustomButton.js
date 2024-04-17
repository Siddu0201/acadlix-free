import { Button } from "@mui/material";
import React from "react";

const CustomButton = (props) => {
  return (
    <Button
      {...props}
      variant="contained"
      sx={{
        borderRadius: "20px",
        padding: "4px 15px",
        fontSize: "14px",
        backgroundColor: "#13455b",
        ":hover": {
          backgroundColor: "#13455b",
        },
        ...props?.sx,
      }}
      size="small"
    >
      {props?.children}
    </Button>
  );
};

export default CustomButton;
