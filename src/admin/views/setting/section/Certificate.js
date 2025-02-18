import React from "react";
import { Box, TextField, FormControlLabel } from "@mui/material";
import { __ } from "@wordpress/i18n";
function Certificate() {
  return (
    <div>
      <Box sx={{ color: "black" }}>
        <h3>{__("Choose Certificate Template", "acadlix")}</h3>
      </Box>
    </div>
  );
}

export default Certificate;
