import { Button } from "@mui/material";
import React from "react";

const CustomButton = (props) => {
  return (
    <Button
      {...props}
      variant="contained"
      color="primary"
      sx={{
        padding: "4px 15px",
        fontSize: "14px",
        ":hover, :focus": {
          backgroundColor: (theme) => theme.palette.primary.dark,
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
