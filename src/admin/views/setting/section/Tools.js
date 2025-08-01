import React from "react";
import { Box, TextField, FormControlLabel, Button } from "@mui/material";
import Row from "@acadlix/components/Row";
import { __ } from "@wordpress/i18n";
function Tools() {
  return (
    <div>
      <Box>
        <Row>
          <h4>{__("Export Settings", "acadlix")}</h4>
          <FormControlLabel
            style={{ marginLeft: "10px" }}
            control={<TextField type="file" />}
          ></FormControlLabel>
        </Row>
        <Row>
          <h4>{__("Import Settings", "acadlix")}</h4>
          <FormControlLabel
            style={{ marginLeft: "10px" }}
            control={<TextField type="file" />}
          ></FormControlLabel>
        </Row>
        <Button variant="contained" color="success">
          {__("Export Now", "acadlix")}
        </Button>
      </Box>
    </div>
  );
}

export default Tools;
