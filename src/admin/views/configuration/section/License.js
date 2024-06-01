import React from "react";
import { Box, Grid } from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";

function License() {
  return (
    <Box sx={{ color: "black" }}>
      <Grid container>
        <GridItem1 xs={12} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            label="Email ID"
          />
        </GridItem1>
        <GridItem1 xs={12} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            label="License Key"
          />
        </GridItem1>
      </Grid>
    </Box>
  );
}

export default License;
