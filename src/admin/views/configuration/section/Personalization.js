import React from "react";
import { Box, Autocomplete, TextField, Grid } from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
function Personalization() {
  const Color = [{ label: "Color1" }, { label: "Color2" }, { label: "Color3" }];
  return (
    <Box sx={{ color: "black" }}>
      <Grid container>
        <GridItem1 xs={12} lg={4}>
          <Autocomplete
            fullWidth
            size="small"
            id="combo-box-demo"
            options={Color}
            renderInput={(params) => (
              <TextField {...params} label="Button Color" />
            )}
          />
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <Autocomplete
            fullWidth
            size="small"
            disablePortal
            id="combo-box-demo"
            options={Color}
            renderInput={(params) => (
              <TextField {...params} label="Background Color" />
            )}
          />
        </GridItem1>
      </Grid>
    </Box>
  );
}

export default Personalization;
