import React from "react";
import { Box } from "@mui/material";
import { __ } from "@wordpress/i18n";
function Certificate() {
  return (
    <div>
      <Box>
        <h3>{__("Choose Certificate Template", "acadlix")}</h3>
      </Box>
    </div>
  );
}

export default Certificate;
