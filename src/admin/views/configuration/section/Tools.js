import React from "react";
import { Box, TextField, FormControlLabel, Button } from "@mui/material";
import Row from "../../../../components/Row";
function Tools() {
  return (
    <div>
      <Box sx={{ color: "black" }}>
        <Row>
          <h4>Export Settings</h4>
          <FormControlLabel
            style={{ marginLeft: "10px" }}
            control={<TextField type="file" />}
          ></FormControlLabel>
        </Row>
        <Row>
          <h4>Import Settings</h4>
          <FormControlLabel
            style={{ marginLeft: "10px" }}
            control={<TextField type="file" />}
          ></FormControlLabel>
        </Row>
        <Button variant="contained" color="success">
          Export Now
        </Button>
      </Box>
    </div>
  );
}

export default Tools;
