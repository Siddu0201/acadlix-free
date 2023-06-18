import React from "react";
import { Box, TextField, FormControlLabel, Autocomplete } from "@mui/material";
import Row from "../../../components/Row";
function Translation() {
  const Language = [
    { label: "Language1" },
    { label: "Language2" },
    { label: "Language3" },
  ];
  return (
    <div>
      <Box sx={{ color: "black" }}>
        <Row>
          <h4>Choose Language</h4>
          <Autocomplete
            sx={{ width: "250px", ml: "10px" }}
            disablePortal
            id="combo-box-demo"
            options={Language}
            renderInput={(params) => (
              <TextField {...params} label="Choose Language" />
            )}
          />
        </Row>
      </Box>
    </div>
  );
}

export default Translation;
