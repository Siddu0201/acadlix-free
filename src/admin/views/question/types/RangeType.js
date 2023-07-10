import React from "react";
import {
  CardHeader,
  CardContent,
  FormControlLabel,
  TextField,
  Grid,
} from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";
function RangeType() {
  return (
    <div>
      <CardHeader title="Option"></CardHeader>
      <CardContent>
        <Grid container>
          <GridItem1 xs={12} lg={6}>
            <h3>Range From</h3>
            <CustomTextField
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          </GridItem1>
          <GridItem1 xs={12} lg={6}>
            <h3>Range To</h3>
            <CustomTextField
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          </GridItem1>
        </Grid>
      </CardContent>
    </div>
  );
}

export default RangeType;
