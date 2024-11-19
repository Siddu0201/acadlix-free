import { TextField } from "@mui/material";
import React from "react";

const CustomTextField = React.forwardRef((props, ref) => (
  <TextField
    {...props}
    ref={ref}
    sx={{
      ".MuiInputBase-inputSizeSmall": {
        padding: "8.5px 14px",
      },
      ".MuiInputBase-inputMultiline": {
        padding: 0,
      },
      ...props?.sx,
    }}
  />
));

export default CustomTextField;
