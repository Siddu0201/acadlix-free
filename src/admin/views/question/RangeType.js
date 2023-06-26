import React from "react";
import {
  CardHeader,
  CardContent,
  FormControlLabel,
  TextField,
  Grid,
} from "@mui/material";
import GridItem1 from "../../../components/GridItem1";
function RangeType() {
  return (
    <div>
      <CardHeader title="Option"></CardHeader>
      <CardContent>
        <Grid container>
          <GridItem1 lg={6}>
            <h3>Range From</h3>
            <FormControlLabel control={<TextField type="number" />} />
          </GridItem1>
          <GridItem1 lg={6}>
            <h3>Range To</h3>
            <FormControlLabel control={<TextField type="number" />} />
          </GridItem1>
        </Grid>
      </CardContent>
    </div>
  );
}

export default RangeType;
