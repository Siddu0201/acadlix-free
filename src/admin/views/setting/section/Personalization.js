import React from "react";
import { Box, Autocomplete, TextField } from "@mui/material";
import Grid from '@mui/material/Grid';
import GridItem1 from "@acadlix/components/GridItem1";
function Personalization() {
  const Color = [{ label: "Color1" }, { label: "Color2" }, { label: "Color3" }];
  return (
    <Box>
      <Grid container >
        <GridItem1 size={{ xs: 12, lg: 4 }}>
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
        <GridItem1 size={{ xs: 12, lg: 4 }}>
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
