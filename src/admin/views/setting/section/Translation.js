import React from "react";
import { Box, TextField, FormControlLabel, Autocomplete } from "@mui/material";
import Row from "../../../../components/Row";
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
              <TextField {...params} label="Choose Language" />
            )}
          />
        </Row>
      </Box>
  );
}

export default Translation;
