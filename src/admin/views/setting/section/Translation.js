import React from "react";
import { Box, TextField, FormControlLabel, Autocomplete } from "@mui/material";
import Row from "@acadlix/components/Row";
import { __ } from "@wordpress/i18n";
function Translation() {
  const Language = [
    { label: "Language1" },
    { label: "Language2" },
    { label: "Language3" },
  ];
  return (
      <Box sx={{ color: "black" }}>
        <Row>
          <Autocomplete
            sx={{ width: "250px", ml: "10px" }}
            size="small"
            disablePortal
            id="combo-box-demo"
            options={Language}
            renderInput={(params) => (
              <TextField {...params} label={__("Choose Language", "acadlix")} />
            )}
          />
        </Row>
      </Box>
  );
}

export default Translation;
