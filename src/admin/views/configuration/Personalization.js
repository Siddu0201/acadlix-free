import React from "react";
import { Box, Autocomplete, TextField } from "@mui/material";
import Row from "../../../components/Row";
function Personalization() {
  const Color = [{ label: "Color1" }, { label: "Color2" }, { label: "Color3" }];
  return (
    <div>
      <Box sx={{ color: "black" }}>
        <Row>
          <h3 style={{ marginRight: "10px" }}>Button Color</h3>
          <Autocomplete
            sx={{ width: "250px" }}
            disablePortal
            id="combo-box-demo"
            options={Color}
            renderInput={(params) => (
              <TextField {...params} label="Choose Color" />
            )}
          />
        </Row>
        <Row>
          <h3 style={{ marginRight: "10px" }}>Background Color</h3>
          <Autocomplete
            sx={{ width: "250px" }}
            disablePortal
            id="combo-box-demo"
            options={Color}
            renderInput={(params) => (
              <TextField {...params} label="Choose Color" />
            )}
          />
        </Row>
      </Box>
    </div>
  );
}

export default Personalization;
