import React from "react";
import { Box, TextField, FormControlLabel } from "@mui/material";
import Row from "../../../components/Row";
function License() {
  return (
    <div>
      <Box sx={{ color: "black" }}>
        <Row>
          <h4>Email ID</h4>
          <FormControlLabel
            control={<TextField />}
            sx={{ marginLeft: "10px" }}
          ></FormControlLabel>
        </Row>
        <Row>
          <h4>License Key</h4>
          <FormControlLabel
            control={<TextField />}
            sx={{ marginLeft: "10px" }}
          ></FormControlLabel>
        </Row>
      </Box>
    </div>
  );
}

export default License;
